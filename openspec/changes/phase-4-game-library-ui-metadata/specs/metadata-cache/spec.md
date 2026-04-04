## MODIFIED Requirements

### Requirement: Metadata uses authorized Steam-family sources
The application SHALL fetch cover art and descriptive metadata from Steam or SteamDB only when the data is available and legally usable for the product. Metadata enrichment MAY be shared across related Steam and manual entries that represent the same underlying game identity, but that shared enrichment SHALL NOT merge or replace the entries' separate provenance.

#### Scenario: Metadata is available for related entries
- **WHEN** the application resolves a supported Steam or SteamDB metadata source for a game that appears as separate Steam and manual entries
- **THEN** it may reuse the retrieved cover art and descriptive fields across those entries while keeping their library identities separate

### Requirement: Metadata is cache-first and offline-capable
The application SHALL continue to present cached metadata while offline and SHALL prefer cached metadata before any later refresh attempt. Missing connectivity, partial metadata, or fetch failures SHALL NOT break the library or detail UI; the product SHALL instead present cached content, partial content, or clear fallback states, and SHALL expose metadata cache status in the detail experience.

#### Scenario: User opens the library or detail view without network access
- **WHEN** cached metadata exists and the device is offline or a refresh cannot complete
- **THEN** the application renders the cached metadata or a clear fallback state instead of failing the browse or detail experience

#### Scenario: Detail surface shows cache status
- **WHEN** the user opens a game's detail surface
- **THEN** the application indicates whether the displayed metadata came from cache, partial fallback data, or a fresher resolved payload

### Requirement: Metadata refresh is non-disruptive
The application SHALL support a silent refresh path that updates cached metadata in the background without blocking the current browsing session or requiring a dedicated manual metadata-refresh action for normal use. Cached content SHALL render first whenever it is already available.

#### Scenario: Cached metadata is stale but usable
- **WHEN** the user opens the library with existing cached metadata
- **THEN** the application shows the cached content immediately and refreshes it in the background when a network path is available

#### Scenario: Background refresh fails
- **WHEN** a background metadata refresh attempt fails
- **THEN** the existing cached or fallback metadata remains visible and the current browsing flow continues without interruption
