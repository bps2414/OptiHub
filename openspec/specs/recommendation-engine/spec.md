## ADDED Requirements

### Requirement: Each game receives a recommendation outcome
The application SHALL present either a recommended optimization tool for a game or an explicit "no safe recommendation available" outcome.

#### Scenario: Recommendation engine evaluates a game
- **WHEN** the application has enough game, hardware, and tool-state context to evaluate a recommendation
- **THEN** it returns either a recommended tool or a no-safe-recommendation outcome for that game

### Requirement: Recommendation output explains confidence and rationale
Each recommendation outcome SHALL include a confidence or risk level and a user-friendly explanation of why the outcome was chosen.

#### Scenario: User reviews a recommendation
- **WHEN** the recommendation outcome is shown in the UI
- **THEN** the user can see the risk classification and a plain-language explanation tied to the relevant evidence

### Requirement: Recommendations consider hardware and availability
The recommendation engine SHALL consider the detected hardware profile and the currently available supported tools before producing an outcome.

#### Scenario: Hardware or tool availability changes
- **WHEN** the user's detected hardware profile or supported tool availability differs from another machine or session
- **THEN** the recommendation outcome can change to reflect the new constraints
