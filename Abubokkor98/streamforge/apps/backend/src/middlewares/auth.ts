import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '@/utils/api-error';
import { verifyToken } from '@/utils/jwt';
import { logger } from '@/utils/logger';

const tokenPayloadSchema = z.object({
  userId: z.number(),
  email: z.string(),
});

const BEARER_PREFIX = 'Bearer ';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    next(ApiError.unauthorized('Missing or malformed authorization header'));
    return;
  }

  const token = authHeader.slice(BEARER_PREFIX.length);

  try {
    const decoded = verifyToken(token);
    const payload = tokenPayloadSchema.parse(decoded);

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    logger.error({ error }, '[Auth Middleware] Token verification failed');
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

/**
 * Sets req.user if a valid Bearer token is present, but does NOT reject
 * requests without a token. Used for endpoints that serve both authenticated
 * users and unauthenticated guests (e.g., LiveKit viewer token).
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    next();
    return;
  }

  const token = authHeader.slice(BEARER_PREFIX.length);

  try {
    const decoded = verifyToken(token);
    const payload = tokenPayloadSchema.parse(decoded);

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    logger.error({ error }, '[Auth Middleware] Optional token verification failed');
  }

  next();
}
