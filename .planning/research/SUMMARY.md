# Research Summary: OptiHub

## Domain: PC Game Optimization Desktop Hub

### Key Findings

**Stack:** Tauri 2.x (Rust backend) + React 19 + TypeScript 5 + Tailwind CSS 4 + Vite 6 + Zustand 5 + SQLite. Windows-first, offline-first. IPC via `invoke()` commands with capability-based permissions.

**Table Stakes:** Game detection (Steam VDF/ACF), hardware detection (CPU/GPU/RAM/VRAM), game detail views with metadata, preset system (Quality/Balanced/Performance), apply/undo mechanism with file backup, tool recommendation per game, settings, credits/licenses screen.

**Differentiators:** Guided optimization flow (wizard-style), risk classification (Safe/Limited/Experimental), multi-tool integration (OptiScaler + Special K + Lossless Scaling), PCGamingWiki compatibility data, contextual explanations for recommendations, batch diagnostics view.

**Watch Out For:** IPC main thread blocking (freezes UI), Rust↔TS type mismatches (silent `undefined`), Steam VDF parsing edge cases, DLL conflicts between OptiScaler and Special K, Lossless Scaling legal boundary (detection only, never redistribute), tool-model mismatches across integrations, backup/restore reliability is mission-critical, WebView2 rendering quirks on Windows, scope creep from v2/v3 features into MVP.

---

### Stack Summary

| Layer | Technology | Confidence |
|-------|-----------|------------|
| Runtime | Tauri 2.x | ✅ High |
| Frontend | React 19 + TypeScript 5 | ✅ High |
| Styling | Tailwind CSS 4 | ✅ High |
| Bundler | Vite 6 | ✅ High |
| State | Zustand 5 | ✅ High |
| Navigation | React Router 7 | ✅ High |
| Icons | Lucide React | ✅ High |
| Components | Shadcn/UI (optional) | 🟡 Medium |
| Hardware | sysinfo + wmi crates | ✅ High |
| GPU (NVIDIA) | nvml-wrapper (optional) | 🟡 Medium |
| Registry | winreg crate | ✅ High |
| VDF Parsing | keyvalues-parser | 🟡 Medium |
| Database | SQLite (rusqlite) | ✅ High |
| Async | Tokio 1.x | ✅ High |
| Serialization | serde + serde_json | ✅ High |
| Package Manager | pnpm 9.x | ✅ High |

### Architecture Summary

- **Two-process model:** React frontend (WebView2) ↔ Rust backend (Tauri commands)
- **All system access through IPC:** frontend never touches file system, registry, or hardware directly
- **SQLite for persistent state:** game library, presets, backup records, tool status
- **JSON for config:** app settings, preset definitions, tool metadata
- **File system for backups:** versioned directories with hash verification
- **Capability-based security:** Tauri 2.x ACL, only enable what's needed

### Critical Decisions Needed

| Decision | Options | Recommendation |
|----------|---------|---------------|
| VDF parser | Custom vs `keyvalues-parser` crate | Use existing crate, avoid reinventing |
| Component library | Shadcn/UI vs custom | Start custom, add Shadcn for complex widgets |
| Backup storage | App data dir vs alongside game | App data directory (centralized, survives game reinstall) |
| Metadata source | Steam API vs local VDF + SteamDB scraping | Local VDF first, Steam web API as enhancement |
| PCGamingWiki | Direct API vs cached data | Cached local data with optional refresh |

### Top Risks (Prioritized)

1. **Backup/Restore reliability** — If users lose game configs, trust is destroyed. Build and test this exhaustively.
2. **DLL conflict management** — OptiScaler + Special K DLL naming conflicts can break games.
3. **VDF parsing edge cases** — Steam's format is quirky and varies between updates.
4. **IPC blocking** — Any synchronous Rust operation freezes the entire UI.
5. **Scope creep** — v2/v3 features creeping into MVP will delay launch indefinitely.

### Build Order Recommendation

```
1. Foundation (Tauri + React + theme + sidebar shell)
2. Hardware Detection (CPU/GPU/RAM/VRAM/monitor)
3. Game Detection (Steam registry, VDF/ACF, library)
4. Game UI (library view, detail page, metadata)
5. Tool Integration & Deployment Management (OptiScaler, Special K, Lossless Scaling)
6. Recommendation Engine (rules, confidence, explanations)
7. Preset System (Quality/Balanced/Performance)
8. Apply & Restore (backup engine, config application, rollback)
9. Integration & Polish (PCGamingWiki, diagnostics, credits, UX)
```

---
*Synthesized: 2026-04-03*
*Sources: STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md*
