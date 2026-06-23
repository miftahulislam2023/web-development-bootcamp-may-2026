import type { NextFunction, Request, Response } from 'express';
import type { ZodObject } from 'zod';

export const validateRequest =
  (zodSchema: ZodObject<any>) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        // Parse stringified JSON from multipart form submission
        req.body = JSON.parse(req.body.data);
      }
      // Validate request body against the provided Zod schema
      req.body = await zodSchema.parseAsync(req.body);

      // Validation passed - proceed to next middleware/route handler
      next();
    } catch (error) {
      next(error);
    }
  };
