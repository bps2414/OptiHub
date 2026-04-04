## Why

Phase 3 delivered a trustworthy management-first library, but OptiHub still lacks the richer browsing and detail experience required by `GAME-03`, `META-01`, and `META-02`. We need to formalize the Phase 4 decisions now so implementation can build the cover-first library, game detail surface, and offline-safe metadata layer without losing the product context already captured in `.planning`.

## What Changes

- Refine the `game-library` capability so `/library` becomes the rich browse surface and `/games` becomes the detail surface for a selected title.
- Specify the Phase 4 browse model: cover-first grid by default, list toggle, search by name, source filtering, useful sorting, and focused cards that preserve Steam/manual provenance.
- Expand the game detail requirement to include hero-style presentation, description, install path, install size, platform info, provenance, and metadata cache status.
- Refine the `metadata-cache` capability to lock in cache-first behavior, silent background refresh, fallback states, and shared metadata enrichment across related Steam/manual entries without merging those entries.
- Translate the existing Phase 4 context and decisions into implementation-ready tasks so the next `/opsx:apply` can execute without re-planning.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `game-library`: Tighten the browse/detail requirements around route ownership, card payload, search/filter/sort controls, detail fields, and Steam/manual rich-card provenance.
- `metadata-cache`: Tighten the metadata requirements around cache status visibility, silent refresh, resilient fallback behavior, and shared enrichment across separate Steam/manual entries.

## Impact

- Frontend surfaces: `src/pages/LibraryPage.tsx`, `src/pages/GamesPage.tsx`, `src/components/games/*`, `src/stores/games.ts`, `src/types/ipc.ts`, `src/i18n/messages.ts`, and `src/index.css`.
- Backend surfaces: `src-tauri/src/commands/games.rs` and any new metadata-focused backend module or cache helpers needed for detail payloads and cached enrichment.
- Product behavior: completes the Phase 4 user-facing shift from management table to premium library browsing while preserving the Phase 3 provenance and separation rules.
