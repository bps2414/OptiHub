## Context

OptiHub already has substantial planning coverage under `.planning/`, including product definition, requirements, roadmap, active phase state, and per-phase execution artifacts. The repository also already has OpenSpec initialized, but `openspec/specs/` is empty, so future requirement changes cannot yet be expressed as capability deltas.

This migration must preserve the current product shape:

- Phases 1 through 3 are already implemented and validated.
- Phase 4 is the current planning focus.
- Phases 5 through 9 are defined in roadmap and requirements form but not yet implemented.
- Repository guidance still references the GSD workflow as the default execution path.

The change therefore needs to seed an OpenSpec baseline from the existing GSD truth without silently changing product intent or discarding historical execution evidence.

## Goals / Non-Goals

**Goals:**

- Create a durable OpenSpec capability baseline that captures the current OptiHub product scope by domain.
- Define how existing GSD artifacts map into OpenSpec so future work can use change-driven deltas.
- Preserve completed GSD phase history as migration input and historical evidence.
- Make the post-migration planning workflow clear enough that contributors know where new requirement changes belong.

**Non-Goals:**

- Re-implementing product code or changing runtime behavior.
- Re-prioritizing the roadmap beyond translating it into OpenSpec capabilities.
- Deleting all `.planning` artifacts in the same change.
- Rewriting historical execution notes into full OpenSpec change history for every completed phase.

## Decisions

### 1. Model the product by enduring capabilities, not by GSD phase numbers

OpenSpec specs will be created around product domains such as `hardware-detection`, `game-library`, and `apply-restore`, rather than around `phase-01`, `phase-02`, and so on. This keeps specs stable as the roadmap evolves and lets future changes target behavior instead of a one-time execution batch.

Alternatives considered:

- Keep one spec per GSD phase: rejected because phases mix multiple concerns and are temporary execution slices, not lasting capabilities.
- Create one monolithic OptiHub spec: rejected because it would make future delta changes noisy and hard to review.

### 2. Treat `.planning/*` as migration input and historical context, not the forward source of truth

The migration will use `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, and relevant phase docs as source material, but once the OpenSpec baseline is applied, future requirement evolution should happen through `openspec/changes/*` and `openspec/specs/*`.

Alternatives considered:

- Delete `.planning` immediately: rejected because it removes useful historical execution evidence and increases migration risk.
- Keep dual-write between GSD and OpenSpec indefinitely: rejected because it creates avoidable drift and duplicate maintenance.

### 3. Add a dedicated `planning-governance` capability

The workflow migration itself needs normative requirements, not just README prose. A `planning-governance` spec will define how the repo stores planning truth, how completed GSD artifacts are treated, and how future contributors should introduce changes.

Alternatives considered:

- Rely only on AGENTS or README instructions: rejected because the workflow rules themselves are part of the system being migrated.

### 4. Seed baseline specs from current requirements, regardless of implementation status

The initial OpenSpec baseline will capture the desired product behavior across validated and pending roadmap areas. Implementation completeness remains a roadmap/change-history concern, not something encoded as partial or disabled requirements inside the specs.

Alternatives considered:

- Only spec the already-built phases: rejected because it would leave future roadmap areas outside OpenSpec and weaken the migration.
- Label every requirement as validated or pending inside the spec text: rejected because status belongs to change history and roadmap tracking, not normative behavior definitions.

### 5. Preserve roadmap sequencing as governance metadata rather than baking it into each capability spec

Capability specs should explain what the system must do. The migration-specific ordering, execution waves, and phase equivalence should be captured in governance and migration documentation so capability files remain focused and reusable.

Alternatives considered:

- Embed phase numbers throughout each spec: rejected because it couples long-lived requirements to a temporary execution plan.

## Risks / Trade-offs

- [Risk] A literal copy from GSD docs could leak implementation or validation detail into normative specs. -> Mitigation: use `.planning/REQUIREMENTS.md` as the primary behavioral source and phase documents only as supporting context.
- [Risk] Contributors may keep using both workflows and create planning drift. -> Mitigation: update repository guidance as part of implementation so new work points to OpenSpec first and `.planning` is explicitly historical or transitional.
- [Risk] Translating from phase-based planning to capability specs may obscure current execution order. -> Mitigation: keep roadmap sequencing documented in governance artifacts and migration notes.
- [Risk] The baseline change touches many capability files at once, which increases review surface. -> Mitigation: align capability boundaries to the existing requirements categories so reviewers can compare one domain at a time.

## Migration Plan

1. Audit the current GSD sources of truth and map each requirement group to a stable OpenSpec capability.
2. Create baseline capability spec files inside the migration change for both product behavior and workflow governance.
3. Update contributor-facing guidance so future planning changes are proposed and applied through OpenSpec.
4. Mark `.planning` as historical or transitional after the OpenSpec baseline is applied, preserving existing execution evidence.

Rollback strategy:

- Before apply: discard the change and continue using `.planning` as the active planning system.
- After apply: if workflow adoption causes confusion, keep `.planning` available as read-only history while refining governance guidance in follow-up OpenSpec changes.

## Open Questions

- Should `.planning` remain read-only in-repo after migration, or should it be moved under an archival subdirectory once the team is comfortable with OpenSpec?
- Do completed phases 1 through 3 need backfilled archived OpenSpec changes for historical traceability, or is a baseline spec plus historical `.planning` evidence sufficient?
- Should the README progress model continue to emphasize numbered phases, or should it eventually surface OpenSpec capabilities and active changes instead?
