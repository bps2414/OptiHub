## ADDED Requirements

### Requirement: Tool state reflects real integration models
The application SHALL distinguish global tool integrations, local source registrations, and per-game deployment state instead of reducing every tool to a generic installed or missing status.

#### Scenario: User opens the Tools page
- **WHEN** the application renders supported integrations
- **THEN** each tool shows the state dimensions that apply to its integration model rather than a single binary status

### Requirement: OptiScaler supports per-game deployment tracking
The application SHALL detect whether OptiScaler is deployed for a specific game and SHALL expose the identifiable deployed version, build, channel, and provenance when available.

#### Scenario: OptiScaler deployment is present near a game executable
- **WHEN** the application inspects a supported game's deployment context
- **THEN** it reports whether OptiScaler is deployed for that game and shows the best available build and provenance information

### Requirement: Tool acquisition preserves provenance and compliance
The application SHALL support official acquisition flows and user-supplied local registrations while recording whether each tool record originated from an official source, a licensed Steam detection, or a user-supplied local source.

#### Scenario: User registers a tool source
- **WHEN** a user registers a supported tool through an official path or a local file or archive path
- **THEN** the resulting tool record includes provenance and compliance state that can be shown in the UI

### Requirement: Special K remains a global integration
The application SHALL model Special K as a global integration with visible version, status, official source, and supported release channel information.

#### Scenario: Special K is detected or registered
- **WHEN** the application evaluates the Special K integration state
- **THEN** it shows the current global status and any identifiable version and channel information

### Requirement: Lossless Scaling is Steam-detect only
The application SHALL detect Lossless Scaling exclusively through the user's Steam library using its licensed app identity and SHALL NOT redistribute, bundle, or suggest unofficial acquisition paths by default.

#### Scenario: User owns Lossless Scaling on Steam
- **WHEN** the application detects the licensed Steam app for Lossless Scaling
- **THEN** it marks the tool as available through Steam ownership without offering redistribution or unofficial download guidance

### Requirement: Tool records expose attribution metadata
The application SHALL show tool name, author, version or build, source URL, license or compliance notes, and release channel whenever that data is relevant and identifiable.

#### Scenario: Tool metadata is rendered
- **WHEN** a tool record includes attribution or compliance data
- **THEN** the UI exposes those fields alongside the tool's operational state
