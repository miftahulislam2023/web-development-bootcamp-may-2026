import dotenv from 'dotenv';

// Load environment variables from .env file into process.env
dotenv.config();

interface EnvConfig {
  // Server Configuration
  PORT: string;
  NODE_ENV: 'development' | 'production';

  // Database Configuration
  DB_URL: string;

  // Frontend Configuration
  FRONTEND_URL: string;

  // Security & Encryption
  BCRYPT_SALT_ROUND: string;
  EXPRESS_SESSION_SECRET: string;

  // JWT (JSON Web Token) Configuration
  JWT_ACCESS_SECRET: string; // Secret key for signing access tokens
  JWT_ACCESS_EXPIRES: string; // Expiration time for access tokens
  JWT_REFRESH_SECRET: string; // Secret key for signing refresh tokens
  JWT_REFRESH_EXPIRES: string; // Expiration time for refresh tokens

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  // List of all required environment variables that must be present
  const requiredEnvVariables: string[] = [
    'PORT',
    'DB_URL',
    'NODE_ENV',
    'FRONTEND_URL',
    'BCRYPT_SALT_ROUND',
    'JWT_ACCESS_SECRET',
    'JWT_ACCESS_EXPIRES',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRES',
    'EXPRESS_SESSION_SECRET',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CALLBACK_URL',
  ];

  /**
   * Validation loop: Check if each required variable exists
   * Throws an error immediately if any variable is missing
   * This fails fast to prevent runtime errors due to missing configuration
   */
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  // Return validated configuration object with all environment variables properly typed
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
  };
};

// Load and export the validated environment variables
// This is executed immediately when the module is imported
export const envVars = loadEnvVariables();
