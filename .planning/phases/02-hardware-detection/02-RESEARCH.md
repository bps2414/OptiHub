# Phase 2: Hardware Detection - Research

**Researched:** 2026-04-03T02:03:23.0692935-03:00
**Domain:** Windows desktop hardware detection for a Tauri + React application
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use grouped cards layout - one card per hardware category (CPU, GPU, Memory, Display). Not a dense technical table, not a GPU-Z/HWiNFO clone.
- Each card shows model/name prominently with a small set of key values:
  - CPU: model, core/thread count
  - GPU: model, VRAM
  - Memory: total RAM
  - Display: resolution, refresh rate
- Keep detail level moderate for v1. No full low-level technical dumps. An expandable "more details" section is acceptable as a future enhancement but not required for v1.
- Compact summary - small cards or rows, one per component (CPU, GPU, RAM, Display).
- Each item shows only the most useful high-level value (e.g., "Ryzen 7 5800X", "RTX 4070 12GB", "32 GB", "2560x1440 @ 144Hz").
- Home summary is for quick orientation only - Diagnostics page is the source of truth for full hardware details.
- Monitor override lives directly on the Diagnostics page in the Display card - not hidden in Settings.
- Manual override is a normal, supported flow - not just error recovery.
- Show detected display values first, then allow the user to switch to manual override.
- State must be explicit with clear labels: "Detected" vs "Manual override active".
- Use inline edit or a small local form section in the Display card - no separate modal.
- User can: enable override, set resolution, set refresh rate, reset back to detected values.
- Never guess or fabricate values. Use explicit labels: "Unknown", "Unavailable", "Not detected".
- Show source/status for each field: "Detected", "Overridden", "Unavailable".
- If only part of a category is known, still show the card - fill unknown fields explicitly rather than hiding the entire section.
- UI must clearly distinguish: real detected data, user-provided override data, and missing data.
- Frontend receives a normalized hardware snapshot model via IPC - not raw tool-specific output. The Rust backend normalizes before sending.
- Prefer stable, reliable fields over ambitious but inconsistent fields.
- For v1, prioritize correctness and clarity over exhaustive hardware detail.

### the agent's Discretion
- Exact Rust struct field names and serialization details
- Choice of specific crate versions (sysinfo, wmi, nvml-wrapper)
- Internal detection ordering and fallback logic
- Exact card styling within design system tokens
- Loading/skeleton states while hardware is being detected

### Deferred Ideas (OUT OF SCOPE)
- None - discussion stayed within phase scope
</user_constraints>

<research_summary>
## Summary

Phase 2 is best implemented as one normalized Rust command that gathers CPU, memory, GPU, and display data, then returns a single `HardwareSnapshot` to the frontend. The standard backend stack for this scope is `sysinfo` for CPU/RAM, `wmi` for GPU identity and VRAM, and native Win32 display enumeration for active monitor name, resolution, and refresh rate. Tauri's async command guidance still applies here: keep the command `async`, use owned input/output types, and avoid blocking the UI thread with long synchronous work.

The key architectural choice is to separate detected hardware data from user override data. Detection should stay Rust-side and return a normalized, partial-safe snapshot with `Option` fields instead of failing hard when one probe is missing. Manual display override should stay frontend-side for this phase, persisted in a Zustand store, because the product needs a first-class override flow now but does not yet have a broader app settings persistence layer on the backend.

