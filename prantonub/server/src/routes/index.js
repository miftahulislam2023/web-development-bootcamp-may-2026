const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { getBudgets, setBudget, deleteBudget } = require("../controllers/budgetController");
const { getRecurring, createRecurring, updateRecurring, toggleRecurring, deleteRecurring } = require("../controllers/recurringController");
const { getProfile, updateProfile, changePassword, deleteAccount } = require("../controllers/userController");

// Budget routes
const budgetRouter = require("express").Router();
budgetRouter.use(protect);
budgetRouter.get("/", getBudgets);
budgetRouter.post("/", setBudget);
budgetRouter.delete("/:id", deleteBudget);

// Recurring routes
const recurringRouter = require("express").Router();
recurringRouter.use(protect);
recurringRouter.get("/", getRecurring);
recurringRouter.post("/", createRecurring);
recurringRouter.put("/:id", updateRecurring);
recurringRouter.patch("/:id/toggle", toggleRecurring);
recurringRouter.delete("/:id", deleteRecurring);

// User routes
const userRouter = require("express").Router();
userRouter.use(protect);
userRouter.get("/profile", getProfile);
userRouter.put("/profile", updateProfile);
userRouter.put("/password", changePassword);
userRouter.delete("/account", deleteAccount);

module.exports = { budgetRouter, recurringRouter, userRouter };
