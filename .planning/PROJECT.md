# OptiHub

> **⚠️ PRODUCT DIRECTION NOTICE — Read before planning new phases**
>
> The product direction was revised after Phase 3. OptiHub is no longer only a tools hub.
> It is now a **guided optimization orchestrator** that combines native game config, external tools,
> curated knowledge, and safe rollback into one flow.
>
> Before interpreting requirements or designing new features, read:
> - `docs/optihub_mvp_revised_vision.md` — revised north star, product shape, support levels, source policy
> - `docs/optihub_roadmap_addendum.md` — revised delivery horizons (MVP / MVP-extended / post-MVP)
> - `docs/optihub_phase_10_game_config_profiles_and_safe_apply.md` — Phase 10 (MVP-extended)
> - `docs/optihub_post_mvp_knowledge_engine_roadmap.md` — post-MVP knowledge engine plan
>
> The sections below remain valid as historical context for completed phases and active requirements,
> but they do not reflect the full revised direction.

## What This Is

OptiHub is a Windows-first, offline-first desktop application that centralizes PC game optimization into a single premium hub. It detects installed games and hardware, determines the safest and most effective optimization path (native config, external tools, or a combined approach), and applies reversible configurations with user confirmation. The UI targets a modern gamer launcher aesthetic — dark premium, sidebar-based, beautiful and accessible.

**Revised North Star (post-Phase 3 direction):** Help the user find and apply the best optimization path for any detected game by combining native config, external tools, curated knowledge, and safe rollback.

## Core Value

The user can optimize any detected game with one guided flow — understand the best path for their game and hardware, apply it safely with a preview, and undo it anytime — without needing to understand the fragmented optimization ecosystem.

## Requirements

### Validated

- [x] Premium dark UI with sidebar navigation, focus/hover states, and bilingual shell support (English + Brazilian Portuguese)
  Validated in Phase 1: Foundation & App Shell
- [x] Hardware snapshot on Diagnostics and Home with CPU, GPU, RAM, display data, and inline manual display override
  Validated in Phase 2: Hardware Detection
- [x] Steam game detection now ships with a management-first library, native manual executable registration, refresh/remove actions, and visible Steam/manual provenance
  Validated in Phase 3: Game Detection

### Active

- [ ] Recommend optimization tool per game with confidence level (safe/limited/experimental)
- [ ] Explain recommendation rationale in user-friendly language
- [ ] Provide Quality/Balanced/Performance presets per game
- [ ] Apply configurations locally with explicit user confirmation
- [ ] Restore/rollback any changes made by the app
- [ ] Use Steam/SteamDB for game metadata (covers, images, descriptions)
- [ ] Integrate OptiScaler via official or user-supplied sources with per-game deployment visibility
- [ ] Integrate Lossless Scaling (detect if user owns it via Steam only — no redistribution)
- [ ] Integrate Special K as a tracked external tool with official-channel visibility
- [ ] Integrate PCGamingWiki as compatibility/fix data source
- [ ] Credits & Licenses screen listing all tools, authors, sources, and licenses
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
- **OptiScaler** — Open-source upscaler override (DLSS/FSR/XeSS). Its practical integration model is per-game deployment near the target executable, with provenance and build/channel tracking.
- **Lossless Scaling** — Paid app on Steam. Frame generation and upscaling. **Cannot be redistributed** — detect only if user owns it.
- **Special K** — Swiss Army tool for PC games. Open-source (GPLv3). Better modeled as a global integration with official-channel tracking.
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
- **Official-source bias**: Default to official acquisition channels and user-supplied local files/paths; do not promote unofficial mirrors by default
- **User consent**: All system modifications require explicit user confirmation before execution
- **Reversibility**: Every change the app makes must be undoable
- **Safety classification**: Every recommendation must carry a risk level (safe/limited/experimental)
- **Licensing compliance**: Every integrated project must have documented name, author, license, and source URL from day one

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tauri over Electron | Smaller binary, better Windows integration, Rust backend for system access | — Pending |
| React + Tailwind for frontend | User preference, large ecosystem, rapid UI development | ✓ Phase 1 scaffolded and verified |
| Lightweight in-repo i18n foundation | Keep localization offline-first and simple while blocking new hardcoded shell strings | ✓ Phase 1 bilingual shell gap closed |
| Frontend-persisted display override | Deliver monitor override in Phase 2 without inventing a broader backend settings subsystem too early | ✓ Phase 2 shipped and verified |
| Steam as primary game source | Largest PC game platform, well-documented library structure | — Pending |
| Separate manual-registration persistence | Steam rows do not reliably know executable paths in Phase 3, so manual registrations persist separately and reconcile by install root while preserving user-added provenance | ✓ Phase 3 shipped and verified |
| No Magpie integration | Explicit project owner decision | ✓ Good |
| Special K replaces Magpie role | Broader functionality, open-source, active development | — Pending |
| Offline-first architecture | Simplifies MVP, respects privacy, no server costs | ✓ Good |
| No auth/accounts in MVP | Reduces complexity, aligns with offline-first principle | ✓ Good |
| Tool-specific integration model | Treat OptiScaler per-game, Special K global, and Lossless Scaling as licensed Steam-only detection rather than flattening everything into installed/missing | — Pending |
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
*Last updated: 2026-04-04 — Product direction revised to guided optimization orchestrator; see `docs/optihub_mvp_revised_vision.md`*
