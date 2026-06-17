import { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "../prisma/generated/client.js";
import { ZodError } from "zod";
import multer from "multer";
import responseHandler from "$/utils/responseHandler.js";
import {
  parseP2003FieldName,
  parsePrismaValidationError,
} from "$/utils/prismaErrorParser.js";

export class ApiError extends Error {
  statusCode: number;
  path: string;

  constructor(
    statusCode: number,
    message: string,
    path: string = "",
    stack?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.path = path;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const notFoundHandler: RequestHandler = (req, res, next) => {
  return responseHandler(res, 404, {
    success: false,
    message: "Oops! The page you’re looking for doesn’t exist.",
  });
};

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = 500;
  let message = err.message || "Something went wrong. Please try again later.";
  let errors = null;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint
        statusCode = 409;
        message = "Duplicate value violates a unique constraint";
        errors = [
          {
            path: (err.meta?.target as string[] | undefined)?.[0] || "general",
            message,
          },
        ];
        break;

      case "P2003": {
        // Foreign key constraint failed
        const modelName = err.meta?.modelName || "UnknownModel";
        const fieldName = parseP2003FieldName(err.message);

        statusCode = 400;

        message = `Operation failed due to a related data constraint.`;

        errors = [
          {
            path: fieldName !== "unknown_field" ? fieldName : "general",
            message:
              fieldName !== "unknown_field"
                ? `The provided value for '${fieldName}' is invalid or this ${modelName} is still linked to other records. Ensure the referenced record exists and remove dependent records if necessary.`
                : `This record is either linked to other existing records or references a non-existing related record. Please verify relationships before retrying.`,
          },
        ];
        break;
      }

      case "P1000": // Auth fail
        statusCode = 500;
        message = "Database authentication failed";
        errors = [
          {
            path: (err.meta?.target as string[] | undefined)?.[0] || "general",
            message,
          },
        ];
        break;

      case "P2011": // Null constraint violation
        statusCode = 400;
        message = "Required field is missing or null";
        errors = [
          {
            path: (err.meta?.target as string[] | undefined)?.[0] || "general",
            message,
          },
        ];
        break;
      case "P2025": // Record not found
        const targetModel = err.meta?.modelName || "Record";
        statusCode = 404;
        message = `${targetModel} not found. The operation could not be completed because the target record does not exist.`;
        errors = [
          {
            path: "general",
            message,
          },
        ];
        break;

      default:
        statusCode = 400;
        message = err.message;
        errors = [{ path: "general", message }];
        break;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    const error = parsePrismaValidationError(err.message);
    statusCode = 400;
    message = err.message ?? "Prisma query validation error";
    errors = [
      {
        path: error.field !== "unknown_field" ? error.field : "general",
        message,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unknown error occurred in Prisma";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Prisma client failed to initialize";
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Input validation failed";
    errors = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1] || "general",
      message: issue.message,
    }));
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    if (err.path) {
      errors = [{ path: err.path, message }];
    }
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = "There was an upload error!";

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File too large. Maximum allowed size exceeded.";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files uploaded. Limit exceeded.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field. Please check the field name.";
        break;
      case "LIMIT_PART_COUNT":
        message = "Too many parts in the form.";
        break;
      case "LIMIT_FIELD_KEY":
        message = "Field name too long.";
        break;
      case "LIMIT_FIELD_VALUE":
        message = "Field value too long.";
        break;
      case "LIMIT_FIELD_COUNT":
        message = "Too many fields in the form.";
        break;
      default:
        message = `Upload error: ${err.message}`;
    }
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  return responseHandler(res, statusCode, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};
