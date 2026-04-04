## ADDED Requirements

### Requirement: Historical planning remains accessible without competing with OpenSpec
The repository SHALL preserve legacy planning artifacts as historical reference while presenting OpenSpec as the unambiguous workflow for new requirement and implementation changes.

#### Scenario: Contributor compares active and historical planning surfaces
- **WHEN** a contributor navigates repository planning folders after the cleanup
- **THEN** they can tell which planning surface is active for new work and which materials are retained only for historical traceability

### Requirement: Repository cleanup preserves planning traceability
Any repository-structure cleanup SHALL retain or refresh the documentation needed to trace current work from repository guidance to OpenSpec changes, baseline specs, and continuity notes.

#### Scenario: Contributor needs change context after cleanup
- **WHEN** a contributor follows the repository guidance for current work
- **THEN** they can still reach the relevant OpenSpec change directories, capability specs, and `.agent/CONTINUITY.md` without relying on removed legacy entry points
