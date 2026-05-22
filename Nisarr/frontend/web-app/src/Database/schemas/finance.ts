import { db } from "../client";

export const financeSchema = `
CREATE TABLE IF NOT EXISTS finance (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    is_special INTEGER DEFAULT 0
)
`;

export async function initFinanceTable() {
    await db.execute(financeSchema);
    // Migration: Add is_special column if it doesn't exist
    try {
        await db.execute("ALTER TABLE finance ADD COLUMN is_special INTEGER DEFAULT 0");
    } catch (e) {
        // Column already exists, ignore error
    }
}
