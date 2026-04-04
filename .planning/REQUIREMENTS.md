# Requirements: OptiHub

**Defined:** 2026-04-03
**Core Value:** The user can optimize any detected game with one guided flow — see what tool to use, pick a preset, apply it safely, and undo it anytime — without needing to understand the fragmented optimization ecosystem.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Game Detection

- [x] **GAME-01**: User can view automatically detected Steam games in the game library; richer cover art and metadata presentation is handled in Phase 4
- [x] **GAME-02**: User can register a game manually by pointing to an executable
- [ ] **GAME-03**: User can view game details (name, install path, size, platform info)
- [x] **GAME-04**: User can refresh game library to detect newly installed games
- [x] **GAME-05**: User can remove a manually added game from the library
- [x] **GAME-06**: User can visually distinguish auto-detected Steam games from manually added games

### Hardware Detection

- [x] **HDWR-01**: User can view detected GPU model and VRAM
- [x] **HDWR-02**: User can view detected CPU model and core count
- [x] **HDWR-03**: User can view detected RAM amount
- [x] **HDWR-04**: User can view detected monitor resolution and refresh rate (best-effort auto-detection with manual override as a normal, expected flow)
- [x] **HDWR-05**: User can manually set monitor Hz/resolution at any time, treated as a first-class input rather than a fallback
- [x] **HDWR-06**: User can view a system diagnostics summary on the home screen

### Tool Integration & Deployment Management

- [ ] **TOOL-01**: App models supported tools by integration type instead of a single generic installed/missing state
- [ ] **TOOL-02**: App can detect whether OptiScaler is deployed for a specific game and show the deployed version/build/channel when identifiable
- [ ] **TOOL-03**: App supports OptiScaler official acquisition plus manual local archive/path registration with explicit provenance
- [ ] **TOOL-04**: App can detect or register Special K as a global integration and show its version/status
- [ ] **TOOL-05**: App supports Special K official acquisition and any officially supported experimental/update channel without defaulting to unofficial mirrors
- [ ] **TOOL-06**: App detects Lossless Scaling via the user's Steam library (app ID 993090) only — no redistribution, bundling, bypass, or unofficial acquisition path
- [ ] **TOOL-07**: User can view a tools overview that distinguishes global tool state, local source registration, and per-game deployment state
- [ ] **TOOL-08**: App records and shows release channel/build provenance where relevant (for example stable vs nightly/rolling)
- [ ] **TOOL-09**: App records and shows official source/compliance state for every tool record (official source, user-supplied local source, licensed Steam detection, or unknown/unverified)
- [ ] **TOOL-10**: Tools UI shows name, author, version/build, source URL, license/compliance notes, and release channel where relevant for all supported third-party tools

### Recommendations

- [ ] **RECO-01**: User can see which optimization tool is recommended for each game
- [ ] **RECO-02**: Each recommendation has a confidence/risk level (Safe/Limited/Experimental)
- [ ] **RECO-03**: Each recommendation includes a user-friendly explanation of why
- [ ] **RECO-04**: Recommendations consider user's hardware (GPU vendor, VRAM, etc.)
- [ ] **RECO-05**: App can display "no safe recommendation available" when no tool is confidently compatible, instead of forcing a recommendation

### Presets

- [ ] **PRES-01**: User can choose between Quality, Balanced, and Performance presets per game
- [ ] **PRES-02**: User can preview what a preset will change before applying
- [ ] **PRES-03**: Presets adapt based on detected hardware capabilities

### Apply & Restore

- [ ] **APPL-01**: User can apply a selected preset with explicit confirmation before execution
- [ ] **APPL-02**: App backs up all original files before any modification
- [ ] **APPL-03**: User can restore/rollback any changes made by the app at any time
- [ ] **APPL-04**: User can view history of all applied optimizations and their status
- [ ] **APPL-05**: App verifies backup integrity before confirming successful backup
- [ ] **APPL-06**: App shows an execution plan before apply (tool, files affected, risk level, backup location)
- [ ] **APPL-07**: App blocks apply if the game is currently running or if prerequisites fail

### Metadata

- [ ] **META-01**: App fetches game cover art and descriptions from Steam/SteamDB when available and legally usable
- [ ] **META-02**: App works fully offline using cached metadata

### UI/UX

- [x] **UIUX-01**: App has a premium dark theme with sidebar navigation
- [x] **UIUX-02**: Sidebar includes: Home, Library, Games, Optimizations, Tools, Presets, Diagnostics, Settings, Credits
- [x] **UIUX-05**: App shell supports English and Brazilian Portuguese with a persisted language choice and locale-based default
- [x] **UIUX-04**: All interactive elements have clear hover/focus states

