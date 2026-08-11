import { Hono } from 'hono'
import { KANA, KANA_BY_ID, KANA_GROUPS, EXTENDED_EXAMPLES, kanaForScript } from '@shared/data/kana'
import type { KanaScript } from '@shared/data/kana'
import { apiError, cacheStatic, etagFor } from '../lib/http.ts'

/**
 * Kana is the one dataset that never needs the database. There are ~150
 * entries, they are fixed for all time, and they are already in the Worker
 * bundle — so serving them costs zero D1 row reads and survives a D1 outage.
 */
export const kanaRoutes = new Hono<{ Bindings: Env }>()

function isScript(value: string | undefined): value is KanaScript {
  return value === 'hiragana' || value === 'katakana'
}

/** Whole set, optionally narrowed to one syllabary. */
kanaRoutes.get('/', async (c) => {
  const script = c.req.query('script')
  if (script !== undefined && !isScript(script)) {
    return c.json(apiError('bad_script', 'script нь hiragana эсвэл katakana байх ёстой.'), 400)
  }

  const entries = script ? kanaForScript(script) : KANA
  const body = JSON.stringify({ groups: KANA_GROUPS, entries, extendedExamples: EXTENDED_EXAMPLES })

  const etag = await etagFor(body)
  if (c.req.header('If-None-Match') === etag) {
    cacheStatic(c)
    return c.body(null, 304)
  }

  cacheStatic(c)
  c.header('ETag', etag)
  c.header('Content-Type', 'application/json; charset=utf-8')
  return c.body(body)
})

/** A single syllable, for the study screen. */
kanaRoutes.get('/:id', async (c) => {
  const entry = KANA_BY_ID.get(c.req.param('id'))
  if (!entry) {
    return c.json(apiError('not_found', 'Ийм кана олдсонгүй.'), 404)
  }

  const body = JSON.stringify(entry)
  const etag = await etagFor(body)
  if (c.req.header('If-None-Match') === etag) {
    cacheStatic(c)
    return c.body(null, 304)
  }

  cacheStatic(c)
  c.header('ETag', etag)
  c.header('Content-Type', 'application/json; charset=utf-8')
  return c.body(body)
})
