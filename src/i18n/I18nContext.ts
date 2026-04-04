import { createContext } from 'react'

import type { Locale } from './locale'
import type { MessageCatalog } from './messages'

export type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  copy: MessageCatalog
}

export const I18nContext = createContext<I18nContextValue | null>(null)
