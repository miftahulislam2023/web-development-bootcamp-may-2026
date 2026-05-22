// database.ts — Turso connection for data-service
// FP style: simple exports, no classes
//
// On Vercel: env vars come from the Dashboard (no dotenv needed).
// Locally: server.ts loads dotenv before importing this module.

import { createClient } from "@libsql/client";

const url = process.env.TURSO_DB_URL || process.env.VITE_TURSO_DB_URL || "";
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN || "";

if (!url) console.error("⚠️ TURSO_DB_URL missing");
if (!authToken) console.error("⚠️ TURSO_AUTH_TOKEN missing");

let db: any;
try {
    db = createClient({ url: url || "libsql://dummy.turso.io", authToken });
} catch (err: any) {
    console.error("DB init failed:", err.message);
    db = { execute: async () => { throw new Error(`DB init failed: ${err.message}`); } };
}

export { db };
