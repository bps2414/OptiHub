## ADDED Requirements

### Requirement: Lossless Scaling is detected via Steam library only
The application SHALL detect Lossless Scaling exclusively by scanning the user's Steam library manifests for App ID `993090`. Detection SHALL be read-only and SHALL NOT involve any binary redistribution, bundling, installer wrapping, or unofficial acquisition path.

#### Scenario: User owns Lossless Scaling on Steam
- **WHEN** the application scans the Steam library and finds an ACF manifest for App ID 993090
- **THEN** the tool record is marked as `detected_via_steam` with provenance `steam_owned`, and no download or path-registration UI is shown

#### Scenario: User does not own Lossless Scaling on Steam
- **WHEN** no ACF manifest for App ID 993090 is found
- **THEN** the application marks Lossless Scaling as `not_detected` and displays the official Steam store URL as the only acquisition reference

### Requirement: No unofficial Lossless Scaling acquisition path is ever exposed
The application SHALL NOT display, suggest, link to, or enable any acquisition path for Lossless Scaling other than its official Steam store page, and SHALL NOT bundle, embed, or distribute any Lossless Scaling binary or archive.

#### Scenario: Lossless Scaling state is rendered in the UI
- **WHEN** the Tools page renders the Lossless Scaling card
- **THEN** the only action available for acquisition is a link to the official Steam store page (external browser); no download, no local path field is shown

### Requirement: Lossless Scaling compliance state is always visible
The application SHALL surface Lossless Scaling's compliance note (licensed commercial software — Steam detection only) in its tool card so users understand why no file-level operations are offered.

#### Scenario: User views Lossless Scaling details
- **WHEN** the user views the Tools page or expands the Lossless Scaling entry
- **THEN** a compliance note is displayed explaining the detection-only integration model alongside the Steam ownership detection result
