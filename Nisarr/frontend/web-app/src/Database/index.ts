// Database client and utilities
export { db, generateId } from "./client";

// Schema exports
export * from "./schemas";

// Initialize all database tables
import { initUsersTable, initSettingsTable, initOtpsTable } from "./schemas/users";
import { initTasksTable } from "./schemas/tasks";
import { initFinanceTable } from "./schemas/finance";
import { initBudgetTable } from "./schemas/budget";
import { initNotesTable } from "./schemas/notes";
import { initHabitsTable } from "./schemas/habits";
import { initInventoryTable } from "./schemas/inventory";
import { initStudyTable } from "./schemas/study";

export async function initDatabase(): Promise<void> {
    try {
        await initUsersTable();
        await initOtpsTable();
        await initSettingsTable();
        await initTasksTable();
        await initHabitsTable();
        await initFinanceTable();
        await initBudgetTable();
        await initNotesTable();
        await initInventoryTable();
        await initStudyTable();
        console.log("Database tables initialized successfully");
    } catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
    }
}
