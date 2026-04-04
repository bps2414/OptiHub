import { useI18n } from '../i18n/useI18n'

export function CreditsPage() {
  const { copy } = useI18n()
  const page = copy.pages.credits

  return (
    <div className="page-panel" id="page-credits">
      <span className="page-eyebrow">{page.eyebrow}</span>
      <h1 className="page-title">{page.title}</h1>
      <p className="page-subtitle">{page.subtitle}</p>
      <p className="page-note">{page.notes[0]}</p>
      <p className="page-note">{page.notes[1]}</p>
    </div>
  )
}
