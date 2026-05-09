import { Request, Response, NextFunction } from "express";
import {
  AppError,
  AuthenticationError,
  PayloadTooLargeError,
  ValidationError,
} from "./AppError";
import { AppLogger } from "../logging/logger";
import { HTTPStatusCode } from "@/types/HTTPStatusCode";
import { errorMapperRegistry } from "./ErrorMapperRegistry";
import { MulterError } from "multer";

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    timestamp: string;
    requestId: string;
    details?: unknown;
    stack?: string;
  };
}

export function errorHandler() {
  return (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    const appError = normalizeError(err);

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode,
        timestamp: new Date().toISOString(),
        requestId: req.id || "unknown",
        ...(appError.details ? { details: appError.details } : {}),
        ...(process.env.NODE_ENV === "development"
          ? { stack: appError.stack }
          : {}),
      },
    };

    logError(appError, req);

    res.status(appError.statusCode).json(errorResponse);
  };
}

function normalizeError(err: unknown): AppError {
  // 1. Already an AppError
  if (err instanceof AppError) {
    return err;
  }

  // 2. Delegate to registered infrastructure error mappers (e.g., Prisma, Redis)
  const mappedError = errorMapperRegistry.map(err);
  if (mappedError) {
    return mappedError;
  }

  // 3. Handle validation errors
  if (err instanceof Error && err.name === "ValidationError") {
    return new ValidationError(err.message, { originalError: err });
  }

  // 4. Handle JSON parsing errors
  if (err instanceof SyntaxError && "body" in err) {
    return new AppError({
      statusCode: HTTPStatusCode.BAD_REQUEST,
      message: "Invalid JSON in request body",
      code: "INVALID_JSON",
      details: { originalError: err.message },
    });
  }

  // 5. Handle multer errors
  if (err instanceof Error && err.name === "MulterError") {
    return handleMulterError(err as any);
  }

  // 6. Handle JWT errors
  if (err instanceof Error && err.name === "JsonWebTokenError") {
    return new AuthenticationError("Invalid token", {
      originalError: err.message,
    });
  }

  if (err instanceof Error && err.name === "TokenExpiredError") {
    return new AuthenticationError("Token expired", {
      originalError: err.message,
    });
  }

  // 7. Generic Error
  if (err instanceof Error) {
    return new AppError({
      statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      message: err.message || "Internal server error",
      code: "INTERNAL_ERROR",
      details: { originalError: err.message, stack: err.stack },
    });
  }

  // 8. Unknown error type
  return new AppError({
    statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    message: "An unknown error occurred",
    code: "UNKNOWN_ERROR",
    details: { originalError: String(err) },
  });
}

function handleMulterError(err: MulterError): AppError {
  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      return new PayloadTooLargeError("File too large");

    case "LIMIT_FILE_COUNT":
      return new AppError({
        statusCode: HTTPStatusCode.BAD_REQUEST,
        message: "Too many files",
        code: "TOO_MANY_FILES",
      });

    case "LIMIT_UNEXPECTED_FILE":
      return new AppError({
        statusCode: HTTPStatusCode.BAD_REQUEST,
        message: "Unexpected file field",
        code: "UNEXPECTED_FILE",
      });

    default:
      return new AppError({
        statusCode: HTTPStatusCode.BAD_REQUEST,
        message: "File upload error",
        code: "FILE_UPLOAD_ERROR",
        // TypeScript now knows `err.code` is a valid string from Multer
        details: { multerError: err.code, field: err.field },
      });
  }
}

function logError(error: AppError, req: Request): void {
  // Safely extract IP
  const xff = req.headers["x-forwarded-for"];
  const ip = Array.isArray(xff) ? xff[0] : xff || req.ip;
  const method = req.method;
  const path = req.originalUrl || req.path;

  // Build a beautiful, single-line string
  let logMessage = `[${method}] ${path} | Status: ${error.statusCode} | Code: ${error.code} | IP: ${ip} | ${error.message}`;

  // Only append details if they exist
  if (error.details && Object.keys(error.details).length > 0) {
    logMessage += ` | Details: ${JSON.stringify(error.details)}`;
  }

  // Log based on severity without passing a giant meta object
  if (error.statusCode >= 500) {
    // We still pass the stack trace as meta for 500 errors so you can debug crashes
    AppLogger.error(`❌ ${logMessage}`, { stack: error.stack });
  } else if (error.statusCode >= 400) {
    AppLogger.warn(`⚠️ ${logMessage}`);
  } else {
    AppLogger.info(`ℹ️ ${logMessage}`);
  }
}
