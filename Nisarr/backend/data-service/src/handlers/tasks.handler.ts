// tasks.handler.ts — Task-specific CRUD with completion side-effects
import crypto from "crypto";
import { db } from "../utils/database.js";
import { TaskSchema } from "../schemas/index.js";

export async function handleTasks(req: any, res: any, userId: string) {
    const { method, body } = req;
    const url = req.url || "";

    try {
    if (method === "GET") {
        if (url.includes("/context")) {
            const urlObj = new URL(url, "http://localhost");
            const type = urlObj.searchParams.get("type");
            const contextId = urlObj.searchParams.get("id");
            if (!type || !contextId) return res.status(400).json({ error: "Missing context params" });
            try {
                const result = await db.execute({ sql: "SELECT * FROM tasks WHERE user_id = ? AND context_type = ? AND context_id = ? ORDER BY created_at DESC", args: [userId, type, contextId] });
                return res.json(result.rows);
            } catch (e: any) {
                if (e.message?.includes("no such column: created_at")) {
                    const fb = await db.execute({ sql: "SELECT * FROM tasks WHERE user_id = ? AND context_type = ? AND context_id = ?", args: [userId, type, contextId] });
                    return res.json(fb.rows);
                }
                throw e;
            }
        }
        if (url.includes("/subtasks")) {
            const urlObj = new URL(url, "http://localhost");
            const parentId = urlObj.searchParams.get("parentId");
            if (!parentId) return res.status(400).json({ error: "Missing parentId" });
            const result = await db.execute({ sql: "SELECT * FROM tasks WHERE user_id = ? AND parent_task_id = ? ORDER BY order_index ASC", args: [userId, parentId] });
            return res.json(result.rows);
        }
        try {
            const result = await db.execute({ sql: "SELECT * FROM tasks WHERE user_id = ? AND (parent_task_id IS NULL OR parent_task_id = '') ORDER BY order_index ASC, created_at DESC", args: [userId] });
            return res.json(result.rows);
        } catch (e: any) {
            if (e.message?.includes("no such column: created_at")) {
                const fb = await db.execute({ sql: "SELECT * FROM tasks WHERE user_id = ? AND (parent_task_id IS NULL OR parent_task_id = '') ORDER BY order_index ASC", args: [userId] });
                return res.json(fb.rows);
            }
            throw e;
        }
    }

    if (method === "POST" && !url.includes("/complete")) {
        try {
            const parsedBody = TaskSchema.parse(body);
            const id = crypto.randomUUID();
            const fields: string[] = ["id", "user_id"];
            const values: any[] = [id, userId];
            for (const [key, value] of Object.entries(parsedBody)) {
                if (value !== undefined) { fields.push(key); values.push(value as any); }
            }
            if (!parsedBody.status) { fields.push("status"); values.push("todo"); }
            if (!parsedBody.priority) { fields.push("priority"); values.push("medium"); }
            const placeholders = fields.map(() => "?").join(", ");
            await db.execute({ sql: `INSERT INTO tasks (${fields.join(", ")}) VALUES (${placeholders})`, args: values });
            return res.json({ success: true, id });
        } catch (e: any) {
            return res.status(400).json({ error: e.errors || e.message });
        }
    }

    if (method === "PUT") {
        const id = body.id;
        if (!id) return res.status(400).json({ error: "Missing task id" });
        try {
            const parsedBody = TaskSchema.parse(body);
            const fields: string[] = [];
            const args: any[] = [];
            for (const [key, value] of Object.entries(parsedBody)) {
                if (value !== undefined) { fields.push(`${key} = ?`); args.push(value as any); }
            }
            if (fields.length > 0) {
                args.push(id, userId);
                await db.execute({ sql: `UPDATE tasks SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`, args });
            }
            return res.json({ success: true });
        } catch (e: any) {
            return res.status(400).json({ error: e.errors || e.message });
        }
    }

    if (method === "DELETE") {
        const id = new URL(url, "http://localhost").pathname.split("/").pop();
        if (!id) return res.status(400).json({ error: "Missing id" });
        await db.execute({ sql: "DELETE FROM tasks WHERE id = ? AND user_id = ?", args: [id, userId] });
        return res.json({ success: true });
    }

    if (method === "POST" && url.includes("/complete")) {
        const id = body.id;
        if (!id) return res.status(400).json({ error: "Missing id" });
        const now = new Date().toISOString();
        const taskResult = await db.execute({ sql: "SELECT * FROM tasks WHERE id = ? AND user_id = ?", args: [id, userId] });
        if (taskResult.rows.length === 0) return res.status(404).json({ error: "Task not found" });
        const task: any = taskResult.rows[0];
        await db.execute({ sql: "UPDATE tasks SET status = 'done', completed_at = ? WHERE id = ? AND user_id = ?", args: [now, id, userId] });
        if (task.context_type === "finance" && task.expected_cost > 0) {
            const financeId = crypto.randomUUID();
            const financeType = task.finance_type || "expense";
            const localNow = new Date();
            const todayDate = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
            await db.execute({ sql: "INSERT INTO finance (id, user_id, type, amount, category, description, date, is_special) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", args: [financeId, userId, financeType, task.expected_cost, task.title, task.description || `From task: ${task.title}`, todayDate + "T12:00:00.000Z", 0] });
            if (financeType === "income" && task.context_id) {
                await db.execute({ sql: "UPDATE budgets SET current_amount = COALESCE(current_amount, 0) + ? WHERE id = ? AND user_id = ?", args: [task.expected_cost, task.context_id, userId] });
            }
        }
        return res.json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
    } catch (outerError: any) {
        console.error("Tasks handler error:", outerError.message);
        return res.status(500).json({ error: `Tasks handler error: ${outerError.message}`, hint: "Check database connectivity and table schema." });
    }
}
