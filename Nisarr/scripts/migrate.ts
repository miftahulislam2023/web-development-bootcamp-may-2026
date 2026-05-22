import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(process.cwd(), ".env") });

const db = createClient({
    url: process.env.VITE_TURSO_DB_URL || process.env.TURSO_DB_URL || "",
    authToken: process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || "",
});

const APP_TABLES = [
    "tasks", "expenses", "budgets", "finance", "habits", 
    "inventory_items", "inventory_categories", "notes", "settings",
    "gym_workout_plans", "gym_exercises", "gym_workout_logs", 
    "gym_set_logs", "gym_body_metrics", "gym_personal_records",
    "study_sessions", "study_topics", "study_goals", "study_common_presets",
    "savings_transactions"
];

async function migrate() {
    console.log("Running database migrations...");

    try {
        // Users table
        const usersInfo = await db.execute("PRAGMA table_info(users)");
        const userCols = usersInfo.rows.map((r: any) => r.name);
        if (!userCols.includes("is_verified")) {
            await db.execute("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0");
            console.log("✅ Added is_verified column to users table");
        }
        if (!userCols.includes("password_hash")) {
            await db.execute("ALTER TABLE users ADD COLUMN password_hash TEXT");
            console.log("✅ Added password_hash column to users table");
        }

        // Ensure Core Tables
        await db.execute(`
            CREATE TABLE IF NOT EXISTS otps (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL,
                otp_code TEXT NOT NULL,
                purpose TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await db.execute(`
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
        `);
        console.log("✅ Core tables ensured");

        // Ensure user_id scoping on ALL app data tables
        console.log("Ensuring user_id exists on all data tables and adding indexes...");
        for (const table of APP_TABLES) {
            try {
                const tableInfo = await db.execute(`PRAGMA table_info(${table})`);
                if (tableInfo.rows.length > 0) {
                    const columns = tableInfo.rows.map((r: any) => r.name);
                    if (!columns.includes("user_id")) {
                        await db.execute(`ALTER TABLE ${table} ADD COLUMN user_id TEXT`);
                        console.log(`✅ Added user_id to ${table}`);
                    }
                    
                    // Add indexes for performance
                    try {
                        await db.execute(`CREATE INDEX IF NOT EXISTS idx_${table}_user_id ON ${table}(user_id)`);
                        console.log(`✅ Created index idx_${table}_user_id`);
                    } catch (idxError: any) {
                        console.warn(`⚠️ Could not create index on ${table}: ${idxError.message}`);
                    }
                }
            } catch (e: any) {
                console.warn(`⚠️ Could not verify table ${table}: ${e.message}`);
            }
        }

        console.log("\n🎉 All migrations complete!");
    } catch (error) {
        console.error("Migration error:", error);
    }

    process.exit(0);
}

migrate();
