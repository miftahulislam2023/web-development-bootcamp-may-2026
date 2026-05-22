import { db } from "../client";

export const usersSchema = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    preferences TEXT DEFAULT '{}',
    is_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`;

export const settingsSchema = `
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    theme TEXT DEFAULT 'dark',
    currency TEXT DEFAULT 'BDT',
    language TEXT DEFAULT 'en',
    notifications_enabled INTEGER DEFAULT 1,
    monthly_budget REAL DEFAULT 0,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`;

export const otpsSchema = `
CREATE TABLE IF NOT EXISTS otps (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    purpose TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`;

// Migration: Add password_hash column if it doesn't exist
async function migrateUsersTable() {
    try {
        // Check if password_hash column exists
        const tableInfo = await db.execute("PRAGMA table_info(users)");
        const hasPasswordHash = tableInfo.rows.some((row: any) => row.name === "password_hash");

        if (!hasPasswordHash) {
            await db.execute("ALTER TABLE users ADD COLUMN password_hash TEXT");
            console.log("Migration: Added password_hash column to users table");
        }

        const hasIsVerified = tableInfo.rows.some((row: any) => row.name === "is_verified");
        if (!hasIsVerified) {
            await db.execute("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0");
            console.log("Migration: Added is_verified column to users table");
        }
    } catch (error) {
        // Table might not exist yet, which is fine
        console.log("Migration check skipped - table may not exist yet");
    }
}

export async function initUsersTable() {
    await db.execute(usersSchema);
    await migrateUsersTable();
}

export async function initOtpsTable() {
    await db.execute(otpsSchema);
}

export async function initSettingsTable() {
    await db.execute(settingsSchema);
}

