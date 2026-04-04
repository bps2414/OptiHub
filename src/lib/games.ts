import type { GameSource } from '../types/ipc'

const commonExecutableSubdirs = new Set([
  'bin',
  'binaries',
  'game',
  'shipping',
  'win64',
  'win32',
  'x64',
  'x86',
])

export function formatGameSource(source: GameSource): 'steam' | 'manual' {
  return source === 'steam' ? 'steam' : 'manual'
}

export function getInstallRoot(executablePath: string): string {
  const normalizedPath = executablePath.replace(/\\/g, '/')
  const segments = normalizedPath.split('/').filter(Boolean)

  if (segments.length <= 1) {
    return executablePath
  }

  segments.pop()

  while (segments.length > 1) {
    const lastSegment = segments.at(-1)?.toLowerCase()

    if (!lastSegment || !commonExecutableSubdirs.has(lastSegment)) {
      break
    }

    segments.pop()
  }

  if (normalizedPath.startsWith('//')) {
    return `//${segments.join('/')}`
  }

  return segments.join('/')
}
