import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("REDIS_URL environment variable is not defined");
}

let redis: Redis | null = null;

export const getRedis = (): Redis => {
  if (!redis) {
    redis = new Redis(REDIS_URL!, {
      maxRetriesPerRequest: null,
      connectTimeout: 10000,
      enableReadyCheck: true,
      lazyConnect: false,        // explicit (this is already the default)
      retryStrategy: (times) => {
        if (times > 5) return null; // stop retrying after 5 attempts
        return Math.min(times * 200, 2000); // exponential backoff
      },
    });

    redis.on("connect", () => console.log("✅ Redis connected"));
    redis.on("ready", () => console.log("✅ Redis ready"));
    redis.on("reconnecting", () => console.warn("⚠️ Redis reconnecting..."));
    redis.on("error", (err) => console.error("❌ Redis error:", err.message));
    redis.on("close", () => console.warn("🔴 Redis connection closed"));
  }

  return redis;
};

export const closeRedis = async (): Promise<void> => {
  if (redis) {
    await redis.quit();
    redis = null; // allow re-initialization if needed
    console.log("🔴 Redis disconnected gracefully");
  }
};

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down...`);
  await closeRedis();
  process.exit(0);
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM")); // important for Docker/K8s