---
phase: 02
slug: hardware-detection
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-03T02:03:23.0692935-03:00
---

# Phase 02 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `cargo test` + `vitest` + repo lint/build checks |
| **Config file** | `vitest.config.ts` and Rust unit-test harness in `src-tauri/` |
| **Quick run command** | `cargo test --manifest-path src-tauri/Cargo.toml hardware::tests -- --nocapture` |
| **Full suite command** | `pnpm test && pnpm lint && pnpm build && cargo test --manifest-path src-tauri/Cargo.toml --jobs 1` |
| **Estimated runtime** | ~60-120 seconds after dependencies are warm |

---

## Sampling Rate

- **After every task commit:** Run `cargo test --manifest-path src-tauri/Cargo.toml hardware::tests -- --nocapture` for backend tasks, or the targeted `pnpm test -- <file>` command once Phase 2 frontend test files exist.
- **After every plan wave:** Run `pnpm test && pnpm lint && pnpm build && cargo test --manifest-path src-tauri/Cargo.toml --jobs 1`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | HDWR-01, HDWR-02, HDWR-03 | unit | `cargo test --manifest-path src-tauri/Cargo.toml hardware::tests::cpu_and_memory -- --nocapture` | ❌ W0 | pending |
| 02-01-02 | 01 | 1 | HDWR-01, HDWR-04 | unit | `cargo test --manifest-path src-tauri/Cargo.toml hardware::tests::gpu_and_display -- --nocapture` | ❌ W0 | pending |
| 02-01-03 | 01 | 1 | HDWR-04, HDWR-05 | integration | `cargo test --manifest-path src-tauri/Cargo.toml hardware::tests -- --nocapture` | ❌ W0 | pending |
| 02-02-01 | 02 | 2 | HDWR-01, HDWR-02, HDWR-03, HDWR-04, HDWR-05 | component | `pnpm test -- src/pages/DiagnosticsPage.test.tsx` | ❌ W0 | pending |
| 02-02-02 | 02 | 2 | HDWR-05 | component | `pnpm test -- src/components/hardware/DisplayOverrideForm.test.tsx` | ❌ W0 | pending |
| 02-02-03 | 02 | 2 | HDWR-06 | component | `pnpm test -- src/pages/HomePage.hardware.test.tsx` | ❌ W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `src-tauri/src/commands/hardware.rs` - add focused `#[cfg(test)]` coverage for normalization and fallback behavior
- [ ] `src/pages/DiagnosticsPage.test.tsx` - grouped card rendering and unavailable-state coverage
- [ ] `src/components/hardware/DisplayOverrideForm.test.tsx` - enable/apply/reset override flow
- [ ] `src/pages/HomePage.hardware.test.tsx` - compact summary widget content and load/error states

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Display mode matches a real Windows monitor | HDWR-04 | The agent cannot inspect the actual connected monitor stack in this planning step | Open Diagnostics on Windows, compare detected width / height / Hz against Windows Display Settings for the active monitor |
| Manual override is clearly labeled and reversible | HDWR-05 | The inline override flow is partly visual / UX-driven | Enable override in the Display card, set width / height / Hz, confirm labels switch to "Manual override active", then reset and confirm detected values return |
| Home summary gives useful at-a-glance values | HDWR-06 | Value usefulness is partly product judgement | Load Home after hardware snapshot resolves and confirm the summary shows one concise line each for CPU, GPU, RAM, and Display |

---

## Validation Sign-Off

- [x] All planned tasks have automated verification targets or explicit Wave 0 dependencies
- [x] Sampling continuity avoids long stretches without an automated check
- [x] Wave 0 creates the missing frontend coverage files required by this phase
- [x] No watch-mode flags are part of the planned verification path
- [x] Feedback latency is expected to stay under 120 seconds on a warm workspace
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-03T02:03:23.0692935-03:00
