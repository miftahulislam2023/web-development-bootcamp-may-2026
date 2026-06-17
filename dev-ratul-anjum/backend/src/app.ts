import express from "express";
import cors from "cors";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.js";
import corsOptions from "./utils/corsOptions.js";
import appRouter from "./router.js";
import { env } from "./utils/env.js";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const app = express();

// Trust proxy must be set before session middleware
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(cors(corsOptions));

// auth route
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/api", appRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
