import type { NextFunction, Request, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  /**
   * Execute the async handler and catch any promise rejections
   * Promise.resolve() ensures the return value is treated as a promise
   * .catch() intercepts any errors and passes them to the error handler
   */
  Promise.resolve(fn(req, res, next)).catch((err: any) => {
    // Pass caught error to Express global error handler
    next(err);
  });
};

export default catchAsync;