**Primary recommendation:** Implement Phase 2 with `sysinfo 0.38.x` + `wmi 0.18.x` + Win32 `EnumDisplayDevicesW`/`EnumDisplaySettingsW`, expose a single `get_hardware_snapshot` command, and keep display override state in a persisted frontend store that projects "Detected", "Overridden", and "Unavailable" statuses into the Diagnostics and Home UI.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library / API | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `sysinfo` | 0.38.4 | CPU model, logical thread count, physical core count, total RAM | Current docs expose `System::new_all`, `System::physical_core_count`, and `total_memory()` directly for system snapshot work |
| `wmi` | 0.18.4 | GPU model, vendor, VRAM, fallback display-related controller fields | Current crate docs show typed struct deserialization, raw queries, and async query support on Windows |
| Win32 `EnumDisplayDevicesW` + `EnumDisplaySettingsW` | Microsoft Win32 APIs | Enumerate attached desktop displays and read current width / height / refresh rate | Microsoft docs explicitly document attached-desktop filtering, adapter/monitor naming, and `ENUM_CURRENT_SETTINGS` for current mode |
| Tauri async commands | Tauri 2 docs (current) | Non-blocking IPC boundary for hardware snapshot command | Official docs say async commands are preferred and run on a separate async task |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `windows` crate | 0.62.x | Rust bindings for `EnumDisplayDevicesW`, `EnumDisplaySettingsW`, `DISPLAY_DEVICEW`, and `DEVMODEW` | Use when Phase 2 needs direct Win32 monitor enumeration instead of WMI-only display data |
| `nvml-wrapper` | 0.12.1 | Optional NVIDIA-specific telemetry fallback for VRAM | Use only if WMI proves unreliable for NVIDIA VRAM on real hardware; not required for initial Phase 2 delivery |
| Zustand `persist` middleware | existing app stack | Persist display override locally in the shell | Use for manual display override before introducing backend settings persistence |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Win32 display APIs | `Win32_DesktopMonitor` via WMI | Simpler query path, but display identity and active mode data are often less reliable than the direct Win32 enumeration route |
| WMI for GPU only | `nvml-wrapper` first | Better NVIDIA-specific telemetry, but narrower hardware coverage and unnecessary complexity for the first pass |
| Frontend-persisted display override | Backend-persisted JSON or SQLite settings now | More future-proof long term, but it introduces a settings persistence system before the roadmap requires it |

**Installation:**
```bash
# Rust additions for Phase 2
cargo add sysinfo@0.38 wmi@0.18 windows@0.62 --manifest-path src-tauri/Cargo.toml

# No new frontend packages are required for the initial UI pass
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
src-tauri/
├── src/
│   ├── commands/
│   │   ├── mod.rs
│   │   ├── system.rs
│   │   └── hardware.rs      # normalized snapshot command + helpers + tests
src/
├── components/
│   └── hardware/            # grouped card, summary widget, override form
├── lib/
│   ├── tauri.ts             # typed getHardwareSnapshot wrapper
│   └── hardware.ts          # formatter + effective display helpers
├── pages/
│   ├── DiagnosticsPage.tsx
│   └── HomePage.tsx
├── stores/
│   └── hardware.ts          # snapshot load state + persisted display override
└── types/
    └── ipc.ts               # HardwareSnapshot interfaces
```

### Pattern 1: Normalized Snapshot Command
**What:** One async Tauri command returns a normalized snapshot object instead of a group of loosely related per-card commands.
**When to use:** Hardware data is displayed together in Diagnostics and summarized together on Home.
**Example:**
```rust
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HardwareSnapshot {
    pub cpu: CpuSnapshot,
    pub gpu: GpuSnapshot,
    pub memory: MemorySnapshot,
    pub display: DisplaySnapshot,
}

#[tauri::command]
pub async fn get_hardware_snapshot() -> Result<HardwareSnapshot, AppError> {
    Ok(HardwareSnapshot {
        cpu: detect_cpu_snapshot(),
        gpu: detect_gpu_snapshot(),
        memory: detect_memory_snapshot(),
        display: detect_display_snapshot(),
    })
}
```

