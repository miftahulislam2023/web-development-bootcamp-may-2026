/**
 * CORS Middleware Configuration
 *
 * Allows all origins during development. In production the
 * allowed origins should be locked down via environment variables.
 *
 * @module cors-middleware
 * @author Coder-A (Auth Service Lead)
 */

import cors from "cors";

/**
 * Pre-configured CORS middleware instance.
 * Permits any origin and common HTTP methods / headers.
 */
export const corsMiddleware = cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
