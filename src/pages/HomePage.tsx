import { useEffect, useState } from 'react'

import { HardwareSummaryWidget } from '../components/hardware/HardwareSummaryWidget'
import { useI18n } from '../i18n/useI18n'
import {
  formatBytesToGiB,
  formatDisplayMode,
  getEffectiveDisplaySnapshot,
} from '../lib/hardware'
import { getSystemInfo, greet } from '../lib/tauri'
import { useHardwareStore } from '../stores/hardware'
import type { AppError, SystemInfo } from '../types/ipc'

type HomeState =
  | { status: 'loading' }
  | { status: 'ready'; greeting: string; systemInfo: SystemInfo }
  | { status: 'error'; error: AppError }

export function HomePage() {
  const [state, setState] = useState<HomeState>({ status: 'loading' })
  const { copy, locale } = useI18n()
  const homeCopy = copy.pages.home
  const hardwareSummaryCopy = homeCopy.hardwareSummary
  const unavailable = copy.hardware.statuses.unavailable
  const snapshot = useHardwareStore((store) => store.snapshot)
  const hardwareLoadState = useHardwareStore((store) => store.loadState)
  const loadHardwareSnapshot = useHardwareStore((store) => store.loadSnapshot)
  const displayOverride = useHardwareStore((store) => store.displayOverride)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [systemInfo, greeting] = await Promise.all([
          getSystemInfo(),
          greet(homeCopy.commanderName, locale),
        ])

        if (!cancelled) {
          setState({ status: 'ready', greeting, systemInfo })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            error: error as AppError,
          })
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [homeCopy.commanderName, locale])

  useEffect(() => {
    if (hardwareLoadState === 'idle') {
      void loadHardwareSnapshot()
    }
  }, [hardwareLoadState, loadHardwareSnapshot])

  const statusLabel =
    state.status === 'loading'
      ? homeCopy.statusConnecting
      : state.status === 'ready'
        ? homeCopy.statusReady
        : homeCopy.statusError

  const effectiveDisplay = snapshot
    ? getEffectiveDisplaySnapshot(snapshot.display, displayOverride)
    : null

  return (
    <div className="page-panel" id="page-home">
      <span className="page-eyebrow">{homeCopy.eyebrow}</span>
      <h1 className="page-title">{homeCopy.title}</h1>
      <p className="page-subtitle">{homeCopy.subtitle}</p>
      <div className="page-grid">
        <section className="page-card">
          <div className="page-card__heading">
            <span className="page-card__title">{homeCopy.statusCardTitle}</span>
            <span className="status-indicator">
              <span
                className={`status-dot${
                  state.status === 'error' ? ' status-dot--offline' : ''
                }`}
              />
              {statusLabel}
            </span>
          </div>

          {state.status === 'ready' ? (
            <div className="page-kv">
              <div className="page-kv__row">
                <span>{homeCopy.fields.greeting}</span>
                <span>{state.greeting}</span>
              </div>
              <div className="page-kv__row">
                <span>{homeCopy.fields.app}</span>
                <span>
                  {state.systemInfo.appName} v{state.systemInfo.appVersion}
                </span>
              </div>
              <div className="page-kv__row">
                <span>{homeCopy.fields.platform}</span>
                <span>{state.systemInfo.platform}</span>
              </div>
            </div>
          ) : null}

          {state.status === 'error' ? (
            <p className="page-note">
              {homeCopy.backendErrorSummary}: {state.error.message}
            </p>
          ) : null}
        </section>

        <HardwareSummaryWidget
          items={[
            {
              label: hardwareSummaryCopy.cpu,
              value: snapshot?.cpu.model ?? unavailable,
            },
            {
              label: hardwareSummaryCopy.gpu,
              value: snapshot?.gpu.model ?? unavailable,
            },
            {
              label: hardwareSummaryCopy.memory,
              value: formatBytesToGiB(snapshot?.memory.totalBytes ?? null),
            },
            {
              label: hardwareSummaryCopy.display,
              value: effectiveDisplay
                ? formatDisplayMode(
                    effectiveDisplay.widthPx,
                    effectiveDisplay.heightPx,
                    effectiveDisplay.refreshHz,
                  )
                : unavailable,
            },
          ]}
          title={hardwareSummaryCopy.title}
        />
      </div>
    </div>
  )
}
