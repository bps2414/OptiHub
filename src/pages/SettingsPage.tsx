import { startTransition, type ChangeEvent } from 'react'

import { supportedLocales, type Locale } from '../i18n/locale'
import { useI18n } from '../i18n/useI18n'

export function SettingsPage() {
  const { copy, locale, setLocale } = useI18n()
  const page = copy.pages.settings

  function handleLocaleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale

    startTransition(() => {
      setLocale(nextLocale)
    })
  }

  return (
    <div className="page-panel" id="page-settings">
      <span className="page-eyebrow">{page.eyebrow}</span>
      <h1 className="page-title">{page.title}</h1>
      <p className="page-subtitle">{page.subtitle}</p>
      <div className="page-grid">
        <section className="page-card">
          <div className="page-card__heading">
            <span className="page-card__title">{page.languageCardTitle}</span>
          </div>
          <p className="form-helper">{page.languageCardDescription}</p>
          <div className="form-field">
            <label className="form-label" htmlFor="settings-language">
              {page.languageLabel}
            </label>
            <select
              aria-label={page.languageLabel}
              className="form-select"
              id="settings-language"
              onChange={handleLocaleChange}
              value={locale}
            >
              {supportedLocales.map((option) => (
                <option key={option} value={option}>
                  {copy.locales[option]}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>
    </div>
  )
}
