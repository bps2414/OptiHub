import { create } from 'zustand'

import { pickGameExecutable } from '../lib/dialog'
import {
  getGameLibrary,
  refreshGameLibrary,
  registerManualGame,
  removeManualGame,
} from '../lib/tauri'
import type {
  AppError,
  GameLibraryEntry,
  ManualGameRegistrationInput,
} from '../types/ipc'

type GamesLoadState = 'idle' | 'loading' | 'ready' | 'error'

interface GamesState {
  entries: GameLibraryEntry[]
  loadState: GamesLoadState
  error: AppError | null
  manualExecutablePath: string | null
  isManualFormOpen: boolean
  isPickingExecutable: boolean
  lastAction: 'idle' | 'load' | 'refresh' | 'manual'
  loadLibrary: () => Promise<void>
  refreshLibrary: () => Promise<void>
  beginManualRegistration: () => Promise<void>
  cancelManualRegistration: () => void
  saveManualGame: (input: ManualGameRegistrationInput) => Promise<void>
  removeManualEntry: (gameId: string) => Promise<void>
}

async function runLibraryLoad(
  request: () => Promise<{ entries: GameLibraryEntry[] }>,
  action: 'load' | 'refresh',
  set: (updater: Partial<GamesState> | ((state: GamesState) => GamesState | Partial<GamesState>)) => void,
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
    const snapshot = await request()

    set({
      entries: snapshot.entries,
      loadState: 'ready',
      lastAction: action,
      error: null,
    })
  } catch (error) {
    set({
      loadState: 'error',
      lastAction: action,
      error: error as AppError,
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
  async loadLibrary() {
    await runLibraryLoad(getGameLibrary, 'load', set)
  },
  async refreshLibrary() {
    await runLibraryLoad(refreshGameLibrary, 'refresh', set)
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
    await get().refreshLibrary()
  },
}))
