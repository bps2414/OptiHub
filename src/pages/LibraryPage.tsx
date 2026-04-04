import { useDeferredValue, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'

import { GameDetailView } from '../components/games/GameDetailView'
import { GameLibraryTable } from '../components/games/GameLibraryTable'
import { ManualGameRegistrationForm } from '../components/games/ManualGameRegistrationForm'
import { getFilteredGameEntries } from '../lib/gameLibrary'
import { useI18n } from '../i18n/useI18n'
import { useGamesStore } from '../stores/games'

export function LibraryPage() {
  const navigate = useNavigate()
  const params = useParams()
  const gameId = params.gameId ? decodeURIComponent(params.gameId) : null
  const { copy, locale } = useI18n()
  const page = copy.pages.library
  const entries = useGamesStore((store) => store.entries)
  const loadState = useGamesStore((store) => store.loadState)
  const error = useGamesStore((store) => store.error)
  const manualExecutablePath = useGamesStore((store) => store.manualExecutablePath)
  const isManualFormOpen = useGamesStore((store) => store.isManualFormOpen)
  const isPickingExecutable = useGamesStore((store) => store.isPickingExecutable)
  const lastAction = useGamesStore((store) => store.lastAction)
  const viewMode = useGamesStore((store) => store.viewMode)
  const searchTerm = useGamesStore((store) => store.searchTerm)
  const sourceFilter = useGamesStore((store) => store.sourceFilter)
  const sortMode = useGamesStore((store) => store.sortMode)
  const detail = useGamesStore((store) => store.detail)
  const detailLoadState = useGamesStore((store) => store.detailLoadState)
  const detailError = useGamesStore((store) => store.detailError)
  const pendingMetadataRefreshAppIds = useGamesStore((store) => store.pendingMetadataRefreshAppIds)
  const loadLibrary = useGamesStore((store) => store.loadLibrary)
  const refreshLibrary = useGamesStore((store) => store.refreshLibrary)
  const beginManualRegistration = useGamesStore((store) => store.beginManualRegistration)
  const cancelManualRegistration = useGamesStore((store) => store.cancelManualRegistration)
  const saveManualGame = useGamesStore((store) => store.saveManualGame)
  const removeManualEntry = useGamesStore((store) => store.removeManualEntry)
  const setViewMode = useGamesStore((store) => store.setViewMode)
  const setSearchTerm = useGamesStore((store) => store.setSearchTerm)
  const setSourceFilter = useGamesStore((store) => store.setSourceFilter)
  const setSortMode = useGamesStore((store) => store.setSortMode)
  const loadGameDetail = useGamesStore((store) => store.loadGameDetail)
  const clearGameDetail = useGamesStore((store) => store.clearGameDetail)
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const metadataHydrationAttemptsRef = useRef<Record<string, number>>({})

  useEffect(() => {
    if (loadState === 'idle') {
      void loadLibrary(locale)
    }
  }, [loadLibrary, loadState, locale])

  useEffect(() => {
    const hydrationSignature = `${locale}:${pendingMetadataRefreshAppIds.join(',')}`

    if (gameId || loadState !== 'ready' || pendingMetadataRefreshAppIds.length === 0) {
      metadataHydrationAttemptsRef.current = {}
      return
    }

    const currentAttempts = metadataHydrationAttemptsRef.current[hydrationSignature] ?? 0
    if (currentAttempts >= 10) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      metadataHydrationAttemptsRef.current[hydrationSignature] = currentAttempts + 1
      void refreshLibrary(locale)
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [gameId, loadState, locale, pendingMetadataRefreshAppIds, refreshLibrary])

  useEffect(() => {
    if (!gameId) {
      clearGameDetail()
      return
    }

    void loadGameDetail(gameId, locale)
  }, [clearGameDetail, gameId, loadGameDetail, locale])

  const visibleEntries = getFilteredGameEntries(entries, {
    searchTerm: deferredSearchTerm,
    sourceFilter,
    sortMode,
  })

  return (
    <div className="page-panel" id="page-library">
      <span className="page-eyebrow">{page.eyebrow}</span>
      <h1 className="page-title">{page.title}</h1>
      <p className="page-subtitle">{page.subtitle}</p>

      {!gameId ? (
        <>
          <div className="game-library-toolbar">
            <button
              className="form-select"
              disabled={loadState === 'loading'}
              onClick={() => {
                void refreshLibrary(locale)
              }}
              type="button"
            >
              {loadState === 'loading' && lastAction === 'refresh'
                ? page.toolbar.refreshing
                : page.toolbar.refresh}
            </button>
            <button
              className="form-select"
              disabled={isPickingExecutable}
              onClick={() => {
                void beginManualRegistration()
              }}
              type="button"
            >
              {isPickingExecutable ? page.toolbar.pickerOpening : page.toolbar.addGame}
            </button>
          </div>

          <div className="game-library-controls">
            <label className="form-field">
              <span className="form-label">{page.controls.searchLabel}</span>
              <input
                className="form-select"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={page.controls.searchPlaceholder}
                type="search"
                value={searchTerm}
              />
            </label>

            <label className="form-field">
              <span className="form-label">{page.controls.sourceLabel}</span>
              <select
                className="form-select"
                onChange={(event) =>
                  setSourceFilter(event.target.value as typeof sourceFilter)
                }
                value={sourceFilter}
              >
                <option value="all">{page.controls.sourceAll}</option>
                <option value="steam">{page.controls.sourceSteam}</option>
                <option value="manual">{page.controls.sourceManual}</option>
              </select>
            </label>

            <label className="form-field">
              <span className="form-label">{page.controls.sortLabel}</span>
              <select
                className="form-select"
                onChange={(event) => setSortMode(event.target.value as typeof sortMode)}
                value={sortMode}
              >
                <option value="name-asc">{page.controls.sortNameAsc}</option>
                <option value="name-desc">{page.controls.sortNameDesc}</option>
                <option value="recent">{page.controls.sortRecent}</option>
              </select>
            </label>

            <div className="form-field">
              <span className="form-label">{page.controls.viewLabel}</span>
              <div className="game-library-view-toggle">
                <button
                  className="form-select"
                  data-active={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                  type="button"
                >
                  {page.controls.viewGrid}
                </button>
                <button
                  className="form-select"
                  data-active={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                  type="button"
                >
                  {page.controls.viewList}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {loadState === 'loading' && lastAction === 'refresh' ? (
        <p className="page-note">{page.toolbar.refreshing}</p>
      ) : null}

      {!gameId && isManualFormOpen && manualExecutablePath ? (
        <ManualGameRegistrationForm
          executablePath={manualExecutablePath}
          onCancel={cancelManualRegistration}
          onSave={saveManualGame}
        />
      ) : null}

      {error ? (
        <p className="page-note">
          {lastAction === 'manual' ? page.pickerFailed : error.message}
        </p>
      ) : null}

      {!gameId && loadState === 'ready' && entries.length === 0 ? (
        <div className="page-card game-library-empty">{page.emptyState}</div>
      ) : null}

      {!gameId && loadState === 'ready' && entries.length > 0 && visibleEntries.length === 0 ? (
        <div className="page-card game-library-empty">{page.browser.noMatches}</div>
      ) : null}

      {gameId && detailLoadState === 'loading' ? (
        <p className="page-note">{copy.pages.games.loading}</p>
      ) : null}

      {gameId && detailError ? (
        <p className="page-note">{detailError.message}</p>
      ) : null}

      {gameId && detail ? <GameDetailView detail={detail} /> : null}

      {!gameId && visibleEntries.length > 0 ? (
        <GameLibraryTable
          entries={visibleEntries}
          onOpenDetail={(gameId) => {
            navigate(`/library/${encodeURIComponent(gameId)}`)
          }}
          onRemove={removeManualEntry}
          viewMode={viewMode}
        />
      ) : null}
    </div>
  )
}
