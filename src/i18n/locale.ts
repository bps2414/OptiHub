export const supportedLocales = ['en', 'pt-BR'] as const

export type Locale = (typeof supportedLocales)[number]

type ResolveLocaleOptions = {
  storedLocale?: string | null
  systemLocales?: readonly string[]
}

export const defaultLocale: Locale = 'en'
export const localeStorageKey = 'optihub.locale'

export function isLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.some((locale) => locale === value)
}

function normalizeLocaleCandidate(value: string | null | undefined): Locale | null {
  if (!value) {
    return null
  }

  if (isLocale(value)) {
    return value
  }

  const normalized = value.replace('_', '-').toLowerCase()

  if (normalized.startsWith('pt')) {
    return 'pt-BR'
  }

  if (normalized.startsWith('en')) {
    return 'en'
  }

  return null
}

export function resolveLocale(options: ResolveLocaleOptions): Locale {
  const storedLocale = normalizeLocaleCandidate(options.storedLocale)

  if (storedLocale) {
    return storedLocale
  }

  for (const locale of options.systemLocales ?? []) {
    const match = normalizeLocaleCandidate(locale)

    if (match) {
      return match
    }
  }

  return defaultLocale
}

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale
  }

  return resolveLocale({
    storedLocale: window.localStorage.getItem(localeStorageKey),
    systemLocales:
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language],
  })
}
