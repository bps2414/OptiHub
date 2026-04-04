import { Outlet } from 'react-router'

import { Sidebar } from '../components/Sidebar'

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}
