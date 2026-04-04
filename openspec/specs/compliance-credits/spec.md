## ADDED Requirements

### Requirement: Credits and licenses are visible in-product
The application SHALL provide a Credits and Licenses surface that lists each integrated third-party tool with its name, author, license, and source URL.

#### Scenario: User opens Credits
- **WHEN** the user navigates to the Credits or Licenses surface
- **THEN** the application shows the required attribution details for each integrated third-party tool

### Requirement: Compliance policy is explicit
The application SHALL document its third-party integration compliance policy and make that policy accessible from the product experience.

#### Scenario: User reviews integration policy
- **WHEN** the user wants to understand how the app handles third-party tools
- **THEN** the application presents the relevant compliance policy language in an accessible location

### Requirement: External integrations are clearly marked
The application SHALL clearly mark supported third-party tools as external integrations and expose their official source or compliance state in the UI.

#### Scenario: User views an integrated tool
- **WHEN** the UI presents a supported third-party tool
- **THEN** the interface indicates that the tool is external and shows the best available source or compliance state
