import { create } from 'zustand'

import { pickGameExecutable } from '../lib/dialog'
import type { Locale } from '../i18n/locale'
import {
  type GameLibrarySortMode,
  type GameLibrarySourceFilter,
  type GameLibraryViewMode,
} from '../lib/gameLibrary'
import {
  getGameDetail,
  getGameLibrary,
  refreshGameLibrary,
  registerManualGame,
  removeManualGame,
} from '../lib/tauri'
import type {
  AppError,
  GameDetailSnapshot,
  GameLibraryEntry,
  ManualGameRegistrationInput,
} from '../types/ipc'

type GamesLoadState = 'idle' | 'loading' | 'ready' | 'error'
type DetailLoadState = 'idle' | 'loading' | 'ready' | 'error'

interface GamesState {
  entries: GameLibraryEntry[]
  loadState: GamesLoadState
  error: AppError | null
  manualExecutablePath: string | null
  isManualFormOpen: boolean
  isPickingExecutable: boolean
  lastAction: 'idle' | 'load' | 'refresh' | 'manual'
  viewMode: GameLibraryViewMode
  searchTerm: string
  sourceFilter: GameLibrarySourceFilter
  sortMode: GameLibrarySortMode
  selectedGameId: string | null
  detail: GameDetailSnapshot | null
  detailLoadState: DetailLoadState
  detailError: AppError | null
  pendingMetadataRefreshAppIds: number[]
  metadataLocale: Locale
  loadLibrary: (locale?: Locale) => Promise<void>
  refreshLibrary: (locale?: Locale) => Promise<void>
  beginManualRegistration: () => Promise<void>
  cancelManualRegistration: () => void
  saveManualGame: (input: ManualGameRegistrationInput) => Promise<void>
  removeManualEntry: (gameId: string) => Promise<void>
  setViewMode: (viewMode: GameLibraryViewMode) => void
  setSearchTerm: (searchTerm: string) => void
  setSourceFilter: (sourceFilter: GameLibrarySourceFilter) => void
  setSortMode: (sortMode: GameLibrarySortMode) => void
  loadGameDetail: (gameId: string, locale?: Locale) => Promise<void>
  clearGameDetail: () => void
}

type StateSetter = (
  updater:
    | Partial<GamesState>
    | ((state: GamesState) => GamesState | Partial<GamesState>),
) => void

async function runLibraryLoad(
  request: (locale: Locale) => Promise<{
    entries: GameLibraryEntry[]
    pendingMetadataRefreshAppIds: number[]
  }>,
  action: 'load' | 'refresh',
  set: StateSetter,
  locale: Locale,
) {
  set((state) =>
    state.loadState === 'loading'
      ? state
      : {
          ...state,
          loadState: 'loading',
          lastAction: action,
          error: null,
        },
  )

  try {
    const snapshot = await request(locale)

    set((state) => {
      const selectedGameId = state.selectedGameId
      const selectedStillExists = selectedGameId
        ? snapshot.entries.some((entry) => entry.id === selectedGameId)
        : false

      return {
        entries: snapshot.entries,
        loadState: 'ready',
        lastAction: action,
        error: null,
        pendingMetadataRefreshAppIds: snapshot.pendingMetadataRefreshAppIds,
        selectedGameId: selectedStillExists ? selectedGameId : null,
        detail: selectedStillExists ? state.detail : null,
        detailLoadState: selectedStillExists ? state.detailLoadState : 'idle',
        detailError: selectedStillExists ? state.detailError : null,
      }
    })
  } catch (error) {
    set({
      loadState: 'error',
      lastAction: action,
      error: error as AppError,
      pendingMetadataRefreshAppIds: [],
    })
  }
}

