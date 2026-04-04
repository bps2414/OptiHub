## MODIFIED Requirements

### Requirement: Metadata uses authorized Steam-family sources
The application SHALL fetch cover art and descriptive metadata from Steam or SteamDB only when the data is available and legally usable for the product. The metadata pipeline SHALL distinguish between library portrait artwork and detail hero artwork. It SHALL prefer portrait-oriented artwork for library cards whenever an approved source can provide it. If Steam-family sources do not provide compliant portrait art for a title, the app SHALL use SteamGridDB as the approved fallback provider for 600x900-style library-card artwork before falling back to a deterministic local placeholder.

#### Scenario: Approved portrait artwork is available
- **WHEN** the metadata pipeline can resolve a compliant portrait-oriented asset for a game
- **THEN** it stores and serves that portrait asset for the library-card experience

#### Scenario: No compliant portrait artwork is available
- **WHEN** the primary provider does not offer a compliant portrait asset for a game
- **THEN** the application falls back according to the approved provider or local-fallback strategy instead of letterboxing a landscape header inside the card

#### Scenario: SteamGridDB portrait fallback is needed
- **WHEN** Steam-family sources do not provide a satisfactory portrait asset for a library card
- **THEN** the application requests a portrait-oriented SteamGridDB asset in the 600x900-style format for the library-card role before using a local placeholder

### Requirement: Metadata is cache-first and offline-capable
The application SHALL continue to present cached metadata while offline and SHALL prefer cached metadata before any later refresh attempt. Metadata cache records SHALL be keyed to the active locale so localized descriptions and related fields do not leak across language choices when provider-localized content is available.

#### Scenario: User changes app language
- **WHEN** the active app locale changes and localized metadata exists for a game
- **THEN** the application resolves or serves the cache entry for that locale instead of reusing a stale cache from another language

#### Scenario: Localized metadata is unavailable
- **WHEN** the active locale does not have localized metadata from the provider
- **THEN** the application degrades gracefully to the best available cached or fallback content without breaking the library experience

### Requirement: Metadata refresh is non-disruptive
The application SHALL support a silent refresh path that updates cached metadata in the background without blocking the current browsing session. When refreshed artwork or localized metadata becomes available for visible library entries, the application SHALL hydrate those library cards without requiring a prior detail-page visit.

#### Scenario: Background refresh resolves missing card artwork
- **WHEN** a background metadata refresh completes for a visible library entry
- **THEN** the library card updates to the refreshed artwork in the library surface itself

#### Scenario: Detail no longer gates library hydration
- **WHEN** the user stays entirely inside the library collection flow after opening the app
- **THEN** visible cards can still hydrate their localized metadata and portrait artwork without relying on a separate detail fetch to unlock them
