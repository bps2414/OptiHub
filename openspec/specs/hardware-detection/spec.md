## ADDED Requirements

### Requirement: Hardware snapshot covers core system components
The application SHALL detect and expose CPU, GPU, VRAM, RAM, and display information through a unified hardware snapshot.

#### Scenario: Diagnostics requests hardware data
- **WHEN** the frontend requests the current hardware snapshot
- **THEN** the backend returns the best available CPU, GPU, VRAM, RAM, and display data for the current Windows machine

### Requirement: Diagnostics and Home surface hardware state
The application SHALL display the hardware snapshot on Diagnostics and provide a summarized version on Home.

#### Scenario: User opens Diagnostics and Home
- **WHEN** the user visits Diagnostics or the Home dashboard
- **THEN** the hardware state is rendered in the page-specific presentation expected for that surface

### Requirement: Display override is a first-class input
The application SHALL allow the user to provide a manual display resolution and refresh-rate override without treating it as an error-only fallback path.

#### Scenario: Auto-detected display data is incomplete or incorrect
- **WHEN** the user enters a manual display override
- **THEN** the application stores and uses that override in the hardware presentation flow until the user changes it again
