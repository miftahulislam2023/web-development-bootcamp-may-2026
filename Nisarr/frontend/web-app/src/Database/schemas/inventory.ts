import { db } from "../client";

export const inventorySchema = `
CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 1,
    cost REAL,
    purchase_date TEXT,
    store TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active',
    warranty_expiry TEXT,
    finance_entry_id TEXT
)
`;

export async function initInventoryTable() {
    await db.execute(inventorySchema);

    // Migrations for new columns - execute independently
    const migrations = [
        "ALTER TABLE inventory ADD COLUMN category TEXT",
        "ALTER TABLE inventory ADD COLUMN quantity INTEGER DEFAULT 1",
        "ALTER TABLE inventory ADD COLUMN notes TEXT",
        "ALTER TABLE inventory ADD COLUMN status TEXT DEFAULT 'active'",
        "ALTER TABLE inventory ADD COLUMN warranty_expiry TEXT",
        "ALTER TABLE inventory ADD COLUMN finance_entry_id TEXT"
    ];

    for (const query of migrations) {
        try {
            await db.execute(query);
        } catch (e) {
            // Check if error is due to column already existing
            // console.log(`Migration checked: ${query}`);
        }
    }
}
