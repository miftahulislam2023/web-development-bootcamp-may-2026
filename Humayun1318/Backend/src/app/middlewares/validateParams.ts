import type { NextFunction, Request, Response } from 'express';
import type { ZodObject } from 'zod';
import type { ParamsDictionary } from 'express-serve-static-core';
export const validateParams =
  (schema: ZodObject<any>) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedParams = await schema.parseAsync(req.params);
      req.params = parsedParams as unknown as ParamsDictionary;

      next();
    } catch (error) {
      next(error);
    }
  };
