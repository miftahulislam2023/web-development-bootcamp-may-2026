import type { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import { envVars } from './app/config/env';
import { registerRecurrenceCron, stopRecurrenceCron } from './app/jobs/recurrence.cron';

let server: Server;

const startServer = async () => {
  try {
    // Establish connection to MongoDB database
    await mongoose.connect(envVars.DB_URL);

    console.log('Connected to DB!!......');

    registerRecurrenceCron();

    // Start Express server on the configured port
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Start server initialization
 * Uses Immediately Invoked Function Expression (IIFE) to handle async/await at the top level
 * Execution flow:
 * 1. Starts the Express server and connects to database
 * 2. Seeds the database with a super admin user if it doesn't exist
 */
(async () => {
  // Start the Express server and connect to MongoDB
  await startServer();
})();

/**
 * Handle SIGINT signal (Ctrl+C)
 * Gracefully shuts down the server when user interrupts the process
 * - Logs the signal received
 * - Closes the server if it exists, preventing new connections
 * - Exits the process with code 0 (success)
 */
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');

  // Check if server is initialized before attempting to close
  if (server) {
    // Close server and exit process after all connections are closed
    server.close(() => {
      console.log('Server closed gracefully');
      process.exit(0);
    });
  } else {
    // If server isn't initialized, exit immediately
    process.exit(0);
  }
});

/**
 * Handle SIGTERM signal (Termination signal)
 * Gracefully shuts down the server when the system terminates the process
 * Similar to SIGINT but triggered by external systems (Docker, systemd, etc.)
 * - Logs the signal received
 * - Closes the server to prevent new connections
 * - Exits process with code 0 after cleanup
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');

  // Check if server is initialized before attempting to close
  if (server) {
    // cron stop if system shutdown
    stopRecurrenceCron();
    // Close server and exit process after all connections are closed
    server.close(() => {
      console.log('Server closed gracefully');
      process.exit(0);
    });
  } else {
    // If server isn't initialized, exit immediately
    process.exit(0);
  }
});

/**
 * Handle unhandledRejection event
 * Catches rejected promises that don't have a .catch() handler
 * These typically indicate bugs in async code that need fixing
 * - Logs the rejection reason for debugging
 * - Closes the server to stop accepting new requests
 * - Exits process with code 1 (error) to indicate failure
 */
process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection at:', reason);

  // Check if server is initialized before attempting to close
  if (server) {
    // Close server and exit process with error code after cleanup
    server.close(() => {
      console.log('Server closed due to unhandled rejection');
      process.exit(1);
    });
  } else {
    // If server isn't initialized, exit immediately with error
    process.exit(1);
  }
});

/**
 * Handle uncaughtException event
 * Catches synchronous errors that aren't wrapped in try-catch blocks
 * These indicate critical issues that require process termination
 * - Logs the exception details for debugging
 * - Closes the server to stop accepting new requests
 * - Exits process with code 1 (error) to indicate critical failure
 */
process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception:', error);

  // Check if server is initialized before attempting to close
  if (server) {
    // Close server and exit process with error code after cleanup
    server.close(() => {
      console.log('Server closed due to uncaught exception');
      process.exit(1);
    });
  } else {
    // If server isn't initialized, exit immediately with error
    process.exit(1);
  }
});
