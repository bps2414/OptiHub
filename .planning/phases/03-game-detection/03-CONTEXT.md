# Phase 3: Game Detection - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Detect installed Steam games via Windows registry plus `libraryfolders.vdf` and `appmanifest_*.acf` parsing, support manual registration by executable selection, and manage a persisted game library with refresh/removal flows. Phase 3 is management-first and does not pull Phase 4 cover-art or metadata fetching into scope.

</domain>

<decisions>
## Implementation Decisions

### Library Presentation
- **D-01:** Phase 3 should use a compact, management-first list/table rather than rich visual cards.
- **D-02:** Each entry should prioritize operational fields: game name, source, install path, and quick actions.
- **D-03:** The richer cover-art-first presentation remains deferred to Phase 4.

### Manual Registration Flow
- **D-04:** Manual add starts with executable selection and then always opens a small confirmation form before saving.
- **D-05:** The confirmation step should let the user review the detected path and set or refine the display name.
- **D-06:** Manual registration is meant to feel clean and intentional, not like a hidden fallback.

### Source Distinction And Removal Rules
- **D-07:** Every game must visibly indicate its source as `Steam` or `Manual`.
- **D-08:** Only manually added entries can be removed by the user.
- **D-09:** If a Steam-detected game disappears from detection on a later refresh, it should drop out of the detected library rather than linger as a broken stale item.

### Refresh And Duplicate Handling
- **D-10:** The library should auto-scan when the user opens the library view.
- **D-11:** The UI should also expose a manual `Refresh` action that reruns Steam detection on demand.
- **D-12:** Duplicate detection should treat matching executable paths or matching install roots as the same game.
- **D-13:** If a manual registration matches a Steam-detected install, the library should keep a single record and promote the source to `Steam`.

### Data Model And Architecture
- **D-14:** Steam detection stays Rust-first and read-only, using registry and filesystem parsing through IPC rather than frontend file access.
- **D-15:** SQLite should persist the managed game library and manual additions so later phases can build on stable records.
- **D-16:** Detection should favor correctness and graceful partial results over aggressive assumptions when Steam files are missing or malformed.

### Agent's Discretion
- Exact Rust module/file split between `steam`, `games`, database helpers, and command handlers
- Choice of parser crate and normalization details for VDF/ACF data
- Exact table/list styling within the existing dark design system
- Whether `/library` owns the main management UI and `/games` stays lighter during Phase 3, as long as the management-first compact list requirement is met
- Exact merge precedence when both manual and Steam records provide slightly different names for the same install

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope And Requirements
- `.planning/ROADMAP.md` — Phase 3 goal, success criteria, and plan split (`03-01`, `03-02`)
- `.planning/REQUIREMENTS.md` — `GAME-01`, `GAME-02`, `GAME-04`, `GAME-05`, and `GAME-06`
- `.planning/PROJECT.md` — offline-first, Windows-only, Steam as primary game source

### Architecture And Safety
- `.planning/research/ARCHITECTURE.md` — suggested `steam`, `games`, and `database` backend modules plus `detect_games` IPC pattern
- `.planning/research/PITFALLS.md` — Steam VDF/ACF parsing risks, multi-library handling, and fallback to manual game addition

### Existing App Patterns
- `.planning/phases/01-foundation-app-shell/01-02-PLAN.md` — page placeholders, sidebar route structure, and dark surface styling tokens
- `.planning/phases/02-hardware-detection/02-CONTEXT.md` — carry-forward rule that Rust/backend remains authoritative for system detection and normalized IPC payloads

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/tauri.ts` — existing `tauriInvoke<T>()` wrapper and command-call pattern for new game-detection IPC methods
- `src/types/ipc.ts` — established location for mirrored TypeScript IPC payload types
- `src/pages/LibraryPage.tsx` and `src/pages/GamesPage.tsx` — existing placeholders ready to receive Phase 3 library management UI
- `src/i18n/messages.ts` — bilingual copy structure already covering library/games routes and ready for new game-management strings

### Established Patterns
- Rust commands live under `src-tauri/src/commands/*` and are registered from `src-tauri/src/lib.rs`
- Frontend shell/navigation is already routed and expects content pages to plug into existing page panels
- Zustand is already used for frontend-owned UI state, while backend-detected data remains Rust-authored via IPC

### Integration Points
- `src-tauri/src/lib.rs` — add game-detection commands to the Tauri invoke handler
- `src-tauri/src/commands/mod.rs` — add new game-related command modules
- `src/pages/LibraryPage.tsx` — likely home for the compact management list and refresh/add/remove controls
- `src/pages/GamesPage.tsx` — can remain lighter in Phase 3 or mirror supporting game-management context without taking on Phase 4 metadata scope

</code_context>

<specifics>
## Specific Ideas

- The library should feel operational and trustworthy first: quick to scan, easy to refresh, easy to distinguish Steam vs manual entries.
- Steam-origin games should carry strong origin identity. Once cover art exists in Phase 4, the Steam icon should appear on the bottom-left corner of the game cover.

</specifics>

<deferred>
## Deferred Ideas

- Cover-art treatment, including the Steam icon overlay on the bottom-left of the cover, belongs to Phase 4 when covers/metadata exist.

</deferred>

---

*Phase: 03-game-detection*
*Context gathered: 2026-04-04*
