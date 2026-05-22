// generic.handler.ts — CRUD handler for all generic data tables
// FP style: pure function, no class

import crypto from "crypto";
import { db } from "../utils/database.js";
import { GenericObjectSchema } from "../schemas/index.js";

const ALLOWED_TABLES = [
    "tasks", "expenses", "budgets", "finance", "habits",
    "inventory", "inventory_items", "inventory_categories", "notes", "settings",
    "gym_workout_plans", "gym_exercises", "gym_workout_logs",
    "gym_set_logs", "gym_body_metrics", "gym_personal_records",
    "study_sessions", "study_topics", "study_subjects", "study_chapters_v2", "study_parts", "study_goals", "study_common_presets",
    "savings_transactions"
];

export async function handleGenericCRUD(req: any, res: any, userId: string, table: string) {
    const { method, body } = req;
    const url = req.url || "";

    if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: "Invalid table" });

    // GET
    if (method === "GET") {
        if (!userId) return res.status(401).json({ error: "Unauthorized: Missing userId" });
        try {
            if (table === "settings") {
                const result = await db.execute({ sql: `SELECT * FROM ${table} WHERE user_id = ? LIMIT 1`, args: [userId] });
                return res.json(result.rows);
            }
            try {
                const result = await db.execute({ sql: `SELECT * FROM ${table} WHERE user_id = ? ORDER BY created_at DESC`, args: [userId] });
                return res.json(result.rows);
            } catch (e: any) {
                if (e.message?.includes("no such column: created_at")) {
                    const fallback = await db.execute({ sql: `SELECT * FROM ${table} WHERE user_id = ?`, args: [userId] });
                    return res.json(fallback.rows);
                }
                return res.status(500).json({ error: `Database error on ${table}`, detail: e.message });
            }
        } catch (e: any) {
            return res.status(500).json({ error: e.message || "Internal server error" });
        }
    }

    // POST
    if (method === "POST") {
        try {
            const parsedBody = GenericObjectSchema.parse(body);
            const id = (parsedBody.id as string) || crypto.randomUUID();
            const fields = ["id", "user_id"];
            const values: any[] = [id, userId];
            for (const key of Object.keys(parsedBody)) {
                if (key !== "id" && key !== "user_id") { fields.push(key); values.push(parsedBody[key] as any); }
            }
            const placeholders = fields.map(() => "?").join(", ");
            await db.execute({ sql: `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders})`, args: values });
            return res.json({ success: true, id });
        } catch (e: any) {
            return res.status(400).json({ error: e.errors || e.message });
        }
    }

    // PUT
    if (method === "PUT") {
        try {
            const parsedBody = GenericObjectSchema.parse(body);
            const id = parsedBody.id;
            if (!id && table !== "settings") return res.status(400).json({ error: "Missing id" });
            const fields: string[] = [];
            const args: any[] = [];
            for (const key of Object.keys(parsedBody)) {
                if (key !== "id" && key !== "user_id") { fields.push(`${key} = ?`); args.push(parsedBody[key] as any); }
            }
            if (fields.length > 0) {
                if (table === "settings") {
                    args.push(userId);
                    await db.execute({ sql: `UPDATE ${table} SET ${fields.join(", ")} WHERE user_id = ?`, args });
                } else {
                    args.push(id, userId);
                    await db.execute({ sql: `UPDATE ${table} SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`, args });
                }
            }
            return res.json({ success: true });
        } catch (e: any) {
            return res.status(400).json({ error: e.errors || e.message });
        }
    }

    // DELETE
    if (method === "DELETE") {
        const parts = url.split("?")[0].split("/");
        let id = parts[parts.length - 1];
        if (id === table) id = body?.id;
        if (!id) return res.status(400).json({ error: "Missing id" });
        try {
            await db.execute({ sql: `DELETE FROM ${table} WHERE id = ? AND user_id = ?`, args: [id, userId] });
            return res.json({ success: true });
        } catch (e: any) {
            return res.status(500).json({ error: e.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
