import express from "express"
import cors from "cors"
import userRoutes from "./routes/user/user.routes.js"
import expenseRoutes from "./routes/expense/expense.routes.js"
import incomeRoutes from "./routes/incomes/income.route.js"
import budgetRoutes from "./routes/budget/budget.routes.js"

const app=express();

app.use(cors());

app.use(express.json());

// User routes

app.use("/api", userRoutes);

// Expense routes

app.use("/api", expenseRoutes);

// Income routes

app.use("/api", incomeRoutes);

// budget routes

app.use("/api", budgetRoutes);

export default app;