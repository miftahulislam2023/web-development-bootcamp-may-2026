import { db } from "../client";

export const habitsSchema = `
CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    habit_name TEXT NOT NULL,
    streak_count INTEGER DEFAULT 0,
    last_completed_date TEXT,
    category TEXT DEFAULT 'general'
)
`;

export async function initHabitsTable() {
    await db.execute(habitsSchema);
    // Add category column if it doesn't exist (migration for existing DBs)
    try {
        await db.execute("ALTER TABLE habits ADD COLUMN category TEXT DEFAULT 'general'");
    } catch {
        // Column already exists, ignore
    }
}
