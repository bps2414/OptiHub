# Roadmap: OptiHub

## Overview

OptiHub's MVP is built in 9 phases following a dependency-driven order: foundation first, then detection layers (hardware → games → tools), then intelligence layers (recommendations → presets), then the critical apply/restore system, and finally integration and polish. Each phase delivers a coherent, testable increment. The goal is a fully functional optimization hub that detects, recommends, applies, and restores — with safety and compliance built in from the start.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & App Shell** - Tauri + React scaffold, premium dark theme, sidebar navigation
- [ ] **Phase 2: Hardware Detection** - CPU, GPU, RAM, VRAM, monitor detection with manual overrides
- [ ] **Phase 3: Game Detection** - Steam library parsing, manual registration, game library management
- [ ] **Phase 4: Game Library UI & Metadata** - Game library views, detail pages, Steam metadata, cover art
- [ ] **Phase 5: Tool Detection & Management** - OptiScaler, Special K, Lossless Scaling detection with provenance
- [ ] **Phase 6: Recommendation Engine** - Tool recommendations per game with confidence levels and explanations
- [ ] **Phase 7: Preset System** - Quality/Balanced/Performance presets with hardware-aware adaptation
- [ ] **Phase 8: Apply & Restore** - Backup engine, execution plans, config application, rollback system
- [ ] **Phase 9: Compliance, Credits & Polish** - Credits/licenses screen, compliance policy, final UX polish

## Phase Details

### Phase 1: Foundation & App Shell
**Goal**: Establish the Tauri + React project with premium dark UI, sidebar navigation (including Credits/Licenses placeholder), and all IPC/async patterns that downstream phases depend on
**Depends on**: Nothing (first phase)
**Requirements**: UIUX-01, UIUX-02, UIUX-04
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Tauri app launches on Windows with React frontend rendering in WebView2
  2. Premium dark theme is applied with sidebar navigation showing all planned sections
  3. Sidebar navigation routes work (Home, Library, Games, Optimizations, Tools, Presets, Diagnostics, Settings, Credits)
  4. Credits/Licenses route exists as a placeholder page reflecting compliance intent from the start
  5. All interactive elements have clear hover/focus states
  6. IPC bridge works — React can invoke a Rust command and receive a response
**Plans**: 3 plans

Plans:
- [ ] 01-01: Tauri + React + Tailwind project scaffold with TypeScript and Vite
- [ ] 01-02: Premium dark theme design system, sidebar layout, routing (all routes including Credits placeholder)
- [ ] 01-03: IPC foundation — Rust command pattern, error handling, serde conventions

### Phase 2: Hardware Detection
**Goal**: Detect CPU, GPU, RAM, VRAM, and monitor specs via Rust backend, display on diagnostics page with manual override support
**Depends on**: Phase 1
**Requirements**: HDWR-01, HDWR-02, HDWR-03, HDWR-04, HDWR-05, HDWR-06
**Success Criteria** (what must be TRUE):
  1. User can see detected GPU model and VRAM on diagnostics page
  2. User can see detected CPU model and core count
  3. User can see detected RAM amount
  4. Monitor resolution and refresh rate shown (best-effort) with manual override readily available
  5. System diagnostics summary visible on home screen
**Plans**: 2 plans

Plans:
- [ ] 02-01: Rust hardware detection commands (sysinfo, wmi, monitor enumeration)
- [ ] 02-02: Diagnostics UI page and home screen hardware summary widget

### Phase 3: Game Detection
**Goal**: Detect installed Steam games via registry + VDF/ACF parsing, support manual game registration, and manage the game library
**Depends on**: Phase 1
**Requirements**: GAME-01, GAME-02, GAME-04, GAME-05, GAME-06
**Success Criteria** (what must be TRUE):
  1. Steam games are auto-detected by reading registry and parsing VDF/ACF files
  2. User can manually register a game by selecting an executable
  3. User can refresh the library to detect new installations
  4. User can remove manually added games
  5. Auto-detected and manually added games are visually distinguishable
**Plans**: 2 plans

Plans:
- [ ] 03-01: Rust Steam detection (registry lookup, libraryfolders.vdf, appmanifest_*.acf parsing)
- [ ] 03-02: Manual game registration, library management, SQLite persistence

### Phase 4: Game Library UI & Metadata
**Goal**: Present the game library with rich UI (grid/list views), game detail pages, and Steam metadata (cover art, descriptions)
**Depends on**: Phase 3
**Requirements**: GAME-03, META-01, META-02
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. User can browse games in a visually rich library view with cover art
  2. User can view game details (name, install path, size, platform info)
  3. Cover art and descriptions fetched from Steam/SteamDB when available
  4. App works fully offline using cached metadata
**Plans**: 2 plans

Plans:
- [ ] 04-01: Game library UI (grid/list views, search, filtering, Steam vs manual badges)
- [ ] 04-02: Metadata fetching (Steam/SteamDB), caching, game detail page

