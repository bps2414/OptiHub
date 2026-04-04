import { describe, expect, it } from 'vitest'

import { formatInstallSize, getFilteredGameEntries } from './gameLibrary'

const entries = [
  {
    id: 'steam:730',
    displayName: 'Counter-Strike 2',
    executablePath: null,
    installDir: 'D:/SteamLibrary/steamapps/common/Counter-Strike Global Offensive',
    source: 'steam' as const,
    steamAppId: 730,
    relatedSteamAppId: null,
    removable: false,
    userAdded: false,
    lastSeenAt: '200',
    metadata: {
      libraryPortraitAssetUrl: null,
      detailHeroAssetUrl: null,
      shortDescription: 'Shooter',
      platforms: ['Windows'],
      cacheStatus: 'cached' as const,
      lastUpdatedAt: '200',
      sharedSteamAppId: 730,
    },
  },
  {
    id: 'manual:celeste',
    displayName: 'Celeste',
    executablePath: 'D:/Games/Celeste/Celeste.exe',
    installDir: 'D:/Games/Celeste',
    source: 'manual' as const,
    steamAppId: null,
    relatedSteamAppId: null,
    removable: true,
    userAdded: true,
    lastSeenAt: '100',
    metadata: {
      libraryPortraitAssetUrl: null,
      detailHeroAssetUrl: null,
      shortDescription: 'Platformer',
      platforms: ['Windows'],
      cacheStatus: 'missing' as const,
      lastUpdatedAt: null,
      sharedSteamAppId: null,
    },
  },
]

describe('getFilteredGameEntries', () => {
  it('filters by source and search term and sorts by recent', () => {
    const result = getFilteredGameEntries(entries, {
      searchTerm: 'counter',
      sourceFilter: 'steam',
      sortMode: 'recent',
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('steam:730')
  })
})

describe('formatInstallSize', () => {
  it('formats byte values into readable units', () => {
    expect(formatInstallSize(1024)).toBe('1.0 KB')
    expect(formatInstallSize(1024 * 1024)).toBe('1.0 MB')
    expect(formatInstallSize(null)).toBe('—')
  })
})
