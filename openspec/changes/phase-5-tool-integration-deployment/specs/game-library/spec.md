## MODIFIED Requirements

### Requirement: Library browsing supports rich collection and detail views
The application SHALL provide a cover-first library view with a list toggle, search, source filtering, sorting, and a game detail surface that shows name, install path, size, platform information, AND a per-game tool deployment summary indicating which tools (if any) are deployed or available for that game.

#### Scenario: User browses and opens game details
- **WHEN** the user searches, filters, or opens a specific game from the library
- **THEN** the application updates the collection view accordingly and presents the selected game's detail information including any tool deployment state fetched from `get_tool_deployments_for_game`
