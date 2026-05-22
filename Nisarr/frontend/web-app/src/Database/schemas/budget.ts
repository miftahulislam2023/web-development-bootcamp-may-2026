import { db } from "../client";

export const budgetSchema = `
CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('budget', 'savings')),
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    period TEXT CHECK(period IN ('monthly', 'weekly', 'yearly') OR period IS NULL),
    category TEXT,
    start_date TEXT,
    is_special INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`;

export const savingsTransactionsSchema = `
CREATE TABLE IF NOT EXISTS savings_transactions (
    id TEXT PRIMARY KEY,
    savings_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('deposit', 'withdraw')),
    amount REAL NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (savings_id) REFERENCES budgets(id) ON DELETE CASCADE
)
`;

export async function initBudgetTable() {
    await db.execute(budgetSchema);
    await db.execute(savingsTransactionsSchema);
    // Migration: Add start_date column if it doesn't exist
    try {
        await db.execute("ALTER TABLE budgets ADD COLUMN start_date TEXT");
    } catch (e) {
        // Column already exists, ignore error
    }
    // Migration: Add is_special column if it doesn't exist
    try {
        await db.execute("ALTER TABLE budgets ADD COLUMN is_special INTEGER DEFAULT 0");
    } catch (e) {
        // Column already exists, ignore error
    }
}
