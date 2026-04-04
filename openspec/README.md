# OpenSpec Planning

OpenSpec is the active planning workflow for OptiHub. Use it for new requirement changes, workflow changes, and implementation tracking.

## Workflow

- Use `/opsx:propose <change-name-or-description>` to create proposal, design, specs, and tasks for a change.
- Use `/opsx:apply <change-name>` to implement the change tasks.
- Use `/opsx:archive <change-name>` after implementation is complete and validated.

During the migration window, the baseline planning change is [`migrate-gsd-to-openspec`](changes/migrate-gsd-to-openspec/). That change seeds the capability model and the migration rules that will eventually be promoted into `openspec/specs/`.

## Legacy source inventory

The migration from GSD to OpenSpec used these repository sources as canonical legacy input:

- `.planning/PROJECT.md`: product definition, constraints, decisions, and validated versus active scope
- `.planning/REQUIREMENTS.md`: requirement catalog and traceability by phase
- `.planning/ROADMAP.md`: phase sequencing, success criteria, and implementation grouping
- `.planning/STATE.md`: last active legacy phase state and progress snapshot

Supporting legacy evidence remains under `.planning/phases/` and `.planning/research/`.

## Capability mapping

### Requirement groups to capabilities

| Legacy requirement group | OpenSpec capability |
|--------------------------|--------------------|
| UIUX | `app-shell-ui` |
| HDWR | `hardware-detection` |
| GAME | `game-library` |
| META | `metadata-cache` |
| TOOL | `tool-integration-deployment` |
| RECO | `recommendation-engine` |
| PRES | `preset-system` |
| APPL | `apply-restore` |
| COMP | `compliance-credits` |
| Workflow / planning rules | `planning-governance` |

### Legacy phase map

| Legacy GSD phase | OpenSpec capability owner |
|------------------|---------------------------|
| Phase 1: Foundation & App Shell | `app-shell-ui` |
| Phase 2: Hardware Detection | `hardware-detection` |
| Phase 3: Game Detection | `game-library` |
| Phase 4: Game Library UI & Metadata | `game-library`, `metadata-cache` |
| Phase 5: Tool Integration & Deployment Management | `tool-integration-deployment` |
| Phase 6: Recommendation Engine | `recommendation-engine` |
| Phase 7: Preset System | `preset-system` |
| Phase 8: Apply & Restore | `apply-restore` |
| Phase 9: Compliance, Credits & Polish | `compliance-credits` |
| Legacy planning workflow rules | `planning-governance` |

## Traceability policy

- Completed GSD phases remain traceable through `.planning/phases/`, `.planning/research/`, and `.agent/CONTINUITY.md`.
- `.planning/` is kept as historical migration context and should not receive new phase or plan artifacts unless a user explicitly asks for legacy maintenance.
- New requirement evolution should happen through `openspec/changes/` against the capability model captured in the migration baseline.

## Where to look

- Active change work: `openspec/changes/`
- Active capability baseline after archival: `openspec/specs/`
- Historical GSD archive: `.planning/`
- Continuity briefing: `.agent/CONTINUITY.md`
- Repository map and cleanup rules: `docs/repository-structure.md`
