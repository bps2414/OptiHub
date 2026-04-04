import { useI18n } from '../i18n/useI18n'

export function GamesPage() {
  const { copy } = useI18n()
  const page = copy.pages.games

  return (
    <div className="page-panel" id="page-games">
      <span className="page-eyebrow">{page.eyebrow}</span>
      <h1 className="page-title">{page.title}</h1>
      <p className="page-subtitle">{page.subtitle}</p>
    </div>
  )
}
