import type mongoose from 'mongoose';
import type { TGenericErrorResponse } from '../interfaces/error.types';
import { HTTP_STATUS } from '../utils/HTTP_STATUS_CODE';

export const handleCastError = (_err: mongoose.Error.CastError): TGenericErrorResponse => {
  // Return standardized error response explaining the issue and how to fix it
  return {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    message: 'Invalid MongoDB ObjectID. Please provide a valid id',
  };
};
