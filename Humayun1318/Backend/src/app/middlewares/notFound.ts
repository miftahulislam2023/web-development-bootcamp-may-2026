import type { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

const notFound = (_req: Request, res: Response) => {
  // Return standardized 404 response with appropriate HTTP status
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Route Not Found',
  });
};

export default notFound;
