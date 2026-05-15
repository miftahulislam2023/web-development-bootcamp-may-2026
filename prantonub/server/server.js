require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("./src/config/passport");
const { errorHandler } = require("./src/middleware/errorHandler");
const { apiLimiter } = require("./src/middleware/rateLimiter");

// Import cron job
require("./src/config/cron");

const app = express();

// Security: Add helmet middleware for security headers
app.use(helmet());

// Rate limiting and CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL === "https://financehub-prantonub.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// General rate limiting for all API requests
app.use("/api/", apiLimiter);

// Body parsing
app.use(express.json({ limit: "1mb" })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/transactions", require("./src/routes/transaction"));
app.use("/api/budgets", require("./src/routes/budget"));
app.use("/api/recurring", require("./src/routes/recurring"));
app.use("/api/notifications", require("./src/routes/notification"));
app.use("/api/user", require("./src/routes/user"));
app.use("/api/export", require("./src/routes/export"));
app.use("/api/ai", require("./src/routes/ai"));

// Health check endpoint
app.get("/", (_req, res) =>
  res.json({ success: true, message: "SpendWise API v2 🚀" }),
);

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

// Global error handler (must be last)
app.use(errorHandler);

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server → http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB failed:", err.message);
    process.exit(1);
  });
