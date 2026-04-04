---
phase: 03-game-detection
plan: 01
subsystem: api
tags: [tauri, rust, steam, registry, vdf, acf, ipc]
requires:
  - phase: 01-03
    provides: Typed IPC wrappers and Rust command registration patterns
provides:
  - Stable `get_game_library` and `refresh_game_library` Tauri commands with `AppHandle`
  - Steam registry + `libraryfolders.vdf` + `appmanifest_*.acf` detection pipeline
  - Deterministic Rust tests for Steam contract and parsing behavior
affects: [library, games, recommendations, presets, tools]
tech-stack:
  added: [winreg, keyvalues-serde]
  patterns: [nullable Steam executable paths, install-root normalization, partial-safe Steam scan]
key-files:
  created: [src-tauri/src/commands/games.rs]
  modified: [src-tauri/Cargo.toml, src-tauri/src/commands/mod.rs, src-tauri/src/lib.rs, src/types/ipc.ts, src/lib/tauri.ts]
key-decisions:
  - "Stabilized the IPC contract in Phase 3 with nullable Steam executable paths plus `removable` and `userAdded` flags to avoid churn in the management layer."
  - "Used `tauri::AppHandle` in game-library commands from the start so later app-data-backed reconciliation would not require command-signature changes."
  - "Kept Phase 3 detection strictly management-first and deferred cover art / metadata work to Phase 4."
patterns-established:
  - "Steam game detection flows through one normalized game-library snapshot instead of multiple per-source IPC calls."
  - "Steam scan helpers stay pure and testable; registry and file-system access sit behind the command boundary."
requirements-completed: [GAME-01, GAME-04]
duration: 34min
completed: 2026-04-03
---

# Phase 3 Plan 01: Steam Detection Backend Summary

**Rust-first Steam detection with stable IPC contracts, install-root normalization, and deterministic parser tests**

## Performance

- **Duration:** 34 min
- **Started:** 2026-04-03T23:12:00-03:00 (approx)
- **Completed:** 2026-04-03T23:46:00-03:00 (approx)
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Added `get_game_library` and `refresh_game_library` to the Tauri backend with stable `AppHandle` signatures.
- Extended the shared TypeScript IPC layer with `GameLibraryEntry`, `GameLibrarySnapshot`, and manual-registration input types.
- Implemented Steam detection through registry lookup plus `libraryfolders.vdf` / `appmanifest_*.acf` parsing with nullable executable paths and parser regression tests.

## Task Commits

Task-level git commits were intentionally skipped in this workspace pass because the repository remains dirty/untracked and Phase 3 is being executed inline in the existing working tree. Verification was performed against the working tree instead.

## Files Created/Modified
- `src-tauri/src/commands/games.rs` - Steam scan command layer, install-root normalization helpers, and backend tests
- `src-tauri/Cargo.toml` - Added `winreg` and `keyvalues-serde`
- `src-tauri/src/commands/mod.rs` - Exported the new `games` command module
- `src-tauri/src/lib.rs` - Registered `get_game_library` and `refresh_game_library`
- `src/types/ipc.ts` - Added the stable Phase 3 game-library IPC contracts
- `src/lib/tauri.ts` - Added typed frontend wrappers for the new game-library commands

## Decisions Made
- Treated Steam manifests as install-root sources only in this phase and explicitly left `executablePath` nullable instead of fabricating `.exe` guesses.
- Added `removable` and `userAdded` to the contract in the first backend pass so the frontend shape would stay stable once manual reconciliation landed.
- Filtered `libraryfolders.vdf` to numeric library keys only, preventing `contentstatsid` and similar metadata fields from polluting library paths.

## Deviations from Plan

None - the plan executed as revised.

## Issues Encountered

- `keyvalues_serde::from_str_with_key` returns the parsed payload before the root key; the initial implementation assumed the reverse order. This was corrected during execution and covered by tests.
- `libraryfolders.vdf` includes non-library fields like `contentstatsid`; a numeric-key filter was added after the parser test exposed the issue.

## User Setup Required

None for this backend slice.

## Next Phase Readiness

- The management layer can now reconcile Steam detections with manual registrations without changing the frontend invoke surface.
- Phase 3 can continue with manual persistence and UI work while keeping cover art and metadata deferred to Phase 4.

---
*Phase: 03-game-detection*
*Completed: 2026-04-03*
