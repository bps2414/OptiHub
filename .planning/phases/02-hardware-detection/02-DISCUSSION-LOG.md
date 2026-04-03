# Phase 2: Hardware Detection - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 02-hardware-detection
**Areas discussed:** Diagnostics page presentation, Home summary widget, Manual monitor override flow, Unknown/unavailable data behavior

---

## Diagnostics Page Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Grouped cards | One card per hardware category (CPU, GPU, Memory, Display) | ✓ |
| Dense technical table | GPU-Z/HWiNFO-style full spec table | |
| Mixed layout | Cards with expandable technical details | |

**User's choice:** Grouped cards — moderate detail, not low-level dumps
**Notes:** Each card shows model/name prominently + small set of key values. Expandable "more details" acceptable as future enhancement but not v1.

---

## Home Summary Widget

| Option | Description | Selected |
|--------|-------------|----------|
| Compact card/rows | One row per component, high-level value only | ✓ |
| Mini dashboard | Multiple stats per component in dense grid | |
| Inline text | Simple text summary paragraph | |

**User's choice:** Compact cards/rows — for quick orientation only, diagnostics is source of truth
**Notes:** CPU, GPU, RAM, Display — each shows only the most useful high-level value.

---

## Manual Monitor Override Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Inline edit on Diagnostics | Override directly in Display card with inline form | ✓ |
| Separate modal | Pop up modal to set resolution/Hz | |
| Settings page only | Move override to Settings | |

**User's choice:** Inline edit on Diagnostics page — normal flow, not error recovery
**Notes:** Show detected first, allow switch to override. Explicit state labels: "Detected" vs "Manual override active". User can enable override, set resolution, set Hz, reset to detected.

---

## Unknown / Unavailable Data Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit labels | Show "Unknown" / "Unavailable" / "Not detected" | ✓ |
| Hide unknown | Hide sections with incomplete data | |
| Best-guess | Infer or estimate missing values | |

**User's choice:** Explicit labels — never guess or fabricate
**Notes:** Show source/status per field (Detected / Overridden / Unavailable). Show partial cards with unknown fields explicit. UI clearly distinguishes real data, user overrides, and missing data.

---

## Agent's Discretion

- Exact Rust struct field names and serialization
- Crate version selection (sysinfo, wmi, nvml-wrapper)
- Internal detection ordering and fallback logic
- Card styling within design system tokens
- Loading/skeleton states during detection

## Deferred Ideas

None
