import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '../../i18n/I18nProvider'
import { GameLibraryTable } from './GameLibraryTable'

describe('GameLibraryTable', () => {
  it('renders rich entries with detail and remove actions', () => {
    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <GameLibraryTable
            entries={[
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
                  cacheStatus: 'fallback',
                  lastUpdatedAt: null,
                  sharedSteamAppId: 730,
                },
              },
              {
                id: 'manual:celeste',
                displayName: 'Celeste',
                executablePath: 'D:/Games/Celeste/Celeste.exe',
                installDir: 'D:/Games/Celeste',
                source: 'manual',
                steamAppId: null,
                relatedSteamAppId: 730,
                removable: true,
                userAdded: true,
                lastSeenAt: '1712274001',
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
            ]}
            onOpenDetail={vi.fn()}
            onRemove={vi.fn()}
            viewMode="grid"
          />
        </I18nProvider>
      </MemoryRouter>,
    )

    expect(screen.getAllByText('Open details')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
    expect(screen.getAllByText('Windows').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Steam').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Manual').length).toBeGreaterThan(0)
  })
})
