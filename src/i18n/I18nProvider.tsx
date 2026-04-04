import { useEffect, useState, type ReactNode } from 'react'

import { I18nContext } from './I18nContext'
import { getInitialLocale, localeStorageKey, type Locale } from './locale'
import { messages } from './messages'

type I18nProviderProps = {
  children: ReactNode
  initialLocale?: Locale
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(() => initialLocale ?? getInitialLocale())

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem(localeStorageKey, locale)
  }, [locale])

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        copy: messages[locale],
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}
