import type { TGenericErrorResponse } from '../interfaces/error.types';
import { HTTP_STATUS } from '../utils/HTTP_STATUS_CODE';

// Handles MongoDB duplicate key errors (e.g., unique index violations)
// MongoDB error code 11000 indicates a duplicate key error, which occurs when trying to insert a document with a value that already exists for a field that has a unique index (e.g., email)
// This function extracts the field name from the error message and returns a standardized error response indicating which field caused the duplication issue
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  return {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    message: `${matchedArray[1]} already exists!!`,
  };
};
