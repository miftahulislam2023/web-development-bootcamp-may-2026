import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routers";
import passport from "passport";
import "./app/config/passport";
import config from "./app/config/index";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { rateLimiter  } from "./app/middlewares/rateLimiter";
import compression from "compression";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

// middlewares
app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  }),
);

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Gzip compression
app.use(compression());
// Redis Rate limit 
app.use(rateLimiter());

// ── Health Check ───────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    service: "livechat-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// MAIN ROUTE
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.send({
    message: "Server Is Running..",
    environment: config.node_env,
    uptime: process.uptime().toFixed(2) + " second",
    timeStamp: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;