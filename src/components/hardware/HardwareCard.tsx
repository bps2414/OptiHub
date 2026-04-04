import type { ReactNode } from 'react'

interface HardwareCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function HardwareCard({ title, subtitle, children }: HardwareCardProps) {
  return (
    <section className="page-card hardware-card">
      <div className="page-card__heading">
        <div>
          <span className="page-card__title">{title}</span>
          {subtitle ? <p className="form-helper">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  )
}
