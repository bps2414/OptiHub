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
  loadLibrary: () => Promise<void>
  refreshLibrary: () => Promise<void>
  beginManualRegistration: () => Promise<void>
  cancelManualRegistration: () => void
  saveManualGame: (input: ManualGameRegistrationInput) => Promise<void>
  removeManualEntry: (gameId: string) => Promise<void>
}

async function runLibraryLoad(
  request: () => Promise<{ entries: GameLibraryEntry[] }>,
  set: (updater: Partial<GamesState> | ((state: GamesState) => GamesState | Partial<GamesState>)) => void,
) {
  set((state) =>
    state.loadState === 'loading'
      ? state
      : {
          ...state,
          loadState: 'loading',
          error: null,
        },
  )

  try {
    const snapshot = await request()

    set({
      entries: snapshot.entries,
      loadState: 'ready',
      error: null,
    })
  } catch (error) {
    set({
      loadState: 'error',
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
  async loadLibrary() {
    await runLibraryLoad(getGameLibrary, set)
  },
  async refreshLibrary() {
    await runLibraryLoad(refreshGameLibrary, set)
  },
  async beginManualRegistration() {
    const executablePath = await pickGameExecutable()

    if (!executablePath) {
      return
    }

    set({
      manualExecutablePath: executablePath,
      isManualFormOpen: true,
      error: null,
    })
  },
  cancelManualRegistration() {
    set({
      manualExecutablePath: null,
      isManualFormOpen: false,
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
    })

    await get().refreshLibrary()
  },
  async removeManualEntry(gameId) {
    await removeManualGame(gameId)
    await get().refreshLibrary()
  },
}))
