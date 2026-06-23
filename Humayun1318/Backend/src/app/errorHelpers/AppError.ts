class AppError extends Error {
  // HTTP status code associated with this error
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;

    // Set or auto-capture the stack trace
    if (stack) {
      // Use provided custom stack trace
      this.stack = stack;
    } else {
      // Automatically capture the stack trace at the point where error was thrown
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
