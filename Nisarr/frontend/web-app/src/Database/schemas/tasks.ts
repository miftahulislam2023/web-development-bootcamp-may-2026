import { db } from "../client";

export const tasksSchema = `
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo',
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,
    context_type TEXT,
    context_id TEXT,
    budget_id TEXT,
    expected_cost REAL,
    finance_type TEXT,
    start_time TEXT,
    end_time TEXT,
    estimated_duration INTEGER,
    actual_duration INTEGER,
    recurrence_rule TEXT,
    parent_task_id TEXT,
    order_index INTEGER DEFAULT 0,
    labels TEXT,
    reminder_time TEXT,
    is_pinned INTEGER DEFAULT 0
)
`;

export const taskLabelsSchema = `
CREATE TABLE IF NOT EXISTS task_labels (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6366f1'
)
`;

export const taskTimeLogsSchema = `
CREATE TABLE IF NOT EXISTS task_time_logs (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
)
`;

export const taskTemplatesSchema = `
CREATE TABLE IF NOT EXISTS task_templates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    template_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium',
    context_type TEXT,
    estimated_duration INTEGER,
    labels TEXT,
    is_system INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`;

export async function initTasksTable() {
    await db.execute(tasksSchema);
    await db.execute(taskLabelsSchema);
    await db.execute(taskTimeLogsSchema);
    await db.execute(taskTemplatesSchema);

    // Migrations for existing tasks table
    const migrations = [
        "ALTER TABLE tasks ADD COLUMN description TEXT",
        "ALTER TABLE tasks ADD COLUMN completed_at TEXT",
        "ALTER TABLE tasks ADD COLUMN context_type TEXT",
        "ALTER TABLE tasks ADD COLUMN context_id TEXT",
        "ALTER TABLE tasks ADD COLUMN budget_id TEXT",
        "ALTER TABLE tasks ADD COLUMN expected_cost REAL",
        "ALTER TABLE tasks ADD COLUMN start_time TEXT",
        "ALTER TABLE tasks ADD COLUMN end_time TEXT",
        "ALTER TABLE tasks ADD COLUMN estimated_duration INTEGER",
        "ALTER TABLE tasks ADD COLUMN actual_duration INTEGER",
        "ALTER TABLE tasks ADD COLUMN recurrence_rule TEXT",
        "ALTER TABLE tasks ADD COLUMN parent_task_id TEXT",
        "ALTER TABLE tasks ADD COLUMN order_index INTEGER DEFAULT 0",
        "ALTER TABLE tasks ADD COLUMN labels TEXT",
        "ALTER TABLE tasks ADD COLUMN reminder_time TEXT",
        "ALTER TABLE tasks ADD COLUMN is_pinned INTEGER DEFAULT 0",
        "ALTER TABLE tasks ADD COLUMN finance_type TEXT",
    ];

    for (const sql of migrations) {
        try { await db.execute(sql); } catch (e) { /* Column exists */ }
    }
}

