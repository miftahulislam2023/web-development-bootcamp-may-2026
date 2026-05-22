// rate-limiter.ts — Simple in-memory rate limiter for API abuse protection
// No external dependencies needed. Limits requests per IP per window.
// On Vercel, each function instance has its own memory, so this is per-instance.

import type { Request, Response, NextFunction } from "express";

interface RateEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateEntry>();

// Clean up expired entries every 5 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key);
    }
}, 5 * 60 * 1000);

/**
 * Creates a rate limiter middleware.
 * @param maxRequests - Maximum requests allowed per window (default: 100)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 */
export function rateLimiter(maxRequests = 100, windowMs = 60_000) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Use X-Forwarded-For on Vercel, fallback to socket IP
        const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
            || req.socket?.remoteAddress
            || "unknown";

        const now = Date.now();
        const entry = store.get(ip);

        if (!entry || now > entry.resetAt) {
            // First request or window expired — start fresh
            store.set(ip, { count: 1, resetAt: now + windowMs });
            return next();
        }

        entry.count++;

        if (entry.count > maxRequests) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            res.set("Retry-After", String(retryAfter));
            return res.status(429).json({
                error: "Too many requests. Please slow down.",
                retryAfterSeconds: retryAfter,
            });
        }

        next();
    };
}
