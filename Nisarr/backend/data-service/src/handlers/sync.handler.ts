// sync.handler.ts — Returns ALL user data in a single response
// Uses Turso batch() for a single DB round-trip

import { db } from "../utils/database.js";

const TABLES_WITH_CREATED_AT = [
    "tasks", "finance", "budgets", "savings_transactions",
    "notes", "inventory",
    "study_subjects", "study_chapters_v2", "study_parts", "study_common_presets"
];

// Special query for tasks (filters out subtasks at top level)
const TASK_QUERY = "SELECT * FROM tasks WHERE user_id = ? AND (parent_task_id IS NULL OR parent_task_id = '') ORDER BY order_index ASC, created_at DESC";

// Special query for habits (no created_at ordering guarantee)
const HABITS_QUERY = "SELECT * FROM habits WHERE user_id = ?";

export async function handleSync(req: any, res: any, userId: string) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed. Use GET." });
    }

    try {
        // Build batch statements — one per table
        // We apply LIMITs to prevent unbounded queries scaling infinitely, protecting memory and payload size
        const statements = [
            // 0: tasks (special query) - limit 1000
            { sql: "SELECT * FROM tasks WHERE user_id = ? AND (parent_task_id IS NULL OR parent_task_id = '') ORDER BY order_index ASC, created_at DESC LIMIT 1000", args: [userId] },
            // 1: finance - limit 1000
            { sql: "SELECT * FROM finance WHERE user_id = ? ORDER BY created_at DESC LIMIT 1000", args: [userId] },
            // 2: budgets - limit 500
            { sql: "SELECT * FROM budgets WHERE user_id = ? ORDER BY created_at DESC LIMIT 500", args: [userId] },
            // 3: savings_transactions - limit 500
            { sql: "SELECT * FROM savings_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 500", args: [userId] },
            // 4: habits - limit 500
            { sql: "SELECT * FROM habits WHERE user_id = ? LIMIT 500", args: [userId] },
            // 5: notes - limit 1000
            { sql: "SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1000", args: [userId] },
            // 6: inventory - limit 1000
            { sql: "SELECT * FROM inventory WHERE user_id = ? ORDER BY created_at DESC LIMIT 1000", args: [userId] },
            // 7: study_subjects - limit 500
            { sql: "SELECT * FROM study_subjects WHERE user_id = ? ORDER BY created_at DESC LIMIT 500", args: [userId] },
            // 8: study_chapters_v2 - limit 1000
            { sql: "SELECT * FROM study_chapters_v2 WHERE user_id = ? ORDER BY created_at DESC LIMIT 1000", args: [userId] },
            // 9: study_parts - limit 2000
            { sql: "SELECT * FROM study_parts WHERE user_id = ? ORDER BY created_at DESC LIMIT 2000", args: [userId] },
            // 10: study_common_presets
            { sql: "SELECT * FROM study_common_presets WHERE user_id = ? LIMIT 100", args: [userId] },
        ];

        const results = await db.batch(statements);

        // Set cache headers — browser won't re-fetch for 30s, reduces Vercel function calls
        res.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60");

        const response = {
            tasks: results[0].rows,
            finance: results[1].rows,
            budgets: results[2].rows,
            savings_transactions: results[3].rows,
            habits: results[4].rows,
            notes: results[5].rows,
            inventory: results[6].rows,
            study_subjects: results[7].rows,
            study_chapters_v2: results[8].rows,
            study_parts: results[9].rows,
            study_common_presets: results[10].rows,
        };

        return res.json(response);
    } catch (err: any) {
        console.error("[SYNC] Batch query error:", err.message);
        return res.status(500).json({ error: `Sync failed: ${err.message}` });
    }
}
