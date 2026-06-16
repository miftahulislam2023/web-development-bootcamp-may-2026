import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '@/utils/api-error';

type RequestField = 'body' | 'params' | 'query';

/**
 * Zod validation middleware factory.
 * Validates the specified request field against a schema
 * and forwards a structured ApiError on failure.
 */
export function validate(schema: z.ZodType, field: RequestField = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[field]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.map(String).join('.') || field,
        message: issue.message,
      }));

      next(ApiError.validation(errors));
      return;
    }

    // Overwrite the field with the validated + coerced data
    Object.assign(req, { [field]: result.data });
    next();
  };
}
