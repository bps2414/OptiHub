# Architecture Research: OptiHub

## Domain: PC Game Optimization Desktop App (Tauri + React)

### System Architecture Overview

OptiHub follows a **two-process model** typical of Tauri 2.x applications:

```
┌─────────────────────────────────────────────────────────────────┐
│                        OptiHub Desktop App                       │
│                                                                   │
│  ┌──────────────────────┐    IPC     ┌──────────────────────────┐ │
│  │    Frontend (React)   │◄─────────►│   Backend (Rust/Tauri)    │ │
│  │                        │  invoke() │                            │ │
│  │  • UI Components       │  events   │  • System Commands         │ │
│  │  • State (Zustand)     │           │  • Hardware Detection      │ │
│  │  • Router              │           │  • Game Detection          │ │
│  │  • Theme/Styling       │           │  • File Operations         │ │
│  │                        │           │  • SQLite DB               │ │
│  │  WebView2 (Windows)    │           │  • Tool Integration        │ │
│  └──────────────────────┘           └──────────────────────────┘ │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    Local File System                           │ │
│  │  • Game directories        • Tool installations               │ │
│  │  • Config backups          • SQLite database                  │ │
│  │  • Steam VDF/ACF files     • App data directory               │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Major Components

#### 1. Frontend Layer (React + TypeScript + Tailwind)

| Component | Responsibility |
|-----------|---------------|
| **AppShell** | Sidebar layout, navigation, global chrome |
| **Home Dashboard** | Quick status, recent games, system overview |
| **Game Library** | Grid/list of detected games with metadata |
| **Game Detail** | Per-game view: tools, presets, recommendations |
| **Optimization Flow** | Wizard-style guided optimization with confirmation |
| **Hardware Panel** | System specs display and diagnostics |
| **Tools Manager** | Detected tools status, integration health |
| **Preset Editor** | Quality/Balanced/Performance configuration |
| **Settings** | App preferences, paths, theme |
| **Credits/Licenses** | Attribution screen for all integrated tools |

**State management:** Zustand for UI state. Rust backend is authoritative for all system data.

#### 2. Backend Layer (Rust / Tauri 2.x)

| Module | Responsibility |
|--------|---------------|
| **hardware** | CPU, GPU, RAM, VRAM detection via `sysinfo` + `wmi` crates |
| **steam** | Registry lookup, VDF/ACF parsing, library folder enumeration |
| **games** | Game registry, manual game addition, metadata management |
| **tools** | Tool integration registry, source/channel metadata, global installs, and per-game deployment tracking |
| **recommendations** | Rules engine: game + hardware + tool → recommendation + confidence |
| **presets** | Preset definitions, per-game config generation |
| **applicator** | Config file manipulation with backup-before-write |
| **backup** | Backup/restore engine for all modifications |
| **database** | SQLite via `rusqlite` — game library, presets, backup history |
| **metadata** | Steam/SteamDB metadata fetching (covers, descriptions) |
| **pcgamingwiki** | PCGamingWiki data integration for compatibility info |

#### 3. Data Layer

| Store | Technology | Contents |
|-------|-----------|----------|
| **App Database** | SQLite | Game library, preset configs, backup records, tool integration records, per-game deployment state |
| **Config Files** | JSON | App settings, tool configurations, preset definitions |
| **Backup Store** | File System | Original game configs before modification |
| **Cache** | File System | Game metadata, cover art, PCGamingWiki data |

### Data Flow

```
User Action (UI)
    │
    ▼
React Component → Zustand Store (UI state)
    │
    ▼
invoke("command_name", args)  ──── IPC Bridge ────►  Rust Command Handler
                                                          │
                                                          ▼
                                                    Business Logic
                                                    (validation, rules)
                                                          │
                                              ┌───────────┼───────────┐
                                              ▼           ▼           ▼
                                          SQLite DB   File System  Registry
                                              │           │           │
                                              └───────────┼───────────┘
                                                          │
                                                          ▼
                                                    Response / Event
                                                          │
                                              ◄──── IPC Bridge ────
                                                          │
                                                          ▼
                                                  React State Update
                                                          │
                                                          ▼
                                                    UI Re-render
```

### Key Architecture Patterns

#### IPC Command Pattern
```
Frontend: invoke("detect_games") → Promise<GameLibrary>
Backend:  #[tauri::command] async fn detect_games(state: State<AppState>) -> Result<GameLibrary, AppError>
```

All system operations (hardware detection, file I/O, registry access) happen exclusively in Rust. The React frontend never touches the file system directly.

#### Backup-Before-Write Pattern
```
1. User selects optimization preset
2. App calculates required file changes
3. App shows confirmation dialog with changes summary
4. User confirms
5. Backend backs up original files → backup store
6. Backend applies changes
7. Backup receipt stored in SQLite with timestamp + hash
8. User can restore anytime via backup history
```

#### Tool Integration Pattern
```
1. Classify each tool by integration model (global integration, user-supplied local source, per-game deployment, licensed Steam-only detection)
2. Detect tool-specific markers (executables, DLLs, config files, Steam ownership markers) without flattening them into a single status
3. Record provenance, release channel, version/build, and compliance state for each tool record
4. For OptiScaler: inspect per-game deployment near the target executable and preserve user-supplied local source metadata
5. For Special K: detect/register global integration and supported official channels
6. For Lossless Scaling: check Steam library specifically (no bundling, copying, or unofficial acquisition flow)
```

### Suggested Build Order

Based on dependency analysis:

```
Phase 1: Foundation (Tauri scaffold, React shell, sidebar, theme)
    │
Phase 2: Hardware Detection (sysinfo, WMI, display info)
    │
Phase 3: Game Detection (Steam registry, VDF/ACF parsing, library)
    │
Phase 4: Game UI (library view, game detail, metadata display)
    │
Phase 5: Tool Integration & Deployment Management (tool-specific models, provenance, channel, per-game deployment state)
    │
Phase 6: Recommendation Engine (rules, confidence scoring, explanations)
    │
Phase 7: Preset System (Quality/Balanced/Performance definitions)
    │
Phase 8: Apply & Restore (backup engine, config application, rollback)
    │
Phase 9: Integration & Polish (PCGamingWiki, diagnostics, credits, UX polish)
```

### Security Boundaries

| Boundary | Rule |
|----------|------|
| **Frontend → Backend** | All system access via IPC commands only |
| **File System** | Scoped to game directories + app data; no arbitrary path access |
| **Registry** | Read-only for Steam detection; no registry writes |
| **Network** | Optional metadata fetching only; core app works offline |
| **User Consent** | All file modifications require explicit confirmation |
| **Capabilities** | Tauri 2.x ACL: only enable required permissions |

---
*Researched: 2026-04-03*