export const useGamesStore = create<GamesState>()((set, get) => ({
  entries: [],
  loadState: 'idle',
  error: null,
  manualExecutablePath: null,
  isManualFormOpen: false,
  isPickingExecutable: false,
  lastAction: 'idle',
  viewMode: 'grid',
  searchTerm: '',
  sourceFilter: 'all',
  sortMode: 'name-asc',
  selectedGameId: null,
  detail: null,
  detailLoadState: 'idle',
  detailError: null,
  pendingMetadataRefreshAppIds: [],
  metadataLocale: 'en',
  async loadLibrary(locale) {
    const activeLocale = locale ?? get().metadataLocale
    set({ metadataLocale: activeLocale })
    await runLibraryLoad(getGameLibrary, 'load', set, activeLocale)
  },
  async refreshLibrary(locale) {
    const activeLocale = locale ?? get().metadataLocale
    set({ metadataLocale: activeLocale })
    await runLibraryLoad(refreshGameLibrary, 'refresh', set, activeLocale)

    const selectedGameId = get().selectedGameId
    if (selectedGameId) {
      await get().loadGameDetail(selectedGameId, activeLocale)
    }
  },
  async beginManualRegistration() {
    set({
      isPickingExecutable: true,
      lastAction: 'manual',
      error: null,
    })

    try {
      const executablePath = await pickGameExecutable()

      if (!executablePath) {
        set({
          isPickingExecutable: false,
        })
        return
      }

      set({
        manualExecutablePath: executablePath,
        isManualFormOpen: true,
        isPickingExecutable: false,
        error: null,
      })
    } catch (error) {
      set({
        isPickingExecutable: false,
        error: error as AppError,
      })
    }
  },
  cancelManualRegistration() {
    set({
      manualExecutablePath: null,
      isManualFormOpen: false,
      isPickingExecutable: false,
    })
  },
  async saveManualGame(input) {
    await registerManualGame({
      ...input,
      executablePath: input.executablePath,
    })

    set({
      manualExecutablePath: null,
      isManualFormOpen: false,
      isPickingExecutable: false,
    })

    await get().refreshLibrary()
  },
  async removeManualEntry(gameId) {
    await removeManualGame(gameId)

    set((state) =>
      state.selectedGameId === gameId
          ? {
            ...state,
            selectedGameId: null,
            detail: null,
            detailLoadState: 'idle',
            detailError: null,
            pendingMetadataRefreshAppIds: state.pendingMetadataRefreshAppIds,
          }
        : state,
    )

    await get().refreshLibrary()
  },
  setViewMode(viewMode) {
    set({ viewMode })
  },
  setSearchTerm(searchTerm) {
    set({ searchTerm })
  },
  setSourceFilter(sourceFilter) {
    set({ sourceFilter })
  },
  setSortMode(sortMode) {
    set({ sortMode })
  },
  async loadGameDetail(gameId, locale) {
    const activeLocale = locale ?? get().metadataLocale
    set({ metadataLocale: activeLocale })
    set({
      selectedGameId: gameId,
      detailLoadState: 'loading',
      detailError: null,
    })

    try {
      const detail = await getGameDetail(gameId, activeLocale)

      set((state) => {
        const sharedAppId = detail.entry.metadata.sharedSteamAppId

        return {
          selectedGameId: gameId,
          detail,
          detailLoadState: 'ready',
          detailError: null,
          entries: state.entries.map((entry) => {
            const shouldHydrateDirectly = entry.id === detail.entry.id
            const shouldHydrateBySharedMetadata =
              sharedAppId !== null && entry.metadata.sharedSteamAppId === sharedAppId

            if (!shouldHydrateDirectly && !shouldHydrateBySharedMetadata) {
              return entry
            }

            return {
              ...entry,
              metadata: {
                ...entry.metadata,
                ...detail.entry.metadata,
              },
            }
          }),
          pendingMetadataRefreshAppIds: state.pendingMetadataRefreshAppIds.filter(
            (appId) => appId !== sharedAppId,
          ),
        }
      })
    } catch (error) {
      set({
        selectedGameId: gameId,
        detailLoadState: 'error',
        detailError: error as AppError,
      })
    }
  },
  clearGameDetail() {
    set({
      selectedGameId: null,
      detail: null,
      detailLoadState: 'idle',
      detailError: null,
    })
  },
}))
