# Phase 2: Hardware Detection - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Detect CPU, GPU, RAM, VRAM, and monitor specs via Rust backend, display them on a Diagnostics page with grouped cards, provide a compact summary widget on the Home page, and support manual monitor override as a first-class flow. All detection happens in Rust via async IPC commands.

</domain>

<decisions>
## Implementation Decisions

### Diagnostics Page Presentation
- **D-01:** Use grouped cards layout — one card per hardware category (CPU, GPU, Memory, Display). Not a dense technical table, not a GPU-Z/HWiNFO clone.
- **D-02:** Each card shows model/name prominently with a small set of key values:
  - CPU: model, core/thread count
  - GPU: model, VRAM
  - Memory: total RAM
  - Display: resolution, refresh rate
- **D-03:** Keep detail level moderate for v1. No full low-level technical dumps. An expandable "more details" section is acceptable as a future enhancement but not required for v1.

### Home Page Summary Widget
- **D-04:** Compact summary — small cards or rows, one per component (CPU, GPU, RAM, Display).
- **D-05:** Each item shows only the most useful high-level value (e.g., "Ryzen 7 5800X", "RTX 4070 12GB", "32 GB", "2560×1440 @ 144Hz").
- **D-06:** Home summary is for quick orientation only — Diagnostics page is the source of truth for full hardware details.

### Manual Monitor Override Flow
- **D-07:** Monitor override lives directly on the Diagnostics page in the Display card — not hidden in Settings.
- **D-08:** Manual override is a normal, supported flow — not just error recovery.
- **D-09:** Show detected display values first, then allow the user to switch to manual override.
- **D-10:** State must be explicit with clear labels: "Detected" vs "Manual override active".
- **D-11:** Use inline edit or a small local form section in the Display card — no separate modal.
- **D-12:** User can: enable override, set resolution, set refresh rate, reset back to detected values.

### Unknown / Unavailable Data Behavior
- **D-13:** Never guess or fabricate values. Use explicit labels: "Unknown", "Unavailable", "Not detected".
- **D-14:** Show source/status for each field: "Detected", "Overridden", "Unavailable".
- **D-15:** If only part of a category is known, still show the card — fill unknown fields explicitly rather than hiding the entire section.
- **D-16:** UI must clearly distinguish: real detected data, user-provided override data, and missing data.

### Data Model & Architecture
- **D-17:** Frontend receives a normalized hardware snapshot model via IPC — not raw tool-specific output. The Rust backend normalizes before sending.
- **D-18:** Prefer stable, reliable fields over ambitious but inconsistent fields.
- **D-19:** For v1, prioritize correctness and clarity over exhaustive hardware detail.

### Agent's Discretion
- Exact Rust struct field names and serialization details
- Choice of specific crate versions (sysinfo, wmi, nvml-wrapper)
- Internal detection ordering and fallback logic
- Exact card styling within design system tokens
- Loading/skeleton states while hardware is being detected

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Architecture
- `.planning/research/ARCHITECTURE.md` — Two-process model, IPC patterns, hardware module definition
- `.planning/research/STACK.md` — Confirmed crates: sysinfo, wmi, nvml-wrapper (optional)

### Requirements
- `.planning/REQUIREMENTS.md` §Hardware Detection — HDWR-01 through HDWR-06 definitions
- `.planning/REQUIREMENTS.md` §Hardware Detection — HDWR-04/05 monitor override as normal flow

### Design System
- `.planning/phases/01-foundation-app-shell/01-02-PLAN.md` — Design tokens, card styling patterns, color variables

### Pitfalls
- `.planning/research/PITFALLS.md` — IPC blocking risk, async command requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Design system tokens defined in Phase 1 (01-02-PLAN.md): `--color-bg-surface`, `--radius-md`, `--color-border-subtle` — use for hardware cards
- IPC patterns from Phase 1 (01-03-PLAN.md): `tauriInvoke<T>()` wrapper, `AppError` type, `#[serde(rename_all = "camelCase")]` convention

### Established Patterns
- Async Tauri commands with `Result<T, AppError>` return type
- TypeScript types in `src/types/ipc.ts` mirroring Rust structs
- Zustand for UI state, Rust backend authoritative for system data

### Integration Points
- DiagnosticsPage.tsx placeholder (created in Phase 1) — replace with full hardware view
- HomePage.tsx (created in Phase 1) — add hardware summary widget alongside IPC health indicator
- `src-tauri/src/commands/mod.rs` — add `pub mod hardware;` module

</code_context>

<specifics>
## Specific Ideas

- Hardware cards should feel like the grouped card approach seen in modern system info panels (Windows 11 System > About, or Steam's system info) — clean, not cluttered
- Status badges on each field ("Detected", "Overridden", "Unavailable") should use the design system status colors: safe green for detected, accent for overridden, muted for unavailable

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-hardware-detection*
*Context gathered: 2026-04-03*
