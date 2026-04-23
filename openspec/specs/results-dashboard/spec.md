## Purpose
Manage and display scraped Google Maps data.
## Requirements
### Requirement: Results Dashboard Entry Point
The extension SHALL provide a dedicated full-page dashboard (Options Page) to view scraped results.

#### Scenario: Open dashboard from side panel
- **WHEN** user clicks the "View Results Database" button in the Side Panel
- **THEN** a new tab opens showing the Results Dashboard page

### Requirement: Scraped Data Table
The dashboard SHALL display all scraped data in a tabular format using Shadcn UI components.

#### Scenario: Display existing data
- **WHEN** the dashboard page loads
- **THEN** it retrieves data from `chrome.storage.local` and renders it in a paginated table

### Requirement: Data Pagination
The results table SHALL implement pagination to handle up to 5,000 items without degrading performance.

#### Scenario: Navigate between pages
- **WHEN** user clicks the "Next" or "Previous" page buttons
- **THEN** the table updates to show the corresponding subset of 50 items

### Requirement: Top Tier Leads Filter
The system SHALL provide a filter to display only "Top Tier" leads. A lead is classified as "Top Tier" if its score meets or exceeds the user-defined threshold (default 80) based on the current scoring configuration.

#### Scenario: Filter by configurable top tier
- **WHEN** user activates the "Show Top Tier Only" filter
- **THEN** only leads whose calculated score meets the threshold set in the Lead Scoring Configuration are displayed.

### Requirement: Dashboard Actions
The dashboard table SHALL incorporate an interactive checkbox column on the left-hand side. A floating action bar or contextual toolbar replaces standard operations when `selectedIds.size > 0`.

#### Scenario: User navigates the table
- **WHEN** the dashboard is loaded
- **THEN** every row displays a checkbox aligned on the far left.
- **AND** quick action icons (Maps, WhatsApp) appear inline with their respective data columns.

