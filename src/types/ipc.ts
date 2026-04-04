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

export interface AppError {
  kind: 'NotFound' | 'OperationFailed' | 'InvalidInput' | 'SystemError'
  message: string
}