### Pattern 2: Partial-Safe Detection
**What:** Each detector returns best-effort data with `Option` fields instead of aborting the entire snapshot when one subsystem is missing.
**When to use:** WMI, monitor enumeration, and vendor-specific hardware data can be incomplete on real user machines.
**Example:**
```rust
fn detect_gpu_snapshot() -> GpuSnapshot {
    match query_video_controllers() {
        Ok(rows) => normalize_primary_gpu(&rows),
        Err(_) => GpuSnapshot {
            model: None,
            vendor: None,
            vram_bytes: None,
        },
    }
}
```

### Pattern 3: Detected Snapshot + Frontend Override Projection
**What:** Rust returns detected display values only; the frontend computes an effective display model by overlaying a persisted manual override.
**When to use:** The product needs manual display override now, but the backend settings persistence layer does not exist yet.
**Example:**
```typescript
export function getEffectiveDisplay(
  detected: DisplaySnapshot,
  override: ManualDisplayOverride,
): DisplaySnapshot {
  if (!override.enabled) return detected

  return {
    ...detected,
    widthPx: override.widthPx,
    heightPx: override.heightPx,
    refreshHz: override.refreshHz,
  }
}
```

### Anti-Patterns to Avoid
- **Per-field IPC calls:** Splitting CPU, GPU, RAM, and display into separate commands adds loading churn and makes status projection harder.
- **Treating missing hardware data as fatal:** This contradicts the product decision to show explicit unknown/unavailable values.
- **Using WMI alone for monitor mode:** Microsoft documents a better direct route for active desktop displays via `EnumDisplayDevicesW` and `EnumDisplaySettingsW`.
- **Inventing a backend settings subsystem early:** Phase 2 only needs a persisted manual override, not a general config engine.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CPU and RAM probing | Custom registry / Win32 probes for basic CPU and RAM facts | `sysinfo` | The crate already exposes CPU brand, frequency, total RAM, and physical core count |
| COM + WMI plumbing | Manual COM initialization and raw IWbem calls | `wmi` | The crate already handles typed deserialization and async query APIs |
| Display enumeration registry parsing | Reading registry display settings directly | `EnumDisplayDevicesW` + `EnumDisplaySettingsW` | Microsoft documents the adapter and monitor enumeration flow and current mode retrieval explicitly |
| Override persistence | A custom file format or ad hoc JSON write path | Zustand `persist` | The app already uses Zustand and only needs lightweight shell persistence for this phase |

**Key insight:** The Phase 2 risk is not "how do we detect everything from scratch"; it is "how do we normalize several imperfect Windows data sources into a stable product snapshot without overbuilding." Reuse mature crates/APIs and spend the custom logic budget on normalization and UX state projection.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Blocking the desktop shell during detection
**What goes wrong:** Diagnostics page load makes the shell feel frozen while hardware probes run.
**Why it happens:** Heavy or synchronous work happens inside a non-async Tauri command.
**How to avoid:** Keep `get_hardware_snapshot` async and use owned types (`String`, structs) per Tauri guidance.
**Warning signs:** Navigation jank or "Not Responding" during Diagnostics page load.

### Pitfall 2: Overtrusting `Win32_VideoController`
**What goes wrong:** GPU or refresh-rate fields come back stale or inaccurate on some hardware.
**Why it happens:** Microsoft documents that non-WDDM hardware returns inaccurate property values for this class.
**How to avoid:** Use `Win32_VideoController` for GPU identity and VRAM, but prefer direct display enumeration for active monitor mode.
**Warning signs:** GPU model appears but display mode is obviously wrong compared with Windows Display Settings.

### Pitfall 3: Losing the distinction between detected and overridden display values
**What goes wrong:** The UI cannot tell whether a display value is real, unavailable, or user-entered.
**Why it happens:** Override values overwrite detected values without metadata or projection helpers.
**How to avoid:** Keep detected snapshot and manual override state separate, then derive effective display values plus status pills in the frontend.
**Warning signs:** Reset becomes impossible or the UI labels a manual value as detected.

