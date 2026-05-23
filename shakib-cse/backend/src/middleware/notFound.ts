import { NotFoundError } from "@/core/errors/AppError";
import { Request, Response, NextFunction } from "express";

export function notFoundHandler() {
  return (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.path}`));
  };
}
