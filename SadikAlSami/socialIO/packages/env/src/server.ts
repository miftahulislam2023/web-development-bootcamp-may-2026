import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		PORT: z.coerce.number().int().positive().default(3000),
		DATABASE_URL: z.string().min(1),
		REDIS_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		ALGORITHM: z.enum(['aes-256-gcm']),
		IV_BYTES: z.coerce.number().int().positive(),
		TAG_BYTES: z.coerce.number().int().positive(),
		ENCRYPTION_KEY: z.string().min(64).max(64),
		NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
