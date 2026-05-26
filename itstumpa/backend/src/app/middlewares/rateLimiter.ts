// middleware/rateLimiter.ts
import { Request, Response, NextFunction } from "express";
import { getRedis } from "../config/redis";

const redis = getRedis();

interface RateLimiterOptions {
  maxRequests: number;
  windowSeconds: number;
  keyPrefix: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  whitelist?: string[];
  message?: string;
}

// Default configuration
const DEFAULT_OPTIONS: RateLimiterOptions = {
  maxRequests: 100,
  windowSeconds: 30,
  keyPrefix: "api",
  message: "Too many requests. Try again later.",
};

export const rateLimiter = (options?: Partial<RateLimiterOptions>) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  const {
    maxRequests,
    windowSeconds,
    keyPrefix,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    whitelist = [],
    message,
  } = config;

  return async (req: any, res: Response, next: NextFunction) => {
    try {
      let identifier: string;
      let ip = "unknown";

      if (req.user?.id) {
        identifier = `user:${req.user.id}`;
        if (whitelist.includes(req.user.id)) {
          return next();
        }
      } else {
        ip = (req.headers["x-forwarded-for"] as string) ||
             req.socket.remoteAddress ||
             "unknown";

        if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");
        if (ip === "::1") ip = "127.0.0.1";

        identifier = `ip:${ip}`;
        
        if (whitelist.includes(ip)) {
          return next();
        }
      }

const key = `ratelimit:${keyPrefix}:${identifier}`;

 const results = await redis.multi().incr(key).expire(key, windowSeconds).exec();

const count = (results?.[0]?.[1] as number) ?? 0;

      const ttl = await redis.ttl(key);
      const resetTime = Date.now() + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000);

      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - count).toString());
      res.setHeader('X-RateLimit-Reset', resetTime.toString());

      if (count > maxRequests) {
        res.setHeader('Retry-After', (ttl > 0 ? ttl : windowSeconds).toString());
        
        console.warn(`[Rate Limit] ${identifier} exceeded limit (${count}/${maxRequests})`);
        
        return res.status(429).json({
          success: false,
          message,
          retryAfter: ttl > 0 ? ttl : windowSeconds,
          limit: maxRequests,
          remaining: 0,
          resetAt: resetTime,
        });
      }

      if (skipSuccessfulRequests) {
        res.on('finish', async () => {
          if (res.statusCode < 400) {
            await redis.decr(key);
          }
        });
      }

      if (skipFailedRequests) {
        res.on('finish', async () => {
          if (res.statusCode >= 400) {
            await redis.decr(key);
          }
        });
      }

      console.log(`[Rate Limit] ${identifier}: ${count}/${maxRequests}`);
      next();
    } catch (error) {
      console.error("[Rate Limiter Error]", error);
      next();
    }
  };
};

//  Export pre-configured versions for convenience
export const authRateLimiter = rateLimiter({
  maxRequests: 5,
  windowSeconds: 60,
  keyPrefix: "auth",
  skipSuccessfulRequests: true,
});

export const apiRateLimiter = rateLimiter({
  maxRequests: 100,
  windowSeconds: 60,
  keyPrefix: "api",
});

export const publicRateLimiter = rateLimiter({
  maxRequests: 200,
  windowSeconds: 60,
  keyPrefix: "public",
});