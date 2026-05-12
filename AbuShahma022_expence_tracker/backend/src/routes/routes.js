import express from "express";

import authRoutes from "./auth.routes.js";
import expenseTypeRoutes from "./expenseType.routes.js";
import expenseRoutes from "./expense.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use(
  "/expense-types",
  expenseTypeRoutes
);

router.use(
  "/expenses",
  expenseRoutes
);
export default router;