import { BrowserRouter, Route, Routes } from 'react-router'

import { AppShell } from './layouts/AppShell'
import { CreditsPage } from './pages/CreditsPage'
import { DiagnosticsPage } from './pages/DiagnosticsPage'
import { GamesPage } from './pages/GamesPage'
import { HomePage } from './pages/HomePage'
import { LibraryPage } from './pages/LibraryPage'
import { OptimizationsPage } from './pages/OptimizationsPage'
import { PresetsPage } from './pages/PresetsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ToolsPage } from './pages/ToolsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/:gameId" element={<LibraryPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:gameId" element={<GamesPage />} />
          <Route path="/optimizations" element={<OptimizationsPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/presets" element={<PresetsPage />} />
          <Route path="/diagnostics" element={<DiagnosticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/credits" element={<CreditsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
