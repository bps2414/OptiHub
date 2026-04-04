# Repository Structure

This repository keeps active product work, active planning, and historical planning in separate surfaces so contributors can orient quickly before changing anything.

## Root Classification

| Path | Classification | Purpose |
| --- | --- | --- |
| `src/`, `public/`, `src-tauri/`, root config files | Active source | Frontend, Tauri backend, assets, and build configuration that define the product |
| `openspec/` | Active planning | New requirements, implementation checklists, and capability-oriented planning |
| `.planning/` | Historical planning | Legacy GSD artifacts retained only for migration traceability and old execution context |
| `.agent/CONTINUITY.md` | Active continuity | Canonical short-form briefing for the current workspace state |
| `.agent/skills/`, `.agent/workflows/`, `.codex/` | Local-only tooling | Agent helper artifacts that should stay out of version control |
| `dist/`, `src-tauri/target*/`, `src-tauri/src-tauri/` | Generated output | Reproducible local build artifacts that should be removed before push |

## Target Layout

The intended repository layout is:

1. Product source stays at the root under `src/`, `public/`, `src-tauri/`, and the project config files.
2. OpenSpec remains the only active planning workflow under `openspec/`.
3. Legacy GSD material remains in `.planning/`, but only as a historical archive with its own README marker.
4. Local agent helper folders and build outputs remain untracked and removable.

## Contributor Entry Points

- Start product work from `src/`, `src-tauri/`, and the root package/build files.
- Start planning work from `openspec/README.md` and `openspec/changes/`.
- Use `.planning/README.md` only when historical migration context is needed.
- Read `.agent/CONTINUITY.md` at the start of every task to recover current decisions and progress.

## Cleanup Rules

- Do not commit generated folders such as `dist/`, `src-tauri/target*/`, or accidental nested build trees like `src-tauri/src-tauri/`.
- Do not treat `.planning/` as an active planning surface for new work.
- If repository structure changes again, update this file together with `openspec/README.md` and any contributor-facing README sections.
