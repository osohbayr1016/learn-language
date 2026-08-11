import { Hono } from 'hono'
import { kanaRoutes } from './routes/kana.ts'
import { apiError, noStore } from './lib/http.ts'

export { UserStateDO } from './durable/user-state.ts'

const app = new Hono<{ Bindings: Env }>()

app.route('/api/kana', kanaRoutes)

app.get('/api/health', (c) => {
  noStore(c)
  return c.json({ ok: true, env: c.env.APP_ENV })
})

// Anything under /api that no route claimed is a genuine 404.
app.all('/api/*', (c) => c.json(apiError('not_found', 'Ийм хаяг байхгүй байна.'), 404))

// Every other unmatched path belongs to the client router, so hand it to the
// assets binding. With `not_found_handling: "single-page-application"` that
// returns index.html, letting a deep link like /kana/kya load directly.
// This does not recurse: ASSETS.fetch reads the asset store, not the Worker.
app.notFound((c) => c.env.ASSETS.fetch(c.req.raw))

app.onError((err, c) => {
  console.error('unhandled', err)
  return c.json(apiError('internal', 'Алдаа гарлаа. Дахин оролдоно уу.'), 500)
})

export default app
