## MODIFIED Requirements

### Requirement: Steam and manual entries remain independently visible
The application SHALL keep Steam detections and manual registrations as visually separate entries even when they point to the same install root, while still allowing related metadata to be shared across them. Rich browse cards and detail handoff SHALL preserve source identity so the UI never implies that equivalent Steam and manual entries were merged into one lifecycle.

#### Scenario: Steam and manual records match the same install
- **WHEN** a manual registration points to a game that also exists in the Steam library
- **THEN** the library still shows separate Steam and manual entries with their own provenance, while allowing those entries to reuse related metadata or cover art

#### Scenario: Rich cards show source-specific identity
- **WHEN** the library renders visually rich browse cards for mixed Steam and manual entries
- **THEN** each card keeps a visible source treatment so Steam-origin entries remain identifiable even when metadata is shared

### Requirement: Library browsing supports rich collection and detail views
The application SHALL use `/library` as the rich collection surface and `/games` as the game detail surface. The library SHALL provide a cover-first grid as the default presentation, a list toggle as an alternate presentation, search by game name, source filtering, and sorting controls. Browse cards SHALL stay focused on cover art, game name, source, and platform context, while the detail surface SHALL present the richer fields for a selected title: cover art, description, install path, install size, platform info, provenance, and metadata cache status.

#### Scenario: User browses the cover-first library
- **WHEN** the user opens `/library`
- **THEN** the application defaults to a cover-first grid and allows the user to switch to a list view without losing the library context

#### Scenario: User searches, filters, or sorts the collection
- **WHEN** the user changes the search term, source filter, or sort mode in the library
- **THEN** the collection updates to reflect those controls while preserving separate Steam and manual entries

#### Scenario: User opens a game's detail surface
- **WHEN** the user selects a game from the library
- **THEN** the application hands off to `/games` and presents the selected game's descriptive, install, provenance, and metadata-cache context
