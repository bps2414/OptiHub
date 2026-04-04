---
phase: 03
slug: game-detection
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-03T23:00:58.0674620-03:00
---

# Phase 03 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `cargo test` + `vitest` + repo lint/build checks |
| **Config file** | `vitest.config.ts` and Rust unit-test harness in `src-tauri/` |
| **Quick run command** | `cargo test --manifest-path src-tauri/Cargo.toml games::tests -- --nocapture` |
| **Full suite command** | `pnpm test && pnpm lint && pnpm build && cargo test --manifest-path src-tauri/Cargo.toml --jobs 1` |
| **Estimated runtime** | ~90-150 seconds after dependencies are warm |

---

## Sampling Rate

- **After every task commit:** Run `cargo test --manifest-path src-tauri/Cargo.toml games::tests -- --nocapture` for backend-heavy tasks, or the targeted `pnpm test -- <file>` command once the new Phase 3 frontend tests exist.
- **After every plan wave:** Run `pnpm test && pnpm lint && pnpm build && cargo test --manifest-path src-tauri/Cargo.toml --jobs 1`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 150 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | GAME-01, GAME-04 | unit | `cargo test --manifest-path src-tauri/Cargo.toml games::tests::steam_contracts -- --nocapture` | ❌ W0 | pending |
| 03-01-02 | 01 | 1 | GAME-01, GAME-04 | unit | `cargo test --manifest-path src-tauri/Cargo.toml games::tests::steam_parsing -- --nocapture` | ❌ W0 | pending |
| 03-01-03 | 01 | 1 | GAME-01, GAME-04 | integration | `cargo test --manifest-path src-tauri/Cargo.toml games::tests -- --nocapture` | ❌ W0 | pending |
| 03-02-01 | 02 | 2 | GAME-02, GAME-05 | unit | `cargo test --manifest-path src-tauri/Cargo.toml games::tests::manual_registry -- --nocapture` | ❌ W0 | pending |
| 03-02-02 | 02 | 2 | GAME-02, GAME-05, GAME-06 | component | `pnpm test -- src/components/games/GameLibraryTable.test.tsx src/components/games/ManualGameRegistrationForm.test.tsx` | ❌ W0 | pending |
| 03-02-03 | 02 | 2 | GAME-01, GAME-04, GAME-05, GAME-06 | component | `pnpm test -- src/pages/LibraryPage.test.tsx` | ❌ W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `src-tauri/src/commands/games.rs` - add focused `#[cfg(test)]` coverage for Steam path parsing, manifest parsing, dedupe, and manual/Steam merge behavior
- [ ] `src/pages/LibraryPage.test.tsx` - compact management list rendering, auto-refresh trigger, and empty/error state coverage
- [ ] `src/components/games/GameLibraryTable.test.tsx` - source badge rendering and manual-only remove action coverage
- [ ] `src/components/games/ManualGameRegistrationForm.test.tsx` - confirmation form, save/cancel flow, and required display-name coverage

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Steam installs on secondary libraries are detected correctly | GAME-01, GAME-04 | The agent cannot inspect a real multi-drive Steam installation during planning | On Windows with Steam installed on at least two libraries, open Library, confirm the first load auto-refreshes, and verify titles from both `steamapps` roots appear |
| Native executable picker returns a real `.exe` path | GAME-02 | The dialog plugin depends on the local desktop environment | Click the add-game action, choose a `.exe`, confirm the form populates the selected path, and save |
| Removing a manual-only game is reversible only through re-add, while Steam rows are not removable | GAME-05, GAME-06 | This is partly a UX / affordance rule | Add a manual game, confirm the row shows `Manual` and a remove action, remove it, then confirm a Steam row shows `Steam` and no remove action |

---

## Validation Sign-Off

- [x] All planned tasks have automated verification targets or explicit Wave 0 dependencies
- [x] Sampling continuity avoids long stretches without an automated check
- [x] Wave 0 creates the missing backend/frontend coverage files required by this phase
- [x] No watch-mode flags are part of the planned verification path
- [x] Feedback latency is expected to stay under 150 seconds on a warm workspace
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-03T23:00:58.0674620-03:00
