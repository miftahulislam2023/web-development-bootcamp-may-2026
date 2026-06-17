import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const validateSchema =
  <T extends ZodType<any, any>>(schema: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateSchema;
