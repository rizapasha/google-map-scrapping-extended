## 1. Data Model & Logic Refactoring

- [x] 1.1 Update `ScrapedData` type to ensure `sessionId` is always present and clean.
- [x] 1.2 Refactor `calculateLeadScore` in `src/lib/utils/scraper-utils.ts` to accept a `LeadScoreConfig` object.
- [x] 1.3 Add default `leadScoreConfig` constants.

## 2. useDashboard Hook Updates

- [x] 2.1 Implement `renameSession(oldName, newName)` function to bulk update items in storage.
- [x] 2.2 Implement `togglePinSession(sessionId)` logic using a new `pinnedSessions` storage key.
- [x] 2.3 Update `sessionIds` useMemo to prioritize pinned sessions and handle custom sorting.
- [x] 2.4 Load and sync `leadScoreConfig` from `chrome.storage.local`.

## 3. UI Components

- [x] 3.1 Create `LeadScoreConfigModal` with weight inputs and "Total = 100" validation.
- [x] 3.2 Add a Rename dialog for the current session.
- [x] 3.3 Update `SessionSidebar` to display pin icons and handle click events.
- [x] 3.4 Integrate the config modal into the sidebar or dashboard header.

## 4. Verification

- [x] 4.1 Verify session renaming updates all associated leads.
- [x] 4.2 Verify pinned sessions stay at the top after refresh.
- [x] 4.3 Verify scoring changes immediately reflect in the "Top Tier" list.
