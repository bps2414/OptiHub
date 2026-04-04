## ADDED Requirements

### Requirement: Apply flow requires an execution plan and confirmation
The application SHALL present an execution plan before applying optimization changes and SHALL require explicit user confirmation to continue.

#### Scenario: User initiates apply
- **WHEN** the user attempts to apply an optimization
- **THEN** the application shows the tool choice, affected files, risk level, and backup location before asking for confirmation

### Requirement: Original files are backed up safely
The application SHALL back up all original files before modification and SHALL verify backup integrity before reporting success.

#### Scenario: Backup is created for an apply operation
- **WHEN** the application prepares to modify game or tool files
- **THEN** it creates a backup and verifies the backup integrity before continuing

### Requirement: Apply flow enforces safety checks
The application SHALL block apply operations when prerequisite checks fail, including when the target game is running.

#### Scenario: Game is already running
- **WHEN** the user starts an apply flow for a game that is currently running or otherwise fails prerequisites
- **THEN** the application stops the operation before any modification is performed

### Requirement: Restore and history remain available
The application SHALL allow the user to restore previous changes and inspect the history and status of applied optimizations.

#### Scenario: User needs to undo a previous optimization
- **WHEN** the user opens optimization history and selects a reversible entry
- **THEN** the application offers a restore flow for that entry and shows its recorded status
