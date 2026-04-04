import { useI18n } from '../i18n/useI18n'

export function ToolsPage() {
  const { copy } = useI18n()
  const page = copy.pages.tools

  return (
    <div className="page-panel" id="page-tools">
      <span className="page-eyebrow">{page.eyebrow}</span>
      <h1 className="page-title">{page.title}</h1>
      <p className="page-subtitle">{page.subtitle}</p>
    </div>
  )
}
