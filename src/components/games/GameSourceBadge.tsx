import { useI18n } from '../../i18n/useI18n'
import { formatGameSource } from '../../lib/games'
import type { GameSource } from '../../types/ipc'

interface GameSourceBadgeProps {
  source: GameSource
}

export function GameSourceBadge({ source }: GameSourceBadgeProps) {
  const { copy } = useI18n()
  const libraryCopy = copy.pages.library
  const normalizedSource = formatGameSource(source)
  const label =
    normalizedSource === 'steam'
      ? libraryCopy.table.steam
      : libraryCopy.table.manual

  return (
    <span className={`game-source-badge game-source-badge--${normalizedSource}`}>
      {label}
    </span>
  )
}
