import { useI18n } from '../i18n/useI18n'

export function LibraryPage() {
  const { copy } = useI18n()
  const page = copy.pages.library

  return (
    <div className="page-panel" id="page-library">
      <span className="page-eyebrow">{page.eyebrow}</span>
      <h1 className="page-title">{page.title}</h1>
      <p className="page-subtitle">{page.subtitle}</p>
    </div>
  )
}
