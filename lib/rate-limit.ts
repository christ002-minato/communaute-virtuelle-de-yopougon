type RateLimitEntry = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const MAX_ENTRIES = 10_000

export interface RateLimitResult {
  ok: boolean
  retryAfterSec: number
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()

  if (store.size >= MAX_ENTRIES) {
    for (const [k, entry] of store) {
      if (entry.resetAt < now) store.delete(k)
    }
  }

  const entry = store.get(key)
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterSec: 0 }
  }

  entry.count += 1
  if (entry.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) }
  }

  return { ok: true, retryAfterSec: 0 }
}