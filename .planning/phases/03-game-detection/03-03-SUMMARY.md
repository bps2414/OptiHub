---
phase: 03-game-detection
plan: 03
subsystem: gap-closure
tags: [phase-03, gaps, library, provenance, uat]
requires:
  - phase: 03-02
    provides: management-first library flow with separate manual registration persistence
provides:
  - Separate Steam and manual rows for the same install instead of a merged effective-source row
  - Relationship metadata via `relatedSteamAppId` without source promotion
  - Updated backend/frontend regression coverage for the separated-entry model
affects: [library]
tech-stack:
  added: [none]
  patterns: [separate-entry reconciliation, relationship metadata, gap-driven regression hardening]
key-files:
  created: [.planning/phases/03-game-detection/03-03-SUMMARY.md]
  modified: [src-tauri/src/commands/games.rs, src/types/ipc.ts, src/i18n/messages.ts, src/components/games/GameLibraryTable.tsx, src/components/games/GameLibraryTable.test.tsx, src/pages/LibraryPage.test.tsx, .planning/phases/03-game-detection/03-UAT.md]
key-decisions:
  - "Manual and Steam entries must remain independent even when they point to the same install."
  - "Install-root matching is now relationship metadata only, not a merge trigger."
patterns-established:
  - "Manual rows can reference Steam detection through `relatedSteamAppId` while keeping `source = manual`."
requirements-completed: [GAME-06]
duration: 24min
completed: 2026-04-04
---

# Phase 3 Plan 03: Gap Closure Summary

**Separated Steam and manual entries after UAT feedback rejected the merged effective-source model**

## Accomplishments
- Replaced the merged Steam/manual row behavior with a separate-entry model.
- Added `relatedSteamAppId` as relationship metadata so the UI can show linkage without collapsing the two sources.
- Updated the UAT gap to `fixed-awaiting-retest` and rewrote the regression tests around the new behavior.

## Files Created/Modified
- `src-tauri/src/commands/games.rs` - Separate-row reconciliation and updated backend tests
- `src/types/ipc.ts` - Added `relatedSteamAppId`
- `src/i18n/messages.ts` - Added linked-to-Steam copy
- `src/components/games/GameLibraryTable.tsx` - Renders distinct Steam/manual rows with relationship hint
- `src/components/games/GameLibraryTable.test.tsx` - Updated table regression tests
- `src/pages/LibraryPage.test.tsx` - Updated page-level expectations
- `.planning/phases/03-game-detection/03-UAT.md` - Gap #6 moved to fixed-awaiting-retest

## Verification
- `cargo test --manifest-path src-tauri/Cargo.toml games::tests::manual_registry -- --nocapture`
- `cargo test --manifest-path src-tauri/Cargo.toml games::tests -- --nocapture`
- `pnpm test -- src/components/games/GameLibraryTable.test.tsx src/pages/LibraryPage.test.tsx`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- `pnpm tauri build`

## Remaining Work
- Human retest of UAT item 6 to confirm the separated Steam/manual model matches the expected product behavior.

---
*Phase: 03-game-detection*
*Completed: 2026-04-04*
