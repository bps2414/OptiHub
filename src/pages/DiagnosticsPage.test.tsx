import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '../i18n/I18nProvider'
import { DiagnosticsPage } from './DiagnosticsPage'

vi.mock('../lib/tauri', () => ({
  getHardwareSnapshot: vi.fn().mockResolvedValue({
    cpu: { model: 'AMD Ryzen 7 5800X', physicalCores: 8, logicalThreads: 16 },
    gpu: { model: 'NVIDIA GeForce RTX 4070', vendor: 'NVIDIA', vramBytes: 12884901888 },
    memory: { totalBytes: 34359738368 },
    display: {
      adapterName: '\\\\.\\DISPLAY1',
      monitorName: 'Generic PnP Monitor',
      widthPx: null,
      heightPx: null,
      refreshHz: null,
    },
  }),
}))

describe('DiagnosticsPage hardware view', () => {
  it('renders grouped hardware cards and keeps unavailable display values visible', async () => {
    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <DiagnosticsPage />
        </I18nProvider>
      </MemoryRouter>,
    )

    await screen.findByText('CPU')

    expect(screen.getByText('GPU')).toBeInTheDocument()
    expect(screen.getByText('Memory')).toBeInTheDocument()
    expect(screen.getByText('Display')).toBeInTheDocument()
    expect(screen.getAllByText('Unavailable').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Use manual override' })).toBeInTheDocument()
  })
})
