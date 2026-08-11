import { Link } from 'react-router'
import { t } from '@shared/i18n'
import type { SimpleMessageKey } from '@shared/i18n'

interface Track {
  to: string
  titleKey: SimpleMessageKey
  glyph: string
  blurb: string
  locked: boolean
}

/**
 * The home screen's job is to remove the "where do I even start" paralysis:
 * exactly one primary action, and the later tracks visibly locked so the
 * learner knows the path exists without being able to wander into it.
 */
const TRACKS: readonly Track[] = [
  {
    to: '/kana',
    titleKey: 'nav.kana',
    glyph: 'あ',
    blurb: 'Хирагана, катакана — япон хэлний цагаан толгой. Эндээс эхэлнэ.',
    locked: false,
  },
  {
    to: '/vocabulary',
    titleKey: 'nav.vocabulary',
    glyph: '語',
    blurb: 'JLPT N5-аас N1 хүртэлх үгсийн сан, түвшин тус бүрээр.',
    locked: true,
  },
  {
    to: '/kanji',
    titleKey: 'nav.kanji',
    glyph: '漢',
    blurb: 'Ханзны бичлэг, дуудлага, утга — зурлагын дараалалтай.',
    locked: true,
  },
  {
    to: '/stories',
    titleKey: 'nav.stories',
    glyph: '本',
    blurb: 'Сурсан үгэн дээрээ тулгуурласан богино өгүүллэг унших.',
    locked: true,
  },
]

export function Home() {
  return (
    <div className="stack" style={{ gap: 22 }}>
      <section className="stack" style={{ gap: 8 }}>
        <h1 style={{ fontSize: '1.9rem' }}>{t('app.tagline')}</h1>
        <p className="muted" style={{ margin: 0 }}>
          {t('about.mission')}
        </p>
        <div style={{ marginTop: 6 }}>
          <Link to="/kana" className="btn">
            {t('common.start')}
          </Link>
        </div>
      </section>

      <section className="stack">
        <h2 style={{ fontSize: '1.05rem' }}>{t('nav.learn')}</h2>
        {TRACKS.map((track) => {
          const body = (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                className="jp"
                aria-hidden="true"
                style={{ fontSize: '1.9rem', color: 'var(--accent)', width: 40, textAlign: 'center' }}
              >
                {track.glyph}
              </span>
              <span className="stack" style={{ gap: 2 }}>
                <strong>{t(track.titleKey)}</strong>
                <span className="muted" style={{ fontSize: '0.86rem' }}>
                  {track.locked ? t('lesson.lockedHint') : track.blurb}
                </span>
              </span>
            </div>
          )

          return track.locked ? (
            <div key={track.to} className="card" style={{ opacity: 0.55 }} aria-disabled="true">
              {body}
            </div>
          ) : (
            <Link key={track.to} to={track.to} className="card">
              {body}
            </Link>
          )
        })}
      </section>
    </div>
  )
}
