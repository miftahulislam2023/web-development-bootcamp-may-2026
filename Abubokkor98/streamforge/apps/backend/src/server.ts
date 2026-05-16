import express, { Request, Response } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '@/config/env';
import apiRouter from '@/api.routes';
import { notFoundHandler } from '@/middlewares/not-found';
import { errorHandler } from '@/middlewares/error-handler';
import { globalLimiter } from '@/middlewares/rate-limiter';
import { StatusCodes } from 'http-status-codes';

const app = express();

// Trust proxy is required when hosting on Render/Vercel behind load balancers.
// This ensures secure cookies and rate limiting work correctly because the load balancer terminates HTTPS.
// References:
// - Express behind proxies: https://expressjs.com/en/guide/behind-proxies.html
// - MDN SameSite Cookies: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
app.set('trust proxy', 1);

const SERVER_ROUTE_PATHS = {
  root: '/',
  health: '/health',
  api: '/api',
} as const;
const STATUS_OK = 'OK';

// Global middlewares
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(
  express.json({
    // Capture the exact raw byte stream for cryptographic webhook signature verification (e.g., LiveKit)
    verify: (req: IncomingMessage & { rawBody?: Buffer }, _res: ServerResponse, buf: Buffer) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());
app.use(globalLimiter);

// Root / Welcome route
app.get(SERVER_ROUTE_PATHS.root, (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: STATUS_OK,
    message: 'StreamForge API is running',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Health check
app.get(SERVER_ROUTE_PATHS.health, (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ status: STATUS_OK, timestamp: new Date() });
});


// Central API router — all module routes register here
app.use(SERVER_ROUTE_PATHS.api, apiRouter);

// Error handling (order matters: 404 first, then global handler)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
