## MODIFIED Requirements

### Requirement: Desktop shell provides premium navigation
The application SHALL provide a premium dark desktop shell with sidebar navigation for Home, Library, Optimizations, Tools, Presets, Diagnostics, Settings, and Credits. The game browse and detail flow SHALL live under Library as a single primary user-facing destination, and `Games` SHALL NOT remain as a separate top-level navigation item for normal use.

#### Scenario: User opens the application
- **WHEN** the desktop shell loads successfully
- **THEN** the user sees a single primary Library destination for game discovery and detail access, alongside the other planned shell sections

#### Scenario: User enters the game detail flow
- **WHEN** the user opens a game's detail experience from Library
- **THEN** the app keeps the user inside the Library-oriented navigation flow instead of making them conceptually switch to a second top-level game surface

#### Scenario: Legacy Games route is visited
- **WHEN** the user reaches the old `Games` route through an existing link or stored path
- **THEN** the app preserves compatibility without presenting `Games` as a competing primary destination in the sidebar
