---
phase: 02-hardware-detection
plan: 02
subsystem: ui
tags: [react, zustand, vitest, diagnostics, i18n]
requires:
  - phase: 02-01
    provides: Normalized hardware snapshot command and TypeScript IPC contracts
provides:
  - Diagnostics hardware cards for CPU, GPU, Memory, and Display
  - Inline manual display override flow with persisted frontend state
  - Home hardware summary widget synced with the effective display snapshot
affects: [home, diagnostics, recommendations, presets]
tech-stack:
  added: [none]
  patterns: [persisted display override store, grouped hardware cards, bilingual hardware copy]
key-files:
  created: [src/lib/hardware.ts, src/stores/hardware.ts, src/components/hardware/HardwareCard.tsx, src/components/hardware/HardwareSummaryWidget.tsx, src/components/hardware/DisplayOverrideForm.tsx, src/pages/DiagnosticsPage.test.tsx, src/components/hardware/DisplayOverrideForm.test.tsx, src/pages/HomePage.hardware.test.tsx]
  modified: [src/i18n/messages.ts, src/pages/DiagnosticsPage.tsx, src/pages/HomePage.tsx, src/index.css]
key-decisions:
  - "Persisted the display override in a dedicated hardware store so override state survives shell reloads without mutating detected hardware data."
  - "Kept all new hardware copy inside the existing EN/PT-BR catalog instead of introducing page-local strings."
patterns-established:
  - "Diagnostics and Home both read from the same hardware store and effective display helper."
  - "Hardware status pills derive from explicit `detected` / `overridden` / `unavailable` states."
requirements-completed: [HDWR-01, HDWR-02, HDWR-03, HDWR-04, HDWR-05, HDWR-06]
duration: 18min
completed: 2026-04-03
---

# Phase 2 Plan 02: Hardware UI Summary

**Grouped Diagnostics hardware cards, persisted display override flow, and Home summary widget**

## Performance

- **Duration:** 18 min
- **Started:** 2026-04-03T18:44:00Z (approx)
- **Completed:** 2026-04-03T19:02:00Z (approx)
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments
- Replaced the Diagnostics placeholder with grouped CPU, GPU, Memory, and Display cards backed by live hardware snapshot state.
- Added a persisted manual display override flow with explicit detected / override / unavailable states.
- Added a Home hardware summary widget and focused frontend tests for Diagnostics, Home, and the override form.

## Task Commits

Task-level git commits were intentionally skipped in this workspace pass because the repository remains dirty/untracked and Phase 2 is being executed inline in the existing working tree. Verification was performed against the working tree instead.

## Files Created/Modified
- `src/lib/hardware.ts` - Hardware formatting and effective display projection helpers
- `src/stores/hardware.ts` - Hardware load state plus persisted display override store
- `src/components/hardware/HardwareCard.tsx` - Reusable grouped-card wrapper for diagnostics content
- `src/components/hardware/HardwareSummaryWidget.tsx` - Compact Home summary widget
- `src/components/hardware/DisplayOverrideForm.tsx` - Inline manual display override controls
- `src/pages/DiagnosticsPage.tsx` - Live grouped hardware cards and inline display override flow
- `src/pages/HomePage.tsx` - Hardware summary widget added below the IPC status card
- `src/i18n/messages.ts` - EN + PT-BR hardware labels, statuses, and override copy
- `src/index.css` - Hardware card, summary, status pill, and action styles
- `src/pages/DiagnosticsPage.test.tsx` - Diagnostics hardware rendering regression test
- `src/components/hardware/DisplayOverrideForm.test.tsx` - Override apply/reset regression test
- `src/pages/HomePage.hardware.test.tsx` - Home hardware summary regression test

## Decisions Made
- Used Zustand `persist` with partial state so only display override survives reloads; detection results remain live and reloadable.
- Shared one effective-display helper between Diagnostics and Home so the override semantics stay consistent.
- Kept the Home IPC card untouched and layered the hardware summary underneath it instead of merging the concerns into one card.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 3 and later recommendation / preset work can reuse the hardware snapshot and Home summary state already on the shell.
- Hardware UI patterns (grouped cards, status pills, persisted override) are now in place for downstream diagnostics and recommendations work.

---
*Phase: 02-hardware-detection*
*Completed: 2026-04-03*