### Phase 5: Tool Detection & Management
**Goal**: Detect OptiScaler, Special K, and Lossless Scaling installations with clear provenance, show tool status and official links
**Depends on**: Phase 1
**Requirements**: TOOL-01, TOOL-02, TOOL-03, TOOL-04, TOOL-05, TOOL-06
**Success Criteria** (what must be TRUE):
  1. OptiScaler installation detected with version/status shown
  2. Special K installation detected with version/status shown
  3. Lossless Scaling detected via Steam library (app ID 993090) only — never redistributed
  4. Tools overview page shows all tools with detected/missing status
  5. Each tool shows how it was detected (Steam install, manual path, not found)
  6. Missing tools show official download/install links
**Plans**: 2 plans

Plans:
- [ ] 05-01: Rust tool detection engine (OptiScaler, Special K, Lossless Scaling scanners)
- [ ] 05-02: Tools management UI page with provenance indicators and official links

### Phase 6: Recommendation Engine
**Goal**: Build the rules engine that maps game + hardware + available tools to a recommendation with confidence level and explanation
**Depends on**: Phase 2, Phase 3, Phase 5
**Requirements**: RECO-01, RECO-02, RECO-03, RECO-04, RECO-05
**Success Criteria** (what must be TRUE):
  1. User can see which optimization tool is recommended for each game
  2. Each recommendation shows Safe/Limited/Experimental risk level
  3. Each recommendation includes a plain-language explanation
  4. Recommendations account for GPU vendor and hardware capabilities
  5. "No safe recommendation available" is shown when no tool is confidently compatible
**Plans**: 2 plans

Plans:
- [ ] 06-01: Rust recommendation rules engine (game→tool mapping, confidence scoring, hardware awareness)
- [ ] 06-02: Recommendation display UI (per-game view, risk badges, explanations)

### Phase 7: Preset System
**Goal**: Define Quality/Balanced/Performance presets per game, preview changes, adapt presets to hardware
**Depends on**: Phase 6
**Requirements**: PRES-01, PRES-02, PRES-03
**Success Criteria** (what must be TRUE):
  1. User can select Quality, Balanced, or Performance preset for each game
  2. User can preview what changes a preset will make before applying
  3. Presets adjust their parameters based on detected hardware
**Plans**: 2 plans

Plans:
- [ ] 07-01: Preset definition system (per-tool config templates, hardware-aware adaptation logic)
- [ ] 07-02: Preset selection UI with change preview

### Phase 8: Apply & Restore
**Goal**: Apply configurations safely with backup, execution plans, confirmation, running-game blocking, and full rollback capability
**Depends on**: Phase 7
**Requirements**: APPL-01, APPL-02, APPL-03, APPL-04, APPL-05, APPL-06, APPL-07
**Success Criteria** (what must be TRUE):
  1. User sees an execution plan before apply (files affected, risk level, backup location)
  2. Apply requires explicit user confirmation
  3. All original files are backed up before modification with integrity verification
  4. Apply is blocked if the game is currently running or prerequisites fail
  5. User can restore/rollback any change at any time
  6. User can view full history of applied optimizations
**Plans**: 3 plans

Plans:
- [ ] 08-01: Backup engine (file backup, SHA-256 verification, versioned storage, SQLite records)
- [ ] 08-02: Apply engine (execution plan generation, running-game detection, prerequisite checks, config application)
- [ ] 08-03: Restore system and optimization history UI

### Phase 9: Compliance, Credits & Polish
**Goal**: Populate the Credits/Licenses placeholder (from Phase 1) with full content, implement compliance policy documentation, third-party tool attribution, and complete final UX polish across the app
**Depends on**: Phase 8
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Credits & Licenses screen lists all integrated tools with name, author, license, and source URL
  2. Lossless Scaling never redistributed — compliance verified
  3. Compliance policy documented and accessible in the app
  4. Third-party tools clearly marked as external integrations with visible official sources
  5. Overall UX polish pass complete — consistent styling, smooth transitions, no dead ends
**Plans**: 2 plans

Plans:
- [ ] 09-01: Credits & Licenses screen, compliance documentation, third-party attribution UI
- [ ] 09-02: Final UX polish pass (consistency audit, transitions, empty states, error states)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

Note: Phases 2, 3, and 5 all depend only on Phase 1 and can potentially run in parallel.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & App Shell | 0/3 | Not started | - |
| 2. Hardware Detection | 0/2 | Not started | - |
| 3. Game Detection | 0/2 | Not started | - |
| 4. Game Library UI & Metadata | 0/2 | Not started | - |
| 5. Tool Detection & Management | 0/2 | Not started | - |
| 6. Recommendation Engine | 0/2 | Not started | - |
| 7. Preset System | 0/2 | Not started | - |
| 8. Apply & Restore | 0/3 | Not started | - |
| 9. Compliance, Credits & Polish | 0/2 | Not started | - |
