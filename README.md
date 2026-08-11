# learn-language

Монгол хэлтэй хүнд зориулсан **үнэгүй** гадаад хэл сурах платформ.

Суралцагч төлбөр төлөхгүй. Орлого нь зөвхөн сургалтын төвүүдийн захиалгаас (subscription)
бүрддэг — суралцагчийн туршлагад ямар ч paywall, зар сурталчилгаа байхгүй.

## Хэлүүд

| Package | Хэл | Төлөв |
|---|---|---|
| `packages/lang-ko` | Солонгос | Бүтэц гаргасан (scaffold) |
| `packages/lang-zh` | Хятад | `CONTENT_SPEC.md` бэлэн |
| (root) | Япон | Кана (kana) модуль — эхний milestone |

Бүх тайлбар, орчуулга, алдааны мэдэгдэл **монгол хэл дээр (кирилл)**. Зорилтот хэлний
өгөгдөл (ханз, кана, хангыл, пиньинь) л эх хэл дээрээ.

## Технологи

- **Runtime** — Cloudflare Workers
- **API** — Hono
- **DB** — Cloudflare D1 (SQLite)
- **Object storage** — Cloudflare R2 (аудио, штрихийн өгөгдөл)
- **Front-end** — React 19 SPA + React Router, Vite
- **Давтлагын алгоритм** — FSRS (`ts-fsrs`)
- **Валидац** — Zod

## Бүтэц

```
shared/          Хэлээс хамаараагүй нийтлэг код
  data/kana.ts   Кана бүрэн жагсаалт + монгол кирилл галиг
  i18n/          Жижиг i18n runtime (монгол каталог)
packages/
  lang-ko/       Солонгос хэлний контент, ETL, migration
  lang-zh/       Хятад хэлний контент стандарт
```

## Ажиллуулах

Node.js **22+** шаардлагатай.

```bash
npm install
npm run dev              # Vite dev server
npm run db:migrate:local # D1 migration (local)
npm run test             # Vitest
```

Deploy:

```bash
npm run deploy           # build → wrangler deploy
```

## Лиценз

AGPL-3.0-or-later.
