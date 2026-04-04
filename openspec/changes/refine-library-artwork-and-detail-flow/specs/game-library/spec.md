## MODIFIED Requirements

### Requirement: Library browsing supports rich collection and detail views
The application SHALL use Library as the single primary game hub for both collection browsing and detail access. The library SHALL provide a cover-first grid as the default presentation, a list toggle as an alternate presentation, search by game name, source filtering, and sorting controls. Opening a game detail view SHALL remain inside the same library flow, such as a nested route or equivalent internal page state, rather than requiring a separate top-level Games destination.

#### Scenario: User browses the collection
- **WHEN** the user opens Library
- **THEN** the application presents the rich game collection and all browse controls without requiring the user to leave the library flow

#### Scenario: User opens a game detail view
- **WHEN** the user selects a game from Library
- **THEN** the application opens the detail experience within the same library-oriented flow and preserves intuitive back-navigation to the collection

## ADDED Requirements

### Requirement: Library cards use portrait-friendly artwork
The application SHALL present browse cards with portrait-friendly artwork treatment and SHALL avoid showing a landscape header letterboxed inside a portrait card frame. The card-art decision SHALL be made independently from the detail-hero artwork decision so a game can use one asset for the library card and a different asset for the in-flow detail page when needed.

#### Scenario: Portrait artwork is available
- **WHEN** the metadata pipeline has access to a portrait-oriented artwork asset for a game
- **THEN** the library card uses that portrait asset as the primary cover treatment

#### Scenario: Only landscape artwork is available
- **WHEN** the metadata pipeline cannot resolve a compliant portrait asset for a game
- **THEN** the library card uses a deterministic fallback strategy that avoids black-bar letterboxing of a landscape asset inside the portrait slot

#### Scenario: Card art and detail art differ
- **WHEN** a title has a strong portrait card asset but a different hero-quality image for detail
- **THEN** the application can use the portrait asset in Library and a separate hero asset in the detail surface without forcing one asset to serve both roles

### Requirement: Library cards hydrate artwork without a detail detour
The application SHALL update library cards when pending artwork or metadata becomes available and SHALL NOT require the user to open a game's detail view first in order to see the card artwork hydrate in Library.

#### Scenario: Library opens with pending metadata
- **WHEN** Library renders entries whose artwork metadata is still hydrating
- **THEN** the card artwork updates in Library once hydration completes, without requiring the user to visit detail and return
