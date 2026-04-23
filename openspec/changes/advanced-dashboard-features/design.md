## Context

The extension currently stores all leads in a flat array (`scrapedData`) and uses a hardcoded scoring function. To provide the requested flexibility, we need to introduce a dedicated configuration object in `chrome.storage.local` and update the UI to allow manipulating the data structure and the scoring logic.

## Goals / Non-Goals

**Goals:**
- Enable session-level organization (rename, pin).
- Externalize lead scoring parameters.
- Ensure strict data integrity during bulk renaming operations.

**Non-Goals:**
- Changing the schema of individual lead items (other than `sessionId`).
- Migrating to a different storage backend (e.g., IndexedDB).

## Decisions

- **Storage Structure**:
    - `pinnedSessions`: `string[]` - Stores a list of session IDs that should be prioritized.
    - `leadScoreConfig`: `object` - Stores weights and threshold.
      ```typescript
      {
        website: number,
        phone: number,
        rating: number,
        reviews: number,
        threshold: number
      }
      ```
- **Bulk Renaming Strategy**: To avoid data loss, renaming will involve creating a new array with updated IDs, saving it to storage, and then refreshing the local state.
- **Scoring Function Refactor**: `calculateLeadScore` will be moved to a dependency-injection pattern where the config is passed as an argument.
- **UI Validation Logic**: The configuration modal will use a reactive sum indicator. The "Save" button will only be enabled if `sum === 100`.

## Risks / Trade-offs

- **[Risk] Large Data Renaming Latency**: Renaming a session with 5,000+ items might cause a UI stutter. → **Mitigation**: Perform the update asynchronously and show a loading toast.
- **[Risk] Configuration Sync**: Changes to weights in one tab might not reflect in another immediately. → **Mitigation**: Use `chrome.storage.onChanged` to sync the configuration state across the application.
