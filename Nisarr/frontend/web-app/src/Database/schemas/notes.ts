import { db } from "../client";

export const notesSchema = `
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    tags TEXT,
    is_pinned INTEGER DEFAULT 0,
    color TEXT DEFAULT 'default',
    is_archived INTEGER DEFAULT 0,
    is_trashed INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`;

// Migration queries to add new columns to existing tables
const migrations = [
    "ALTER TABLE notes ADD COLUMN is_pinned INTEGER DEFAULT 0",
    "ALTER TABLE notes ADD COLUMN color TEXT DEFAULT 'default'",
    "ALTER TABLE notes ADD COLUMN is_archived INTEGER DEFAULT 0",
    "ALTER TABLE notes ADD COLUMN is_trashed INTEGER DEFAULT 0",
    "ALTER TABLE notes ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE notes ADD COLUMN serial_number INTEGER",
];

export async function initNotesTable() {
    await db.execute(notesSchema);
    // Run migrations (ignore errors if columns already exist)
    for (const migration of migrations) {
        try {
            await db.execute(migration);
        } catch {
            // Column already exists, skip
        }
    }

    // Backfill serial_number if null
    try {
        await db.execute(`
            WITH RankedNotes AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
                FROM notes
            )
            UPDATE notes 
            SET serial_number = (SELECT rn FROM RankedNotes WHERE RankedNotes.id = notes.id)
            WHERE serial_number IS NULL;
        `);

        // Create metadata table for persistent counters
        await db.execute(`
            CREATE TABLE IF NOT EXISTS note_metadata (
                key TEXT PRIMARY KEY,
                value INTEGER DEFAULT 0
            )
        `);

        // Initialize last_serial if not set, based on current max serial
        // This ensures that even if we delete notes, the counter continues from the highest ANYTIME seen (approximated by current max)
        // If table is empty, starts at 0.
        await db.execute(`
            INSERT OR IGNORE INTO note_metadata (key, value) VALUES ('last_serial', 0)
        `);

        // Sync last_serial with actual max serial in notes (only if current value is less than max)
        await db.execute(`
            UPDATE note_metadata 
            SET value = (SELECT COALESCE(MAX(serial_number), 0) FROM notes)
            WHERE key = 'last_serial' AND value < (SELECT COALESCE(MAX(serial_number), 0) FROM notes)
        `);

    } catch (e) {
        console.error("Failed to backfill serial numbers or init metadata", e);
    }
}
