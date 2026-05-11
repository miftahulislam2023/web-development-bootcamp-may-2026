import express from "express";
import { verifyFirebaseToken } from "../../middlewares/auth/auth.middleware.js";
import { loadDbUser } from "../../middlewares/dbuser/dbuser.middleware.js";
import { createIncome, deleteIncome, getIncomeDetails, getIncomes, updateIncomeDetails } from "../../controllers/income/income.controller.js";

const router=express.Router();

// Income creation

router.post("/incomes", verifyFirebaseToken, createIncome);

// Incomes fetch

router.get("/incomes", verifyFirebaseToken, loadDbUser, getIncomes);

// Single income

router.get("/incomes/:id", verifyFirebaseToken, loadDbUser, getIncomeDetails);

// Income update

router.patch("/incomes/:id", verifyFirebaseToken, loadDbUser, updateIncomeDetails);

// Income delete

router.delete("/incomes/:id", verifyFirebaseToken, loadDbUser, deleteIncome);

export default router;