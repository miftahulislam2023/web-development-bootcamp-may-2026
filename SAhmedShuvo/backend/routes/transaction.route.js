const express = require("express");
const { checkAuthentication } = require("../middlewares/auth.middleware");
const { addExpense, addIncome, showTransaction, deleteTransaction } = require("../controllers/transaction.controller");
const transactionRouter = express.Router();

transactionRouter.post("/addExpense", checkAuthentication, addExpense);
transactionRouter.post("/addIncome", checkAuthentication, addIncome);
transactionRouter.get("/show", checkAuthentication, showTransaction);
transactionRouter.post("/delete/:id", checkAuthentication, deleteTransaction);

module.exports = transactionRouter;

