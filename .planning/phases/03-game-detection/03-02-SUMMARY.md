---
phase: 03-game-detection
plan: 02
subsystem: persistence-ui
tags: [react, zustand, rusqlite, dialog, vitest, library]
requires:
  - phase: 03-01
    provides: Stable game-library commands and nullable Steam executable contract
provides:
  - Separate persisted manual registrations with install-root reconciliation against Steam detections
  - Compact management-first `/library` flow with source badges, native add-game path selection, and manual-only removal
  - Backend `manual_registry` tests plus focused frontend tests for the library flow
affects: [library, games, recommendations, presets]
tech-stack:
  added: [rusqlite, tauri-plugin-dialog, '@tauri-apps/plugin-dialog']
  patterns: [separate manual registration table, provenance-preserving reconciliation, provenance-aware source badges]
key-files:
  created: [src/lib/dialog.ts, src/lib/games.ts, src/stores/games.ts, src/components/games/GameSourceBadge.tsx, src/components/games/GameLibraryTable.tsx, src/components/games/ManualGameRegistrationForm.tsx, src/pages/LibraryPage.test.tsx, src/components/games/GameLibraryTable.test.tsx, src/components/games/ManualGameRegistrationForm.test.tsx]
  modified: [src-tauri/Cargo.toml, src-tauri/src/commands/games.rs, src-tauri/src/lib.rs, package.json, pnpm-lock.yaml, src/lib/tauri.ts, src/i18n/messages.ts, src/pages/LibraryPage.tsx, src/pages/GamesPage.tsx, src/index.css]
key-decisions:
  - "Persisted only manual registrations in SQLite and reconciled Steam detections in memory, which avoids uniqueness conflicts for multiple Steam rows with nullable executable paths."
  - "Used normalized install root as the authoritative Steam-side reconciliation key in Phase 3 and limited executable-path matching to manual/manual duplicate prevention."
  - "Preserved original user-added provenance separately from effective source so matched Steam rows can still report `userAdded = true` and unmatched manual rows reappear if Steam detection disappears."
patterns-established:
  - "LibraryPage is now the management-first source of truth for Phase 3."
  - "Source badges and helper text distinguish effective Steam provenance from preserved manual provenance."
requirements-completed: [GAME-01, GAME-02, GAME-04, GAME-05, GAME-06]
duration: 54min
completed: 2026-04-03
---

# Phase 3 Plan 02: Library Management Summary

**Separate manual-registration persistence, provenance-preserving reconciliation, and compact Phase 3 library management UI**

## Performance

- **Duration:** 54 min
- **Started:** 2026-04-03T23:46:00-03:00 (approx)
- **Completed:** 2026-04-04T00:40:00-03:00 (approx)
- **Tasks:** 3
- **Files modified:** 18

## Accomplishments
- Added separate SQLite persistence for manual registrations plus backend reconciliation that preserves original user-added provenance while exposing effective Steam source.
- Added native `.exe` picking, a compact management-first library table, source badges, manual registration confirmation, and a library-focused `/games` handoff message.
- Added backend `manual_registry` tests and focused frontend tests covering LibraryPage, source-badge rendering, and manual registration UX.

## Task Commits

Task-level git commits were intentionally skipped in this workspace pass because the repository remains dirty/untracked and Phase 3 is being executed inline in the existing working tree. Verification was performed against the working tree instead.

## Files Created/Modified
- `src-tauri/src/commands/games.rs` - Separate manual registration table, provenance-preserving reconciliation, and backend `manual_registry` tests
- `src-tauri/Cargo.toml` - Added `rusqlite` and `tauri-plugin-dialog`
- `src-tauri/src/lib.rs` - Initialized dialog plugin and registered manual add/remove commands
- `package.json` / `pnpm-lock.yaml` - Added `@tauri-apps/plugin-dialog`
- `src/lib/tauri.ts` - Added `registerManualGame()` and `removeManualGame()`
- `src/lib/dialog.ts` - Native executable picker wrapper
- `src/lib/games.ts` - Shared source-formatting and install-root helpers
- `src/stores/games.ts` - Library load state and actions for load/refresh/add/remove
- `src/i18n/messages.ts` - EN + PT-BR copy for the Phase 3 library flow
- `src/components/games/GameSourceBadge.tsx` - Steam/manual badge component
- `src/components/games/GameLibraryTable.tsx` - Compact management list
- `src/components/games/ManualGameRegistrationForm.tsx` - Confirmation form for manual game adds
- `src/pages/LibraryPage.tsx` - Main management UI for detected and manual games
- `src/pages/GamesPage.tsx` - Lightweight pointer to the `/library` management flow
- `src/index.css` - Game-library toolbar, table, badge, meta, and form styles
- `src/pages/LibraryPage.test.tsx` - Library auto-load and management-state coverage
- `src/components/games/GameLibraryTable.test.tsx` - Source-badge and manual-only remove coverage
- `src/components/games/ManualGameRegistrationForm.test.tsx` - Save/cancel and required display-name coverage

## Decisions Made
- Chose the separate-table model from the revised plan so Steam detections are never forced into an `executable_path` uniqueness scheme they cannot satisfy in Phase 3.
- Derived manual install roots from executable paths with a small folder-stripping heuristic (`bin`, `win64`, `game`, etc.) so Steam/manual matching by install root works for common Windows layouts.
- Kept all new user-facing strings inside the existing i18n catalogs and left Phase 4 cover-art/metadata work untouched.

## Deviations from Plan

None - the revised plan executed as written.

## Issues Encountered

- Manual/Steam reconciliation initially failed because the manual install root was using the immediate parent directory of the executable. This was corrected with a small install-root heuristic and locked in with backend tests.
- Vitest module mocking for the LibraryPage suite needed hoisted mocks because the tauri wrapper mock is imported through the Zustand store module.

## User Setup Required

None. The native file picker works inside the desktop app once the phase is built.

## Next Phase Readiness

- Recommendation and preset work can now consume a stable, provenance-aware game library without revisiting Phase 3 persistence decisions.
- Phase 4 can layer cover art, metadata, and richer detail views on top of the current `/library` management flow instead of rebuilding the base library model.

---
*Phase: 03-game-detection*
*Completed: 2026-04-03*
