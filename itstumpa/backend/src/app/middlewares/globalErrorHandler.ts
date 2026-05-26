import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import config from "../config";
import { ZodError } from "zod";
import ApiError from "../../utils/apiErrors";

const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (config.node_env === "development") {
    console.log(err);
  }

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  /* -------------------- Zod Error -------------------- */
if (err instanceof ZodError) {
  return res.status(httpStatus.BAD_REQUEST).json({
    success: false,
    message: "Zod Validation Error",
    error: err.issues.map((e) => ({
      path: e.path.join(".") || "body",
      message: e.message,
      code: e.code,
    })),
  });
}

  // ---------------- Prisma Known Errors ---------------- */
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message = "Duplicate entry already exists";
        break;

      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message = "Requested resource not found";
        break;

      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Invalid relation reference";
        break;

      case "P2011":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Missing required field";
        break;

      default:
        statusCode = httpStatus.BAD_REQUEST;
        message = "Database operation failed";
        break;
    }
  }

  // ---------------- Prisma Validation Error ---------------- */
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid data provided";
  }

  // ---------------- Prisma Init Error ---------------- */
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.BAD_GATEWAY;
    message = "Database connection failed";
  }

  // ---------------- custom AppError ---------------- */
  else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // ---------------- Error ---------------- */
  else if (err instanceof Error) {
    statusCode = httpStatus.BAD_GATEWAY;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: config.node_env === "development" ? err : undefined,
    stack: config.node_env === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;