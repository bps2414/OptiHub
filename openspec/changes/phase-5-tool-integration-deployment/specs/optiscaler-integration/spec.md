## ADDED Requirements

### Requirement: OptiScaler deployment detection produces a confidence-graded result
The application SHALL detect whether OptiScaler is deployed for a specific game by scanning a defined set of directories adjacent to the game's main executable. Detection SHALL produce one of four confidence states: `Confirmed`, `Partial`, `Ambiguous`, or `NotFound`.

#### Scenario: OptiScaler is fully and cleanly deployed
- **WHEN** the application inspects a game's scan scope and finds `OptiScaler.ini` with a valid `[OptiScaler]` section AND at least one supporting loader DLL, `OptiScaler.dll`, or `OptiScaler.asi`
- **THEN** the deployment record is emitted with confidence `Confirmed` and the detected signals listed

#### Scenario: OptiScaler.ini is present but incomplete
- **WHEN** the application finds `OptiScaler.ini` in scope but no matching loader, OR finds `OptiScaler.ini` that cannot be read or lacks the `[OptiScaler]` section
- **THEN** the deployment record is emitted with confidence `Partial`

#### Scenario: OptiScaler.dll or .asi is present without an INI file
- **WHEN** the application finds `OptiScaler.dll` or `OptiScaler.asi` in scope but no `OptiScaler.ini`
- **THEN** the deployment record is emitted with confidence `Partial`

#### Scenario: Only a generic loader DLL is present
- **WHEN** the application finds only an upstream-confirmed loader DLL name (`dxgi.dll`, `winmm.dll`, `d3d12.dll`, `dbghelp.dll`, `version.dll`, `wininet.dll`, or `winhttp.dll`) in scope, without `OptiScaler.ini`, `OptiScaler.dll`, or `OptiScaler.asi`
- **THEN** the deployment record is emitted with confidence `Ambiguous`; the UI SHALL clearly indicate this is inconclusive, not confirmed detection

#### Scenario: nvngx.dll or nvngx_dlss.dll is found
- **WHEN** the application finds `nvngx.dll` or `nvngx_dlss.dll` in scope, with no other OptiScaler signal
- **THEN** these files are ignored as detection signals and the result is `NotFound`; they are not part of the current official OptiScaler loader-name set

#### Scenario: No OptiScaler signals found
- **WHEN** the application finds none of the above signals in scope
- **THEN** the deployment record is emitted with confidence `NotFound`

### Requirement: OptiScaler scan scope is bounded to directories near the game executable
Detection SHALL scan only: the game executable's directory (`exe_dir/`), `exe_dir/plugins/`, and `exe_dir/reframework/plugins/`. The backend SHALL NOT recursively walk the entire game install tree.

#### Scenario: Signals outside the scan scope are ignored
- **WHEN** an OptiScaler file exists in a subdirectory outside the defined scan scope
- **THEN** it does not affect the detection result for that game

### Requirement: OptiScaler INI validation is based on section header presence
When `OptiScaler.ini` is found in scope, the application SHALL attempt to read it and check for the presence of a `[OptiScaler]` section header. A missing or unreadable section SHALL cause the INI to be treated as unverified, reducing the confidence level from `Confirmed` to `Partial`.

#### Scenario: INI exists with valid section header
- **WHEN** `OptiScaler.ini` is present and contains `[OptiScaler]`
- **THEN** the INI is classified as valid and contributes to `Confirmed` confidence when a loader is also found

#### Scenario: INI exists but section header is absent or file is unreadable
- **WHEN** `OptiScaler.ini` is present but does not contain `[OptiScaler]`, or the file cannot be read
- **THEN** the INI is classified as invalid; the confidence level cannot exceed `Partial`

### Requirement: OptiScaler supports official acquisition and local source registration
The application SHALL support two OptiScaler acquisition paths: (1) directing the user to each official source (GitHub Releases, NexusMods) by opening those URLs in the system browser, and (2) registering a user-supplied local archive or directory path. Both paths produce a `tool_sources` record with explicit provenance (`official_release` or `user_local`).

#### Scenario: User is directed to official acquisition
- **WHEN** the user activates an official acquisition CTA for OptiScaler
- **THEN** the application opens the corresponding official URL in the system browser; no file download occurs within the app

#### Scenario: User registers a local archive
- **WHEN** the user selects a local `.zip` archive or directory path for OptiScaler and confirms registration
- **THEN** the backend inserts a `tool_sources` row with `tool_id = "OptiScaler"`, provenance `user_local`, and the supplied path; the updated tool overview is returned

### Requirement: OptiScaler build channel is recorded when identifiable
The application SHALL record a release channel (`stable`, `nightly`, or `unknown`) for any registered or detected OptiScaler source or deployment, and SHALL surface this channel in the tool detail and game deployment views.

#### Scenario: Channel is identified from PE metadata or INI version marker
- **WHEN** OptiScaler detection or source registration yields a recognizable build identifier
- **THEN** the corresponding deployment or source record is tagged with the appropriate channel label
