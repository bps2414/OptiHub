## 1. Rust Module Structure

- [ ] 1.1 Create `src-tauri/src/tools/` directory with `mod.rs`, `types.rs`, `service.rs`, `optiscaler.rs`, `special_k.rs`, `lossless_scaling.rs`, `windows.rs`
- [ ] 1.2 Create `src-tauri/src/commands/tools.rs` as thin facade (IPC DTOs + Tauri command handlers only; all logic delegated to `crate::tools::*`)
- [ ] 1.3 Declare `mod tools;` in `lib.rs` and add `pub mod tools;` chain so all sub-modules are reachable

## 2. Type Definitions & Catalog

- [ ] 2.1 Define exhaustive `ToolId` enum (`OptiScaler`, `SpecialK`, `LosslessScaling`) in `tools/types.rs` — no `#[non_exhaustive]`; exhaustive matches enforce handling of every tool at compile time
- [ ] 2.2 Define `OfficialSource { label: &'static str, url: &'static str }` and `ToolCatalogEntry { id, display_name, integration_kind, author, license_notes, official_sources: &'static [OfficialSource], redistribution_policy }` in `tools/types.rs`
- [ ] 2.3 Define detection state types in `tools/types.rs`: `OptiScalerDetectionState` (variants: `Confirmed`, `Partial`, `Ambiguous`, `NotFound`), `SpecialKDetectionState`, `LosslessScalingDetectionState`
- [ ] 2.4 Define `TOOL_CATALOG: &[ToolCatalogEntry]` constant array in `tools/types.rs` with all three tools: OptiScaler (GitHub Releases + NexusMods sources), Special K (official release source), Lossless Scaling (Steam store reference only)
- [ ] 2.5 Define IPC DTOs in `commands/tools.rs`: `IpcOfficialSource`, `IpcToolSource`, `IpcToolDeployment`, `IpcToolOverviewItem`, `IpcToolsOverview`; all derive `Serialize`

## 3. Database Schema

- [ ] 3.1 Add `tool_sources` table migration: `id TEXT PK, tool_id TEXT NOT NULL, provenance TEXT NOT NULL (official_release|user_local|steam_owned), path_or_url TEXT, version TEXT, channel TEXT, registered_at TEXT NOT NULL`; `tool_id` is a plain string matching ToolId values — no FK to a tools table
- [ ] 3.2 Add `tool_deployments` table migration: `id TEXT PK, tool_id TEXT NOT NULL, game_id TEXT NOT NULL, confidence TEXT NOT NULL (confirmed|partial|ambiguous|not_found), dll_signals_found TEXT (JSON array of filenames), ini_found INTEGER NOT NULL DEFAULT 0, ini_valid INTEGER NOT NULL DEFAULT 0, version TEXT, channel TEXT, detected_at TEXT NOT NULL`
- [ ] 3.3 Add indexes: `tool_sources(tool_id)`, `tool_deployments(game_id)`, `tool_deployments(tool_id, game_id)` — last one for Phase 6 lookup performance
- [ ] 3.4 Wire both table migrations into the existing `ensure_*` / `execute_batch` pattern used in `commands/games.rs` (called at command entry before each operation)

## 4. Rust Backend — Service Layer & Registry Commands

- [ ] 4.1 Implement `tools/service.rs`: `build_tools_overview(conn) -> Result<IpcToolsOverview>` — merges TOOL_CATALOG entries with `tool_sources` rows from DB and latest detection state per tool
- [ ] 4.2 Implement `get_tools_overview` Tauri command in `commands/tools.rs`: open DB, call `service::build_tools_overview`, return result
- [ ] 4.3 Implement `register_tool_source` command: validate path exists (local) or URL format (official), insert `tool_sources` row, return updated `IpcToolOverviewItem` for the affected tool
- [ ] 4.4 Implement `remove_tool_source` command: delete `tool_sources` row by source id, return updated `IpcToolOverviewItem`
- [ ] 4.5 Implement `refresh_tool_detection` command: invoke all three detection routines, upsert their respective DB records, return updated `IpcToolsOverview`
- [ ] 4.6 Register all five commands in `lib.rs` invoke handler

