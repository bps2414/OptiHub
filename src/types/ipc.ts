export interface SystemInfo {
  appName: string
  appVersion: string
  platform: string
}

export interface CpuSnapshot {
  model: string | null
  physicalCores: number | null
  logicalThreads: number | null
}

export interface GpuSnapshot {
  model: string | null
  vendor: string | null
  vramBytes: number | null
}

export interface MemorySnapshot {
  totalBytes: number | null
}

export interface DisplaySnapshot {
  adapterName: string | null
  monitorName: string | null
  widthPx: number | null
  heightPx: number | null
  refreshHz: number | null
}

export interface HardwareSnapshot {
  cpu: CpuSnapshot
  gpu: GpuSnapshot
  memory: MemorySnapshot
  display: DisplaySnapshot
}

export type GameSource = 'steam' | 'manual'
export type MetadataCacheStatus = 'missing' | 'fallback' | 'cached'

export interface GameMetadataSummary {
  libraryPortraitAssetUrl: string | null
  detailHeroAssetUrl: string | null
  shortDescription: string | null
  platforms: string[]
  cacheStatus: MetadataCacheStatus
  lastUpdatedAt: string | null
  sharedSteamAppId: number | null
}

export interface GameLibraryEntry {
  id: string
  displayName: string
  executablePath: string | null
  installDir: string
  source: GameSource
  steamAppId: number | null
  relatedSteamAppId: number | null
  removable: boolean
  userAdded: boolean
  lastSeenAt: string | null
  metadata: GameMetadataSummary
}

export interface GameLibrarySnapshot {
  entries: GameLibraryEntry[]
  steamLibraryPaths: string[]
  scannedAt: string
  pendingMetadataRefreshAppIds: number[]
}

export interface GameDetailSnapshot {
  entry: GameLibraryEntry
  installSizeBytes: number | null
  relatedEntries: GameLibraryEntry[]
}

export interface ManualGameRegistrationInput {
  displayName: string
  executablePath: string
}

export interface AppError {
  kind: 'NotFound' | 'OperationFailed' | 'InvalidInput' | 'SystemError'
  message: string
}
