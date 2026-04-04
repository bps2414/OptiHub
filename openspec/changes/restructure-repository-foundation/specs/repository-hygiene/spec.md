## ADDED Requirements

### Requirement: Repository structure separates active, historical, and generated materials
The repository SHALL organize active product source, active planning surfaces, historical planning artifacts, and generated outputs so contributors can distinguish them without inspecting file history.

#### Scenario: Contributor opens the repository root
- **WHEN** a contributor lists the root structure after the cleanup
- **THEN** active application source, active OpenSpec planning, and historical materials appear in clearly separated locations or clearly labeled boundaries

### Requirement: Generated artifacts do not remain in the committed working tree
The repository SHALL keep build outputs, caches, and other reproducible local artifacts out of version-controlled structure unless a file is intentionally curated project source.

#### Scenario: Contributor prepares the repository for push
- **WHEN** generated artifacts such as local build output or cache directories are present
- **THEN** the repository guidance and ignore rules make clear that those artifacts are removable and should not be committed as project source

### Requirement: Repository entry points are documented
The repository SHALL document canonical entry points for active implementation work, active planning, historical reference material, and continuity context.

#### Scenario: Contributor needs to know where to start
- **WHEN** a contributor reads the repository-facing documentation after cleanup
- **THEN** they can identify where active code lives, where new changes are proposed and applied, where historical planning is stored, and where the continuity briefing is maintained
