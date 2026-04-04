import { useEffect } from 'react'

import { DisplayOverrideForm } from '../components/hardware/DisplayOverrideForm'
import { HardwareCard } from '../components/hardware/HardwareCard'
import { useI18n } from '../i18n/useI18n'
import {
  formatBytesToGiB,
  formatDisplayMode,
  getEffectiveDisplaySnapshot,
  getHardwareFieldStatus,
} from '../lib/hardware'
import { useHardwareStore } from '../stores/hardware'

export function DiagnosticsPage() {
  const { copy } = useI18n()
  const page = copy.pages.diagnostics
  const hardwareCopy = page.hardware
  const hardwareStatuses = copy.hardware.statuses
  const snapshot = useHardwareStore((state) => state.snapshot)
  const loadState = useHardwareStore((state) => state.loadState)
  const loadSnapshot = useHardwareStore((state) => state.loadSnapshot)
  const displayOverride = useHardwareStore((state) => state.displayOverride)
  const setDisplayOverride = useHardwareStore((state) => state.setDisplayOverride)
  const clearDisplayOverride = useHardwareStore((state) => state.clearDisplayOverride)

  useEffect(() => {
    if (loadState === 'idle') {
      void loadSnapshot()
    }
  }, [loadSnapshot, loadState])

  const effectiveDisplay = snapshot
    ? getEffectiveDisplaySnapshot(snapshot.display, displayOverride)
    : null

  const displayStatus = effectiveDisplay
    ? getHardwareFieldStatus(
        effectiveDisplay.widthPx ?? effectiveDisplay.heightPx ?? effectiveDisplay.refreshHz,
        displayOverride.enabled,
      )
    : 'unavailable'

  const statusLabel =
    displayStatus === 'detected'
      ? hardwareStatuses.detected
      : displayStatus === 'overridden'
        ? hardwareStatuses.overridden
        : hardwareStatuses.unavailable

  return (
    <div className="page-panel" id="page-diagnostics">
      <span className="page-eyebrow">{page.eyebrow}</span>
      <h1 className="page-title">{page.title}</h1>
      <p className="page-subtitle">{page.subtitle}</p>
      <div className="hardware-grid">
        <HardwareCard title={hardwareCopy.cards.cpu}>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.model}</span>
            <span className="hardware-field__value">
              {snapshot?.cpu.model ?? hardwareStatuses.unavailable}
            </span>
          </div>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.physicalCores}</span>
            <span className="hardware-field__value">
              {snapshot?.cpu.physicalCores ?? hardwareStatuses.unavailable}
            </span>
          </div>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.logicalThreads}</span>
            <span className="hardware-field__value">
              {snapshot?.cpu.logicalThreads ?? hardwareStatuses.unavailable}
            </span>
          </div>
        </HardwareCard>

        <HardwareCard title={hardwareCopy.cards.gpu}>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.model}</span>
            <span className="hardware-field__value">
              {snapshot?.gpu.model ?? hardwareStatuses.unavailable}
            </span>
          </div>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.vendor}</span>
            <span className="hardware-field__value">
              {snapshot?.gpu.vendor ?? hardwareStatuses.unavailable}
            </span>
          </div>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.vram}</span>
            <span className="hardware-field__value">
              {formatBytesToGiB(snapshot?.gpu.vramBytes ?? null)}
            </span>
          </div>
        </HardwareCard>

        <HardwareCard title={hardwareCopy.cards.memory}>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.totalRam}</span>
            <span className="hardware-field__value">
              {formatBytesToGiB(snapshot?.memory.totalBytes ?? null)}
            </span>
          </div>
        </HardwareCard>

        <HardwareCard title={hardwareCopy.cards.display}>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.source}</span>
            <span className={`hardware-status hardware-status--${displayStatus}`}>
              {statusLabel}
            </span>
          </div>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.adapter}</span>
            <span className="hardware-field__value">
              {effectiveDisplay?.adapterName ?? hardwareStatuses.unavailable}
            </span>
          </div>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.monitor}</span>
            <span className="hardware-field__value">
              {effectiveDisplay?.monitorName ?? hardwareStatuses.unavailable}
            </span>
          </div>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.resolution}</span>
            <span className="hardware-field__value">
              {effectiveDisplay
                ? formatDisplayMode(
                    effectiveDisplay.widthPx,
                    effectiveDisplay.heightPx,
                    effectiveDisplay.refreshHz,
                  ).split(' @ ')[0]
                : hardwareStatuses.unavailable}
            </span>
          </div>
          <div className="hardware-field">
            <span>{hardwareCopy.fields.refreshRate}</span>
            <span className="hardware-field__value">
              {effectiveDisplay?.refreshHz
                ? `${effectiveDisplay.refreshHz}Hz`
                : hardwareStatuses.unavailable}
            </span>
          </div>
          <DisplayOverrideForm
            onApply={setDisplayOverride}
            onReset={clearDisplayOverride}
            override={displayOverride}
          />
        </HardwareCard>
      </div>
    </div>
  )
}
