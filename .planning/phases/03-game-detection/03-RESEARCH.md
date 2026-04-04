# Phase 3: Game Detection - Research

**Researched:** 2026-04-03T23:00:58.0674620-03:00
**Domain:** Steam game detection, manual executable registration, and persisted game-library management in a Tauri + React desktop app
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Phase 3 should use a compact, management-first list/table rather than rich visual cards.
- Each entry should prioritize operational fields: game name, source, install path, and quick actions.
- The richer cover-art-first presentation remains deferred to Phase 4.
- Manual add starts with executable selection and then always opens a small confirmation form before saving.
- The confirmation step should let the user review the detected path and set or refine the display name.
- Manual registration is meant to feel clean and intentional, not like a hidden fallback.
- Every game must visibly indicate its source as `Steam` or `Manual`.
- Only manually added entries can be removed by the user.
- If a Steam-detected game disappears from detection on a later refresh, it should drop out of the detected library rather than linger as a broken stale item.
- The library should auto-scan when the user opens the library view.
- The UI should also expose a manual `Refresh` action that reruns Steam detection on demand.
- Duplicate detection should treat matching executable paths or matching install roots as the same game.
- If a manual registration matches a Steam-detected install, the library should keep a single record and promote the source to `Steam`.
- Steam detection stays Rust-first and read-only, using registry and filesystem parsing through IPC rather than frontend file access.
- SQLite should persist the managed game library and manual additions so later phases can build on stable records.
- Detection should favor correctness and graceful partial results over aggressive assumptions when Steam files are missing or malformed.

### the agent's Discretion
- Exact Rust module/file split between `steam`, `games`, database helpers, and command handlers
- Choice of parser crate and normalization details for VDF/ACF data
- Exact table/list styling within the existing dark design system
- Whether `/library` owns the main management UI and `/games` stays lighter during Phase 3
- Exact merge precedence when both manual and Steam records provide slightly different names for the same install

### Deferred Ideas (OUT OF SCOPE)
- Cover-art treatment, including the Steam icon overlay on the bottom-left of the cover, belongs to Phase 4 when covers/metadata exist.
</user_constraints>

<research_summary>
## Summary

Phase 3 is best split into two layers. First, Rust should provide a resilient Steam scan pipeline that reads the Steam install root from the Windows registry, parses `libraryfolders.vdf`, loads each `appmanifest_*.acf`, and returns normalized game entries through typed IPC contracts. Second, a persisted game-library layer should merge those Steam detections with manual registrations stored in SQLite, giving the frontend one management-focused snapshot for `/library`.

The safest implementation path is to reuse mature libraries for the parts that are easy to get subtly wrong. `winreg` is the standard Rust choice for Windows registry access, `keyvalues-serde` already parses Steam's VDF-like formats into typed structs without hand-rolled tokenization, and `rusqlite` with the `bundled` feature keeps SQLite reliable on Windows without depending on a system installation. For manual registration, the official Tauri dialog plugin is the right fit because the product needs a native executable picker that returns real filesystem paths inside the desktop app.

**Primary recommendation:** Implement Phase 3 with `winreg` + `keyvalues-serde` + `rusqlite` on the Rust side, expose `get_game_library`, `refresh_game_library`, `register_manual_game`, and `remove_manual_game` through `src/lib/tauri.ts`, and let `/library` become the source-of-truth management view. Keep `/games` lightweight in this phase rather than prematurely building the richer metadata-heavy UI reserved for Phase 4.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library / API | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `winreg` | 0.55.0 | Read Steam install location from the Windows registry | Current docs.rs release provides maintained Windows registry bindings without raw Win32 registry plumbing |
| `keyvalues-serde` | 0.2.3 | Parse `libraryfolders.vdf` and `appmanifest_*.acf` into typed Rust structs | Current crate docs show direct serde-based parsing of KeyValues/VDF text plus `Option` support for missing fields |
| `rusqlite` | 0.39.0 with `bundled` | Persist manual entries and merged library state locally | Current docs recommend `bundled` as the simplest, most reliable build path when you want SQLite available everywhere |
| Tauri dialog plugin | `tauri-plugin-dialog` 2.6.0 / `@tauri-apps/plugin-dialog` v2 line | Native file picker for choosing `.exe` files during manual registration | Official Tauri v2 docs document the exact plugin setup and `open()` API for filesystem paths on Windows |

