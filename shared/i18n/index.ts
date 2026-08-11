/**
 * Tiny i18n runtime.
 *
 * Deliberately not a library: the app ships one locale, and the only feature
 * we actually need is `{placeholder}` substitution. Keeping it typed against
 * the Mongolian catalogue means a typo in a message key is a build error, and
 * a message that expects `{count}` cannot be called without it.
 */
import { mn, type MessageKey } from './mn.ts'

export type { MessageKey }

export const LOCALES = ['mn'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'mn'

const CATALOGUES: Record<Locale, Record<MessageKey, string>> = { mn }

export type MessageParams = Record<string, string | number>

/** Extracts `{placeholder}` names from a literal message so `t()` can demand them. */
type Placeholders<S extends string> = S extends `${string}{${infer P}}${infer Rest}`
  ? P | Placeholders<Rest>
  : never

type ParamsFor<K extends MessageKey> = [Placeholders<(typeof mn)[K]>] extends [never]
  ? [params?: MessageParams]
  : [params: Record<Placeholders<(typeof mn)[K]>, string | number>]

/**
 * The subset of keys whose message takes no placeholders.
 *
 * Components that accept a message key as a *prop* should use this rather than
 * `MessageKey`: passing the wide union to `t()` would make the params argument
 * mandatory (some member of the union needs it), so narrowing here is what
 * keeps `t(props.titleKey)` both legal and safe.
 */
export type SimpleMessageKey = {
  [K in MessageKey]: [Placeholders<(typeof mn)[K]>] extends [never] ? K : never
}[MessageKey]

const PLACEHOLDER = /\{(\w+)\}/g

export function translate<K extends MessageKey>(
  locale: Locale,
  key: K,
  ...[params]: ParamsFor<K>
): string {
  const template = CATALOGUES[locale][key] ?? CATALOGUES[DEFAULT_LOCALE][key]
  if (!params) return template
  return template.replace(PLACEHOLDER, (match, name: string) => {
    const value = (params as MessageParams)[name]
    return value === undefined ? match : String(value)
  })
}

/** Convenience binding for the single shipping locale. */
export function t<K extends MessageKey>(key: K, ...params: ParamsFor<K>): string {
  return translate(DEFAULT_LOCALE, key, ...params)
}

/**
 * Mongolian number formatting. Mongolian does not inflect nouns for plural the
 * way English does, so there is no plural-rule machinery here on purpose — but
 * digits still want a thousands separator.
 */
export function formatNumber(value: number, locale: Locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale === 'mn' ? 'mn-MN' : locale).format(value)
}

/**
 * Relative time in Mongolian, for "next review in …" and "last synced …".
 * Intl.RelativeTimeFormat has mn data in modern browsers and in workerd.
 */
export function formatRelativeTime(
  targetMs: number,
  nowMs: number,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const rtf = new Intl.RelativeTimeFormat(locale === 'mn' ? 'mn-MN' : locale, { numeric: 'auto' })
  const diffSeconds = Math.round((targetMs - nowMs) / 1000)
  const abs = Math.abs(diffSeconds)

  if (abs < 60) return rtf.format(diffSeconds, 'second')
  if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), 'minute')
  if (abs < 86_400) return rtf.format(Math.round(diffSeconds / 3600), 'hour')
  if (abs < 2_592_000) return rtf.format(Math.round(diffSeconds / 86_400), 'day')
  if (abs < 31_536_000) return rtf.format(Math.round(diffSeconds / 2_592_000), 'month')
  return rtf.format(Math.round(diffSeconds / 31_536_000), 'year')
}
