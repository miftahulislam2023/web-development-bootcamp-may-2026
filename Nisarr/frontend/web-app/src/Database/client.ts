import { createClient } from "@libsql/client";

// Initialize Turso client
export const db = createClient({
    url: import.meta.env.VITE_TURSO_DB_URL,
    authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});

// Helper function to generate UUIDs
export function generateId(): string {
    return crypto.randomUUID();
}
