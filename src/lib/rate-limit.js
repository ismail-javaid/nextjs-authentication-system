
import "server-only";

const buckets =
  globalThis.__rateLimit ??
  (globalThis.__rateLimit = new Map());

export function rateLimit(
  key,
  limit = 5,
  windowMs = 15 * 60 * 1000
) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return { ok: true };
  }

  bucket.count += 1;

  return {
    ok: bucket.count <= limit,
    retryInMinutes: Math.ceil(
      (bucket.resetAt - now) / 60000
    ),
  };
}