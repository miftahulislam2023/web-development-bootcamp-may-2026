require("dotenv").config();   // MUST be first

const express = require("express");
const connectDB = require("./config/db");
const applyMiddleware= require("./middlewares/app.middleware");
const app = express();
applyMiddleware(app);

const userRouter = require("./routes/user.route");
const accountRouter = require("./routes/account.route");
const transactionRouter = require("./routes/transaction.route");

// // Serve static files from uploads directory
// const path = require("path");
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect Database
connectDB();



app.get("/", (req, res) => {
  res.json({
    message: "Welcome to personal expense app",
  });
});

//users
app.use("/api/user", userRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);
// app.use("/report", reportRouter);
// app.use("/item", itemRouter);
// app.use("/admin", adminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
