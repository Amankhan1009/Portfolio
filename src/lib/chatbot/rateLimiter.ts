/**
 * In-memory sliding-window rate limiter for the portfolio chat endpoint.
 * Protects against excessive requests, rapid spamming, and API budget exhaustion.
 */

type ClientRecord = {
  timestamps: number[];
};

const store = new Map<string, ClientRecord>();

// Cleanup stale records every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [key, record] of store.entries()) {
    const fresh = record.timestamps.filter((ts) => now - ts < windowMs);
    if (fresh.length === 0) {
      store.delete(key);
    } else {
      record.timestamps = fresh;
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Check if a client has exceeded their request quota.
 *
 * @param identifier Client IP or unique session identifier
 * @param limit Maximum requests allowed within the window (default: 15)
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 min)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 15,
  windowMs: number = 60 * 1000,
): RateLimitResult {
  cleanupStaleEntries(windowMs);

  const now = Date.now();
  const record = store.get(identifier) || { timestamps: [] };

  // Filter timestamps within the current sliding window
  const recentTimestamps = record.timestamps.filter(
    (ts) => now - ts < windowMs,
  );

  if (recentTimestamps.length >= limit) {
    const oldest = recentTimestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);

    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  recentTimestamps.push(now);
  store.set(identifier, { timestamps: recentTimestamps });

  return {
    success: true,
    limit,
    remaining: limit - recentTimestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}
