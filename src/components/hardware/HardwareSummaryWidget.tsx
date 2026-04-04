interface HardwareSummaryItem {
  label: string
  value: string
}

interface HardwareSummaryWidgetProps {
  title: string
  items: HardwareSummaryItem[]
}

export function HardwareSummaryWidget({
  title,
  items,
}: HardwareSummaryWidgetProps) {
  return (
    <section className="page-card hardware-summary">
      <div className="page-card__heading">
        <span className="page-card__title">{title}</span>
      </div>
      <div className="hardware-summary__items">
        {items.map((item) => (
          <div className="hardware-summary__item" key={item.label}>
            <span className="form-label">{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