## 5. Rust Backend — OptiScaler Detection

- [ ] 5.1 Implement `tools/optiscaler.rs`: `detect(install_dir: &Path) -> OptiScalerDetectionState` — scan `install_dir/`, `install_dir/plugins/`, `install_dir/reframework/plugins/` for: `OptiScaler.ini`, `OptiScaler.dll`, `OptiScaler.asi`; and the upstream-confirmed loader names: `dxgi.dll`, `winmm.dll`, `d3d12.dll`, `dbghelp.dll`, `version.dll`, `wininet.dll`, `winhttp.dll`. Do NOT include `nvngx.dll` or `nvngx_dlss.dll` in the scan list.
- [ ] 5.2 Implement INI validation helper: attempt to read `OptiScaler.ini` and confirm presence of a `[OptiScaler]` section header; returns `IniState::Valid`, `IniState::Invalid`, or `IniState::Absent`
- [ ] 5.3 Apply confidence scoring: emit `Confirmed` (INI valid + loader or `OptiScaler.dll`/`.asi` present), `Partial` (INI without loader, or INI unreadable/malformed, or `.dll`/`.asi` without INI), `Ambiguous` (only generic loader DLL name without INI), `NotFound`
- [ ] 5.4 Implement `get_tool_deployments_for_game` command: receive `game_id`, look up `install_dir` from game DB record, run `optiscaler::detect`, upsert `tool_deployments` row, return `IpcToolDeployment`
- [ ] 5.5 Implement channel tagging: map version markers from PE metadata or INI content to `stable|nightly|unknown` channel labels; include in deployment record

## 6. Rust Backend — Windows Helpers

- [ ] 6.1 Implement `tools/windows.rs`: `read_registry_string(hive: HKEY, subkey: &str, value_name: &str) -> Option<String>` using the `winreg` crate already present in `Cargo.toml`

## 7. Rust Backend — Special K Detection

- [ ] 7.1 Implement `tools/special_k.rs`: `detect() -> SpecialKDetectionState` — check `%PROGRAMDATA%\SK_Res`, `%APPDATA%\SpecialK` for version markers and `HKCU\Software\Kaldaien\SpecialK` registry hive via `windows::read_registry_string`
- [ ] 7.2 Wire Special K detection into `refresh_tool_detection`; store result as runtime detection state (not in `tool_sources` — global install state only)

## 8. Rust Backend — Lossless Scaling Detection

- [ ] 8.1 Implement `tools/lossless_scaling.rs`: `detect() -> LosslessScalingDetectionState` — reuse or expose a helper from the existing `scan_steam_snapshot` in `commands/games.rs` to check manifests for App ID `993090`
- [ ] 8.2 Wire Lossless Scaling detection into `refresh_tool_detection`: insert `tool_sources` row with provenance `steam_owned` when detected; delete it when not found
- [ ] 8.3 Audit: confirm no download path, install path, or unofficial URL is ever persisted or returned anywhere in the Lossless Scaling code path

## 9. Frontend — IPC Types & Store

- [ ] 9.1 Add IPC types to `src/types/ipc.ts`: `OfficialSource`, `ToolSource`, `ToolDeployment` (with `confidence: 'confirmed'|'partial'|'ambiguous'|'not_found'`), `ToolOverviewItem`, `ToolsOverview`
- [ ] 9.2 Create `src/stores/tools.ts` Zustand store: fields `tools: ToolOverviewItem[]`, `deployments: Map<string, ToolDeployment>`, `selectedToolId: string | null`, `loading: boolean`, `error: AppError | null`
- [ ] 9.3 Add store actions: `fetchToolsOverview`, `registerToolSource`, `removeToolSource`, `refreshToolDetection`, `fetchDeploymentsForGame`, `selectTool`
- [ ] 9.4 Add Tauri invoke wrappers in `src/lib/tauri.ts` for all five new commands
- [ ] 9.5 Add i18n keys for all new Tools UI strings in `src/i18n/messages.ts` (EN + PT-BR)

