import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getCategorySummary,
  getMonthlySummary,
  getSingleExpense
} from "../controllers/expense.controller.js";

const router = express.Router();


// Create Expense
router.post(
  "/",
  authMiddleware,
  createExpense
);

router.get(
  "/",
  authMiddleware,
  getExpenses
);

router.get(
  "/summary",
  authMiddleware,
  getExpenseSummary
);

router.get(
  "/category-summary",
  authMiddleware,
  getCategorySummary
);

router.get(
  "/monthly-summary",
  authMiddleware,
  getMonthlySummary
);

router.get(
  "/:id",
  authMiddleware,
  getSingleExpense
);


router.patch(
  "/:id",
  authMiddleware,
  updateExpense
);

router.delete(
  "/:id",
  authMiddleware,
  deleteExpense
);
export default router;