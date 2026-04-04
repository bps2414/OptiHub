---
phase: 02-hardware-detection
plan: 01
subsystem: api
tags: [tauri, rust, sysinfo, wmi, windows, ipc]
requires:
  - phase: 01-03
    provides: Typed IPC wrappers and Rust command registration patterns
provides:
  - Normalized `get_hardware_snapshot` Rust command for CPU, GPU, memory, and display data
  - Shared TypeScript IPC contracts for hardware snapshot payloads
  - Deterministic Rust tests for hardware normalization helpers
affects: [diagnostics, home, recommendations, presets]
tech-stack:
  added: [sysinfo, wmi, windows, windows-core]
  patterns: [single-snapshot hardware IPC, nullable hardware payloads, pure normalization helper tests]
key-files:
  created: [src-tauri/src/commands/hardware.rs]
  modified: [src-tauri/Cargo.toml, src-tauri/src/commands/mod.rs, src-tauri/src/lib.rs, src/types/ipc.ts, src/lib/tauri.ts]
key-decisions:
  - "Kept the Rust payload detection-only and left manual display override to the frontend store for this phase."
  - "Returned nullable hardware fields instead of fabricated defaults so the UI can surface explicit Unavailable states."
  - "Pinned `sysinfo` to 0.37.2 to avoid the `windows_core` version split that blocked `wmi 0.18.4` in this workspace."
patterns-established:
  - "Hardware detection flows through one `get_hardware_snapshot` command instead of per-card IPC calls."
  - "Rust normalization helpers stay pure and testable; live WMI / Win32 calls sit behind the command boundary."
requirements-completed: [HDWR-01, HDWR-02, HDWR-03, HDWR-04, HDWR-05]
duration: 24min
completed: 2026-04-03
---

# Phase 2 Plan 01: Hardware Detection Backend Summary

**Rust hardware snapshot command with sysinfo, WMI, Win32 display enumeration, and typed IPC contracts**

## Performance

- **Duration:** 24 min
- **Started:** 2026-04-03T18:20:00Z (approx)
- **Completed:** 2026-04-03T18:44:00Z (approx)
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Added a single `get_hardware_snapshot` backend command that returns normalized CPU, GPU, memory, and display data in one payload.
- Extended the shared TypeScript IPC layer with `HardwareSnapshot` and `getHardwareSnapshot()`.
- Added deterministic Rust tests for CPU, GPU, and display normalization so future hardware changes have a regression net.

## Task Commits

Task-level git commits were intentionally skipped in this workspace pass because the repository remains dirty/untracked and Phase 2 is being executed inline in the existing working tree. Verification was performed against the working tree instead.

## Files Created/Modified
- `src-tauri/src/commands/hardware.rs` - Hardware snapshot structs, best-effort detection helpers, Win32 display enumeration, and Rust unit tests
- `src-tauri/Cargo.toml` - Added Phase 2 hardware dependencies and compatibility pins
- `src-tauri/src/commands/mod.rs` - Exported the hardware command module
- `src-tauri/src/lib.rs` - Registered `get_hardware_snapshot` in the Tauri invoke handler
- `src/types/ipc.ts` - Added hardware snapshot interfaces for the frontend
- `src/lib/tauri.ts` - Added the typed `getHardwareSnapshot()` wrapper

## Decisions Made
- Kept hardware detection best-effort and nullable instead of failing the whole snapshot on partial probe issues.
- Used direct Win32 display enumeration for active mode data instead of trusting WMI monitor fields.
- Preserved frontend ownership of manual display override so Phase 2 did not need a broader backend settings subsystem.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Downgraded `sysinfo` to a compatible line for `wmi 0.18.4`**
- **Found during:** Task 1 (Add Phase 2 hardware dependencies and shared IPC contracts)
- **Issue:** `sysinfo 0.38.4` pulled the `windows 0.62.x` family while `wmi 0.18.4` resolved against `windows 0.61.x`, which caused `windows_core` trait mismatches and blocked compilation before the new tests even ran.
- **Fix:** Pinned `sysinfo` to `0.37.2` and aligned the direct Windows bindings to the `0.61.x` line already used by Tauri / WMI in this workspace.
- **Files modified:** `src-tauri/Cargo.toml`
- **Verification:** `cargo test --manifest-path src-tauri/Cargo.toml hardware::tests -- --nocapture` stopped failing on dependency resolution and began failing only on the intended `todo!()` test targets, then passed after implementation.

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The dependency pin changed the exact crate minor line but preserved the planned architecture and kept the implementation inside Phase 2 scope.

## Issues Encountered
- The `wmi` crate's wide `windows` / `windows-core` version ranges produced an internal mismatch when paired with `sysinfo 0.38.x` in this workspace. The issue was resolved during execution by aligning to the compatible `0.61.x` Windows family.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Diagnostics and Home can now consume one normalized hardware snapshot instead of composing multiple backend calls.
- The frontend can build manual display override and hardware summary UI without changing the backend contract again.

---
*Phase: 02-hardware-detection*
*Completed: 2026-04-03*