### Pitfall 4: Planning for perfect telemetry instead of stable telemetry
**What goes wrong:** Phase 2 balloons into vendor-specific edge cases before the main flow lands.
**Why it happens:** It is tempting to chase exact VRAM and monitor metadata for every GPU/monitor combo from day one.
**How to avoid:** Ship the stable baseline (`sysinfo` + `wmi` + Win32 display APIs), mark missing values explicitly, and leave NVIDIA-specific NVML fallback as a later enhancement if real hardware proves it necessary.
**Warning signs:** The plan starts depending on NVML, DXGI, and WMI all at once.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from primary sources:

### CPU and memory snapshot with sysinfo
```rust
use sysinfo::System;

let system = System::new_all();
let cpu_brand = system
    .cpus()
    .first()
    .map(|cpu| cpu.brand().to_string());
let physical_cores = System::physical_core_count().map(|count| count as u32);
let total_memory_bytes = system.total_memory();
```
Source: docs.rs `sysinfo` 0.38.4 (`System::new_all`, `System::physical_core_count`, `System::total_memory`)

### Typed GPU query with wmi
```rust
#[derive(Debug, Deserialize)]
#[serde(rename_all = "PascalCase")]
struct VideoControllerRow {
    name: Option<String>,
    adapter_compatibility: Option<String>,
    adapter_ram: Option<u32>,
}

let wmi = WMIConnection::new()?;
let rows: Vec<VideoControllerRow> = wmi.raw_query(
    "SELECT Name, AdapterCompatibility, AdapterRAM FROM Win32_VideoController",
)?;
```
Source: docs.rs `wmi` 0.18.4 examples for typed `query` / `raw_query`

### Attached display enumeration using current settings
```rust
// Pseudocode shape for the windows crate bindings used in Phase 2
let adapter = enumerate_attached_display_devices();
let mode = enum_display_settings(adapter.device_name, ENUM_CURRENT_SETTINGS)?;
let display = DisplaySnapshot {
    monitor_name,
    width_px: Some(mode.dmPelsWidth),
    height_px: Some(mode.dmPelsHeight),
    refresh_hz: Some(mode.dmDisplayFrequency),
};
```
Source: Microsoft Learn guidance for `EnumDisplayDevicesW` and `EnumDisplaySettingsW`

### Async Tauri command with owned types
```rust
#[tauri::command]
async fn get_hardware_snapshot() -> Result<HardwareSnapshot, AppError> {
    // owned return type, no borrowed arguments
    Ok(snapshot)
}
```
Source: Tauri v2 docs on async commands and owned input/output types
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Older `sysinfo` examples that assumed different memory units | `sysinfo` 0.38.4 docs explicitly state `total_memory()` returns bytes | 0.38.4 docs published 2026-03-09 | Format memory values from bytes directly; do not port older KiB-based snippets blindly |
| Older `wmi` 0.13/0.14 blog examples | `wmi` 0.18.4 with documented async query support and current `windows` bindings range | 0.18.x line published through 2026-03-27 | Plan against the 0.18 API surface, not legacy examples |
| NVIDIA-only VRAM fallback as a first move | `nvml-wrapper` 0.12.1 is current but best treated as optional fallback | 0.12.1 published 2026-03-30 | Keep Phase 2 baseline vendor-neutral and add NVML only if real testing justifies it |

**New tools/patterns to consider:**
- `wmi` 0.18.x async queries: helpful if the synchronous raw query path proves slow in practice
- `windows` 0.62.x direct bindings: good fit because the app is explicitly Windows-only

**Deprecated / outdated assumptions:**
- Treating WMI display mode as the only display source is outdated for active-monitor UX
- Assuming every hardware field must exist before rendering the card conflicts with the product's explicit unavailable-state requirements
</sota_updates>

<open_questions>
## Open Questions

1. **Should display override be persisted beyond the shell layer in Phase 2?**
   - What we know: The product requires override now, but no broader backend settings system exists yet.
   - What's unclear: Whether later recommendation logic will need the override from Rust before a settings subsystem lands.
   - Recommendation: Persist override in Zustand for Phase 2 and keep the effective-display helper isolated so the persistence backend can change later without rewriting the page components.

