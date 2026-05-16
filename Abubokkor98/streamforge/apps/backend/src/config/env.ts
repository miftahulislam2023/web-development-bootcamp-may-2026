import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend root (apps/backend/.env)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvironmentConfig {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
  FRONTEND_URL: string;
  LIVEKIT_URL: string;
  LIVEKIT_API_KEY: string;
  LIVEKIT_API_SECRET: string;
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env: EnvironmentConfig = {
  PORT: (() => {
    const port = parseInt(getRequiredEnv('PORT'), 10);
    if (isNaN(port) || port <= 0) {
      throw new Error(`Invalid PORT value: ${process.env.PORT}`);
    }
    return port;
  })(),
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),
  JWT_SECRET: getRequiredEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getRequiredEnv('JWT_EXPIRES_IN'),
  SMTP_HOST: getRequiredEnv('SMTP_HOST'),
  SMTP_PORT: (() => {
    const port = parseInt(getRequiredEnv('SMTP_PORT'), 10);
    if (isNaN(port) || port <= 0) {
      throw new Error(`Invalid SMTP_PORT value: ${process.env.SMTP_PORT}`);
    }
    return port;
  })(),
  SMTP_USER: getRequiredEnv('SMTP_USER'),
  SMTP_PASS: getRequiredEnv('SMTP_PASS'),
  SMTP_FROM: getRequiredEnv('SMTP_FROM'),
  FRONTEND_URL: getRequiredEnv('FRONTEND_URL'),
  LIVEKIT_URL: getRequiredEnv('LIVEKIT_URL'),
  LIVEKIT_API_KEY: getRequiredEnv('LIVEKIT_API_KEY'),
  LIVEKIT_API_SECRET: getRequiredEnv('LIVEKIT_API_SECRET'),
};
