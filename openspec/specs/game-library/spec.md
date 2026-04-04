## ADDED Requirements

### Requirement: Game library includes Steam and manual sources
The application SHALL detect installed Steam games, support manual executable registration, and render source provenance for each library entry.

#### Scenario: Library is refreshed
- **WHEN** the user refreshes the library
- **THEN** the application updates Steam detections, preserves manual registrations, and shows whether each entry originated from Steam or a manual add flow

### Requirement: Steam and manual entries remain independently visible
The application SHALL keep Steam detections and manual registrations as visually separate entries even when they point to the same install root, while still allowing related metadata to be shared across them.

#### Scenario: Steam and manual records match the same install
- **WHEN** a manual registration points to a game that also exists in the Steam library
- **THEN** the library still shows separate Steam and manual entries with their own provenance rather than collapsing them into one row

### Requirement: Library management supports confirmation-based manual control
The application SHALL allow the user to register a game manually by selecting an executable, confirm the addition, and remove only manually added entries.

#### Scenario: User adds and removes a manual game
- **WHEN** the user selects a valid executable and confirms the registration
- **THEN** the game appears as a manual entry that can later be removed without affecting Steam detections

### Requirement: Library browsing supports rich collection and detail views
The application SHALL provide a cover-first library view with a list toggle, search, source filtering, sorting, and a game detail surface that shows name, install path, size, and platform information.

#### Scenario: User browses and opens game details
- **WHEN** the user searches, filters, or opens a specific game from the library
- **THEN** the application updates the collection view accordingly and presents the selected game's detail information
