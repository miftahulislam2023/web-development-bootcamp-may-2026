import express from "express";
import { createBudget, getBudgetSummary, getCurrentBudget } from "../../controllers/budget/budget.controller.js";
import { verifyFirebaseToken } from "../../middlewares/auth/auth.middleware.js";
import { loadDbUser } from "../../middlewares/dbuser/dbuser.middleware.js";

const router=express.Router();

// Budget creation

router.post("/budget", verifyFirebaseToken, createBudget);

// Current budget fetch

router.get("/budget", verifyFirebaseToken, loadDbUser, getCurrentBudget);

// Budget history summary

router.get("/budget/summary", verifyFirebaseToken, loadDbUser, getBudgetSummary);

export default router;
