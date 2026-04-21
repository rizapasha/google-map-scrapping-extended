## MODIFIED Requirements

### Requirement: Input validation feedback
The side panel (`sidepanel.tsx`) SHALL use `sonner` toast notifications for validation error feedback instead of native `alert()`, so that feedback is non-blocking and visually consistent with the design system.

#### Scenario: Empty context validation
- **WHEN** the user clicks "Start Scraping" without entering a Business Context
- **THEN** a toast error appears: "Please fill in the Business Context field"
- **AND** focus is moved to the context input

#### Scenario: Empty location validation
- **WHEN** the user clicks "Start Scraping" without entering a Location
- **THEN** a toast error appears: "Please fill in the Location field"
- **AND** focus is moved to the location input

#### Scenario: Invalid limit validation
- **WHEN** the user enters a limit ≤ 0 or > 5000 and clicks "Start Scraping"
- **THEN** a toast error appears: "Item limit must be between 1 and 5,000"

#### Scenario: Content script connection error
- **WHEN** the background returns an error response after attempting to start scraping
- **THEN** a toast error appears with the error message from the response, or a generic fallback message

### Requirement: Scraping completion toast
The side panel SHALL display a toast notification when it receives a `SCRAPING_COMPLETE` message from the content script.

#### Scenario: Completion toast on success
- **WHEN** the side panel receives `{ action: "SCRAPING_COMPLETE", payload: { count: N, wasCancelled: false } }`
- **THEN** a success toast appears: "Scraping complete! N items saved."

#### Scenario: Cancellation toast
- **WHEN** the side panel receives `{ action: "SCRAPING_COMPLETE", payload: { count: N, wasCancelled: true } }`
- **THEN** a warning toast appears: "Scraping stopped. N items saved."
