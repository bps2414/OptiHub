import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { getHardwareSnapshot } from '../lib/tauri'
import type { AppError, HardwareSnapshot } from '../types/ipc'
import type { ManualDisplayOverride } from '../lib/hardware'

type HardwareLoadState = 'idle' | 'loading' | 'ready' | 'error'

interface HardwareState {
  snapshot: HardwareSnapshot | null
  loadState: HardwareLoadState
  error: AppError | null
  displayOverride: ManualDisplayOverride
  loadSnapshot: () => Promise<void>
  setDisplayOverride: (override: ManualDisplayOverride) => void
  clearDisplayOverride: () => void
}

const defaultDisplayOverride: ManualDisplayOverride = {
  enabled: false,
  widthPx: '',
  heightPx: '',
  refreshHz: '',
}

export const useHardwareStore = create<HardwareState>()(
  persist(
    (set) => ({
      snapshot: null,
      loadState: 'idle',
      error: null,
      displayOverride: defaultDisplayOverride,
      async loadSnapshot() {
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
          const snapshot = await getHardwareSnapshot()

          set({
            snapshot,
            loadState: 'ready',
            error: null,
          })
        } catch (error) {
          set({
            loadState: 'error',
            error: error as AppError,
          })
        }
      },
      setDisplayOverride(override) {
        set({ displayOverride: override })
      },
      clearDisplayOverride() {
        set({ displayOverride: defaultDisplayOverride })
      },
    }),
    {
      name: 'optihub.hardware.display-override',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        displayOverride: state.displayOverride,
      }),
    },
  ),
)
