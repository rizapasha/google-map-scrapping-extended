## MODIFIED Requirements

### Requirement: ScrapedData type is imported from shared utility
The content script (`src/contents/scraper.ts`) SHALL import the `ScrapedData` interface from `~/lib/utils/scraper-utils` and SHALL NOT define its own local copy of the interface.

#### Scenario: Single type definition enforced
- **WHEN** a developer adds a field to `ScrapedData` in `scraper-utils.ts`
- **THEN** TypeScript immediately surfaces type errors in any file that uses `ScrapedData` incorrectly, including `scraper.ts`, with no need to update a duplicate definition

#### Scenario: Scraper module compiles without local ScrapedData declaration
- **WHEN** `npx tsc --noEmit` is run
- **THEN** `scraper.ts` compiles successfully using only the imported type from `scraper-utils.ts`

## MODIFIED Requirements

### Requirement: Scraping completion notification
The content script (`scraper.ts`) SHALL send a message to the side panel via `chrome.runtime.sendMessage` upon scraping completion or cancellation instead of calling `alert()` directly, to avoid blocking the content script thread and to enable a UI-consistent notification.

#### Scenario: Successful scraping completion message
- **WHEN** scraping finishes by reaching the item limit or end of feed
- **THEN** the content script sends `{ action: "SCRAPING_COMPLETE", payload: { count: number, wasCancelled: false } }` to the runtime

#### Scenario: Cancelled scraping message
- **WHEN** scraping is halted by the stop signal
- **THEN** the content script sends `{ action: "SCRAPING_COMPLETE", payload: { count: number, wasCancelled: true } }` to the runtime

#### Scenario: Side panel receives and toasts the message
- **WHEN** the side panel receives a `SCRAPING_COMPLETE` message
- **THEN** it displays a `sonner` toast with the appropriate success or cancellation message
