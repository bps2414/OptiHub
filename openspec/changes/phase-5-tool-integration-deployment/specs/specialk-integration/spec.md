## ADDED Requirements

### Requirement: Special K is detected as a global integration
The application SHALL detect Special K's global installation state by checking known install paths (`%PROGRAMDATA%\SK_Res`, `%APPDATA%\SpecialK`) and the `HKCU\Software\Kaldaien\SpecialK` registry hive, and SHALL expose the detected version, status, and any identifiable release channel.

#### Scenario: Special K is installed via its official installer
- **WHEN** the application runs detection for Special K
- **THEN** it returns integration type `global_integration`, the detected version, and the channel where identifiable (`stable`, `experimental`, or `unknown`)

#### Scenario: Special K installation cannot be confirmed
- **WHEN** no Special K footprint is found in known paths and registry hives
- **THEN** the application returns Special K state as `not_detected` and offers a manual registration path

### Requirement: Special K supports official acquisition and channel visibility
The application SHALL direct users to the official Special K acquisition path and SHALL surface any officially supported release channels (stable, experimental) without referencing unofficial mirrors.

#### Scenario: User initiates official Special K acquisition
- **WHEN** the user triggers the official acquisition flow for Special K
- **THEN** the application opens the official Special K source or release URL in the system browser and does not initiate any download internally

#### Scenario: Channel options are displayed
- **WHEN** the Tools UI renders the Special K tool card
- **THEN** it shows any officially recognized release channels alongside the current global status

### Requirement: Special K can be manually registered when auto-detection fails
The application SHALL allow the user to register a local Special K installation path when automatic detection fails, and SHALL record the source with provenance `user_local` and no misleading channel claims.

#### Scenario: User registers a local Special K path
- **WHEN** the user selects the Special K executable or install directory via manual registration
- **THEN** the backend stores a `tool_sources` row with provenance `user_local` and updates the global detection state accordingly
