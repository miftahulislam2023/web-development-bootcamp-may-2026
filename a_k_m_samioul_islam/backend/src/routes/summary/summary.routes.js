import express from "express";
import { categoryWiseExpense, getSummary } from "../../controllers/summary/summary.controller.js";
import { verifyFirebaseToken } from "../../middlewares/auth/auth.middleware.js";
import { loadDbUser } from "../../middlewares/dbuser/dbuser.middleware.js";

const router=express.Router();

// Dashboard summary

router.get("/summary", verifyFirebaseToken, loadDbUser, getSummary);

// Last 7 days category wise expenses

router.get("/summary/expenses", verifyFirebaseToken, loadDbUser, categoryWiseExpense);

export default router;