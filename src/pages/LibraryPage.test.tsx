import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '../i18n/I18nProvider'
import { useGamesStore } from '../stores/games'
import { LibraryPage } from './LibraryPage'

const tauriMocks = vi.hoisted(() => ({
  getGameLibraryMock: vi.fn(),
  refreshGameLibraryMock: vi.fn(),
  registerManualGameMock: vi.fn(),
  removeManualGameMock: vi.fn(),
}))

vi.mock('../lib/tauri', () => ({
  getGameLibrary: tauriMocks.getGameLibraryMock,
  refreshGameLibrary: tauriMocks.refreshGameLibraryMock,
  registerManualGame: tauriMocks.registerManualGameMock,
  removeManualGame: tauriMocks.removeManualGameMock,
}))

vi.mock('../lib/dialog', () => ({
  pickGameExecutable: vi.fn(),
}))

describe('LibraryPage', () => {
  beforeEach(() => {
    tauriMocks.getGameLibraryMock.mockReset()
    tauriMocks.refreshGameLibraryMock.mockReset()
    tauriMocks.registerManualGameMock.mockReset()
    tauriMocks.removeManualGameMock.mockReset()

    useGamesStore.setState({
      entries: [],
      loadState: 'idle',
      error: null,
      manualExecutablePath: null,
      isManualFormOpen: false,
    })
  })

  it('auto-loads the library and renders the empty state with the toolbar', async () => {
    tauriMocks.getGameLibraryMock.mockResolvedValue({
      entries: [],
      steamLibraryPaths: [],
      scannedAt: '1712274000',
    })

    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <LibraryPage />
        </I18nProvider>
      </MemoryRouter>,
    )

    await screen.findByText('No games detected yet')

    expect(tauriMocks.getGameLibraryMock).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Refresh library' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add game' })).toBeInTheDocument()
  })

  it('shows visible refresh feedback while the library is refreshing', async () => {
    const user = userEvent.setup()
    let resolveRefresh: ((value: unknown) => void) | undefined
    tauriMocks.getGameLibraryMock.mockResolvedValue({
      entries: [],
      steamLibraryPaths: [],
      scannedAt: '1712274000',
    })
    tauriMocks.refreshGameLibraryMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRefresh = resolve
        }),
    )

    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <LibraryPage />
        </I18nProvider>
      </MemoryRouter>,
    )

    await screen.findByText('No games detected yet')

    await user.click(screen.getByRole('button', { name: 'Refresh library' }))

    expect(screen.getAllByText('Refreshing library...').length).toBeGreaterThan(0)

    resolveRefresh?.({
      entries: [],
      steamLibraryPaths: [],
      scannedAt: '1712274001',
    })
  })

  it('renders the compact management list when entries exist', async () => {
    tauriMocks.getGameLibraryMock.mockResolvedValue({
      entries: [
        {
          id: 'steam:730',
          displayName: 'Counter-Strike 2',
          executablePath: 'D:/SteamLibrary/steamapps/common/Counter-Strike Global Offensive/game/bin/win64/cs2.exe',
          installDir: 'D:/SteamLibrary/steamapps/common/Counter-Strike Global Offensive',
          source: 'steam',
          steamAppId: 730,
          removable: false,
          userAdded: true,
          lastSeenAt: '1712274000',
        },
      ],
      steamLibraryPaths: ['D:/SteamLibrary'],
      scannedAt: '1712274000',
    })

    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <LibraryPage />
        </I18nProvider>
      </MemoryRouter>,
    )

    await screen.findByText('Counter-Strike 2')

    expect(screen.getByText('Install path')).toBeInTheDocument()
    expect(screen.getByText('Added manually')).toBeInTheDocument()
  })
})
