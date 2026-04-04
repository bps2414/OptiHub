## Why

The repository no longer reflects the current project reality cleanly: it mixes active OpenSpec planning, historical GSD material, generated/build clutter, and stale root-level documentation in a way that makes the workspace feel unfinished and harder to maintain. This cleanup is needed now so future implementation work starts from a clearer, more trustworthy foundation before more features and assets accumulate.

## What Changes

- Audit the current repository and classify files/folders as active product source, historical reference, generated artifacts, or removable clutter.
- Reorganize root-level structure so the active application workspace, planning surfaces, and historical material are visually clearer and easier to navigate.
- Remove or archive obsolete files and directories that no longer belong in the working tree, including generated outputs and legacy planning leftovers that should not remain mixed with active sources.
- Refresh repository-facing documentation so contributors can understand what is active, what is historical, and what can be regenerated locally.
- Tighten repository hygiene rules such as ignore coverage and placement conventions so the cleaned structure stays clean after the refactor.

## Capabilities

### New Capabilities
- `repository-hygiene`: Defines how the repository structure is curated, how generated/temporary artifacts are kept out of version control, and how active versus historical materials are organized.

### Modified Capabilities
- `planning-governance`: Clarify how historical GSD artifacts remain available without competing with OpenSpec as the active workflow, and how repository-facing guidance should direct contributors through the cleaned structure.

## Impact

Affected areas include root repository layout, documentation/readmes that describe contributor workflow, ignore rules for generated artifacts, and historical planning storage under the existing planning surfaces. This change is expected to touch repository metadata and documentation more than application runtime behavior.
