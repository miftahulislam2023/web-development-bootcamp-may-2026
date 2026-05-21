import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import ratelimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import router from './src/routes/routes.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
}));

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API Running",
  });
});


// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});


// Global Error Handler
app.use((err, req, res, next) => {

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });

});

export default app;

