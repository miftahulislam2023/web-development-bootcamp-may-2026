// src/core/errors/AppError.ts
import { HTTPStatusCode } from "@/types/HTTPStatusCode";
import { config } from "../config";

// 1. Define the parameters object
export interface AppErrorArgs {
  statusCode: HTTPStatusCode;
  message: string;
  code?: string;
  details?: unknown;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly statusCode: HTTPStatusCode;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  // 2. Constructor now takes a single configuration object
  constructor(args: AppErrorArgs) {
    super(args.message);
    this.name = this.constructor.name;
    this.statusCode = args.statusCode;
    this.code = args.code || "APP_ERROR";
    this.isOperational = args.isOperational ?? true;
    this.details = args.details;

    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      ...(config.server.env === "development" && this.details
        ? { details: this.details }
        : {}),
    };
  }
}

// --- Specific Error Classes Updated to Object Pattern ---

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.BAD_REQUEST,
      message,
      code: "VALIDATION_ERROR",
      details,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.NOT_FOUND,
      message: `${resource} not found`,
      code: "NOT_FOUND",
      details,
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.UNAUTHORIZED,
      message,
      code: "AUTHENTICATION_ERROR",
      details,
    });
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.FORBIDDEN,
      message,
      code: "AUTHORIZATION_ERROR",
      details,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.CONFLICT,
      message,
      code: "CONFLICT_ERROR",
      details,
    });
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.TOO_MANY_REQUESTS,
      message,
      code: "RATE_LIMIT_ERROR",
      details,
    });
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message = "Payload too large", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.PAYLOAD_TOO_LARGE,
      message,
      code: "PAYLOAD_TOO_LARGE",
      details,
    });
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      message,
      code: "DATABASE_ERROR",
      details,
      isOperational: false, // Critical DB errors are often non-operational
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = "External service error", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.BAD_GATEWAY,
      message,
      code: "EXTERNAL_SERVICE_ERROR",
      details,
    });
  }
}

export class TimeoutError extends AppError {
  constructor(message = "Request timeout", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.REQUEST_TIMEOUT,
      message,
      code: "TIMEOUT_ERROR",
      details,
    });
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super({
      statusCode: HTTPStatusCode.BAD_REQUEST,
      message,
      code: "BAD_REQUEST_ERROR",
      details,
    });
  }
}
