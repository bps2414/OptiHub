## ADDED Requirements

### Requirement: Tool integration model is defined as a compile-time catalog
The application SHALL define all supported tools (OptiScaler, Special K, Lossless Scaling) as compile-time constants in the Rust backend, not as seeded rows in a database. Tool identity, metadata, official sources, and compliance notes SHALL be part of the static catalog. SQLite SHALL only persist runtime user state: user-registered local sources and detected deployment records.

#### Scenario: Application starts for the first time
- **WHEN** the application starts without any prior SQLite data
- **THEN** all three tools are available immediately via the catalog constants without any database query; the database contains no `tools` table and no seed rows

#### Scenario: Frontend queries tool metadata
- **WHEN** the frontend invokes `get_tools_overview`
- **THEN** the backend assembles each tool's response by merging the catalog constant (name, author, license, official sources) with runtime state loaded from the DB (user sources, detection state)

### Requirement: ToolId is an exhaustive enum
The `ToolId` type SHALL be a plain exhaustive Rust enum with variants for each supported tool (`OptiScaler`, `SpecialK`, `LosslessScaling`). It SHALL NOT use `#[non_exhaustive]`. Match expressions on `ToolId` without a wildcard arm SHALL fail to compile if a new variant is added, providing maximum compiler safety when extending the catalog.

#### Scenario: Compiler behavior when a new tool is added
- **WHEN** a new `ToolId` variant is introduced in the codebase
- **THEN** all existing `match tool_id` expressions without wildcard arms produce compile errors, alerting every call site to handle the new tool explicitly

### Requirement: Tool sources are user-managed SQLite records linked by ToolId string
The application SHALL persist user-registered tool sources (local archive paths or user-supplied local registrations) as rows in a `tool_sources` table. The `tool_id` column SHALL store the string serialization of the `ToolId` enum value. There SHALL be no foreign-key reference to a `tools` table.

#### Scenario: User registers a local source path
- **WHEN** the user registers a local archive or directory path for a supported tool via `register_tool_source`
- **THEN** the backend inserts a `tool_sources` row with `tool_id` matching the target tool's ToolId string, provenance `user_local`, and the registered path; the updated tool overview is returned

#### Scenario: User removes a registered source
- **WHEN** the user removes a previously registered source via `remove_tool_source`
- **THEN** the backend deletes that `tool_sources` row by source id; the updated tool overview is returned

### Requirement: Official sources support multiple entries per tool
Each tool in the catalog SHALL carry a list of official sources (`OfficialSource { label, url }`), not a single URL. The IPC payload SHALL expose all entries. Tools with more than one official source (OptiScaler) SHALL present multiple distinct acquisition CTAs in the frontend.

#### Scenario: OptiScaler official sources are queried
- **WHEN** the frontend renders the OptiScaler tool detail
- **THEN** both the GitHub Releases source and the NexusMods source are present in the response and rendered as separate acquisition buttons

#### Scenario: Single-source tool is queried
- **WHEN** the frontend renders Special K or Lossless Scaling
- **THEN** exactly one official source entry is present in the response

### Requirement: Tool detection is refreshable on demand
The application SHALL expose a `refresh_tool_detection` command that re-runs file-system and registry-based detection for all supported tools and updates stored state accordingly. The updated overview SHALL be returned to the caller without requiring an app restart.

#### Scenario: User triggers a detection refresh
- **WHEN** the user invokes refresh from the Tools UI
- **THEN** the backend re-runs all detection routines, updates relevant `tool_sources` and `tool_deployments` rows, and returns the updated tools overview
