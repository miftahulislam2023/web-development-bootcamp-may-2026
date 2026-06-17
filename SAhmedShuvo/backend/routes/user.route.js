const express = require("express");
const userRouter = express.Router();

const { RegisterUser, LoginUser } = require("../controllers/auth.controller");
const { checkAuthentication } = require("../middlewares/auth.middleware");
const { dashboardInfo, monthlySummary, downloadMonthlyReport, chartData, expenseCategories } = require("../controllers/user.controller");


userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.get("/dashboard", checkAuthentication, dashboardInfo);
userRouter.get("/report", checkAuthentication, monthlySummary );
userRouter.get("/downloadReport", checkAuthentication, downloadMonthlyReport);
userRouter.get("/chartData", checkAuthentication, chartData);
userRouter.get("/expenseCategories", checkAuthentication, expenseCategories)

module.exports = userRouter;