/**
 * Database Client — Turso/libSQL Connection
 * 
 * Provides a singleton database client for the Auth Service.
 * Reads connection parameters from environment variables.
 * 
 * On Vercel: env vars come from the Dashboard (no dotenv needed).
 * Locally: dotenv is loaded by server.ts before this module is imported.
 * 
 * @module database
 * @author Coder-A (Auth Service Lead)
 */

import { createClient, type Client } from "@libsql/client";

// ── Connection Configuration ─────────────────────────────────────────────────
const TURSO_URL: string = process.env.TURSO_DB_URL || process.env.VITE_TURSO_DB_URL || "";
const TURSO_TOKEN: string = process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN || "";

if (!TURSO_URL) {
    console.error("[AUTH-DB] ⚠️  TURSO_DB_URL is NOT set. All DB operations will fail.");
}
if (!TURSO_TOKEN) {
    console.error("[AUTH-DB] ⚠️  TURSO_AUTH_TOKEN is NOT set. All DB operations will fail.");
}

// ── Client Initialisation ────────────────────────────────────────────────────

/**
 * The database client singleton.
 * Falls back to a mock client that throws descriptive errors when
 * environment variables are missing.
 */
export class DatabaseConnection {
    private static instance: Client;

    /**
     * Returns the singleton Turso client. Initialises on first call.
     */
    public static getClient(): Client {
        if (!DatabaseConnection.instance) {
            try {
                DatabaseConnection.instance = createClient({
                    url: TURSO_URL || "libsql://dummy.turso.io",
                    authToken: TURSO_TOKEN,
                });
                console.log("[AUTH-DB] ✅ Turso client initialised successfully.");
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                console.error("[AUTH-DB] ❌ Failed to initialise Turso client:", message);

                // Return a stub that always rejects
                DatabaseConnection.instance = {
                    execute: async () => {
                        throw new Error(
                            `Database client init failed. Verify TURSO_DB_URL. Original: ${message}`
                        );
                    },
                } as unknown as Client;
            }
        }
        return DatabaseConnection.instance;
    }
}

/** Convenience shorthand — import { db } from "./database" */
export const db = DatabaseConnection.getClient();