### Compliance

- [ ] **COMP-01**: App has a Credits & Licenses screen listing all integrated tools with name, author, license, and source URL
- [ ] **COMP-02**: App never redistributes Lossless Scaling — detection only
- [ ] **COMP-03**: App documents compliance policy for all third-party tool integrations
- [ ] **COMP-04**: App clearly marks third-party tools as external integrations with visible official source and credits in the UI

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### UI/UX Enhancements

- **UIUX-03**: App has responsive layout that works well across different screen sizes
- **META-03**: User can manually provide game metadata when auto-fetch fails

### Data Integration

- **PCGW-01**: PCGamingWiki integration for compatibility data and known fixes per game

### Advanced Features

- **P2P-01**: Potato-to-Playable mode — guided optimization for very low-spec PCs
- **ALAG-01**: Anti-Lag Wizard — latency reduction guidance
- **FPSD-01**: FPS Doctor — performance diagnosis and automated fixes
- **OVRL-01**: Real-time overlay — in-game performance monitoring
- **SYNC-01**: Optional account/sync — cloud backup of settings and presets
- **BTCH-01**: Batch optimization — apply presets to multiple games at once
- **CUST-01**: Advanced preset editor — user creates custom presets beyond Quality/Balanced/Performance

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Magpie integration | Explicitly excluded by project owner |
| SaaS / cloud backend | Offline-first, no server dependency in MVP |
| User accounts / login / auth | Not in MVP — reduces complexity, aligns with offline-first |
| Telemetry / data collection | Privacy-first approach |
| Anti-cheat interactions | Legal risk, account bans, controversy |
| Online competitive game focus | Wrong audience for MVP, high risk |
| Driver/kernel-level modifications | Safety boundary, Windows instability risk |
| macOS / Linux support | Windows-only in MVP, architecture optimized for Windows APIs |
| Lossless Scaling redistribution/bundling | Legal constraint — detect existing Steam install only |
| Tool auto-download/bundling | Legal and licensing risk in v1 |
| Real-time overlay | Future feature (v2/v3) |
| Cloud sync | Future feature (v2/v3) |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| UIUX-01 | Phase 1 | Complete |
| UIUX-02 | Phase 1 | Complete |
| UIUX-05 | Phase 1 | Complete |
| UIUX-04 | Phase 1 | Complete |
| HDWR-01 | Phase 2 | Complete |
| HDWR-02 | Phase 2 | Complete |
| HDWR-03 | Phase 2 | Complete |
| HDWR-04 | Phase 2 | Complete |
| HDWR-05 | Phase 2 | Complete |
| HDWR-06 | Phase 2 | Complete |
| GAME-01 | Phase 3 | Complete |
| GAME-02 | Phase 3 | Complete |
| GAME-04 | Phase 3 | Complete |
| GAME-05 | Phase 3 | Complete |
| GAME-06 | Phase 3 | Complete |
| GAME-03 | Phase 4 | Pending |
| META-01 | Phase 4 | Pending |
| META-02 | Phase 4 | Pending |
| TOOL-01 | Phase 5 | Pending |
| TOOL-02 | Phase 5 | Pending |
| TOOL-03 | Phase 5 | Pending |
| TOOL-04 | Phase 5 | Pending |
| TOOL-05 | Phase 5 | Pending |
| TOOL-06 | Phase 5 | Pending |
| TOOL-07 | Phase 5 | Pending |
| TOOL-08 | Phase 5 | Pending |
| TOOL-09 | Phase 5 | Pending |
| TOOL-10 | Phase 5 | Pending |
| RECO-01 | Phase 6 | Pending |
| RECO-02 | Phase 6 | Pending |
| RECO-03 | Phase 6 | Pending |
| RECO-04 | Phase 6 | Pending |
| RECO-05 | Phase 6 | Pending |
| PRES-01 | Phase 7 | Pending |
| PRES-02 | Phase 7 | Pending |
| PRES-03 | Phase 7 | Pending |
| APPL-01 | Phase 8 | Pending |
| APPL-02 | Phase 8 | Pending |
| APPL-03 | Phase 8 | Pending |
| APPL-04 | Phase 8 | Pending |
| APPL-05 | Phase 8 | Pending |
| APPL-06 | Phase 8 | Pending |
| APPL-07 | Phase 8 | Pending |
| COMP-01 | Phase 9 | Pending |
| COMP-02 | Phase 9 | Pending |
| COMP-03 | Phase 9 | Pending |
| COMP-04 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-03 after Phase 3 game detection completion*
