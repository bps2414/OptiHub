## ADDED Requirements

### Requirement: Metadata uses authorized Steam-family sources
The application SHALL fetch cover art and descriptive metadata from Steam or SteamDB only when the data is available and legally usable for the product.

#### Scenario: Metadata is available for a detected game
- **WHEN** the application resolves a supported Steam or SteamDB metadata source
- **THEN** it stores the retrieved cover art and descriptive fields for later presentation

### Requirement: Metadata is cache-first and offline-capable
The application SHALL continue to present cached metadata while offline and SHALL prefer cached metadata before any later refresh attempt.

#### Scenario: User opens the library without network access
- **WHEN** cached metadata exists and the device is offline or a refresh cannot complete
- **THEN** the application renders the cached metadata instead of failing the library experience

### Requirement: Metadata refresh is non-disruptive
The application SHALL support a silent refresh path that updates cached metadata in the background without blocking the current browsing session.

#### Scenario: Cached metadata is stale but usable
- **WHEN** the user opens the library with existing cached metadata
- **THEN** the application can show the cached content immediately and refresh it in the background when a network path is available
