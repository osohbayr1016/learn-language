import { t } from '@shared/i18n'
import type { SimpleMessageKey } from '@shared/i18n'

/** Stands in for screens whose track has not been built yet. */
export function Placeholder({ titleKey }: { titleKey: SimpleMessageKey }) {
  return (
    <div className="stack">
      <h1>{t(titleKey)}</h1>
      <div className="card muted">Энэ хэсэг удахгүй нэмэгдэнэ.</div>
    </div>
  )
}
