// ---------------------------------------------------------------------------
// Minimal in-memory sliding-window rate limiter.
//
// Good enough for a single-instance deployment and abuse mitigation on the
// contact + auth endpoints. For multi-instance/serverless scale, swap the Map
// for a shared store (e.g. Upstash Redis) behind the same interface.
// ---------------------------------------------------------------------------

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, retryAfter: 0 };
}

// Periodically evict expired buckets so the Map doesn't grow unbounded.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
  }, 60_000).unref?.();
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}
