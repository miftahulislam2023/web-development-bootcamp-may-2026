// data.routes.ts — All /api/data/* routes
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { handleTasks, handleGenericCRUD, handleGym, handleBudget, handleHabits, handleSync } from "../handlers/index.js";

const router = Router();

// All data routes require auth
router.use(authMiddleware);

// Unified sync endpoint — returns ALL data in one request
router.get("/all", async (req: any, res) => {
    try {
        await handleSync(req, res, req.userId);
    } catch (err: any) {
        console.error("[DATA-ROUTE] Error on /all:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Route dispatcher
router.all("*splat", async (req: any, res, next) => {
    const userId = req.userId;
    const url = req.originalUrl || req.url || "";
    const route = url.split("?")[0];

    try {
        if (route.startsWith("/api/data/tasks")) return await handleTasks(req, res, userId);
        if (route.startsWith("/api/data/gym/workouts") || route.startsWith("/api/data/gym/exercises/") || route.startsWith("/api/data/gym/sets/")) return await handleGym(req, res, userId);
        if (route.startsWith("/api/data/budgets/savings/tx") || route.startsWith("/api/data/budgets/savings/add")) return await handleBudget(req, res, userId);
        if (route === "/api/data/habits/complete" || route === "/api/data/habits/all") return await handleHabits(req, res, userId);

        // Generic table routing
        const parts = route.split("/");
        let table = parts[3];
        if (table === "generic" || url.includes("?table=")) {
            const urlObj = new URL(url, "http://localhost");
            table = urlObj.searchParams.get("table") || table;
        }

        const allowedTables = [
            "expenses", "budgets", "finance", "habits",
            "inventory", "inventory_items", "inventory_categories", "notes", "settings",
            "gym_workout_plans", "gym_exercises", "gym_workout_logs",
            "gym_set_logs", "gym_body_metrics", "gym_personal_records",
            "study_sessions", "study_topics", "study_subjects", "study_chapters_v2", "study_parts", "study_goals", "study_common_presets",
            "savings_transactions"
        ];

        if (allowedTables.includes(table)) return await handleGenericCRUD(req, res, userId, table);
        return res.status(404).json({ error: `Data route not found: ${route}`, table });
    } catch (err: any) {
        console.error(`[DATA-ROUTE] Error on ${route}:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;
