# OptiHub

## What This Is

OptiHub is a Windows-first, offline-first desktop application that centralizes PC game optimization into a single premium hub. It detects installed games and hardware, recommends the best optimization tools per game, offers automatic presets (Quality/Balanced/Performance), and applies reversible configurations with user confirmation. The UI targets a modern gamer launcher aesthetic — dark premium, sidebar-based, beautiful and accessible.

## Core Value

The user can optimize any detected game with one guided flow — see what tool to use, pick a preset, apply it safely, and undo it anytime — without needing to understand the fragmented optimization ecosystem.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Detect games installed via Steam library
- [ ] Allow manual game/executable registration
- [ ] Detect GPU, CPU, RAM, VRAM
- [ ] Detect monitor Hz/resolution with manual fallback
- [ ] Recommend optimization tool per game with confidence level (safe/limited/experimental)
- [ ] Explain recommendation rationale in user-friendly language
- [ ] Provide Quality/Balanced/Performance presets per game
- [ ] Apply configurations locally with explicit user confirmation
- [ ] Restore/rollback any changes made by the app
- [ ] Use Steam/SteamDB for game metadata (covers, images, descriptions)
- [ ] Integrate OptiScaler (open-source upscaler override)
- [ ] Integrate Lossless Scaling (detect if user owns it via Steam only — no redistribution)
- [ ] Integrate Special K (Swiss Army tool for PC games)
- [ ] Integrate PCGamingWiki as compatibility/fix data source
- [ ] Credits & Licenses screen listing all tools, authors, sources, and licenses
- [ ] Premium dark UI with sidebar navigation (Home, Library, Games, Optimizations, Tools, Presets, Diagnostics, Settings, Credits)
- [ ] Compliance policy: no redistribution, proper attribution, license documentation for all integrated tools

### Out of Scope

- Magpie integration — explicitly excluded by project owner
- SaaS / cloud backend — offline-first, no server dependency in MVP
- User accounts / login / auth — not in MVP
- Telemetry / data collection — privacy-first approach
- Anti-cheat interactions — avoid risk and controversy
- Online competitive game focus — too risky, wrong audience for MVP
- Deep driver/kernel hacks — safety boundary
- Mobile / macOS / Linux — Windows-only in MVP
- Real-time overlay — future feature (v2/v3)
- Cloud sync — future feature (v2/v3)
- Lossless Scaling redistribution/bundling — legal constraint, must detect user's existing Steam install

## Context

**Problem space:** PC game optimization is fragmented across dozens of tools (OptiScaler, Lossless Scaling, Special K, ReShade, etc.). Users don't know which tool works for which game, which preset to pick, whether it's safe, or how to undo changes. This is especially painful for users with weaker hardware who need optimization the most.

**Target audience (priority order):**
1. Users with low-spec PCs (Potato-to-Playable)
2. Performance/tweak enthusiasts
3. Intermediate PC gamers
4. Casual gamers

**Existing ecosystem:**
- **OptiScaler** — Open-source upscaler override (DLSS/FSR/XeSS). MIT-compatible. Can be bundled with proper attribution.
- **Lossless Scaling** — Paid app on Steam. Frame generation and upscaling. **Cannot be redistributed** — detect only if user owns it.
- **Special K** — Swiss Army tool for PC games. Open-source (GPLv3). Broad compatibility.
- **PCGamingWiki** — Community wiki for PC game fixes, compatibility data, known issues. Creative Commons data.
- **Steam/SteamDB** — Game library detection, metadata, cover art.

**Monetization direction:** Free and open initially. Potential for open-core model or donations in the future. No SaaS complexity in v1.

**Future vision (not MVP):**
- Potato-to-Playable (guided optimization for low-spec PCs)
- Anti-Lag Wizard (latency reduction guidance)
- FPS Doctor (performance diagnosis and fixes)
- Real-time overlay
- Optional account/sync

## Constraints

- **Platform**: Windows only — architecture optimized for Windows APIs, no cross-platform abstractions
- **Stack**: Tauri + React + Tailwind — user's preferred stack, suitable for desktop with native access
- **Offline-first**: All core functionality must work without internet connection
- **No redistribution**: Third-party tools must not be bundled without license compliance; prefer detection of existing installs
- **Lossless Scaling**: Commercial software — integration only via detection of existing Steam install, never redistribute
- **User consent**: All system modifications require explicit user confirmation before execution
- **Reversibility**: Every change the app makes must be undoable
- **Safety classification**: Every recommendation must carry a risk level (safe/limited/experimental)
- **Licensing compliance**: Every integrated project must have documented name, author, license, and source URL from day one

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tauri over Electron | Smaller binary, better Windows integration, Rust backend for system access | — Pending |
| React + Tailwind for frontend | User preference, large ecosystem, rapid UI development | — Pending |
| Steam as primary game source | Largest PC game platform, well-documented library structure | — Pending |
| No Magpie integration | Explicit project owner decision | ✓ Good |
| Special K replaces Magpie role | Broader functionality, open-source, active development | — Pending |
| Offline-first architecture | Simplifies MVP, respects privacy, no server costs | ✓ Good |
| No auth/accounts in MVP | Reduces complexity, aligns with offline-first principle | ✓ Good |
| Detection-first integration model | Detect installed tools rather than bundle — safer legally and technically | ✓ Good |
| Risk classification system | Safe/Limited/Experimental labels build user trust and enable informed decisions | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

**README Sync (mandatory after every phase):**

Both `README.md` and `README.pt-BR.md` must always reflect the actual project state.

After any phase completion or task that changes user-facing functionality:
1. Update the phase status table in both READMEs
2. Expand the features section if a new end-user feature was delivered
3. Commit: `git add README.md README.pt-BR.md && git commit -m "docs: sync READMEs with phase {N} completion"`
4. Push: `git push origin master`

See `.planning/CONVENTIONS.md` for the full README sync policy and checklist.

---
*Last updated: 2026-04-03 — added CONVENTIONS.md, README sync policy*

