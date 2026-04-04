# Phase 4: Game Library UI & Metadata - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform the Phase 3 management-first library into a rich, cover-driven browsing experience with a visually polished library view, search/filter controls, per-game detail pages, and cached Steam/SteamDB metadata that keeps working offline. Phase 4 enriches the existing detected library; it does not add recommendation, preset, or tool-integration behavior.

</domain>

<decisions>
## Implementation Decisions

### Route Responsibilities
- **D-01:** `/library` becomes the primary rich collection view for browsing the full game library.
- **D-02:** `/games` should evolve from the current placeholder into the per-game detail experience for a selected title.
- **D-03:** The existing Phase 3 management actions must still remain reachable from the rich library flow, but the visual collection experience now takes priority over the table-first presentation.

### Library Visual Model
- **D-04:** The default library presentation should be a cover-first grid.
- **D-05:** The library must also offer a list toggle as an alternate view, but grid is the default and visual identity anchor.
- **D-06:** Library cards should stay relatively focused: cover art, game name, source badge, and platform info belong on the card; deeper metadata belongs on the detail page.

### Game Detail Experience
- **D-07:** The game detail page should ship in this phase with a hero-style header and the key identity/context fields.
- **D-08:** Detail content must include: cover art, title, description, install path, install size, platform info, source/provenance, and metadata cache status.
- **D-09:** The detail page should feel like the source of truth for a game's descriptive context, while the library remains optimized for browsing and scanning.

### Metadata Fetching And Offline Cache
- **D-10:** Metadata should use a cache-first model so the app remains fully useful offline.
- **D-11:** When network is available, the app may silently refresh cached metadata in the background instead of requiring a manual metadata-refresh action.
- **D-12:** Missing network connectivity or fetch failures must never break the UI; cached metadata, partial metadata, or clear fallback states are acceptable.
- **D-13:** Metadata is shared enrichment for the game identity itself, so separate Steam and Manual entries that refer to the same underlying game may share related cover/description data even though their library entries remain distinct.

### Search, Filters, And Sorting
- **D-14:** Phase 4 should include search by game name.
- **D-15:** Phase 4 should include filtering by source (`Steam` / `Manual`) and sorting controls.
- **D-16:** Metadata presence filtering (`with metadata` / `without metadata`) is not required if it complicates the first delivery; the user prioritized search + source + ordering instead.

### Steam And Manual Provenance In The Rich UI
- **D-17:** Steam and Manual entries must remain separate visual entries even when they point to the same install or share metadata.
- **D-18:** Shared metadata is allowed, but source identity and lifecycle remain independent.
- **D-19:** The future cover-art treatment requested in Phase 3 carries forward here: Steam-origin entries should support a Steam-specific visual identity on the cover treatment rather than losing provenance in a generic card.

### Agent's Discretion
- Exact route shape for game detail (`/games/:id`, query-driven detail, or equivalent) as long as `/games` becomes the detail surface
- Exact card layout, hover behavior, and list-view density within the established premium-dark design system
- The specific ordering modes exposed in Phase 4, provided sorting exists and feels useful
- Exact metadata cache invalidation rules, storage layout, and background refresh triggers
- Whether install size is computed eagerly or shown as a progressively enriched field when initially unavailable

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope And Requirements
- `.planning/ROADMAP.md` - Phase 4 goal, success criteria, and plan split (`04-01`, `04-02`)
- `.planning/REQUIREMENTS.md` - `GAME-03`, `META-01`, and `META-02`
- `.planning/PROJECT.md` - offline-first behavior, Windows-only constraint, Steam/SteamDB metadata direction

### Carry-Forward Rules From Earlier Phases
- `.planning/phases/03-game-detection/03-CONTEXT.md` - Phase 3 management-first decisions, visible provenance rules, and the deferred cover-art note
- `.planning/phases/03-game-detection/03-UAT.md` - latest accepted product truth that Steam and Manual entries should remain separate
- `.planning/phases/02-hardware-detection/02-CONTEXT.md` - carry-forward rule that normalized backend IPC remains authoritative while frontend owns local view state

### Architecture And Research
- `.planning/research/ARCHITECTURE.md` - `games` and `metadata` module responsibilities plus filesystem cache direction
- `.planning/research/SUMMARY.md` - metadata-source recommendation (`local/cache-first with Steam web enrichment`) and scope/risk notes
- `.planning/research/FEATURES.md` - game detail view and metadata capability framing
- `.planning/research/PITFALLS.md` - guardrails around Steam data handling, offline behavior, and later-phase boundaries

### Existing App Patterns
- `src/pages/LibraryPage.tsx` - current Phase 3 library entry point and integration surface
- `src/pages/GamesPage.tsx` - current placeholder route that should become the detail surface
- `src/stores/games.ts` - current frontend-owned game-library state and action pattern
- `src/components/games/GameLibraryTable.tsx` - current management-oriented rendering and provenance treatment
- `src/components/games/GameSourceBadge.tsx` - established Steam/Manual badge pattern
- `src/types/ipc.ts` - current `GameLibraryEntry` / `GameLibrarySnapshot` IPC contract
- `src/index.css` - current premium-dark page/card/table tokens and game-library styling hooks

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/pages/LibraryPage.tsx` already owns initial load, refresh, manual add, and empty/error states for the library flow.
- `src/stores/games.ts` already centralizes frontend-owned library state, making it the natural place for view mode, search term, source filter, and detail-selection state unless planning finds a cleaner split.
- `src/components/games/GameSourceBadge.tsx` already gives Steam/Manual provenance a reusable visual language.
- `src/index.css` already contains `page-panel`, `page-card`, and game-library-specific styling tokens that can be extended into grid/list cards without inventing a new visual system.

### Established Patterns
- Rust remains the authoritative source for detected/cached game data, delivered through typed IPC contracts mirrored in `src/types/ipc.ts`.
- Frontend stores own transient UI behavior such as loading states and view controls.
- `/library` and `/games` already exist as routed shell surfaces, so Phase 4 can deepen those routes without navigation redesign.

### Integration Points
- `src/pages/LibraryPage.tsx` should absorb the rich grid/list browser, search, filters, and the handoff into detail.
- `src/pages/GamesPage.tsx` should be replaced or extended into the game-detail route experience.
- `src/stores/games.ts` and `src/lib/tauri.ts` will likely need new metadata/detail loading actions once the backend exposes them.
- `src-tauri/src/commands/games.rs` or a new metadata-focused command module should become the backend source for cached metadata and detail payloads.

</code_context>

<specifics>
## Specific Ideas

- The cover-first library should feel premium and launcher-like rather than like a storefront clone or generic admin grid.
- The Steam visual identity note from Phase 3 carries forward here: Steam-origin entries should be visually identifiable on the cover treatment, ideally with a subtle Steam-specific overlay or marker.
- Shared metadata across equivalent Steam/Manual entries is acceptable, but UI copy must not imply that the entries themselves were merged.

</specifics>

<deferred>
## Deferred Ideas

- Recommendation summaries, preset previews, tool-deployment status, and apply/restore controls remain future-phase concerns.
- Advanced metadata filtering (for example, dedicated `with metadata` / `without metadata` facets) can wait unless planning finds it almost free after search/source/sort are in place.

</deferred>

---

*Phase: 04-game-library-ui-metadata*
*Context gathered: 2026-04-04*
