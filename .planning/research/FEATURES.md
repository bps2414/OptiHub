# Features Research: OptiHub

## Domain: PC Game Optimization Hub

### Table Stakes (Must-Have — Users Expect These)

| Feature | Complexity | Notes |
|---------|-----------|-------|
| Game library detection (Steam) | Medium | Parse VDF files, read Windows Registry for Steam path |
| Hardware detection (CPU, GPU, RAM) | Medium | sysinfo + WMI crates. VRAM via Win32_VideoController |
| Game detail view with metadata | Medium | Cover art, description, platform info from Steam/SteamDB |
| Preset system (Quality/Balanced/Performance) | Medium | Per-game and per-tool preset configurations |
| Apply/undo mechanism | High | File backup before modification, restore on demand |
| Tool recommendation per game | High | Rules engine mapping game → compatible tools → confidence |
| Settings/preferences | Low | App-level settings (theme, language, paths) |
| Credits & licenses screen | Low | Static page listing all integrated projects |

### Differentiators (Competitive Advantage)

| Feature | Complexity | Notes |
|---------|-----------|-------|
| Guided optimization flow (wizard-style) | Medium | Step-by-step with explanations, not just a "Apply" button |
| Risk classification (Safe/Limited/Experimental) | Medium | Trust signal — builds confidence in non-technical users |
| Tool integration (OptiScaler, Special K, LS) | High | Detect installations, configure, prepare DLL placements |
| PCGamingWiki data integration | High | Cargo API queries, robust wikitext parsing |
| Contextual explanations ("why this tool?") | Medium | Natural language rationale for each recommendation |
| Batch diagnostics view | Medium | System overview showing hardware + all detected tools |
| Manual executable registration | Low | For non-Steam games or custom setups |
| Monitor Hz/resolution detection with manual fallback | Low-Medium | Reliable auto-detect + manual override |

### Anti-Features (Things to Deliberately NOT Build)

| Feature | Why Not |
|---------|---------|
| Anti-cheat bypass/interaction | Legal risk, account bans, controversy |
| Online competitive game focus | Wrong audience, high risk |
| Driver/kernel-level modifications | Safety boundary, Windows instability risk |
| Game piracy detection/support | Legal and ethical red line |
| Telemetry/data collection | Privacy-first principle |
| Cloud sync/accounts (MVP) | Unnecessary complexity |
| Tool redistribution | License violations, legal risk |
| Auto-apply without confirmation | Violates user consent principle |
| Magpie integration | Explicitly excluded by project owner |

### Feature Dependencies

```
Game Detection ──> Game Detail View ──> Tool Recommendation ──> Preset Selection ──> Apply Flow
     │                   │                      │                      │
     └── Hardware Detection                     └── Tool Detection     └── Backup/Restore
                                                     │
                                                     └── PCGamingWiki Data
```

### Market Context

**Existing tools in this space:**
- **GeForce Experience / AMD Adrenalin** — GPU vendor-specific, limited to their own optimization
- **Razer Cortex** — Game booster, not deep optimization
- **Afterburner** — Monitoring/OC only, not game-specific optimization
- **Individual tools** — OptiScaler, Special K, Lossless Scaling etc. work independently

**Gap OptiHub fills:** No tool unifies detection + recommendation + integration + presets + safety classification in one place. The closest analogy is a "package manager for game optimizations."

---
*Researched: 2026-04-02*
