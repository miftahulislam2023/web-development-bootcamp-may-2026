// budget.handler.ts — Savings transactions
import crypto from "crypto";
import { db } from "../utils/database.js";
import { SavingsAddSchema, SavingsTxUpdateSchema, SavingsTxDeleteSchema } from "../schemas/index.js";

export async function handleBudget(req: any, res: any, userId: string) {
    const { method, body, url = "" } = req;

    if (url.includes("/savings/add") && method === "POST") {
        try {
            const parsed = SavingsAddSchema.parse(body);
            await db.execute({ sql: "UPDATE budgets SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?", args: [parsed.amount, parsed.id, userId] });
            const txId = crypto.randomUUID();
            const type = parsed.amount >= 0 ? "deposit" : "withdraw";
            const today = new Date().toISOString().split("T")[0];
            await db.execute({ sql: "INSERT INTO savings_transactions (id, savings_id, user_id, type, amount, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [txId, parsed.id, userId, type, Math.abs(parsed.amount), parsed.description || null, today] });
            return res.json({ success: true, txId });
        } catch (e: any) { return res.status(400).json({ error: e.errors || e.message }); }
    }

    if (url.includes("/savings/tx") && method === "PUT") {
        try {
            const parsed = SavingsTxUpdateSchema.parse(body);
            const reverseOld = parsed.oldType === "deposit" ? -parsed.oldAmount : parsed.oldAmount;
            await db.execute({ sql: "UPDATE budgets SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?", args: [reverseOld, parsed.savingsId, userId] });
            const applyNew = parsed.newType === "deposit" ? parsed.newAmount : -parsed.newAmount;
            await db.execute({ sql: "UPDATE budgets SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?", args: [applyNew, parsed.savingsId, userId] });
            await db.execute({ sql: "UPDATE savings_transactions SET amount = ?, type = ?, date = ?, description = ? WHERE id = ? AND user_id = ?", args: [parsed.newAmount, parsed.newType, parsed.newDate, parsed.newDescription || null, parsed.id, userId] });
            return res.json({ success: true });
        } catch (e: any) { return res.status(400).json({ error: e.errors || e.message }); }
    }

    if (url.includes("/savings/tx") && method === "DELETE") {
        try {
            const parsed = SavingsTxDeleteSchema.parse(body);
            const reverseAmount = parsed.type === "deposit" ? -parsed.amount : parsed.amount;
            await db.execute({ sql: "UPDATE budgets SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?", args: [reverseAmount, parsed.savingsId, userId] });
            await db.execute({ sql: "DELETE FROM savings_transactions WHERE id = ? AND user_id = ?", args: [parsed.id, userId] });
            return res.json({ success: true });
        } catch (e: any) { return res.status(400).json({ error: e.errors || e.message }); }
    }

    return res.status(404).json({ error: "Budget route not found" });
}
