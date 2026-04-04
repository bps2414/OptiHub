import {
  formatPlatformSummary,
  getGameCoverFallback,
  resolveLibraryArtwork,
  type GameLibraryViewMode,
} from '../../lib/gameLibrary'
import { useI18n } from '../../i18n/useI18n'
import type { GameLibraryEntry } from '../../types/ipc'
import { GameSourceBadge } from './GameSourceBadge'

interface GameLibraryTableProps {
  entries: GameLibraryEntry[]
  viewMode: GameLibraryViewMode
  onOpenDetail: (gameId: string) => void
  onRemove: (gameId: string) => void | Promise<void>
}

function GameArtwork({ entry }: { entry: GameLibraryEntry }) {
  const fallback = getGameCoverFallback(entry)
  const artwork = resolveLibraryArtwork(entry)

  return (
    <div className="game-artwork">
      {artwork ? (
        <img
          alt=""
          className="game-artwork__image"
          src={artwork}
        />
      ) : (
        <div className="game-artwork__fallback" aria-hidden="true">
          {fallback}
        </div>
      )}
      <div className="game-artwork__badge">
        <GameSourceBadge source={entry.source} />
      </div>
    </div>
  )
}

export function GameLibraryTable({
  entries,
  viewMode,
  onOpenDetail,
  onRemove,
}: GameLibraryTableProps) {
  const { copy } = useI18n()
  const libraryCopy = copy.pages.library
  const isGrid = viewMode === 'grid'

  return (
    <section
      className={isGrid ? 'game-library-grid' : 'game-library-list'}
      data-view-mode={viewMode}
    >
      {entries.map((entry) => (
        <article
          className={isGrid ? 'game-library-card' : 'game-library-list-item'}
          key={entry.id}
        >
          <GameArtwork entry={entry} />

          <div className="game-library-card__body">
            <div className="game-library-card__heading">
              <h2 className="game-library-card__title">{entry.displayName}</h2>
              {!isGrid ? (
                <span className="game-library-card__platform">
                  {formatPlatformSummary(entry)}
                </span>
              ) : null}
            </div>

            <div className="game-library-card__meta">
              {isGrid ? (
                <span className="game-library-card__platform">
                  {formatPlatformSummary(entry)}
                </span>
              ) : null}
              <span className="game-library-card__path">{entry.installDir}</span>
            </div>

            {!isGrid && entry.metadata.shortDescription ? (
              <p className="game-library-card__description">
                {entry.metadata.shortDescription}
              </p>
            ) : null}

            <div className="game-library-card__actions">
              <button
                className="form-select"
                onClick={() => onOpenDetail(entry.id)}
                type="button"
              >
                {libraryCopy.browser.openDetails}
              </button>
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
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
