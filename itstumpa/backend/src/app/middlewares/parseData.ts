import { NextFunction, Request, Response } from 'express';

export const parseData = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body?.data) return next();

  try {
    const parsed = JSON.parse(req.body.data);
    req.body = { ...req.body, ...parsed };
    delete req.body.data;
    next();
  } catch {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in data',
    });
  }
};