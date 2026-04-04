## Context

Phase 3 established the game library (SQLite-backed, Steam + manual). The Tools page currently renders nothing functional — it is a sidebar-registered placeholder. The three supported tools have radically different integration shapes:

- **OptiScaler**: per-game deployment (DLL + config files near a game executable). No global install concept. Can be sourced from official GitHub releases, NexusMods, or a user-supplied local archive/path.
- **Special K**: global injection service (SpecialK64/32, global whitelist). Has an official installer/zip, stable and experimental channels. Per-game it can be enabled/disabled but the tool itself is a single global integration.
- **Lossless Scaling**: commercially licensed through Steam (App ID 993090). No binary redistribution allowed. Detection-only.

Phase 5 must lay the data and command foundation that Phase 6 (Recommendation Engine) will query.

## Goals / Non-Goals

**Goals:**
- Model each tool's integration type and persistence requirements without a one-size-fits-all schema.
- Detect and surface tool state that Phase 6 can consume to build hardware-aware recommendations.
- Let users register official or local tool sources with provenance so every tool record is compliant-auditable.
- Build a Tools UI that exposes global state, local source registrations, and per-game deployment as distinct layers.

**Non-Goals:**
- Automatic background download or installation of any tool binary — user initiates all acquisitions.
- Per-game enable/disable toggling of Special K (Phase 7+ concern).
- Preset application or config mutation (Phase 7–8).
- Any Lossless Scaling acquisition path other than confirming Steam ownership.

## Decisions

### 0. Module structure: facade in commands/, implementation in tools/

The implementation lives in a dedicated `src-tauri/src/tools/` module tree:

```
src-tauri/src/
  commands/
    tools.rs            ← thin Tauri command handlers + IPC DTO types only
  tools/
    mod.rs              ← re-exports, public API of the module
    types.rs            ← ToolId enum, ToolCatalogEntry, OfficialSource, detection state types
    service.rs          ← aggregates catalog + runtime state into IPC responses
    optiscaler.rs       ← OptiScaler detection logic
    special_k.rs        ← Special K detection logic
    lossless_scaling.rs ← Lossless Scaling Steam scan
    windows.rs          ← shared Windows helpers (registry reads, PE header access)
```

`commands/tools.rs` only imports from `crate::tools::*` and calls service functions. This preserves the external command registration pattern (consistent with `commands/games.rs`, `commands/hardware.rs`) while avoiding a monolithic file.

**Why**: The three tool integrations have fundamentally different detection logic, different provenance rules, and will have different Phase 6 recommendation rules. Keeping them in separate files makes each scanner independently readable and testable without scrolling through 1000+ lines.

**ToolId is exhaustive**: `ToolId` is a plain enum defined without `#[non_exhaustive]`. This provides maximum compiler protection — a `match` without a wildcard arm will fail to compile when a new `ToolId` variant is added, forcing Phase 6 and every future consumer to explicitly handle every tool. `#[non_exhaustive]` would have the opposite effect.

### 1. Tool catalog as Rust constants, not a seeded SQLite table

The three supported tools are defined as compile-time constants in `tools/types.rs`. There is no `tools` table in SQLite. Tool identity, metadata, and compliance notes are assembled in-process from the constant definitions.

**Why**: The tools are not user data — they are the product itself. Seeding rows in SQLite makes author credits, official URLs, and license notes appear to be mutable runtime state when they are not. Adding a 4th tool should be a code change, not a data migration.

**SQLite scope**: Only genuinely runtime/user state is persisted:
- `tool_sources` — user-registered local archive/path entries (provenance: `user_local`) and detected Steam entries (provenance: `steam_owned`)
- `tool_deployments` — detected per-game deployment records with confidence and signal data

Phase 6 does not join on a `tools` table. It assembles state in memory: `TOOL_CATALOG[id]` + detection result + `tool_sources` rows from DB.

### 2. official_sources is a slice of OfficialSource, not a single URL

