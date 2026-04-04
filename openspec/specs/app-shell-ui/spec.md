## ADDED Requirements

### Requirement: Desktop shell provides premium navigation
The application SHALL provide a premium dark desktop shell with sidebar navigation for Home, Library, Games, Optimizations, Tools, Presets, Diagnostics, Settings, and Credits.

#### Scenario: User opens the application
- **WHEN** the desktop shell loads successfully
- **THEN** the user sees the premium dark navigation shell with all planned sections available as routes or placeholders

### Requirement: Shell supports bilingual operation
The application SHALL support English and Brazilian Portuguese with locale-based default selection and a persisted user override.

#### Scenario: User changes language preference
- **WHEN** the user selects a supported language in the shell
- **THEN** the application persists that choice and continues rendering shell copy in the selected language on later launches

### Requirement: Interactive shell elements remain accessible
The application SHALL present clear hover and focus states for interactive shell controls so keyboard and pointer users can navigate confidently.

#### Scenario: User tabs through navigation
- **WHEN** focus moves across sidebar links or shell actions
- **THEN** each interactive element exposes a visible focus or hover treatment that distinguishes the active target
