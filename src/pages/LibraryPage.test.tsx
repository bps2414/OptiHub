import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '../i18n/I18nProvider'
import { useGamesStore } from '../stores/games'
import { LibraryPage } from './LibraryPage'

const tauriMocks = vi.hoisted(() => ({
  getGameDetailMock: vi.fn(),
  getGameLibraryMock: vi.fn(),
  refreshGameLibraryMock: vi.fn(),
  registerManualGameMock: vi.fn(),
  removeManualGameMock: vi.fn(),
}))

vi.mock('../lib/tauri', () => ({
  getGameDetail: tauriMocks.getGameDetailMock,
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
    tauriMocks.getGameDetailMock.mockReset()
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
      isPickingExecutable: false,
      lastAction: 'idle',
      viewMode: 'grid',
      searchTerm: '',
      sourceFilter: 'all',
      sortMode: 'name-asc',
      selectedGameId: null,
      detail: null,
      detailLoadState: 'idle',
      detailError: null,
      pendingMetadataRefreshAppIds: [],
      metadataLocale: 'en',
    })
  })

  it('auto-loads the library and renders the empty state with the toolbar', async () => {
    tauriMocks.getGameLibraryMock.mockResolvedValue({
      entries: [],
      steamLibraryPaths: [],
      scannedAt: '1712274000',
      pendingMetadataRefreshAppIds: [],
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
      pendingMetadataRefreshAppIds: [],
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
      pendingMetadataRefreshAppIds: [],
    })
  })

  it('renders the compact management list when entries exist', async () => {
    tauriMocks.getGameLibraryMock.mockResolvedValue({
      entries: [
        {
          id: 'steam:730',
          displayName: 'Counter-Strike 2',
          executablePath: null,
          installDir: 'D:/SteamLibrary/steamapps/common/Counter-Strike Global Offensive',
          source: 'steam',
          steamAppId: 730,
          relatedSteamAppId: null,
          removable: false,
          userAdded: false,
          lastSeenAt: '1712274000',
          metadata: {
            libraryPortraitAssetUrl: null,
            detailHeroAssetUrl: null,
            shortDescription: 'Competitive shooter',
            platforms: ['Windows'],
            cacheStatus: 'cached',
            lastUpdatedAt: '1712274000',
            sharedSteamAppId: 730,
          },
        },
        {
          id: 'manual:counter-strike-2',
          displayName: 'Counter-Strike 2 Manual',
          executablePath: 'D:/SteamLibrary/steamapps/common/Counter-Strike Global Offensive/game/bin/win64/cs2.exe',
          installDir: 'D:/SteamLibrary/steamapps/common/Counter-Strike Global Offensive',
          source: 'manual',
          steamAppId: null,
          relatedSteamAppId: 730,
          removable: true,
          userAdded: true,
          lastSeenAt: '1712274000',
          metadata: {
            libraryPortraitAssetUrl: null,
            detailHeroAssetUrl: null,
            shortDescription: null,
            platforms: ['Windows'],
            cacheStatus: 'fallback',
            lastUpdatedAt: null,
            sharedSteamAppId: 730,
          },
        },
      ],
      steamLibraryPaths: ['D:/SteamLibrary'],
      scannedAt: '1712274000',
      pendingMetadataRefreshAppIds: [],
    })

    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <LibraryPage />
        </I18nProvider>
      </MemoryRouter>,
    )

    await screen.findByText('Counter-Strike 2')

    expect(screen.getAllByText('Open details').length).toBeGreaterThan(0)
    expect(screen.getByText('Counter-Strike 2 Manual')).toBeInTheDocument()
    expect(screen.getAllByText('Windows').length).toBeGreaterThan(0)
  })

  it('renders the detail flow inside the library route when a game id is present', async () => {
    tauriMocks.getGameLibraryMock.mockResolvedValue({
      entries: [],
      steamLibraryPaths: [],
      scannedAt: '1712274000',
      pendingMetadataRefreshAppIds: [],
    })
    tauriMocks.getGameDetailMock.mockResolvedValue({
      entry: {
        id: 'steam:730',
        displayName: 'Counter-Strike 2',
        executablePath: null,
        installDir: 'D:/SteamLibrary/steamapps/common/Counter-Strike Global Offensive',
        source: 'steam',
        steamAppId: 730,
        relatedSteamAppId: null,
        removable: false,
        userAdded: false,
        lastSeenAt: '1712274000',
        metadata: {
          libraryPortraitAssetUrl: null,
          detailHeroAssetUrl: null,
          shortDescription: 'Competitive shooter',
          platforms: ['Windows'],
          cacheStatus: 'cached',
          lastUpdatedAt: '1712274000',
          sharedSteamAppId: 730,
        },
      },
      installSizeBytes: 1024,
      relatedEntries: [],
    })

    render(
      <MemoryRouter initialEntries={['/library/steam%3A730']}>
        <I18nProvider initialLocale="en">
          <Routes>
            <Route element={<LibraryPage />} path="/library/:gameId" />
          </Routes>
        </I18nProvider>
      </MemoryRouter>,
    )

    await screen.findByText('Identity')

    expect(tauriMocks.getGameDetailMock).toHaveBeenCalledWith('steam:730', 'en')
    expect(screen.getByRole('link', { name: 'Back to Library' })).toBeInTheDocument()
    expect(screen.getByText('Competitive shooter')).toBeInTheDocument()
  })
})
