import type { GameLibraryEntry } from '../types/ipc'

export type GameLibraryViewMode = 'grid' | 'list'
export type GameLibrarySourceFilter = 'all' | 'steam' | 'manual'
export type GameLibrarySortMode = 'name-asc' | 'name-desc' | 'recent'

interface FilterOptions {
  searchTerm: string
  sourceFilter: GameLibrarySourceFilter
  sortMode: GameLibrarySortMode
}

export function getFilteredGameEntries(
  entries: GameLibraryEntry[],
  options: FilterOptions,
): GameLibraryEntry[] {
  const normalizedSearch = options.searchTerm.trim().toLowerCase()

  return [...entries]
    .filter((entry) => {
      if (options.sourceFilter === 'all') {
        return true
      }

      return entry.source === options.sourceFilter
    })
    .filter((entry) => {
      if (!normalizedSearch) {
        return true
      }

      const searchTargets = [
        entry.displayName,
        entry.installDir,
        entry.metadata.shortDescription,
      ]

      return searchTargets.some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      )
    })
    .sort((left, right) => {
      if (options.sortMode === 'recent') {
        const leftTimestamp = Number(left.lastSeenAt ?? 0)
        const rightTimestamp = Number(right.lastSeenAt ?? 0)

        return rightTimestamp - leftTimestamp || left.displayName.localeCompare(right.displayName)
      }

      const comparison = left.displayName.localeCompare(right.displayName)
      return options.sortMode === 'name-desc' ? comparison * -1 : comparison
    })
}

export function formatInstallSize(bytes: number | null): string {
  if (bytes === null || Number.isNaN(bytes)) {
    return '—'
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const formatted = unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)
  return `${formatted} ${units[unitIndex]}`
}

export function getGameCoverFallback(entry: GameLibraryEntry): string {
  const words = entry.displayName.split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return '?'
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

export function resolveLibraryArtwork(entry: GameLibraryEntry): string | null {
  return entry.metadata.libraryPortraitAssetUrl
}

export function resolveDetailArtwork(entry: GameLibraryEntry): string | null {
  return entry.metadata.detailHeroAssetUrl ?? entry.metadata.libraryPortraitAssetUrl
}

export function formatPlatformSummary(entry: GameLibraryEntry): string {
  if (entry.metadata.platforms.length > 0) {
    return entry.metadata.platforms.join(' • ')
  }

  return 'Windows'
}
