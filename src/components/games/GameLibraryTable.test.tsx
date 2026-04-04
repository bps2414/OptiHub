import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '../../i18n/I18nProvider'
import { GameLibraryTable } from './GameLibraryTable'

describe('GameLibraryTable', () => {
  it('renders Steam and Manual rows with manual-only remove actions', () => {
    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <GameLibraryTable
            entries={[
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
              {
                id: 'manual:celeste',
                displayName: 'Celeste',
                executablePath: 'D:/Games/Celeste/Celeste.exe',
                installDir: 'D:/Games/Celeste',
                source: 'manual',
                steamAppId: null,
                removable: true,
                userAdded: true,
                lastSeenAt: '1712274000',
              },
            ]}
            onRemove={vi.fn()}
          />
        </I18nProvider>
      </MemoryRouter>,
    )

    expect(screen.getAllByText('Steam').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Manual').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Added manually').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })
})
