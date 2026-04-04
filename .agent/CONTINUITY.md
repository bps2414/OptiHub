# Continuity

[PLANS]
- 2026-04-03T23:11:10Z [CODE] Planned Phase 3 with `03-RESEARCH.md`, `03-VALIDATION.md`, `03-01-PLAN.md`, and `03-02-PLAN.md`; requirement coverage for `GAME-01`, `GAME-02`, `GAME-04`, `GAME-05`, and `GAME-06` is explicitly mapped across the two plans.
- 2026-04-04T01:55:00Z [CODE] Debugged and fixed the Phase 2 UAT gap around incorrect VRAM plus ugly display names, then updated `02-UAT.md` to resolved.
- 2026-04-04T01:51:30Z [CODE] Gathered Phase 3 context and wrote `03-CONTEXT.md` plus `03-DISCUSSION-LOG.md`; the workspace is ready for Phase 3 planning.
- 2026-04-03T04:13:35Z [TOOL] Executed Phase 1 inline across plans `01-01`, `01-02`, and `01-03`; verification evidence came from `pnpm install`, `pnpm lint`, `pnpm build`, `cargo check` (temp target dir), and a short `pnpm tauri dev --no-watch` smoke run.
- 2026-04-03T05:12:54Z [CODE] Planned Phase 2 with research-first artifacts: `02-RESEARCH.md`, `02-VALIDATION.md`, `02-01-PLAN.md`, and `02-02-PLAN.md`.
- 2026-04-03T18:52:12Z [CODE] Executed Phase 2 inline across plans `02-01` and `02-02`; verification evidence came from targeted Vitest hardware tests, full `pnpm test`, `pnpm lint`, `pnpm build`, and full `cargo test`.

[DECISIONS]
- 2026-04-04T01:55:00Z [CODE] GPU VRAM now prefers DXGI dedicated video memory over `Win32_VideoController.AdapterRAM`, while display naming hides raw/generic monitor labels instead of surfacing them directly.
- 2026-04-04T02:01:00Z [USER] Project-level agent guidance now requires all user-facing responses and commentary in pt-BR while keeping source code, identifiers, commits, and code comments in English unless explicitly requested otherwise.
- 2026-04-04T01:51:30Z [USER] Locked Phase 3 toward a compact management-first game list, confirmation-based manual registration, visible Steam/manual provenance, and duplicate merging that promotes matching manual entries to Steam origin.
- 2026-04-03T04:13:35Z [CODE] Kept OptiHub Windows-only in build tooling by targeting `chrome105` in `vite.config.ts`.
- 2026-04-03T04:13:35Z [CODE] Standardized IPC through `src-tauri/src/commands/*` on the Rust side and `src/lib/tauri.ts` on the frontend side.
- 2026-04-03T04:54:15Z [CODE] Closed the Phase 1 language gap with a lightweight in-repo i18n layer under `src/i18n/*` instead of adding a full external runtime library.
- 2026-04-03T18:52:12Z [CODE] Kept manual display override in the frontend hardware store for Phase 2 so detected hardware data stays backend-authored while override UX ships without a broader settings subsystem.

[PROGRESS]
- 2026-04-04T01:51:30Z [USER] Switched the discuss-phase conversation to Portuguese and accepted the recommended refresh model: auto-scan on library open plus explicit manual refresh.
- 2026-04-03T04:13:35Z [TOOL] `create-tauri-app` was replaced by temp Vite scaffold + `tauri init --ci` because the repo root already contained planning/tooling files and needed an in-place setup path.
- 2026-04-03T05:00:00Z [USER] Requested that any further Phase 1 validation be skipped; follow-up work in this turn was limited to syncing `.planning/*`, READMEs, and continuity/docs with the bilingual shell outcome.

[DISCOVERIES]
- 2026-04-03T23:11:10Z [CODE] Phase 3 needs a native executable picker for trustworthy manual registration; the planning artifacts therefore standardize on the Tauri dialog plugin instead of browser file inputs.
- 2026-04-04T01:55:00Z [TOOL] On this machine, `Win32_VideoController.AdapterRAM` reported ~4.29 GB for `AMD Radeon RX 6600`, while `dxdiag` reported ~8.1 GB dedicated memory; this confirmed the VRAM bug was a source-data issue rather than formatting math.
- 2026-04-04T01:51:30Z [CODE] Existing placeholders in `src/pages/LibraryPage.tsx` and `src/pages/GamesPage.tsx` are sufficient to absorb a compact Phase 3 management UI; cover-art-specific Steam badging is explicitly deferred to Phase 4.
- 2026-04-03T04:13:35Z [TOOL] Vite 8/Tailwind 4 in this workspace required explicit `esbuild` installation for production build completion.
- 2026-04-03T04:13:35Z [TOOL] In-repo Cargo target directories hit Windows file-lock errors during verification; temp target directory plus `CARGO_INCREMENTAL=0` produced a successful `cargo check`.
- 2026-04-03T04:54:15Z [TOOL] `react-refresh/only-export-components` requires the i18n provider, context, and hook to live in separate files for lint-clean React fast refresh boundaries.
- 2026-04-03T05:12:54Z [CODE] Phase 2 research favors `sysinfo` + `wmi` + direct Win32 display enumeration over a WMI-only monitor path, and keeps manual display override persisted in the frontend until a broader settings subsystem exists.
- 2026-04-03T18:52:12Z [TOOL] `wmi 0.18.4` only compiled cleanly in this workspace after downgrading `sysinfo` to `0.37.2`; `sysinfo 0.38.x` introduced a `windows_core` split that blocked the backend before the new tests ran.

[OUTCOMES]
- 2026-04-03T23:11:10Z [CODE] Phase 3 is now plan-ready for execution with a wave-1 backend Steam scan plan and a wave-2 persistence/UI management plan, plus matching validation strategy and internal research.
- 2026-04-04T01:55:00Z [CODE] Phase 2 UAT is now closed as complete after switching VRAM detection to DXGI-backed dedicated memory and cleaning display labels; verification passed again via `pnpm test`, `pnpm lint`, `pnpm build`, `cargo test`, and `pnpm tauri build`.
- 2026-04-04T02:01:00Z [CODE] `AGENTS.md` now includes an explicit language policy for this repository: assistant communication in pt-BR and code artifacts in English.
- 2026-04-04T01:51:30Z [CODE] Phase 3 context is captured with explicit decisions for list-style library management, confirmation-based manual registration, Steam/manual source rules, duplicate merging, and a carry-forward note for Steam icon placement on future game covers.
- 2026-04-03T18:52:12Z [CODE] Phase 2 now delivers live Diagnostics hardware cards, a Home hardware summary widget, and inline manual display override on top of the new `get_hardware_snapshot` IPC command; verification passed and the project is ready to move to Phase 3.
- 2026-04-03T04:54:15Z [CODE] Phase 1 shell now supports English plus Brazilian Portuguese with locale detection, persisted language choice, shell/page copy catalogs, and a locale-aware Rust greeting; verification passed via `pnpm test`, `pnpm lint`, `pnpm build`, and `cargo test`.
- 2026-04-03T05:12:54Z [CODE] Phase 2 is ready for execution with backend-first plan `02-01` and UI plan `02-02`; local planning checks confirmed research, validation, and HDWR requirement coverage artifacts exist.
- 2026-04-03T04:13:35Z [CODE] Phase 1 delivered the desktop scaffold, premium dark routed shell, and verified Rust↔React IPC health indicator on Home. Phase 2 can build directly on the current commands/layout structure.
