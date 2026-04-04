## ADDED Requirements

### Requirement: Games expose three primary presets
The application SHALL offer Quality, Balanced, and Performance presets for supported game optimization flows.

#### Scenario: User opens preset selection
- **WHEN** a supported game reaches the preset selection step
- **THEN** the application offers Quality, Balanced, and Performance as the primary preset choices

### Requirement: Presets preview their intended changes
The application SHALL allow the user to preview what a preset will change before it is applied.

#### Scenario: User inspects a preset before apply
- **WHEN** the user selects a preset candidate
- **THEN** the application shows the anticipated configuration changes prior to confirmation

### Requirement: Presets adapt to detected hardware
The application SHALL adapt preset parameters to the user's detected hardware capabilities instead of treating every preset as static across all machines.

#### Scenario: Same preset is viewed on different hardware
- **WHEN** two machines with materially different hardware profiles view the same preset
- **THEN** the preset output can differ to respect the detected capabilities and constraints
