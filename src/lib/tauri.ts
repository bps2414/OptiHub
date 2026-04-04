import { invoke } from '@tauri-apps/api/core'

import type { Locale } from '../i18n/locale'
import type {
  AppError,
  GameLibraryEntry,
  GameLibrarySnapshot,
  HardwareSnapshot,
  ManualGameRegistrationInput,
  SystemInfo,
} from '../types/ipc'

function normalizeAppError(error: unknown): AppError {
  if (typeof error === 'string') {
    try {
      const parsed = JSON.parse(error) as Partial<AppError>

      if (parsed.kind && parsed.message) {
        return {
          kind: parsed.kind as AppError['kind'],
          message: parsed.message,
        }
      }
    } catch {
      return {
        kind: 'SystemError',
        message: error,
      }
    }
  }

  if (error && typeof error === 'object' && 'kind' in error && 'message' in error) {
    return error as AppError
  }

  return {
    kind: 'SystemError',
    message: 'Unexpected IPC error',
  }
}

export async function tauriInvoke<T>(
  cmd: string,
  args?: Record<string, unknown>,
): Promise<T> {
  try {
    return await invoke<T>(cmd, args)
  } catch (error) {
    throw normalizeAppError(error)
  }
}

export async function greet(name: string, locale: Locale): Promise<string> {
  return tauriInvoke<string>('greet', { name, locale })
}

export async function getSystemInfo(): Promise<SystemInfo> {
  return tauriInvoke<SystemInfo>('get_system_info')
}

export async function getHardwareSnapshot(): Promise<HardwareSnapshot> {
  return tauriInvoke<HardwareSnapshot>('get_hardware_snapshot')
}

export async function getGameLibrary(): Promise<GameLibrarySnapshot> {
  return tauriInvoke<GameLibrarySnapshot>('get_game_library')
}

export async function refreshGameLibrary(): Promise<GameLibrarySnapshot> {
  return tauriInvoke<GameLibrarySnapshot>('refresh_game_library')
}

export async function registerManualGame(
  input: ManualGameRegistrationInput,
): Promise<GameLibraryEntry> {
  return tauriInvoke<GameLibraryEntry>('register_manual_game', { input })
}

export async function removeManualGame(gameId: string): Promise<void> {
  return tauriInvoke<void>('remove_manual_game', { gameId })
}
