import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { auth } from '@socialIO/auth';
import { env } from '@socialIO/env/server';

import { errorHandler, notFound } from '@/middlewares';
import { conversationController, messageController, profileController } from '@/controllers';

import type { AppEnv } from '@/types/app-env';

export const app = new Hono<AppEnv>({ strict: false });

app.use(logger());
app.use(
	'/*',
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	}),
);

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));
app.get('/', (c) => c.text('SocialIO Server is running.'));

app.route('/api/profile', profileController);
app.route('/api/conversations', conversationController);
app.route('/api', messageController);

app.notFound(notFound);
app.onError(errorHandler);
