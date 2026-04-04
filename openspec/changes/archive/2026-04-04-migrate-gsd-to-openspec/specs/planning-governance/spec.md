## ADDED Requirements

### Requirement: OpenSpec governs future planning changes
The repository SHALL use OpenSpec capabilities and changes as the forward-looking source of truth for product requirements and workflow evolution after the migration baseline is applied.

#### Scenario: New requirement change is proposed
- **WHEN** a contributor needs to add, modify, or remove product behavior after migration
- **THEN** the change is authored under `openspec/changes/` against one or more OpenSpec capabilities

### Requirement: GSD artifacts remain available as migration history
The repository SHALL retain the existing `.planning/` artifacts as historical migration input until they are explicitly archived by a follow-up decision.

#### Scenario: Historical phase context is needed
- **WHEN** a contributor needs evidence from previously completed phases or planning discussions
- **THEN** the repository provides the existing `.planning/` artifacts as read-only historical context rather than requiring reconstruction from memory

### Requirement: Capability mapping remains traceable
The migration SHALL define a discoverable mapping between the legacy GSD phase structure and the OpenSpec capability baseline so contributors can navigate the transition safely.

#### Scenario: Contributor compares roadmap and specs
- **WHEN** a contributor reviews the existing roadmap or validated work during the migration window
- **THEN** they can identify which OpenSpec capability owns the corresponding product domain
