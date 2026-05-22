/**
 * Auth Service — Express Server Entry Point
 *
 * Listens on port 4001 and serves all /api/auth/* endpoints.
 *
 * @module server
 * @author Coder-A (Auth Service Lead)
 */

// ── Load Environment ─────────────────────────────────────────────────────────
// On Vercel: env vars come from Dashboard, dotenv is a no-op.
// Locally: reads from ../../.env
import dotenv from "dotenv";
try { dotenv.config({ path: "../../.env" }); } catch (_) { /* ignore on Vercel */ }

import express from "express";

import { corsMiddleware } from "./middleware/cors.js";
import authRoutes from "./routes/auth.routes.js";

// ── Application Bootstrap ────────────────────────────────────────────────────
const app = express();
const PORT = parseInt(process.env.AUTH_SERVICE_PORT || "4001", 10);

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
    console.log(`[AUTH-SRV] ${req.method} ${req.path}`);
    next();
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ service: "auth-service", status: "ok", time: new Date().toISOString() });
});

// ── Start ────────────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`\n  🔐 Auth Service running at http://localhost:${PORT}`);
        console.log(`  📡 Routes:`);
        console.log(`     POST /api/auth/register`);
        console.log(`     POST /api/auth/verify`);
        console.log(`     POST /api/auth/login`);
        console.log(`     POST /api/auth/forgot-password`);
        console.log(`     POST /api/auth/reset-password`);
        console.log(`     POST /api/auth/google`);
        console.log(`     GET  /api/auth/me`);
        console.log(`     GET  /health\n`);
    });
}

// Export the app for Serverless platforms (like Vercel)
export default app;
