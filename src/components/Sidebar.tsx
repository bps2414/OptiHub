import type { ComponentType } from 'react'

import {
  Activity,
  Award,
  Home,
  Library,
  Settings,
  SlidersHorizontal,
  Wrench,
  Zap,
} from 'lucide-react'
import { NavLink } from 'react-router'

import type { NavigationKey } from '../i18n/messages'
import { useI18n } from '../i18n/useI18n'

const primaryLinks = [
  { key: 'home', to: '/', icon: Home, end: true },
  { key: 'library', to: '/library', icon: Library },
  { key: 'optimizations', to: '/optimizations', icon: Zap },
  { key: 'tools', to: '/tools', icon: Wrench },
  { key: 'presets', to: '/presets', icon: SlidersHorizontal },
  { key: 'diagnostics', to: '/diagnostics', icon: Activity },
] as const

const secondaryLinks = [
  { key: 'settings', to: '/settings', icon: Settings },
  { key: 'credits', to: '/credits', icon: Award },
] as const

type SidebarLink = {
  end?: boolean
  key: NavigationKey
  to: string
  icon: ComponentType<{ className?: string; size?: number }>
}

function renderLink(link: SidebarLink, labels: Record<NavigationKey, string>) {
  const Icon = link.icon

  return (
    <NavLink
      key={link.to}
      className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
      end={link.end}
      to={link.to}
    >
      <Icon className="sidebar-link__icon" size={20} />
      <span>{labels[link.key]}</span>
    </NavLink>
  )
}

export function Sidebar() {
  const { copy } = useI18n()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand__title">OptiHub</span>
        <span className="sidebar-brand__subtitle">{copy.shell.brandSubtitle}</span>
      </div>

      <nav aria-label={copy.shell.navigationLabel} className="sidebar-nav">
        {primaryLinks.map((link) => renderLink(link, copy.shell.links))}
        <div aria-hidden="true" className="sidebar-divider" />
        {secondaryLinks.map((link) => renderLink(link, copy.shell.links))}
      </nav>
    </aside>
  )
}
