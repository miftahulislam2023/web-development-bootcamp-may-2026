import type mongoose from 'mongoose';
import type { TErrorSources, TGenericErrorResponse } from '../interfaces/error.types';
import { HTTP_STATUS } from '../utils/HTTP_STATUS_CODE';

export const handlerValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  // Array to store processed validation errors
  const errorSources: TErrorSources[] = [];

  const errors = Object.values(err.errors);

  errors.forEach((errorObject: any) =>
    errorSources.push({
      // Path of the field that failed validation (e.g., 'email', 'age', 'user.profile.phone')
      path: errorObject.path,
      // The validation error message explaining why the field failed
      message: errorObject.message,
    }),
  );

  return {
    statusCode: HTTP_STATUS.BAD_REQUEST, // Bad Request - client provided invalid data
    message: 'Validation Error',
    errorSources,
  };
};
