import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createExpenseType,
  getExpenseTypes,
} from "../controllers/expenseType.controller.js";

const router = express.Router();


// Create Expense Type
router.post(
  "/",
  authMiddleware,
  createExpenseType
);


// Get Expense Types
router.get(
  "/",
  authMiddleware,
  getExpenseTypes
);


export default router;