import crypto from 'crypto';

const REFRESH_TOKEN_BYTE_LENGTH = 32;

export function generateRefreshToken(): string {
  return crypto.randomBytes(REFRESH_TOKEN_BYTE_LENGTH).toString('hex');
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
