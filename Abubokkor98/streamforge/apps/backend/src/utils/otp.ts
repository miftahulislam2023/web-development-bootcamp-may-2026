import crypto from 'crypto';

const OTP_DIGIT_MIN = 100_000;
const OTP_DIGIT_MAX_EXCLUSIVE = 1_000_000;

export const OTP_EXPIRY_MINUTES = 5;
export const RESET_TOKEN_EXPIRY_MINUTES = 15;
export const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export const MS_PER_MINUTE = 60 * 1000;
export const MS_PER_DAY = 24 * 60 * 60 * 1000;
export const RESET_TOKEN_PURPOSE = 'password-reset';

export function generateOtp(): string {
  return crypto.randomInt(OTP_DIGIT_MIN, OTP_DIGIT_MAX_EXCLUSIVE).toString();
}
