import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createBudget,
  getCurrentBudget,
} from "../controllers/budget.controller.js";

const router = express.Router();


// Create Budget
router.post(
  "/",
  authMiddleware,
  createBudget
);


// Get Current Budget
router.get(
  "/current",
  authMiddleware,
  getCurrentBudget
);


export default router;