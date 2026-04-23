## ADDED Requirements

### Requirement: Customizable Lead Metrics
The system SHALL provide a configuration interface for lead scoring weights (Website, Phone, Rating, Reviews) and a Top Tier threshold.

#### Scenario: Adjusting weights
- **WHEN** user sets Website weight to 50 and Phone weight to 50
- **THEN** a lead with only a website will receive a score of 50.

### Requirement: Metric Weight Validation
The system SHALL enforce that the sum of all scoring weights is exactly 100. If the sum is not 100, the "Save" button MUST be disabled and an error message MUST be displayed.

#### Scenario: Invalid weight sum
- **WHEN** user sets weights that sum to 120
- **THEN** the system displays "Total weight must be 100. Current: 120" and prevents saving.

### Requirement: Top Tier Threshold
The system SHALL allow users to define the minimum score required for a lead to be classified as "Top Tier".

#### Scenario: Setting threshold to 50
- **WHEN** threshold is set to 50 and "Show Top Tier Only" filter is active
- **THEN** leads with a score of 50 or higher are displayed, while those below are hidden.
