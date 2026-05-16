const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// DB connect (safe way)
connectDB().catch((err) => {
  console.log("DB Connection Failed:", err);
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/mood", require("./routes/moodRoutes"));
app.use("/api/insights", require("./routes/insightRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/recurring", require("./routes/recurringRoutes"));

module.exports = app;  