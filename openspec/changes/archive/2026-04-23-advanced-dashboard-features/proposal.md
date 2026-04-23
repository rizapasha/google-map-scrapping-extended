## Why

The current dashboard lacks essential management features for organizing large amounts of scraped data. Users cannot rename sessions to better identify them, cannot prioritize specific sessions via pinning, and are stuck with hardcoded "Top Tier Lead" metrics that may not fit their specific business needs.

## What Changes

- **Session Renaming**: Users can rename existing scraping sessions. This will update the `sessionId` for all associated data items in storage.
- **Session Pinning**: Users can "pin" important sessions to the top of the session list for quick access.
- **Configurable Lead Metrics**: Users can manually adjust the weights of the scoring metrics (Website, Phone, Rating, Reviews) and set their own "Top Tier" threshold.
- **Strict Metric Validation**: The scoring configuration will enforce that the sum of all metric weights must equal exactly 100 to ensure scoring consistency.

## Capabilities

### New Capabilities
- `session-management`: New requirements for renaming and pinning sessions.
- `lead-scoring-configuration`: New requirements for user-configurable scoring metrics and validation.

### Modified Capabilities
- `dashboard-data-filters`: Update the "Top Tier" filter to respect user-defined configurations instead of hardcoded values.

## Impact

- `src/lib/hooks/use-dashboard.ts`: Major updates to state management and storage interaction.
- `src/lib/utils/scraper-utils.ts`: Refactor `calculateLeadScore` to accept a configuration object.
- `src/components/dashboard/SessionSidebar.tsx`: UI updates for pinning and renaming.
- `src/options.tsx`: Integration of the new configuration modal and renaming UI.
