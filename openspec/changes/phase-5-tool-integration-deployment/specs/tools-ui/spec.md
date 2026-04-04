## ADDED Requirements

### Requirement: Tools page presents an overview strip and a navigation list as separate UI zones
The Tools page SHALL render two distinct zones at the top: (1) a visual-only overview strip showing the detection status badge for each of the three tools, and (2) a compact left navigation column with one fixed entry per tool. The overview strip SHALL NOT be interactive or navigable — it provides status at a glance only. Navigation SHALL happen exclusively through the left column.

#### Scenario: User opens the Tools page
- **WHEN** the Tools page mounts and `get_tools_overview` resolves
- **THEN** the overview strip displays three status badges and the left column displays three navigation entries, each with a tool name and status badge; no navigation action is activated by the strip

#### Scenario: User selects a tool from the left column
- **WHEN** the user clicks a tool entry in the left column
- **THEN** the detail panel updates to show that tool's information; the overview strip does not change behavior

### Requirement: Tools page detail panel shows all required tool information
The detail panel SHALL display: tool name, author, license note, current detection status badge, "how detected" explanation text, official sources section, user-registered local sources section, per-game deployment list (for OptiScaler only), and action buttons (refresh detection, add local source).

#### Scenario: Tool with full detection state is selected
- **WHEN** the user selects a tool that has been detected
- **THEN** the detail panel shows name, author, license, detection status, the detection method that produced the result, all official sources, and any registered local sources

#### Scenario: Tool with no detection result is selected
- **WHEN** the user selects a tool that has not been detected
- **THEN** the detail panel shows name, author, license, a "not detected" status, and the official sources as the primary available action

### Requirement: Tools UI renders one CTA per official source
For each entry in a tool's `official_sources` list, the UI SHALL render a distinct acquisition button or link. Tools with multiple official sources (OptiScaler: GitHub Releases + NexusMods) SHALL NOT collapse them into a single generic button. Each CTA SHALL open the corresponding URL in the system browser.

#### Scenario: OptiScaler official sources are rendered
- **WHEN** the OptiScaler detail panel is visible
- **THEN** both the "GitHub Releases" and "NexusMods" buttons are rendered separately and each opens its respective URL

#### Scenario: Single-source tool official sources are rendered
- **WHEN** the detail panel is shown for Special K or Lossless Scaling
- **THEN** exactly one official source button is rendered

### Requirement: Tools UI renders user-registered local sources with provenance labels
The detail panel SHALL show a list of user-registered `tool_sources` rows for the selected tool. Each entry SHALL display: path or URL, provenance label (`User-supplied local`, `Official release`, or `Detected via Steam`), and a remove action. Tools that do not support local registration (Lossless Scaling) SHALL NOT show a "Add local source" button.

#### Scenario: User-registered sources are displayed
- **WHEN** the selected tool has one or more `tool_sources` rows
- **THEN** each source is listed with its path, provenance label, and a remove button

#### Scenario: Lossless Scaling detail is shown
- **WHEN** the Lossless Scaling tool is selected
- **THEN** no "Add local source" button is displayed; only the Steam detection result and compliance note are shown

### Requirement: OptiScaler detail panel shows per-game deployment state
The Tools UI SHALL include a per-game deployment section in the OptiScaler detail panel that lists known deployment records. Each record SHALL show game name, confidence badge (`Confirmed`, `Partial`, `Ambiguous`, `Not found`), channel label, and provenance. The deployment list SHALL load on expand, not eagerly on page mount.

#### Scenario: User expands per-game deployment view
- **WHEN** the user expands or selects the OptiScaler deployment list
- **THEN** the UI calls `get_tool_deployments_for_game` for each game in the list and renders confidence badges and provenance per entry

### Requirement: Tools page provides a visible refresh action
The Tools page SHALL include a clearly accessible refresh control that triggers `refresh_tool_detection` and updates all tool state without a full app reload.

#### Scenario: User refreshes tool detection
- **WHEN** the user clicks the refresh control
- **THEN** the app shows a loading indicator, calls `refresh_tool_detection`, and updates the overview strip badges, nav list status badges, and detail panel with the updated detection results

### Requirement: Lossless Scaling UI surfaces compliance note and shows no acquisition path
The Lossless Scaling detail panel SHALL include a visible compliance note explaining the detection-only integration. The only acquisition reference SHALL be the Steam store URL. No download button, local path field, or unofficial mirror reference SHALL appear anywhere in the Lossless Scaling UI.

#### Scenario: Lossless Scaling detail is rendered
- **WHEN** the user views the Lossless Scaling detail panel
- **THEN** a compliance note is visible, the Steam store URL is the only acquisition reference, and no download or local path action is available
