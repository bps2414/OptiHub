import { Link } from 'react-router'

import { formatInstallSize, formatPlatformSummary, getGameCoverFallback, resolveDetailArtwork } from '../../lib/gameLibrary'
import { useI18n } from '../../i18n/useI18n'
import type { GameDetailSnapshot, MetadataCacheStatus } from '../../types/ipc'
import { GameSourceBadge } from './GameSourceBadge'

function metadataStatusLabel(
  status: MetadataCacheStatus,
  copy: ReturnType<typeof useI18n>['copy']['pages']['games']['metadata'],
) {
  switch (status) {
    case 'cached':
      return copy.cached
    case 'fallback':
      return copy.fallback
    default:
      return copy.missing
  }
}

interface GameDetailViewProps {
  detail: GameDetailSnapshot
}

export function GameDetailView({ detail }: GameDetailViewProps) {
  const { copy } = useI18n()
  const page = copy.pages.games
  const artwork = resolveDetailArtwork(detail.entry)

  return (
    <>
      <div className="game-detail-actions">
        <Link className="form-select" to="/library">
          {page.backToLibrary}
        </Link>
      </div>

      <section className="page-card game-detail-hero">
        <div className="game-detail-hero__artwork">
          {artwork ? (
            <img
              alt=""
              className="game-detail-hero__image"
              src={artwork}
            />
          ) : (
            <div className="game-detail-hero__fallback" aria-hidden="true">
              {getGameCoverFallback(detail.entry)}
            </div>
          )}
        </div>

        <div className="game-detail-hero__body">
          <div className="game-detail-hero__header">
            <div>
              <h2 className="game-detail-hero__title">{detail.entry.displayName}</h2>
              <p className="game-detail-hero__platform">
                {formatPlatformSummary(detail.entry)}
              </p>
            </div>
            <GameSourceBadge source={detail.entry.source} />
          </div>

          <p className="game-detail-hero__description">
            {detail.entry.metadata.shortDescription ?? page.descriptionFallback}
          </p>
        </div>
      </section>

      <section className="game-detail-grid">
        <div className="page-card">
          <div className="page-card__heading">
            <h2 className="page-card__title">{page.sections.identity}</h2>
          </div>
          <div className="page-kv">
            <div className="page-kv__row">
              <span>{page.fields.installPath}</span>
              <span>{detail.entry.installDir}</span>
            </div>
            <div className="page-kv__row">
              <span>{page.fields.installSize}</span>
              <span>{formatInstallSize(detail.installSizeBytes)}</span>
            </div>
            <div className="page-kv__row">
              <span>{page.fields.platform}</span>
              <span>{formatPlatformSummary(detail.entry)}</span>
            </div>
            <div className="page-kv__row">
              <span>{page.fields.source}</span>
              <span>{detail.entry.source === 'steam' ? page.sourceSteam : page.sourceManual}</span>
            </div>
          </div>
        </div>

        <div className="page-card">
          <div className="page-card__heading">
            <h2 className="page-card__title">{page.sections.metadata}</h2>
          </div>
          <div className="page-kv">
            <div className="page-kv__row">
              <span>{page.fields.cacheStatus}</span>
              <span>{metadataStatusLabel(detail.entry.metadata.cacheStatus, page.metadata)}</span>
            </div>
            <div className="page-kv__row">
              <span>{page.fields.lastUpdated}</span>
              <span>{detail.entry.metadata.lastUpdatedAt ?? page.metadata.notAvailable}</span>
            </div>
            <div className="page-kv__row">
              <span>{page.fields.sharedMetadata}</span>
              <span>
                {detail.entry.metadata.sharedSteamAppId
                  ? String(detail.entry.metadata.sharedSteamAppId)
                  : page.metadata.notAvailable}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-card">
        <div className="page-card__heading">
          <h2 className="page-card__title">{page.sections.relatedEntries}</h2>
        </div>
        {detail.relatedEntries.length === 0 ? (
          <p className="page-note game-detail-related__empty">{page.noRelatedEntries}</p>
        ) : (
          <div className="game-detail-related">
            {detail.relatedEntries.map((entry) => (
              <div className="game-detail-related__item" key={entry.id}>
                <div>
                  <strong>{entry.displayName}</strong>
                  <p>{entry.installDir}</p>
                </div>
                <div className="game-detail-related__meta">
                  <GameSourceBadge source={entry.source} />
                  <Link className="form-select" to={`/library/${encodeURIComponent(entry.id)}`}>
                    {page.openRelated}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
