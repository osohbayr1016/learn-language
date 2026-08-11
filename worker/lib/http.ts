import type { Context } from 'hono'

/**
 * Error shape every failing API response uses, so the client only ever has to
 * parse one thing.
 */
export interface ApiError {
  error: {
    code: string
    /** Already-localised Mongolian message, safe to show to the user. */
    message: string
  }
}

export function apiError(code: string, message: string): ApiError {
  return { error: { code, message } }
}

/**
 * Cache headers for content that only changes when we redeploy or re-run the
 * ETL. `s-maxage` is generous because Cloudflare's cache is free and every
 * cache hit is a D1 row read we do not pay for; `max-age` is short so a
 * learner picks up corrections without a hard refresh.
 */
export function cacheStatic(c: Context, seconds = 86_400): void {
  c.header('Cache-Control', `public, max-age=3600, s-maxage=${seconds}, stale-while-revalidate=604800`)
}

/** Per-user data must never be cached by a shared cache. */
export function noStore(c: Context): void {
  c.header('Cache-Control', 'private, no-store')
}

/**
 * Weak ETag over a JSON payload. Cheap enough for the small static datasets we
 * serve and turns repeat visits into 304s.
 */
export async function etagFor(body: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(body))
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `W/"${hex.slice(0, 16)}"`
}
