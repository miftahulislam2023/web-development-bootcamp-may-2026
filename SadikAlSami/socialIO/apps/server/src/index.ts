import { serve } from '@hono/node-server';
import { env } from '@socialIO/env/server';
import { disconnectRedis, pub, redis, sub } from '@socialIO/db/redis';
import { app } from './app';
import { wss, wsRouter } from './ws';
import { subscribeToGlobal } from './ws/pubsub';

app.route('/ws', wsRouter);

const server = serve({ fetch: app.fetch, port: Number(env.PORT), websocket: { server: wss } }, (info) =>
	console.log(`[server] listening on http://localhost:${info.port}`),
);

Promise.all([redis.connect(), pub.connect(), sub.connect()])
	.then(() => {
		console.log('[server] Redis clients connected');
		subscribeToGlobal().catch(console.error);
	})
	.catch((err) => {
		console.error('[server] Redis connection failed:', err);
		console.warn('[server] Continuing without Redis cache');
	});

process.on('SIGTERM', async () => {
	console.log('[server] SIGTERM — shutting down');
	server.close();
	await disconnectRedis();
	process.exit(0);
});
