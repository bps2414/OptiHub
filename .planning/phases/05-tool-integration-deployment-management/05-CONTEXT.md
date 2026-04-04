# Phase 5: Tool Integration & Deployment Management - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 manages third-party tool integration records and visibility, not just generic detection. It must represent real tool models: OptiScaler as a per-game deployment-capable integration, Special K as a mostly global integration, and Lossless Scaling as a licensed Steam-only detection path. Phase 5 depends on the game library created in Phase 3 for per-game state, but Phase 3 itself remains focused on game detection and library management only.

</domain>

<decisions>
## Implementation Decisions

### Integration Model Segmentation
- **D-01:** Do not flatten all tools into a single `installed / missing` model.
- **D-02:** OptiScaler is modeled primarily as a per-game deployment workflow near the target executable, with game-specific state as a first-class concern.
- **D-03:** Special K is modeled primarily as a global integration with optional manual path registration if it improves reliability.
- **D-04:** Lossless Scaling remains a licensed local integration detected via Steam ownership/install state, not a deployable payload managed by OptiHub.

### Source Acquisition And Registration
- **D-05:** OptiScaler must support both official acquisition and explicit user-supplied local archive/path registration.
- **D-06:** Special K must support official acquisition and any officially supported release/update channel, plus manual local path registration if useful.
- **D-07:** Lossless Scaling must never be bundled, mirrored, or redistributed; any optional manual path support must remain a local licensed registration only.

### Deployment, Version, And Channel Visibility
- **D-08:** The Tools UI must distinguish global install state, local source registration, and per-game deployment state as separate concepts.
- **D-09:** OptiScaler should show which build/channel is deployed per game whenever that can be identified reliably.
- **D-10:** Release channel is part of the model for tools where upstream officially exposes channels (for example stable vs nightly/rolling or supported experimental tracks).

### Provenance, Credits, And Compliance
- **D-11:** No piracy, no illegal redistribution, no bundling of proprietary software, and no unofficial mirrors by default.
- **D-12:** Every supported third-party tool record must expose name, author, version/build, official source URL, license/compliance notes, and channel where relevant.
- **D-13:** Provenance must be explicit for every record: official source, user-supplied local source, Steam licensed detection, or unknown/unverified.
- **D-14:** Phase 5 should surface lightweight compliance/provenance metadata in the Tools view, while the dedicated Credits & Licenses experience still belongs to Phase 9.

### Phase Boundary Guardrails
- **D-15:** Phase 3 stays unchanged and remains responsible for game detection, manual executable registration, refresh, removal, and library persistence.
- **D-16:** Phase 5 may consume Phase 3 game records to show per-game deployment state, but it must not absorb recommendation logic (Phase 6) or apply/rollback execution logic (Phase 8).

### Agent's Discretion
- Exact schema split between tool catalog records, source records, and per-game deployment records
- Exact heuristics for identifying deployed OptiScaler build/channel from local files
- Whether optional manual Lossless Scaling path registration is worth shipping in Phase 5, as long as it remains local-only and licensed-user oriented
- Exact UI layout for combining tool overview rows/cards with per-game deployment breakdowns
- Exact wording and interaction pattern for official acquisition actions (open site, copy URL, register local archive, register local path)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope And Requirements
- `.planning/ROADMAP.md` — Phase 5 renamed scope, success criteria, and plan split
- `.planning/REQUIREMENTS.md` — `TOOL-01` through `TOOL-10`, plus compliance requirements `COMP-01` through `COMP-04`
- `.planning/PROJECT.md` — offline-first, no redistribution, official-source bias, and the tool-specific integration model decision

### Prior-Phase Boundary
- `.planning/phases/03-game-detection/03-CONTEXT.md` — Phase 3 boundary and persisted game-library rules that Phase 5 must consume without redefining

### Architecture And Risk Notes
- `.planning/research/ARCHITECTURE.md` — tools module role, database expectations, and tool integration pattern
- `.planning/research/PITFALLS.md` — DLL conflict risks between OptiScaler and Special K plus the Lossless Scaling legal boundary
- `.planning/research/FEATURES.md` — product-level framing for tool integration as a differentiator
- `.planning/research/SUMMARY.md` — project-wide warning that tool-model mismatches are a real planning risk

### Existing App Patterns
- `.planning/phases/01-foundation-app-shell/01-03-PLAN.md` — IPC patterns for new backend/frontend integration commands

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/pages/ToolsPage.tsx` — current placeholder route for the future Tools management surface
- `src/pages/CreditsPage.tsx` — existing placeholder for the dedicated credits/compliance experience that Phase 9 will deepen
- `src/i18n/messages.ts` — current tool/credits copy entries that will need richer provenance/channel/compliance language
- `src/lib/tauri.ts` and `src/types/ipc.ts` — established IPC wrapper/type location for new tool-integration payloads

### Established Patterns
- Routed page placeholders already exist for `/tools` and `/credits`, so Phase 5 can fill the Tools route without inventing new navigation
- Backend-detected/system-derived state is Rust-authored and normalized before it reaches the frontend
- The project already treats compliance as a visible concern from Phase 1 onward, rather than a late afterthought

### Integration Points
- `src/pages/ToolsPage.tsx` — likely home for global tool records, source registration, and per-game deployment summaries
- `src/pages/CreditsPage.tsx` — complementary destination for the fuller credits/licenses experience in Phase 9
- `src-tauri/src/commands/*` and `src-tauri/src/lib.rs` — add tool integration commands and scanning logic here
- Phase 3 game-library persistence/database work — likely source of canonical game IDs/install paths for per-game OptiScaler deployment checks

</code_context>

<specifics>
## Specific Ideas

- The tool model must feel operationally honest: "globally integrated", "registered from local archive", and "deployed for this game" are different states and should not be visually collapsed.
- If upstream terminology differs, the researcher/planner should validate the exact official release-channel names before implementation instead of inventing new labels.
- The current Tools page subtitle ("Detected optimization tools and their status") is too generic for the new model and should later evolve toward integration/provenance language.

</specifics>

<deferred>
## Deferred Ideas

- Actual file deployment, conflict resolution, backup-before-write, and rollback behavior belong to Phase 8 even though Phase 5 should make those future states observable.
- The full Credits & Licenses information architecture and compliance policy presentation still belong to Phase 9, even if Phase 5 surfaces lightweight provenance/compliance metadata.

</deferred>

---

*Phase: 05-tool-integration-deployment-management*
*Context gathered: 2026-04-03*
