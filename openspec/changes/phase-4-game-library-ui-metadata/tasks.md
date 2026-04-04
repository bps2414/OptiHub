## 1. Backend metadata and contract foundation

- [x] 1.1 Extend the Rust game/metadata backend with cache-aware detail payloads and any supporting storage helpers needed for cover art, description, platform info, install size, and metadata cache status.
- [x] 1.2 Add or update IPC commands and TypeScript mirror types in `src-tauri/src/commands/*`, `src/lib/tauri.ts`, and `src/types/ipc.ts` so the frontend can load the rich library snapshot and selected-game detail state.
- [x] 1.3 Expand `src/stores/games.ts` to own Phase 4 browse state (view mode, search term, source filter, sort mode, selected game/detail loading) while preserving the existing refresh/manual add/remove flows.

## 2. Rich library browsing experience

- [x] 2.1 Replace the current table-first rendering in `src/pages/LibraryPage.tsx` and `src/components/games/*` with a cover-first library browser that defaults to grid view and supports a list toggle.
- [x] 2.2 Add browse controls for search by name, source filtering, and sorting, keeping management actions reachable from the richer library flow.
- [x] 2.3 Implement focused rich cards that preserve Steam/manual provenance, including source-specific visual treatment and resilient fallback states when metadata is missing.

## 3. Game detail route and metadata presentation

- [x] 3.1 Turn `src/pages/GamesPage.tsx` into the dedicated game detail surface and wire the library-to-detail handoff using the selected game state or route params chosen during implementation.
- [x] 3.2 Render the hero-style detail presentation with cover art, description, install path, install size, platform info, provenance, and metadata cache status.
- [x] 3.3 Ensure related Steam/manual entries can reuse metadata enrichment without collapsing their separate identities in either the library or the detail view.

## 4. Validation and polish

- [x] 4.1 Add or update backend tests for metadata/detail payload generation, cache/fallback behavior, and separate Steam/manual provenance handling where the Phase 4 contract changes.
- [x] 4.2 Add or update frontend tests for browse controls, detail handoff, and fallback rendering where practical.
- [x] 4.3 Run the relevant verification suite (`pnpm test`, `pnpm lint`, `pnpm build`, and targeted or full `cargo test`) and resolve Phase 4 regressions before shipping.
