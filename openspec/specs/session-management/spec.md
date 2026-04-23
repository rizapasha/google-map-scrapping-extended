# session-management Specification

## Purpose
TBD - created by archiving change advanced-dashboard-features. Update Purpose after archive.
## Requirements
### Requirement: Session Renaming
The system SHALL allow users to rename an existing scraping session. Renaming MUST update the `sessionId` for all data items belonging to that session in the `scrapedData` storage. Additionally, if the session being renamed is currently pinned, the system MUST update the session ID in the `pinnedSessions` storage to ensure the pin is preserved.

#### Scenario: Rename Bali session to Lombok
- **WHEN** user inputs "Lombok" as the new name for the "Bali" session and confirms
- **THEN** all 50 items previously tagged as "Bali" now have `sessionId: "Lombok"`
- **AND** if "Bali" was pinned, "Lombok" replaces it in the `pinnedSessions` list
- **AND** the UI updates to show the new session name and maintains its pinned status.

### Requirement: Session Pinning
The system SHALL allow users to "pin" sessions. Pinned sessions MUST always appear at the top of the session list, followed by unpinned sessions in descending chronological order.

#### Scenario: Pinning a session
- **WHEN** user clicks the pin icon next to a session named "Target Leads"
- **THEN** the session is added to `pinnedSessions` storage and "Target Leads" moves to the first position in the sidebar list.

