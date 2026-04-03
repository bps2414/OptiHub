---
phase: 01-foundation-app-shell
plan: 03
subsystem: ipc
tags: [tauri, rust, serde, invoke, typescript]
requires:
  - phase: 01-01
    provides: Tauri workspace scaffold and Rust entrypoint
  - phase: 01-02
    provides: Home page placeholder and routed app shell
provides:
  - Rust command module structure with serializable app errors
  - Typed TypeScript invoke wrapper and IPC type definitions
  - Home page backend health card proving React-to-Rust communication
affects: [hardware-detection, game-detection, tool-detection, diagnostics]
tech-stack:
  added: [thiserror, esbuild]
  patterns: [commands module pattern, serialized IPC errors, typed frontend invoke wrapper]
key-files:
  created: [src-tauri/src/commands/mod.rs, src-tauri/src/commands/system.rs, src-tauri/src/errors.rs, src/lib/tauri.ts, src/types/ipc.ts]
  modified: [src/pages/HomePage.tsx, src-tauri/src/lib.rs, src-tauri/Cargo.toml, vite.config.ts]
key-decisions:
  - "Relied on Tauri 2's built-in serialization for command error return values instead of a custom `InvokeError` conversion."
  - "Locked Vite build output to Chromium because OptiHub is explicitly Windows-only."
patterns-established:
  - "All frontend-to-backend calls should go through `src/lib/tauri.ts` wrappers."
  - "Rust command response structs use `snake_case` fields plus `#[serde(rename_all = \"camelCase\")]` for TypeScript consumption."
requirements-completed: [UIUX-01]
duration: 16 min
completed: 2026-04-03
---

# Phase 1 Plan 03: IPC Foundation Summary

**Rust command modules, typed invoke helpers, and a live Home page backend status card now prove the OptiHub desktop shell can talk to Tauri safely**

## Performance

- **Duration:** 16 min
- **Started:** 2026-04-03T03:58:00Z (approx)
- **Completed:** 2026-04-03T04:14:00Z (approx)
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Added the first command module pair: `greet` and `get_system_info`.
- Added typed frontend IPC wrappers and shared TypeScript interfaces for command results and serialized errors.
- Upgraded Home into a persistent backend health card that shows greeting text, app version, platform, and online/offline status.

## Task Commits

Task-level git commits were intentionally skipped in this workspace pass because the repository began with unrelated dirty/untracked state and overlapping plan files. Verification was performed against the working tree instead.

## Files Created/Modified
- `src-tauri/src/commands/system.rs` - First Tauri commands and `SystemInfo` payload
- `src-tauri/src/errors.rs` - Serializable `AppError` enum for frontend-safe command failures
- `src-tauri/src/lib.rs` - Command registration via `invoke_handler`
- `src/lib/tauri.ts` - Typed `invoke` wrapper plus command helpers
- `src/types/ipc.ts` - Shared IPC payload and error interfaces
- `src/pages/HomePage.tsx` - Runtime backend status card with loading, ready, and error states
- `vite.config.ts` - Windows-targeted production build target for the desktop app

## Decisions Made
- Kept both a string-returning command (`greet`) and a structured payload command (`get_system_info`) so downstream phases have examples of each IPC shape.
- Treated verification-time tooling fixes as part of the plan because they were required to make the Windows desktop build truthful.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Removed a conflicting custom `InvokeError` conversion**
- **Found during:** Task 1 (Create Rust command module with error handling)
- **Issue:** Tauri 2 already implements `From<T>` for serializable command errors, so the manual `From<AppError>` impl caused a conflicting trait error.
- **Fix:** Removed the manual conversion and relied on the framework's built-in serialization for `AppError`.
- **Files modified:** `src-tauri/src/errors.rs`
- **Verification:** `cargo check` passed after the conflicting impl was removed.

**2. [Rule 3 - Blocking] Added explicit `esbuild` support and narrowed the build target to Chromium**
- **Found during:** Verification (frontend build)
- **Issue:** Vite 8 + Tailwind 4 required `esbuild` to be installed explicitly in this workspace, and the mixed Safari target triggered unsupported transforms for Windows-only desktop output.
- **Fix:** Added `esbuild` as a dev dependency and set `vite.config.ts` build target to `chrome105`.
- **Files modified:** `package.json`, `pnpm-lock.yaml`, `vite.config.ts`
- **Verification:** `pnpm build` completed successfully after the dependency and target change.

**3. [Rule 3 - Blocking] Verified Cargo in a temp target directory to bypass Windows file locking**
- **Found during:** Verification (Rust backend check)
- **Issue:** In-repo Cargo target directories repeatedly hit Windows access/file-lock errors during verification.
- **Fix:** Re-ran `cargo check` with `CARGO_TARGET_DIR` pointed at a temp directory and `CARGO_INCREMENTAL=0`.
- **Files modified:** none (verification environment only)
- **Verification:** `cargo check` finished successfully from the temp target directory.

---

**Total deviations:** 3 auto-fixed (1 missing critical, 2 blocking)
**Impact on plan:** All deviations were verification-enabling fixes that kept the phase within original scope.

## Issues Encountered
- The short `pnpm tauri dev --no-watch` smoke run needed a longer settle window, but it ultimately launched an `optihub` process successfully before cleanup.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Future detection phases can add Rust commands under `src-tauri/src/commands/` and mirror them in `src/lib/tauri.ts`.
- Home and Diagnostics already have a live IPC pattern to build on for hardware details.

---
*Phase: 01-foundation-app-shell*
*Completed: 2026-04-03*