## 10. Frontend — Tools UI Page & Components

- [ ] 10.1 Create `src/components/tools/ToolsOverviewStrip.tsx`: visual-only status row showing detection badges for all 3 tools; purely decorative, no click/navigation behavior
- [ ] 10.2 Create `src/components/tools/ToolNavList.tsx`: compact left column with 3 fixed navigation buttons, each with tool name and status badge; clicking dispatches `selectTool` in store
- [ ] 10.3 Create `src/components/tools/ToolDetailPanel.tsx`: renders selected tool's name, author, license note, detection status badge, "How detected" explanation text, official sources list, user sources list, per-game deployments (OptiScaler only), and action buttons
- [ ] 10.4 Create `src/components/tools/OfficialSourceList.tsx`: renders one CTA button per `OfficialSource` entry; each opens the URL via Tauri shell open; label comes from `source.label`
- [ ] 10.5 Create `src/components/tools/ToolSourceList.tsx`: renders user-registered `tool_sources` rows with provenance badge and individual remove action; shows empty state when no sources registered
- [ ] 10.6 Create `src/components/tools/OptiScalerDeployments.tsx`: per-game deployment list; each row shows game name, confidence badge, channel, and provenance; calls `fetchDeploymentsForGame` when row is expanded
- [ ] 10.7 Create `src/components/tools/RegisterSourceDialog.tsx`: modal for local path registration via file picker (Tauri dialog plugin); provenance automatically `user_local`; only shown for tools supporting local registration (OptiScaler, Special K)
- [ ] 10.8 Update `src/pages/ToolsPage.tsx`: mount `fetchToolsOverview` on load; compose `ToolsOverviewStrip` + `ToolNavList` + `ToolDetailPanel`; add refresh button triggering `refreshToolDetection`
- [ ] 10.9 Wire `useToolsStore` to all sub-components; ensure loading, empty (no tool selected), and error states are handled throughout

## 11. Frontend — Game Library Integration

- [ ] 11.1 Update game detail view (Phase 4 surface) to call `fetchDeploymentsForGame` when a game is selected and render a compact OptiScaler deployment summary section in the detail panel
- [ ] 11.2 Add i18n keys for tool deployment summary labels in the game detail view (EN + PT-BR)

## 12. Verification

- [ ] 12.1 Confirm `TOOL_CATALOG` constants compile correctly with all three `ToolId` variants, correct `official_sources` entries (OptiScaler has 2), and compliance notes
- [ ] 12.2 Confirm OptiScaler detection emits `Confirmed` for a directory with valid `OptiScaler.ini` + loader, `Partial` for INI-only or `.dll`-only, `Ambiguous` for lone generic DLL, `NotFound` for clean directory
- [ ] 12.3 Confirm Special K detection returns a valid state (or graceful `NotDetected`) with and without an SK install present on the test machine
- [ ] 12.4 Confirm Lossless Scaling returns `DetectedViaSteam` when App ID 993090 ACF is present, `NotFound` otherwise; confirm no unofficial URL appears in any response
- [ ] 12.5 Confirm `register_tool_source` stores a `user_local` source and `remove_tool_source` deletes it; confirm `tool_id` text matches `ToolId` string serialization
- [ ] 12.6 Confirm Tools page renders overview strip (no navigation), 3-item nav list, and detail panel with correct detection state, compliance note, and multiple official source CTAs for OptiScaler
- [ ] 12.7 Confirm no Lossless Scaling download path, install path, or unofficial URL appears anywhere in the UI or IPC response
- [ ] 12.8 Confirm all UI strings render correctly in both EN and PT-BR
