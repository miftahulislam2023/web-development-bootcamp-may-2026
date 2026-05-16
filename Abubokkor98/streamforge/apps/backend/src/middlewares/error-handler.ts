import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '@/utils/api-error';
import { logger } from '@/utils/logger';

interface ErrorResponseBody {
  status: 'error';
  statusCode: number;
  message: string;
  errors?: { field: string; message: string }[];
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return _next(err);
  }

  if (err instanceof ApiError) {
    const body: ErrorResponseBody = {
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    };

    if (err.errors) {
      body.errors = err.errors;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  // Unexpected errors — log full stack for debugging
  logger.error({ err }, '[Unhandled Error]');

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
  } satisfies ErrorResponseBody);
}