### Supporting
| Library / API | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `tauri::async_runtime::spawn_blocking` | existing Tauri runtime | Keep registry / file / SQLite work off the shell thread | Use for Steam scans and persistence operations that touch disk heavily |
| `PathBuf` + canonical path normalization | stdlib | Dedupe manual and Steam entries by executable path and install root | Use before comparing records so duplicate rules stay deterministic |
| Zustand `persist` or regular store state | existing app stack | Hold UI load state and optimistic management actions on the frontend | Use for the library page view model; backend stays authoritative for stored records |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `keyvalues-serde` | Custom VDF parser | Violates the pitfalls guidance; easy to break on Steam edge cases and version changes |
| Backend-native file picker | Plain HTML `<input type="file">` | Web file inputs are awkward in desktop flows and do not align with the native path-based Tauri experience |
| `rusqlite` bundled | Rely on a system SQLite installation | Harder to keep reliable on Windows user machines |
| `/games` as the management page | `/library` as the management page | `/library` matches the existing shell labels and current phase scope more directly; `/games` can stay lighter until Phase 4 |

**Installation:**
```bash
# Steam detection + persistence
cargo add winreg@0.55 keyvalues-serde@0.2
cargo add rusqlite@0.39 --features bundled

# Native executable picker
pnpm tauri add dialog
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
│   │   ├── hardware.rs
│   │   └── games.rs              # Steam scan + manual registry commands + tests
src/
├── components/
│   └── games/
│       ├── GameLibraryTable.tsx
│       ├── GameSourceBadge.tsx
│       └── ManualGameRegistrationForm.tsx
├── lib/
│   ├── tauri.ts                  # typed game-library wrappers
│   ├── dialog.ts                 # native executable picker helper
│   └── games.ts                  # path formatting / dedupe helpers
├── pages/
│   ├── LibraryPage.tsx
│   └── GamesPage.tsx
├── stores/
│   └── games.ts                  # library load state + actions
└── types/
    └── ipc.ts                    # GameLibraryEntry / snapshot / input contracts
```

### Pattern 1: Scan Then Normalize
**What:** Steam scan code first enumerates candidate libraries and manifests, then maps them into normalized `GameLibraryEntry` records with nullable optional fields.
**When to use:** Registry values, VDF files, and manifests can all be partially missing or malformed on real Windows installs.

### Pattern 2: Persisted Library Snapshot
**What:** The app stores library rows in SQLite and treats refresh as a reconciliation step, not a purely ephemeral scan.
**When to use:** Manual games must persist, manual duplicates must merge into Steam records, and later phases need stable game IDs.

### Pattern 3: `/library` Owns Management
**What:** `LibraryPage` becomes the management-first compact list with refresh, add, and remove actions.
**When to use:** The current phase is explicitly about detection and management, not the richer browse/details experience from Phase 4.

### Pattern 4: Native Executable Picker + Confirmation Form
**What:** The user chooses an `.exe` using the Tauri dialog plugin, then confirms the display name before saving.
**When to use:** Manual registration needs a real Windows path plus a clean, intentional UX.

### Anti-Patterns to Avoid
- **Hand-rolled VDF tokenization:** The project already documented Steam parsing as a pitfall; use a parser crate instead.
- **Frontend-managed library truth:** The frontend can own loading state, but Steam/manual records should still come from Rust + SQLite.
- **Keeping stale Steam rows forever:** This contradicts the locked decision that missing Steam games should fall out of the detected library on refresh.
- **Shipping Phase 4 visuals early:** Cover art, richer cards, and metadata fetching should stay deferred even if the list is visually polished.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Steam registry access | Raw Win32 registry calls | `winreg` | The crate already wraps the Windows Registry API safely and idiomatically |
| VDF / ACF parsing | Custom string splitting or brace matching | `keyvalues-serde` | The crate is built specifically for Valve-style KeyValues documents and supports serde-derived structs |
| Local persistence | Custom JSON file database | `rusqlite` with `bundled` | The architecture already standardizes on SQLite for the local app database |
| Executable selection | Browser-style file inputs | Tauri dialog plugin | The official plugin returns real filesystem paths on Windows and keeps the UX native |

