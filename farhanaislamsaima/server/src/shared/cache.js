import { createClient } from 'redis';

const memoryStore = new Map();
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = createClient({ url: REDIS_URL });
let redisReady = false;
let redisStarted = false;

redis.on('error', (error) => {
  redisReady = false;
  console.log('Redis cache unavailable:', error.message);
});

redis.on('ready', () => {
  redisReady = true;
});

async function startCache() {
  if (redisStarted) {
    return;
  }

  redisStarted = true;

  try {
    await redis.connect();
  } catch (error) {
    redisReady = false;
    console.log('Using in-memory cache fallback:', error.message);
  }
}

function getMemoryCache(key) {
  const item = memoryStore.get(key);

  if (!item) {
    return null;
  }

  if (Date.now() > item.expiresAt) {
    memoryStore.delete(key);
    return null;
  }

  return item.value;
}

async function getCache(key) {
  await startCache();

  if (redisReady) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  return getMemoryCache(key);
}

async function setCache(key, value, ttlMs = 30000) {
  await startCache();

  if (redisReady) {
    await redis.set(key, JSON.stringify(value), {
      PX: ttlMs
    });
    return;
  }

  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
}

async function clearCache(prefix = '') {
  await startCache();

  if (redisReady) {
    const keys = await redis.keys(`${prefix}*`);

    if (keys.length > 0) {
      await redis.del(keys);
    }

    return;
  }

  for (const key of memoryStore.keys()) {
    if (!prefix || key.startsWith(prefix)) {
      memoryStore.delete(key);
    }
  }
}

export {
  clearCache,
  getCache,
  setCache,
  startCache
};
