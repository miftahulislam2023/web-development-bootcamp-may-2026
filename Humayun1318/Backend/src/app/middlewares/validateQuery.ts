import type { NextFunction, Request, Response } from 'express';
import type { ZodObject } from 'zod';
import type { ParsedQs } from 'qs';

export const validateQuery =
  (schema: ZodObject<any>) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = (await schema.parseAsync(req.query)) as unknown as ParsedQs;
      next();
    } catch (error) {
      next(error);
    }
  };
