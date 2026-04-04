import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '../i18n/I18nProvider'
import { HomePage } from './HomePage'

vi.mock('../lib/tauri', () => ({
  getSystemInfo: vi.fn().mockResolvedValue({
    appName: 'OptiHub',
    appVersion: '0.1.0',
    platform: 'windows',
  }),
  greet: vi.fn().mockResolvedValue('Hello from OptiHub, Commander! The Rust backend is working.'),
  getHardwareSnapshot: vi.fn().mockResolvedValue({
    cpu: { model: 'AMD Ryzen 7 5800X', physicalCores: 8, logicalThreads: 16 },
    gpu: { model: 'NVIDIA GeForce RTX 4070', vendor: 'NVIDIA', vramBytes: 12884901888 },
    memory: { totalBytes: 34359738368 },
    display: {
      adapterName: '\\\\.\\DISPLAY1',
      monitorName: 'Generic PnP Monitor',
      widthPx: 2560,
      heightPx: 1440,
      refreshHz: 144,
    },
  }),
}))

describe('HomePage hardware summary', () => {
  it('renders a compact CPU, GPU, memory, and display summary', async () => {
    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <HomePage />
        </I18nProvider>
      </MemoryRouter>,
    )

    await screen.findByText('AMD Ryzen 7 5800X')

    expect(screen.getByText('NVIDIA GeForce RTX 4070')).toBeInTheDocument()
    expect(screen.getByText('32 GB')).toBeInTheDocument()
    expect(screen.getByText('2560x1440 @ 144Hz')).toBeInTheDocument()
  })
})
