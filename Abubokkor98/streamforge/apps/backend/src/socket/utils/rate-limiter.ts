// ─── In-Memory Sliding Window Rate Limiter for Socket Events ───
// Tracks event timestamps per key (socketId:eventName) and rejects
// events that exceed the configured limit within the time window.
// Designed for single-instance deployments (no Redis dependency).

const DEFAULT_CLEANUP_INTERVAL_MS = 60_000;

interface RateLimitConfig {
  /** Maximum number of events allowed within the window */
  maxEvents: number;
  /** Time window in milliseconds */
  windowMs: number;
}

/** Stores timestamps of recent events keyed by a unique identifier */
const eventTimestamps = new Map<string, number[]>();

/**
 * Checks whether an event should be allowed, and records it if so.
 * @returns `true` if the event is within limits, `false` if rate-limited.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  const timestamps = eventTimestamps.get(key) ?? [];

  // Remove expired timestamps outside the current window
  const activeTimestamps = timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= config.maxEvents) {
    // Still save the cleaned-up array to avoid memory growth
    eventTimestamps.set(key, activeTimestamps);
    return false;
  }

  activeTimestamps.push(now);
  eventTimestamps.set(key, activeTimestamps);
  return true;
}

/**
 * Removes all tracked timestamps for a given key prefix.
 * Call on socket disconnect to free memory.
 */
export function clearRateLimitEntries(keyPrefix: string): void {
  for (const key of eventTimestamps.keys()) {
    if (key.startsWith(keyPrefix)) {
      eventTimestamps.delete(key);
    }
  }
}

// ── Periodic cleanup of stale entries ──
// Prevents memory leaks from disconnected sockets whose entries weren't explicitly cleared.
const STALE_ENTRY_THRESHOLD_MS = 5 * 60 * 1000;

function cleanupStaleEntries(): void {
  const now = Date.now();
  const cutoff = now - STALE_ENTRY_THRESHOLD_MS;

  for (const [key, timestamps] of eventTimestamps.entries()) {
    const latestTimestamp = timestamps[timestamps.length - 1];

    if (latestTimestamp === undefined || latestTimestamp < cutoff) {
      eventTimestamps.delete(key);
    }
  }
}

setInterval(cleanupStaleEntries, DEFAULT_CLEANUP_INTERVAL_MS);

// ── Pre-configured rate limit configs ──

/** Chat messages: 3 per 5 seconds */
export const CHAT_RATE_LIMIT: RateLimitConfig = {
  maxEvents: 3,
  windowMs: 5_000,
};

/** Emoji reactions: 1 per 2 seconds */
export const REACTION_RATE_LIMIT: RateLimitConfig = {
  maxEvents: 1,
  windowMs: 2_000,
};
