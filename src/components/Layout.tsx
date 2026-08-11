import { NavLink, Outlet } from 'react-router'
import { t } from '@shared/i18n'
import type { SimpleMessageKey } from '@shared/i18n'

const TABS: ReadonlyArray<{ to: string; labelKey: SimpleMessageKey; glyph: string }> = [
  { to: '/', labelKey: 'nav.home', glyph: '⌂' },
  { to: '/kana', labelKey: 'nav.kana', glyph: 'あ' },
  { to: '/review', labelKey: 'nav.review', glyph: '⟳' },
  { to: '/progress', labelKey: 'nav.progress', glyph: '▤' },
  { to: '/settings', labelKey: 'nav.settings', glyph: '⚙' },
]

export function Layout() {
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="topbar__brand">
          <span className="topbar__mark jp" aria-hidden="true">
            あ
          </span>
          {t('app.name')}
        </NavLink>
        <span className="badge-free">{t('app.free')}</span>
      </header>

      <main className="app__main">
        <Outlet />
      </main>

      <nav className="tabbar" aria-label={t('nav.home')}>
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.to === '/'} className="tabbar__item">
            <span className="tabbar__icon" aria-hidden="true">
              {tab.glyph}
            </span>
            {t(tab.labelKey)}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
