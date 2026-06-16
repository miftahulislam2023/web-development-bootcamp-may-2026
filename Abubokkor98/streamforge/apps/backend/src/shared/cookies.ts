import { Response } from 'express';
import { REFRESH_TOKEN_EXPIRY_DAYS } from '@/utils/otp';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

const ACCESS_TOKEN_DURATION_MINUTES = 15;
const ACCESS_TOKEN_MAX_AGE_MS = ACCESS_TOKEN_DURATION_MINUTES * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE_MS = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

/**
 * Cookie options — consistent across set/clear operations.
 * - httpOnly: prevents client-side JS access (XSS protection)
 * - secure: HTTPS-only in production
 * - sameSite: 'none' in production (cross-origin), 'lax' in dev
 * - path: '/' — available on all routes
 */
function getAuthCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
  };
}

/**
 * Set BOTH auth cookies atomically.
 * Access token cookie (15min) + refresh token cookie (7 days).
 */
export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  const options = getAuthCookieOptions();

  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    ...options,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
  });

  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...options,
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  });
}

/**
 * Clear BOTH auth cookies.
 * CRITICAL: Must use same options as when cookies were set,
 * otherwise browsers won't clear them in production.
 */
export function clearAuthCookies(res: Response): void {
  const options = getAuthCookieOptions();
  res.clearCookie(ACCESS_TOKEN_COOKIE, options);
  res.clearCookie(REFRESH_TOKEN_COOKIE, options);
}

export function getRefreshTokenFromCookie(cookies: Record<string, string>): string | undefined {
  return cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
}
