## MODIFIED Requirements

### Requirement: Top Tier Leads Filter
The system SHALL provide a filter to display only "Top Tier" leads. A lead is classified as "Top Tier" if its score meets or exceeds the user-defined threshold (default 80) based on the current scoring configuration.

#### Scenario: Filter by configurable top tier
- **WHEN** user activates the "Show Top Tier Only" filter
- **THEN** only leads whose calculated score meets the threshold set in the Lead Scoring Configuration are displayed.
