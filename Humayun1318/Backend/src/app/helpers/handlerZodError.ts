import type { TErrorSources, TGenericErrorResponse } from '../interfaces/error.types';
import { HTTP_STATUS } from '../utils/HTTP_STATUS_CODE';

// Handles Zod validation errors and formats them into a standardized error response
export const handlerZodError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  err.issues.forEach((issue: any) => {
    // Extract the field name from the path array (last element)
    // Example: path=['email'] -> get 'email'
    // Example: path=['user', 'profile', 'phone'] -> get 'phone'
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  return {
    statusCode: HTTP_STATUS.BAD_REQUEST, // 400 Bad Request - client provided invalid data
    message: 'Zod Error',
    errorSources,
  };
};
