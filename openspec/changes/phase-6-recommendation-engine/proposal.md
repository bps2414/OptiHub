# Phase 6 — Recommendation Engine

## Summary

Phase 5 built the foundation: hardware profile (Phase 2), game library (Phase 3), and tool detection state (Phase 5) are all now available in-process. Phase 6 connects these three data sources into a **Recommendation Engine** — a deterministic, reasoning-transparent layer that, for each game, emits exactly one recommendation outcome: a tool path, a native config path, a combined path, or an explicit "no safe recommendation" outcome, each with confidence and rationale.

The core value of OptiHub is the one-guided-flow promise: *find and apply the best optimization path for their game and hardware, apply it safely with a preview, and undo it anytime.* Phase 6 delivers the "find the best path" step backed by real hardware awareness and real tool availability data. Phases 7 and 8 depend on this output to drive preset selection and apply/restore flows.

> **Note:** The recommendation engine should not conflate native config paths with tool paths — these are distinct capability families that the engine selects between. Native config support (Phase 10, MVP-extended) will deepen the native config branch as a downstream input to the engine.

## Problem

Without a recommendation engine, users must understand the fragmented optimization ecosystem themselves: which tool works with their GPU, which tools conflict, what risk level is acceptable. OptiHub currently collects all the relevant evidence but produces no actionable output from it. The game detail view has no "what should I use?" answer.

## Affected Systems

- `src-tauri/src/` — new `recommendation/` module (pure Rust, no I/O side effects)
- `src-tauri/src/commands/recommendations.rs` — IPC facade (thin)
- `src/stores/recommendations.ts` — Zustand store
- `src/pages/OptimizationsPage.tsx` — primary surface for per-game recommendations
- `src/components/games/GameDetailView.tsx` — inline recommendation summary panel
- `openspec/specs/recommendation-engine/spec.md` — existing upstream requirements

## Motivation

- **Phase 5 readiness gate**: Phase 5 produces `tool_sources`, `tool_deployments`, and `TOOL_CATALOG` — all the inputs the engine needs. Phase 6 is now unblocked.
- **User value**: A user who has just scanned their game library gets zero actionable output today. Phase 6 turns detection state into a recommendation they can act on.
- **Phase 7 dependency**: Preset selection (Phase 7) needs to know which tool was recommended and at what confidence before it can offer hardware-calibrated Quality/Balanced/Performance options.
- **Risk transparency**: Each recommendation carries a risk level (`safe / limited / experimental`) and a plain-language rationale string. The user is never asked to trust a recommendation they cannot read.

## Out of Scope

- Preset parameter generation or hardware-tuned preset values (Phase 7)
- Applying or reverting any tool configuration (Phase 8)
- Downloading, installing, or deploying any tool binary (Phase 5 concern)
- Machine learning or external recommendation APIs — the engine is deterministic rule-based
- Game-specific community override rules (v2/future)
