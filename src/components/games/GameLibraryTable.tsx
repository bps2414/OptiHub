import { useI18n } from '../../i18n/useI18n'
import type { GameLibraryEntry } from '../../types/ipc'
import { GameSourceBadge } from './GameSourceBadge'

interface GameLibraryTableProps {
  entries: GameLibraryEntry[]
  onRemove: (gameId: string) => void | Promise<void>
}

export function GameLibraryTable({
  entries,
  onRemove,
}: GameLibraryTableProps) {
  const { copy } = useI18n()
  const libraryCopy = copy.pages.library

  return (
    <section className="page-card game-library-table">
      <div className="game-library-row game-library-row--header">
        <span className="game-library-cell">{libraryCopy.table.name}</span>
        <span className="game-library-cell">{libraryCopy.table.source}</span>
        <span className="game-library-cell">{libraryCopy.table.installPath}</span>
        <span className="game-library-cell">{libraryCopy.table.actions}</span>
      </div>

      {entries.map((entry) => (
        <div className="game-library-row" key={entry.id}>
          <span className="game-library-cell">{entry.displayName}</span>
          <span className="game-library-cell">
            <GameSourceBadge source={entry.source} />
            <span className="game-source-meta">
              {entry.source === 'steam'
                ? entry.userAdded
                  ? libraryCopy.table.addedManually
                  : libraryCopy.table.detectedViaSteam
                : libraryCopy.table.addedManually}
            </span>
          </span>
          <span className="game-library-cell">{entry.installDir}</span>
          <span className="game-library-cell">
            {entry.removable ? (
              <button
                className="form-select"
                onClick={() => {
                  void onRemove(entry.id)
                }}
                type="button"
              >
                {libraryCopy.table.remove}
              </button>
            ) : null}
          </span>
        </div>
      ))}
    </section>
  )
}
