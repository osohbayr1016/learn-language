import { useState } from 'react'
import { Link } from 'react-router'
import { KANA, charOf } from '@shared/data/kana'
import type { KanaEntry, KanaKind, KanaScript, Vowel } from '@shared/data/kana'
import { t } from '@shared/i18n'

/**
 * The gojūon chart, rendered from the bundled kana set rather than fetched.
 * ~15KB of JS buys an instant, offline-capable chart and costs zero requests —
 * the /api/kana endpoint exists for other consumers, not for this screen.
 */

const VOWELS: readonly Vowel[] = ['a', 'i', 'u', 'e', 'o']

const BASE_ROWS = ['', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'] as const
const VOICED_ROWS = ['g', 'z', 'd', 'b', 'p'] as const
const YOUON_ROWS = ['k', 's', 't', 'n', 'h', 'm', 'r', 'g', 'z', 'b', 'p'] as const
const YOUON_VOWELS: readonly Vowel[] = ['a', 'u', 'o']

const INDEX = new Map<string, KanaEntry>(
  KANA.map((entry) => [`${entry.kind}:${entry.row}:${entry.vowel}`, entry]),
)

function lookup(kind: KanaKind, row: string, vowel: Vowel): KanaEntry | undefined {
  if (kind === 'dakuten') {
    return INDEX.get(`dakuten:${row}:${vowel}`) ?? INDEX.get(`handakuten:${row}:${vowel}`)
  }
  return INDEX.get(`${kind}:${row}:${vowel}`)
}

interface CellProps {
  entry: KanaEntry | undefined
  script: KanaScript
  showReading: 'romaji' | 'cyrillic'
}

function Cell({ entry, script, showReading }: CellProps) {
  const char = entry ? charOf(entry, script) : null
  if (!entry || !char) {
    return <div className="kana-cell kana-cell--empty" aria-hidden="true" />
  }

  return (
    <Link to={`/kana/${entry.id}?script=${script}`} className="kana-cell">
      <span className="kana-cell__char jp" lang="ja">
        {char}
      </span>
      <span className="kana-cell__reading">
        {showReading === 'romaji' ? entry.romaji : entry.cyrillic}
      </span>
    </Link>
  )
}

interface TableProps {
  kind: KanaKind
  rows: readonly string[]
  vowels: readonly Vowel[]
  script: KanaScript
  showReading: 'romaji' | 'cyrillic'
}

function KanaTable({ kind, rows, vowels, script, showReading }: TableProps) {
  return (
    <div
      className="kana-grid"
      style={{ gridTemplateColumns: `repeat(${vowels.length}, minmax(0, 1fr))` }}
    >
      {rows.flatMap((row) =>
        vowels.map((vowel) => (
          <Cell
            key={`${kind}:${row}:${vowel}`}
            entry={lookup(kind, row, vowel)}
            script={script}
            showReading={showReading}
          />
        )),
      )}
    </div>
  )
}

export function KanaChart() {
  const [script, setScript] = useState<KanaScript>('hiragana')
  const [showReading, setShowReading] = useState<'romaji' | 'cyrillic'>('cyrillic')

  const nEntry = KANA.find((k) => k.id === 'n')

  return (
    <div className="stack">
      <h1>{t('kana.chart')}</h1>

      <div className="stack" style={{ gap: 10 }}>
        <div role="group" aria-label={t('kana.whichScript')} style={{ display: 'flex', gap: 8 }}>
          {(['hiragana', 'katakana'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={script === s ? 'btn' : 'btn btn--ghost'}
              aria-pressed={script === s}
              onClick={() => setScript(s)}
            >
              {t(s === 'hiragana' ? 'kana.hiragana' : 'kana.katakana')}
            </button>
          ))}
        </div>

        <div role="group" style={{ display: 'flex', gap: 8 }}>
          {(['cyrillic', 'romaji'] as const).map((r) => (
            <button
              key={r}
              type="button"
              className={showReading === r ? 'btn' : 'btn btn--ghost'}
              aria-pressed={showReading === r}
              onClick={() => setShowReading(r)}
            >
              {t(r === 'cyrillic' ? 'kana.cyrillic' : 'kana.romaji')}
            </button>
          ))}
        </div>
      </div>

      <section className="stack">
        <h2>{t('kana.kind.base')}</h2>
        <KanaTable
          kind="base"
          rows={BASE_ROWS}
          vowels={VOWELS}
          script={script}
          showReading={showReading}
        />
        <div className="kana-grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
          <Cell entry={nEntry} script={script} showReading={showReading} />
        </div>
      </section>

      <section className="stack">
        <h2>
          {t('kana.kind.dakuten')} / {t('kana.kind.handakuten')}
        </h2>
        <KanaTable
          kind="dakuten"
          rows={VOICED_ROWS}
          vowels={VOWELS}
          script={script}
          showReading={showReading}
        />
      </section>

      <section className="stack">
        <h2>{t('kana.kind.youon')}</h2>
        <KanaTable
          kind="youon"
          rows={YOUON_ROWS}
          vowels={YOUON_VOWELS}
          script={script}
          showReading={showReading}
        />
      </section>
    </div>
  )
}
