## Why

Three critical code quality issues have accumulated in the codebase that directly harm maintainability and user experience: a duplicated `ScrapedData` type definition creates a hidden drift risk, native browser `alert()`/`confirm()` calls produce jarring UX that is inconsistent with the Shadcn design system, and `options.tsx` at 877 lines has grown too monolithic to safely iterate on. These must be resolved before adding any new features to prevent the debt from compounding.

## What Changes

- **Remove duplicate `ScrapedData` interface** from `src/contents/scraper.ts` and establish `src/lib/utils/scraper-utils.ts` as the single source of truth; update the import in `scraper.ts`.
- **Replace all `alert()` and `confirm()` calls** across `sidepanel.tsx`, `options.tsx`, and `scraper.ts` with Shadcn `Sonner` toast notifications and an `AlertDialog` confirmation component.
- **Decompose `options.tsx`** (877 lines) into focused sub-components: `<SessionSidebar>`, `<StatCards>`, `<LeadsTable>`, and `<BatchActionBar>`, with `options.tsx` acting as the thin orchestration layer.

## Capabilities

### New Capabilities

- `toast-notifications`: Global toast/notification system powered by Sonner for feedback events (scraping complete, errors, confirmations).
- `dashboard-component-structure`: Decomposed options dashboard with isolated, testable sub-components.

### Modified Capabilities

- `results-dashboard`: UI behavior changes — destructive actions now use `AlertDialog` instead of native `confirm()`, and feedback uses toasts instead of `alert()`.
- `map-scraper-engine`: `ScrapedData` type is removed from `scraper.ts`; it now imports from `scraper-utils.ts`. No behavioral change.
- `extension-ui`: Side panel validation errors and scraping completion now use toast instead of `alert()`.

## Impact

- **Files modified**: `src/contents/scraper.ts`, `src/sidepanel.tsx`, `src/options.tsx`
- **Files created**: `src/components/dashboard/SessionSidebar.tsx`, `src/components/dashboard/StatCards.tsx`, `src/components/dashboard/LeadsTable.tsx`, `src/components/dashboard/BatchActionBar.tsx`
- **New dependency**: `sonner` (toast library, compatible with Shadcn) + `@radix-ui/react-alert-dialog`
- **No breaking changes** to data schema (`ScrapedData`) or `chrome.storage` structure
- **TypeScript**: All existing type safety is preserved; deduplication strengthens it
