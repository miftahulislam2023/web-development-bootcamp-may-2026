// src/middlewares/validateRequest.ts
import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import ApiError from "../../utils/apiErrors";

export const validateRequest =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
 body: req.body ?? {},
        params: req.params ?? {},
        query: req.query ?? {},
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues.map((e) => e.message).join(", ");
        return next(new ApiError(400, message));
      }
      next(err);
    }
  };