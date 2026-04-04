import { useEffect } from 'react'

import { GameLibraryTable } from '../components/games/GameLibraryTable'
import { ManualGameRegistrationForm } from '../components/games/ManualGameRegistrationForm'
import { useI18n } from '../i18n/useI18n'
import { useGamesStore } from '../stores/games'

export function LibraryPage() {
  const { copy } = useI18n()
  const page = copy.pages.library
  const entries = useGamesStore((store) => store.entries)
  const loadState = useGamesStore((store) => store.loadState)
  const error = useGamesStore((store) => store.error)
  const manualExecutablePath = useGamesStore((store) => store.manualExecutablePath)
  const isManualFormOpen = useGamesStore((store) => store.isManualFormOpen)
  const loadLibrary = useGamesStore((store) => store.loadLibrary)
  const refreshLibrary = useGamesStore((store) => store.refreshLibrary)
  const beginManualRegistration = useGamesStore((store) => store.beginManualRegistration)
  const cancelManualRegistration = useGamesStore((store) => store.cancelManualRegistration)
  const saveManualGame = useGamesStore((store) => store.saveManualGame)
  const removeManualEntry = useGamesStore((store) => store.removeManualEntry)

  useEffect(() => {
    if (loadState === 'idle') {
      void loadLibrary()
    }
  }, [loadLibrary, loadState])

  return (
    <div className="page-panel" id="page-library">
      <span className="page-eyebrow">{page.eyebrow}</span>
      <h1 className="page-title">{page.title}</h1>
      <p className="page-subtitle">{page.subtitle}</p>

      <div className="game-library-toolbar">
        <button
          className="form-select"
          onClick={() => {
            void refreshLibrary()
          }}
          type="button"
        >
          {page.toolbar.refresh}
        </button>
        <button
          className="form-select"
          onClick={() => {
            void beginManualRegistration()
          }}
          type="button"
        >
          {page.toolbar.addGame}
        </button>
      </div>

      {isManualFormOpen && manualExecutablePath ? (
        <ManualGameRegistrationForm
          executablePath={manualExecutablePath}
          onCancel={cancelManualRegistration}
          onSave={saveManualGame}
        />
      ) : null}

      {error ? (
        <p className="page-note">{error.message}</p>
      ) : null}

      {loadState === 'ready' && entries.length === 0 ? (
        <div className="page-card game-library-empty">{page.emptyState}</div>
      ) : null}

      {entries.length > 0 ? (
        <GameLibraryTable
          entries={entries}
          onRemove={removeManualEntry}
        />
      ) : null}
    </div>
  )
}
