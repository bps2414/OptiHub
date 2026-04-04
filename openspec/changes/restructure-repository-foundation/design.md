## Context

OptiHub already has a real application workspace plus an active OpenSpec planning flow, but the repository still carries migration-era leftovers and generated clutter that blur the distinction between active code, historical planning, and disposable outputs. The user wants the repository to look intentional before pushing it publicly again, which makes repository structure, archival boundaries, and contributor-facing guidance the primary design concern.

This is a cross-cutting repository change because it can touch the root layout, historical planning placement, ignore coverage, and top-level documentation at the same time. The design therefore needs explicit rules for what is kept active, what is archived, and what is removed entirely.

## Goals / Non-Goals

**Goals:**
- Produce a repository layout that makes active sources, planning surfaces, and historical material immediately understandable.
- Remove or archive clutter without losing product history that still informs future work.
- Make contributor entry points explicit so new work starts from the right docs and folders.
- Establish hygiene rules that keep generated artifacts and temporary files out of the committed tree after cleanup.

**Non-Goals:**
- Redesign the application architecture, routes, or product requirements unrelated to repository hygiene.
- Rewrite historical planning content for style or completeness beyond what is needed to archive or label it clearly.
- Introduce new infrastructure, CI/CD systems, or packaging workflows unless required only to support repository hygiene directly.

## Decisions

### Decision: Use classification-first cleanup instead of ad hoc deletion
The implementation should begin with a repository audit that tags each root-level file/folder as active, historical, generated, or removable. This reduces the risk of deleting planning evidence or source material that still matters.

Alternative considered:
- Delete obvious clutter immediately. Rejected because this repository has already gone through a planning migration, so some "old-looking" files are still valid traceability inputs.

### Decision: Keep historical planning, but isolate it visually
Historical GSD materials should remain available, but they should no longer compete with OpenSpec and the active app workspace at the same visual level. The cleanup should either consolidate historical material under a clearly named archival boundary or strengthen existing boundaries so the repository root communicates what is active versus historical at a glance.

Alternative considered:
- Remove `.planning/` entirely. Rejected because existing change context and migration traceability still rely on those artifacts.

### Decision: Treat generated artifacts as non-source and remove them from the tracked workspace
Build outputs, caches, and other reproducible artifacts should be removed from version control scope and excluded through repository hygiene rules. The working tree should keep only source, planning, and intentionally curated assets.

Alternative considered:
- Leave generated outputs in place if already present locally. Rejected because the user explicitly wants a cleaner repository presentation before pushing.

### Decision: Documentation must point contributors to canonical entry points
Repository-facing docs should state where to start for implementation, planning, history, and continuity. This avoids replacing one kind of clutter with another and ensures the new layout remains understandable after the cleanup lands.

Alternative considered:
- Rely on folder names alone. Rejected because this repository has multiple planning systems in its history and needs explicit guidance.

## Risks / Trade-offs

- [Risk] Useful historical context could be deleted during cleanup. -> Mitigation: require audit/classification before removal and prefer archival moves over destructive deletion for ambiguous files.
- [Risk] The repository may look cleaner locally but still drift later if rules are undocumented. -> Mitigation: pair structural cleanup with explicit ignore and placement rules in repository-facing docs/specs.
- [Risk] Moving historical files can break references in docs. -> Mitigation: refresh top-level documentation and OpenSpec guidance as part of the same change.
- [Risk] The user's intent to "clean everything" may tempt overreach into product behavior. -> Mitigation: keep runtime/product changes out of scope and limit the change to repository hygiene and contributor guidance.

## Migration Plan

1. Audit the repository tree and define the target layout plus file classifications.
2. Update ignore rules and decide which generated directories should be removed from the working tree.
3. Move/archive historical materials into the chosen structure without losing traceability.
4. Refresh top-level documentation and contributor guidance to reflect the cleaned structure.
5. Run lightweight verification that the repository still builds from source and that the documented entry points exist.

## Open Questions

- UNCONFIRMED whether the best final archival location is to keep `.planning/` in place with stronger labeling or move it under a more explicit archive/docs boundary during apply.
- UNCONFIRMED which existing root files beyond the obvious generated outputs should be removed versus retained until the implementation audit is complete.
