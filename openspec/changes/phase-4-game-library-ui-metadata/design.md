## Context

Phase 3 already ships a management-first library backed by Rust-authored detection data and frontend-owned UI state. The current app structure gives Phase 4 a natural path forward:

- `src/pages/LibraryPage.tsx` already owns library loading, refresh, manual add, and empty/error states.
- `src/pages/GamesPage.tsx` is still a placeholder and can become the dedicated detail surface without navigation churn.
- `src/stores/games.ts` is the existing home for transient library UI state and can absorb search, source filter, sort, view mode, and selected-game state.
- `src-tauri/src/commands/games.rs` already centralizes library snapshot loading and is the best place to extend the data contract for metadata-backed detail payloads.

This change needs to turn the current table-first library into a premium browse experience while keeping the Phase 3 guarantees intact:

- Steam and manual entries stay visually separate.
- Source provenance remains visible.
- Offline behavior remains trustworthy.
- Metadata is enrichment, not a reason for the UI to fail.

## Goals / Non-Goals

**Goals:**

- Make `/library` the rich browse surface with cover-first grid cards, list toggle, search, source filter, and sorting.
- Make `/games` the detail surface with hero presentation and the required identity/context fields.
- Extend the IPC contract so the frontend can load metadata-backed detail payloads and expose metadata cache status.
- Introduce cache-first metadata enrichment that silently refreshes when possible and degrades gracefully when offline or incomplete.
- Preserve separate Steam/manual entries even when they share metadata.

**Non-Goals:**

- Building recommendation, preset, tool-deployment, or apply/restore UI into the Phase 4 surfaces.
- Merging Steam and manual records into one lifecycle.
- Reworking the global navigation or app shell outside the existing `/library` and `/games` routes.
- Shipping advanced metadata facets beyond search, source filtering, and ordering.

## Decisions

### 1. Keep browse and detail responsibilities on separate existing routes

`/library` will become the high-density collection experience and `/games` will become the detail surface. This preserves the route map users already have while giving the placeholder route a clear job.

Alternatives considered:

- Put browse and detail in a single route with modals or drawers: rejected because Phase 4 explicitly wants `/games` to become the detail surface.
- Move the rich browsing UI to `/games`: rejected because it conflicts with the locked Phase 4 route decision.

### 2. Extend the existing games store instead of inventing a second frontend domain store

`src/stores/games.ts` already owns the library flow. Phase 4 should extend it with browse controls and detail-selection state before introducing new store boundaries.

Alternatives considered:

- Create a separate metadata store immediately: rejected because the current state surface is still small enough to keep in one library-oriented store.
- Push all browse state into route params only: rejected because the current app already uses Zustand for transient UI state and the controls need shared ownership across library/detail handoff.

### 3. Add a richer backend payload instead of forcing the frontend to compose detail data from partial fields

The current `GameLibraryEntry` shape is enough for Phase 3 management, but not for Phase 4 detail pages. The backend should expose detail-friendly metadata and cache fields through typed IPC so Rust remains authoritative for detected/cached data.

Alternatives considered:

- Keep the current snapshot and fetch metadata ad hoc from the frontend: rejected because it weakens offline guarantees and breaks the established Rust-first system-data boundary.
- Overload the current library snapshot with every detail field from day one: rejected because it increases initial load size and couples browsing too tightly to detail enrichment.

### 4. Use cache-first metadata with non-blocking refresh

The detail and browse surfaces should render cached or fallback data immediately and refresh metadata opportunistically in the background. This aligns with the offline-first promise and the Phase 4 decision log.

Alternatives considered:

- Require a manual metadata refresh step: rejected because the user already preferred silent background refresh.
- Block the detail page until metadata loads: rejected because it would make offline or partial states feel broken.

### 5. Shared metadata is allowed, but provenance stays per entry

Steam/manual entries that refer to the same underlying game may reuse related metadata and cover art, but they remain separate cards and separate detail entries. The model therefore needs a metadata identity distinct from the library-entry identity.

Alternatives considered:

- Duplicate metadata per entry with no sharing: rejected because it adds unnecessary storage/work and conflicts with the shared-enrichment decision.
- Merge entries when metadata matches: rejected because it violates the accepted provenance rule from late Phase 3.

## Risks / Trade-offs

- [Risk] Metadata fetching or file I/O could block the desktop experience. -> Mitigation: keep backend work async/spawn-blocking and render cached/fallback data first.
- [Risk] The data contract may grow quickly if library cards and detail pages demand different payloads. -> Mitigation: keep browse snapshot lean and add a dedicated detail payload or targeted metadata fields instead of making one mega-struct.
- [Risk] Shared metadata across separate entries may confuse users into thinking the entries were merged. -> Mitigation: keep source badges and provenance language visible on cards and detail pages.
- [Risk] Rich library visuals can regress the management actions users rely on today. -> Mitigation: preserve refresh/manual add/remove affordances within the richer browse flow instead of dropping them.

## Migration Plan

1. Refine `game-library` and `metadata-cache` specs with the locked Phase 4 decisions.
2. Implement backend metadata/cache payload support and typed IPC contracts.
3. Replace the table-first `/library` presentation with browse controls plus grid/list rendering while preserving management actions.
4. Turn `/games` into the game detail surface and wire the library-to-detail handoff.
5. Validate offline behavior, fallback states, and separate Steam/manual entry handling.

Rollback strategy:

- If Phase 4 UI work regresses usability, keep the Phase 3 management actions reachable and revert the browse/detail components while preserving the backend metadata contract where safe.
- If metadata enrichment proves unstable, ship the richer library/detail UI against cached or partial data first and narrow the online refresh path in a follow-up change.

## Open Questions

- Should the detail handoff use a stable route param (`/games/:id`) or a store-driven selected game layered on top of `/games`?
- Should install size be computed eagerly during library load or exposed as progressive enrichment on the detail page if filesystem scans are expensive?
- Is the metadata cache best modeled as filesystem assets plus a lightweight SQLite index, or can the initial Phase 4 implementation keep metadata state entirely in one backend storage path?
