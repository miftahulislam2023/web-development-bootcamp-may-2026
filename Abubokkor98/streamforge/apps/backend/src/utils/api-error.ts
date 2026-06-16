import { StatusCodes } from 'http-status-codes';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly errors?: ValidationErrorDetail[];

  constructor(
    statusCode: number,
    message: string,
    errors?: ValidationErrorDetail[],
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string): ApiError {
    return new ApiError(StatusCodes.BAD_REQUEST, message);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(StatusCodes.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(StatusCodes.FORBIDDEN, message);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(StatusCodes.NOT_FOUND, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(StatusCodes.CONFLICT, message);
  }

  static validation(errors: ValidationErrorDetail[]): ApiError {
    return new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation failed', errors);
  }

  static internal(message = 'Internal Server Error'): ApiError {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message, undefined, false);
  }
}
