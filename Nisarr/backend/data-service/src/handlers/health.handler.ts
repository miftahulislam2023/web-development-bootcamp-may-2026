// health.handler.ts — Health check endpoint
import { db } from "../utils/database.js";

export async function handleHealth(_req: any, res: any) {
    const envStatus = {
        TURSO_DB_URL: !!(process.env.TURSO_DB_URL || process.env.VITE_TURSO_DB_URL),
        TURSO_AUTH_TOKEN: !!(process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN),
        GOOGLE_CLIENT_ID: !!process.env.VITE_GOOGLE_CLIENT_ID,
        JWT_SECRET: !!(process.env.JWT_SECRET || process.env.VITE_JWT_SECRET),
    };
    let dbStatus = "unknown";
    try { await db.execute("SELECT 1"); dbStatus = "connected"; }
    catch (err: any) { dbStatus = `error: ${err.message}`; }

    res.json({ status: dbStatus === "connected" ? "ok" : "degraded", service: "data-service", time: new Date().toISOString(), db: dbStatus, env: envStatus });
}
