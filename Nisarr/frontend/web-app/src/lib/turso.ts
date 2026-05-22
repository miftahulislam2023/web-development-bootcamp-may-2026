// Re-export everything from the new Database module for backwards compatibility
// This file maintains the existing import paths while using the new organized structure

export { db, generateId, initDatabase } from "@/Database";
export * from "@/Database/schemas";

// Legacy default user ID (kept for any existing references, but deprecated)
export const DEFAULT_USER_ID = "default-user";