**Key insight:** The hard part of Phase 3 is not "reading files" — it is maintaining a trustworthy, merge-safe library model across Steam scans and manual adds. Spend custom logic on normalization, deduplication, and lifecycle rules, not on re-implementing registry, parser, or database plumbing.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Blocking the shell during Steam scans
**What goes wrong:** Opening the library page feels like the app froze while registry reads and manifest parsing run.
**Why it happens:** The command does synchronous file-system work directly on the command path.
**How to avoid:** Wrap Steam scans and SQLite merges in `spawn_blocking` and keep the command boundary async.

### Pitfall 2: Missing multi-library installs
**What goes wrong:** Users only see games installed in the main Steam folder.
**Why it happens:** The implementation reads only the primary Steam path and ignores `libraryfolders.vdf`.
**How to avoid:** Parse every library path from `libraryfolders.vdf`, then scan manifests under each `steamapps` folder.

### Pitfall 3: Duplicate manual and Steam records drifting apart
**What goes wrong:** A user sees the same game twice or loses the ability to remove the wrong record.
**Why it happens:** The reconciliation step compares only names instead of normalized paths.
**How to avoid:** Normalize executable and install-root paths before comparing, then promote matched manual rows to `Steam`.

### Pitfall 4: Requirement drift between GAME-01 and Phase 4 scope
**What goes wrong:** Planning tries to pull cover art and metadata into Phase 3 because `GAME-01` mentions them.
**Why it happens:** The requirement wording is richer than the Phase 3 roadmap boundary.
**How to avoid:** Treat Phase 3 as delivering trustworthy auto-detected Steam library entries now, while cover art and metadata enrichment remain explicitly deferred to Phase 4 per roadmap and context.
</common_pitfalls>

<validation_architecture>
## Validation Architecture

- Backend verification should focus on pure parsing and merge helpers, not live registry or live Steam installs.
- Frontend verification should focus on the compact library list, source badges, manual-only remove affordances, and the add-game confirmation flow.
- Manual verification is still required for one real Windows Steam install and one real native dialog selection because those are environment-dependent behaviors.
</validation_architecture>

<sources>
## Sources

### Primary (HIGH confidence)
- Tauri Dialog plugin docs: [Dialog | Tauri](https://v2.tauri.app/plugin/dialog/) — checked setup, plugin init, and `open()` file picker flow
- `tauri-plugin-dialog` docs.rs: [tauri-plugin-dialog 2.6.0](https://docs.rs/crate/tauri-plugin-dialog/latest) — checked current crate version/date
- `rusqlite` docs.rs: [rusqlite 0.39.0](https://docs.rs/crate/rusqlite/latest) — checked `bundled` guidance for reliable SQLite setup
- `keyvalues-serde` docs.rs: [keyvalues-serde 0.2.3](https://docs.rs/keyvalues-serde/latest/keyvalues_serde/) — checked typed parsing examples and `Option` behavior
- `winreg` docs.rs: [winreg 0.55.0](https://docs.rs/crate/winreg/latest) — checked current crate version and Windows Registry scope

### Project-local (HIGH confidence)
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/phases/03-game-detection/03-CONTEXT.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Steam registry detection, VDF/ACF parsing, SQLite persistence, native file selection in Tauri
- Ecosystem: `winreg`, `keyvalues-serde`, `rusqlite`, Tauri dialog plugin
- Patterns: scan-then-normalize, persisted library reconciliation, compact management UI, native executable picker
- Pitfalls: blocking scans, multi-library misses, duplicate drift, scope bleed from metadata/cover art

**Confidence breakdown:**
- Standard stack: HIGH
- Architecture: HIGH
- Pitfalls: HIGH
- Code examples: HIGH

**Research date:** 2026-04-03T23:00:58.0674620-03:00
**Valid until:** 2026-05-03 (30 days - parser/plugin/library releases are moving, but the phase architecture is stable)
</metadata>

---

*Phase: 03-game-detection*
*Research completed: 2026-04-03T23:00:58.0674620-03:00*
*Ready for planning: yes*
