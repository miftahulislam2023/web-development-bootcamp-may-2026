import { env } from '@socialIO/env/server';
import Redis from 'ioredis';

function createClient(name: string): Redis {
	const client = new Redis(env.REDIS_URL, {
		lazyConnect: true, // Don't connect until the first command is issued
		maxRetriesPerRequest: null, // Don't retry failed commands
		retryStrategy(times) {
			const delay = Math.min(times * 200, 10_000); // Exponential backoff with a max delay of 10 seconds
			console.warn(`[redis:${name}] reconnect attempt #${times}, waiting ${delay}ms`);
			return delay;
		},
	});
	client.on('connect', () => console.log(`[redis:${name}] connected`));
	client.on('error', (err) => console.error(`[redis:${name}] error:`, err));
	client.on('close', () => console.warn(`[redis:${name}] connection closed`));
	return client;
}

// Lazy-initialized Redis clients for different purposes
let _redis: Redis | null = null;
let _pub: Redis | null = null;
let _sub: Redis | null = null;

// Functions to get Redis clients, initializing them on first use
export const getRedis = (): Redis => (_redis ??= createClient('main'));
export const getPub = (): Redis => (_pub ??= createClient('pub'));
export const getSub = (): Redis => (_sub ??= createClient('sub'));

// Direct exports of the Redis clients for convenience, but they will be initialized lazily
export const redis = getRedis();
export const pub = getPub();
export const sub = getSub();

export const RedisKeys = {
	// HSET presence:user:{userId}  status  online  last_seen(ts)  EX 30
	presence: (userId: string) => `presence:user:${userId}`,

	// SET typing:{convId}:{userId}  1  EX 5
	typing: (convId: string, userId: string) => `typing:${convId}:${userId}`,
	typingPattern: (convId: string) => `typing:${convId}:*`,

	// ZADD messages:{convId}  {seq}  {decryptedMsgJson}
	messageCache: (convId: string) => `messages:${convId}`,

	// Pub/sub channel per conversation
	channel: (convId: string) => `conversation:${convId}`,

	// Global channel — conversation_updated events for chat list reordering
	globalChannel: 'global:events',
} as const;

// TTLs (seconds)
export const RedisTTL = {
	presence: 30, // heartbeat fires every 20 s — 10 s buffer before expiry
	typing: 5, // auto-clears if tab crashes mid-type, no cleanup needed
	messageCache: 3600, // evict cold conversations after 1 hour
} as const;

// Graceful shutdown
export async function disconnectRedis(): Promise<void> {
	await Promise.all([_redis?.quit(), _pub?.quit(), _sub?.quit()]);
	_redis = _pub = _sub = null;
}