Each `ToolCatalogEntry` carries `official_sources: &'static [OfficialSource]`:

```rust
pub struct OfficialSource {
    pub label: &'static str,   // e.g. "GitHub Releases", "NexusMods"
    pub url:   &'static str,
}
```

OptiScaler has two legitimate official sources: GitHub Releases and NexusMods. The OptiScaler project explicitly states it has no official website and that GitHub, Discord, and NexusMods are the only legitimate distribution points. Special K has one source (its own release infrastructure). Lossless Scaling has one entry (Steam store page — shown as informational reference only, not an acquisition CTA).

The IPC payload reflects this as `Vec<IpcOfficialSource>`. The frontend renders one CTA per source when `official_sources.len() > 1`.

### 3. OptiScaler detection: confidence-scored, not binary

Detection produces one of four confidence states: `Confirmed`, `Partial`, `Ambiguous`, `NotFound`.

**Scan scope** (per game): only directories adjacent to the game's main executable. No recursive tree walk.
- `exe_dir/` (directory containing the game's primary executable)
- `exe_dir/plugins/`
- `exe_dir/reframework/plugins/`

**Confidence rules**:

| State | Criteria |
|---|---|
| `Confirmed` | `OptiScaler.ini` present AND (a supported loader DLL OR `OptiScaler.dll` OR `OptiScaler.asi` present in scope) AND INI contains a recognizable `[OptiScaler]` section header |
| `Partial` | `OptiScaler.ini` present without a matching loader, OR `OptiScaler.ini` present but unreadable/malformed, OR `OptiScaler.dll` or `.asi` present without INI |
| `Ambiguous` | Only a confirmed loader name (`dxgi.dll`, `winmm.dll`, `d3d12.dll`, `dbghelp.dll`, `version.dll`, `wininet.dll`, `winhttp.dll`) present in scope, without `OptiScaler.ini` and without `OptiScaler.dll` or `OptiScaler.asi` |
| `NotFound` | None of the above signals present in scope |

**Confirmed loader filenames** (upstream-verified): `dxgi.dll`, `winmm.dll`, `d3d12.dll`, `dbghelp.dll`, `version.dll`, `wininet.dll`, `winhttp.dll`, `OptiScaler.asi`. `OptiScaler.dll` may appear before rename and is treated as a strong companion signal alongside `OptiScaler.ini`. `nvngx.dll` and `nvngx_dlss.dll` are **not** part of the current official loader-name set and SHALL NOT be used as detection signals.

**Why**: Generic loader DLLs (`dxgi.dll`, `winmm.dll`, etc.) are shared names with ReShade, Special K, and other mods — treating them alone as confirmation generates false positives. `OptiScaler.ini` is the most reliable primary signal: its name is specific to OptiScaler and upstream documentation explicitly states not to rename it.

**INI validation**: Reading the file and checking for a `[OptiScaler]` section header is sufficient for Phase 5. Full key-level parsing is not required.

### 4. Special K: global detection via known paths and registry

The backend checks `%PROGRAMDATA%\SK_Res`, `%APPDATA%\SpecialK`, and the `HKCU\Software\Kaldaien\SpecialK` registry hive for version markers, using shared helpers from `tools/windows.rs`.

Fall back gracefully to `NotDetected` with manual registration path surfaced in the UI when no footprint is found.

### 5. Lossless Scaling: Steam ACF scan only

Scan for ACF manifest with App ID `993090` in the existing Steam library data (reuse the `scan_steam_snapshot` infrastructure from `commands/games.rs`). When found, insert/update a `tool_sources` row with provenance `steam_owned`. When removed from Steam library, delete that row.

The `official_sources` entry for Lossless Scaling contains the Steam store URL — displayed as informational only; no file download, no archive path, no unofficial link is ever stored or surfaced.

### 6. IPC surface: five commands

| Command | Purpose |
|---|---|
| `get_tools_overview` | Returns assembled state: catalog metadata + detection state + user sources for all tools |
| `get_tool_deployments_for_game` | Runs/returns OptiScaler detection for a specific game_id |
| `register_tool_source` | Inserts a `tool_sources` row with provenance; returns updated tool state |
| `remove_tool_source` | Deletes a `tool_sources` row; returns updated tool state |
| `refresh_tool_detection` | Re-runs all detection routines; upserts deployment records; returns fresh overview |

### 7. Tools UI: overview strip (visual) + compact left list + detail panel

```
┌─────────────────────────────────────────────────────┐
│  Overview strip — visual status only, no navigation │
│  [OptiScaler ●] [Special K ○] [Lossless Scaling ●] │
├──────────────┬──────────────────────────────────────┤
│  Left column │  Detail panel                        │
│  (3 fixed    │  - Tool name, author, license note   │
│   nav items) │  - Detection status badge            │
│              │  - "How detected" explanation        │
│  OptiScaler  │  - Official sources (1 CTA per src)  │
│  Special K   │  - User-registered local sources     │
│  Lossless S. │  - Per-game deployments (OptiScaler) │
│              │  - [Refresh] [Add local source]      │
└──────────────┴──────────────────────────────────────┘
```

Overview strip is **visual only** — it shows aggregate status at a glance but does not navigate. Navigation is exclusively through the left column. This eliminates duplicate navigation paths.

The left column has exactly 3 fixed entries implemented as styled navigation buttons with status badges, not a scrollable list component.

### 8. Frontend state: Zustand useToolsStore

Single store: `tools: ToolOverviewItem[]`, `deployments: Map<gameId, ToolDeployment>`, `selectedToolId: ToolId | null`, `loading`, `error`. Populated on Tools page mount. No polling.

## Risks / Trade-offs

- **OptiScaler detection accuracy** → confidence system reduces false positives vs. binary detection; INI section validation adds a cheap additional check. Residual risk: a DLL conflict scenario could place an unrelated INI nearby. Mitigation: section validation reduces this further.
- **Special K detection brittleness** → SK install structure has changed across versions. Mitigation: fall back gracefully to `NotDetected` rather than asserting a wrong state; manual registration always available.
- **Phase 6 dependency** → stale detection data produces wrong recommendations. Mitigation: `refresh_tool_detection` is prominently exposed in the UI; Phase 6 can also query detection timestamp.
- **Catalog-only model** → adding a 4th tool requires a code change and release. Mitigation: accepted for MVP; dynamic catalog is a v2 concern.

## Migration Plan

1. Add `tool_sources` and `tool_deployments` tables via a new SQLite migration (no `tools` seed table).
2. Define `TOOL_CATALOG` constant array in `tools/types.rs`.
3. Implement detection modules in `tools/optiscaler.rs`, `tools/special_k.rs`, `tools/lossless_scaling.rs`, plus shared helpers in `tools/windows.rs`.
4. Implement `tools/service.rs` to assemble catalog + runtime state into IPC responses.
5. Register the five Tauri commands in `lib.rs`.
6. Build Tools page and components.
7. Game detail page calls `get_tool_deployments_for_game` on game selection.

Rollback: migrations are additive. Reverting the frontend removes UI without affecting Phase 3 data.

## Open Questions

- Should `refresh_tool_detection` scan all games for OptiScaler deployments eagerly, or only on-demand per game? On-demand recommended for Phase 5 MVP to avoid slow scans on large libraries.

> **Resolved — OptiScaler loader filenames**: Confirmed upstream loader names are `dxgi.dll`, `winmm.dll`, `d3d12.dll`, `dbghelp.dll`, `version.dll`, `wininet.dll`, `winhttp.dll`, and `OptiScaler.asi`. `OptiScaler.dll` may appear pre-rename (treat as companion signal). `nvngx.dll` and `nvngx_dlss.dll` are not part of the current official loader-name set and must not be treated as detection signals.
