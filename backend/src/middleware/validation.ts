// src/middleware/validation.ts
import { ValidationError } from "@/core/errors/AppError";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateRequest(schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Validate and store body
      if (schema.body) {
        req.body = schema.body.parse(req.body);
        req.validatedBody = req.body;
      }

      // Validate query parameters without modifying req.query
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);
        req.validatedQuery = parsedQuery;
        try {
          // Create a new object with parsed values
          req.query = parsedQuery as any;
        } catch (error) {}
      }

      // Validate params without modifying req.params
      if (schema.params) {
        const parsedParams = schema.params.parse(req.params);
        req.validatedParams = parsedParams;

        try {
          Object.assign(req.params, parsedParams);
        } catch (error) {
          // If we can't modify req.params, just use validatedParams
        }
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }));

        next(
          new ValidationError("Request validation failed", {
            issues,
            invalidFields: issues.length,
          }),
        );
      } else {
        next(error);
      }
    }
  };
}

// Helper function to get validated data from request
export function getValidatedData(req: Request) {
  return {
    query: req.validatedQuery || req.query,
    params: req.validatedParams || req.params,
    body: req.validatedBody || req.body,
  };
}
