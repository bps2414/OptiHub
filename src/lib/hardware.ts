import type { DisplaySnapshot } from '../types/ipc'

export interface ManualDisplayOverride {
  enabled: boolean
  widthPx: string
  heightPx: string
  refreshHz: string
}

export function formatBytesToGiB(bytes: number | null): string {
  if (!bytes || bytes <= 0) {
    return 'Unavailable'
  }

  return `${Math.round(bytes / 1024 ** 3)} GB`
}

export function formatDisplayMode(
  widthPx: number | null,
  heightPx: number | null,
  refreshHz: number | null,
): string {
  if (!widthPx || !heightPx || !refreshHz) {
    return 'Unavailable'
  }

  const roundedRefresh = Number.isInteger(refreshHz) ? refreshHz : Number(refreshHz.toFixed(1))

  return `${widthPx}x${heightPx} @ ${roundedRefresh}Hz`
}

export function getHardwareFieldStatus(
  value: unknown,
  isOverridden = false,
): 'detected' | 'overridden' | 'unavailable' {
  if (isOverridden) {
    return 'overridden'
  }

  if (value === null || value === undefined || value === '') {
    return 'unavailable'
  }

  return 'detected'
}

function parseOverrideValue(value: string): number | null {
  const parsed = Number.parseInt(value, 10)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

export function getEffectiveDisplaySnapshot(
  detected: DisplaySnapshot,
  override: ManualDisplayOverride,
): DisplaySnapshot {
  if (!override.enabled) {
    return detected
  }

  const widthPx = parseOverrideValue(override.widthPx)
  const heightPx = parseOverrideValue(override.heightPx)
  const refreshHz = parseOverrideValue(override.refreshHz)

  return {
    ...detected,
    widthPx: widthPx ?? detected.widthPx,
    heightPx: heightPx ?? detected.heightPx,
    refreshHz: refreshHz ?? detected.refreshHz,
  }
}