2. **Is `AdapterRAM` reliable enough across the target hardware mix?**
   - What we know: `Win32_VideoController` exposes `AdapterRAM`, but Microsoft warns that some class values can be inaccurate on non-WDDM hardware.
   - What's unclear: How often OptiHub's target users will hit inaccurate VRAM values in practice.
   - Recommendation: Use WMI first, return `None` when values look missing or implausible, and validate on at least one NVIDIA + one AMD/Intel machine before considering NVML fallback work.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- Tauri async commands docs: https://v2.tauri.app/es/develop/calling-rust/ - checked async command guidance, owned type caveats, and separate-task execution (`turn4view5`, lines 582-629)
- `sysinfo` 0.38.4 crate docs: https://docs.rs/crate/sysinfo/latest - checked current crate version/date (`turn1view0`, lines 28-79)
- `sysinfo::System` docs: https://docs.rs/sysinfo/latest/sysinfo/struct.System.html - checked `new_all`, `total_memory`, `physical_core_count` (`turn2view0`, lines 175-179; `turn2view1`, lines 2759-2766; `turn2view2`, lines 6981-6987)
- `sysinfo::Cpu` docs: https://docs.rs/sysinfo/latest/sysinfo/struct.Cpu.html - checked `brand()` and `frequency()` (`turn2view3`, lines 744-754; `turn2view4`, lines 1039-1049)
- `wmi` 0.18.4 crate docs: https://docs.rs/crate/wmi/latest - checked current crate version/date plus typed and async query examples (`turn7view0`, lines 28-67 and 137-224)
- Microsoft Learn `Win32_VideoController`: https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-videocontroller - checked relevant properties and WDDM accuracy warning (`turn4view0`, lines 39-45 and 49-67 and 168-175)
- Microsoft Learn `EnumDisplayDevicesW`: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumdisplaydevicesw - checked attached-desktop enumeration, adapter name, and monitor name flow (`turn5view3`, lines 53-80; `turn5view5`, lines 76-80)
- Microsoft Learn `EnumDisplaySettingsW`: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumdisplaysettingsw - checked `ENUM_CURRENT_SETTINGS` and `DEVMODE` members for width/height/frequency (`turn5view0`, lines 52-78)

### Secondary (MEDIUM confidence)
- `nvml-wrapper` 0.12.1 crate docs: https://docs.rs/crate/nvml-wrapper/latest - checked current version/date and scope as a safe Rust wrapper around NVML (`turn2view5`, lines 28-31 and 60-63; `turn2view6`, lines 81-83)

### Tertiary (LOW confidence - needs validation)
- None. The recommendations above are grounded in current official docs and project-local context.
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Windows hardware detection in a Tauri desktop app
- Ecosystem: `sysinfo`, `wmi`, Win32 display APIs, optional `nvml-wrapper`
- Patterns: normalized snapshot command, partial-safe detection, frontend override projection
- Pitfalls: blocking IPC, inaccurate WMI display data, override state mixing, overbuilding telemetry

**Confidence breakdown:**
- Standard stack: HIGH - current versions and APIs were checked directly against primary docs
- Architecture: HIGH - driven by product constraints plus official Tauri / Microsoft guidance
- Pitfalls: HIGH - supported by product context and Microsoft / Tauri caveats
- Code examples: HIGH - derived from current primary docs and adapted to this repo's existing patterns

**Research date:** 2026-04-03T02:03:23.0692935-03:00
**Valid until:** 2026-05-03 (30 days - stable desktop stack, but crate versions are moving monthly)
</metadata>

---

*Phase: 02-hardware-detection*
*Research completed: 2026-04-03T02:03:23.0692935-03:00*
*Ready for planning: yes*
