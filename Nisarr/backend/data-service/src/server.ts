// server.ts — Data Service entry point

// ── Load Environment ─────────────────────────────────────────────────────────
// On Vercel: env vars come from Dashboard, dotenv is a no-op.
// Locally: reads from ../../.env
import dotenv from "dotenv";
try { dotenv.config({ path: "../../.env" }); } catch (_) { /* ignore on Vercel */ }

import express from "express";
import cors from "cors";
import compression from "compression";
import dataRoutes from "./routes/data.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { handleHealth } from "./handlers/index.js";
import { rateLimiter } from "./middleware/rate-limiter.js";

const app = express();
const PORT = parseInt(process.env.DATA_SERVICE_PORT || "4002", 10);

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(compression()); // Compress all responses to optimize payload size (especially for /api/data/all)
app.use(express.json());
app.use(rateLimiter(100, 60_000)); // 100 requests per minute per IP — blocks API abuse

// Request logging
app.use((req, _res, next) => { console.log(`[DATA-SRV] ${req.method} ${req.path}`); next(); });

// Routes
app.use("/api/data", dataRoutes);
app.use("/api/ai", aiRoutes);
app.get("/api/health", handleHealth);
app.get("/health", (_req, res) => res.json({ service: "data-service", status: "ok", time: new Date().toISOString() }));

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`\n  📦 Data Service running at http://localhost:${PORT}`);
        console.log(`  📡 Routes: /api/data/*, /api/ai/enhance, /api/health\n`);
    });
}

// Export the app for Serverless platforms (like Vercel)
export default app;
