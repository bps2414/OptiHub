## Why

Phase 3 established the game library, but OptiHub has no model for optimization tools — the three supported tools (OptiScaler, Special K, Lossless Scaling) have fundamentally different integration models that a generic installed/missing state cannot represent. We need to model each tool accurately before Phase 6 can build recommendations on top of them.

## What Changes

- Introduce a typed tool registry in the Rust backend that models each supported tool by its real integration workflow: per-game deployment (OptiScaler), global/injection-style integration (Special K), and licensed Steam-only detection (Lossless Scaling).
- Add per-game deployment tracking for OptiScaler: detect whether it is deployed near the game executable, identify the build/channel, and support official acquisition plus manual local archive/path registration with explicit provenance.
- Add global integration tracking for Special K: detect installation, version, and status; expose the official acquisition path and any officially supported release channels.
- Add Lossless Scaling detection via the user's Steam library (App ID 993090) only — no redistribution, no unofficial acquisition path.
- For every tool record, record and surface: official source URL, credits/author, version/build, license/compliance notes, and release channel where relevant.
- Build the Tools management UI page that distinguishes global tool state, local source registration, and per-game deployment state as separate concepts.

## Capabilities

### New Capabilities
- `tool-registry`: Core data model, Rust commands, and SQLite persistence for supported tool metadata — integration type, global install state, local source registrations, per-game deployment records, version/channel/provenance/compliance fields.
- `optiscaler-integration`: Per-game OptiScaler deployment detection, official acquisition flow, and manual local archive/path registration with provenance tracking.
- `specialk-integration`: Global Special K detection, version/status tracking, official acquisition path, and release channel visibility.
- `lossless-scaling-integration`: Steam-library-only detection of Lossless Scaling (App ID 993090) with no unofficial acquisition or redistribution path.
- `tools-ui`: Tools management page that presents global install state, local sources, and per-game deployment as separate concepts with compliance indicators.

### Modified Capabilities
- `game-library`: Extend the game record payload to carry per-game tool deployment summaries (for use in the library and game detail surfaces).

## Impact

- Backend: new `src-tauri/src/commands/tools.rs` (or `tools/` module), schema additions to `src-tauri/src/db.rs`, and integration with the existing game detection commands for per-game deployment lookups.
- Frontend: new `src/pages/ToolsPage.tsx`, new `src/components/tools/` subtree, store additions in `src/stores/tools.ts`, IPC type extensions in `src/types/ipc.ts`, and i18n keys in `src/i18n/messages.ts`.
- Data: SQLite schema additions for `tools`, `tool_sources`, and `tool_deployments` tables.
- Compliance: Lossless Scaling integration is detection-only (Steam library); no binary, archive, or unofficial mirror path is ever exposed.
