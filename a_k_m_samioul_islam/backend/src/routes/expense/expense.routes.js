import express from "express";
import { createExpense, deleteExpense, getExpenseDetails, getExpenses, updateExpenseDetails } from "../../controllers/expense/expense.controller.js";
import { verifyFirebaseToken } from "../../middlewares/auth/auth.middleware.js";
import { loadDbUser } from "../../middlewares/dbuser/dbuser.middleware.js";

const router=express.Router();

// Expense creation

router.post("/expenses", verifyFirebaseToken, loadDbUser, createExpense);

// Expenses fetch

router.get("/expenses", verifyFirebaseToken, loadDbUser,getExpenses);

// Single expense

router.get("/expenses/:id", verifyFirebaseToken, loadDbUser, getExpenseDetails);

// Expense update

router.patch("/expenses/:id", verifyFirebaseToken, loadDbUser, updateExpenseDetails);

// Expense delete

router.delete("/expenses/:id", verifyFirebaseToken, loadDbUser, deleteExpense);

export default router;