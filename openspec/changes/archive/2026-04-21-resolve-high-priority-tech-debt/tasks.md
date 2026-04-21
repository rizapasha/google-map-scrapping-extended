## 1. Install Dependencies

- [x] 1.1 Run `npx shadcn@latest add sonner` to install the Sonner toast component and its Shadcn wrapper
- [x] 1.2 Run `npx shadcn@latest add alert-dialog` to install the AlertDialog component

## 2. Deduplicate ScrapedData Interface

- [x] 2.1 Remove the local `ScrapedData` interface declaration from `src/contents/scraper.ts` (lines 7–16)
- [x] 2.2 Add import `import type { ScrapedData } from "~/lib/utils/scraper-utils"` at the top of `src/contents/scraper.ts`
- [x] 2.3 Run `npx tsc --noEmit` and confirm zero type errors

## 3. Replace alert() in Content Script with Message Passing

- [x] 3.1 In `scraper.ts`, remove both `alert()` calls inside the `finally` block of `performScraping`
- [x] 3.2 Replace them with `chrome.runtime.sendMessage({ action: "SCRAPING_COMPLETE", payload: { count: results.length, wasCancelled } })`
- [x] 3.3 Add a `chrome.runtime.onMessage` listener in `sidepanel.tsx` that handles the `SCRAPING_COMPLETE` action

## 4. Add Toast Infrastructure to Extension Pages

- [x] 4.1 Add `import { Toaster } from "~/components/ui/sonner"` and mount `<Toaster />` in the return of `sidepanel.tsx`
- [x] 4.2 Add `import { Toaster } from "~/components/ui/sonner"` and mount `<Toaster />` in the return of `options.tsx`

## 5. Replace alert() / confirm() in Side Panel

- [x] 5.1 Replace the `alert("Harap isi Context dan Location!")` validation call in `sidepanel.tsx` with `toast.error(...)` for missing context
- [x] 5.2 Replace the `alert("Limit harus antara 1 sampai 5000!")` call with `toast.error(...)`
- [x] 5.3 Replace the generic error fallback `alert(...)` in `handleStartScraping` response handler with `toast.error(...)`
- [x] 5.4 Add a `chrome.runtime.onMessage` handler in `sidepanel.tsx` to receive `SCRAPING_COMPLETE` and call `toast.success()` or `toast.warning()` accordingly

## 6. Replace confirm() in Dashboard with AlertDialog

- [x] 6.1 Add an `AlertDialog` state management pattern to `options.tsx`: a `confirmState` object holding `{ isOpen, title, description, onConfirm }`
- [x] 6.2 Mount a single `<ConfirmAlertDialog>` component (or inline `AlertDialog`) driven by `confirmState` in the `options.tsx` render
- [x] 6.3 Replace the `confirm("Are you sure you want to delete all data?")` in `clearDatabase` with an `openConfirm(...)` call
- [x] 6.4 Replace the `confirm("Delete session...?")` in the delete session handler with `openConfirm(...)`
- [x] 6.5 Replace the `confirm(\`Are you sure you want to delete ${selectedIds.size} selected leads?\`)` in `deleteSelected` with `openConfirm(...)`
- [x] 6.6 Add `toast.success(...)` calls after each successful delete action (session delete, clear all, batch delete)

## 7. Decompose options.tsx into Sub-Components

- [x] 7.1 Create `src/components/dashboard/` directory
- [x] 7.2 Create `src/components/dashboard/StatCards.tsx` — extract the 4 metric cards; accept props: `{ currentData: ScrapedData[] }`
- [x] 7.3 Create `src/components/dashboard/BatchActionBar.tsx` — extract the selected-rows toolbar; accept props: `{ selectedCount, onExport, onDelete }`
- [x] 7.4 Create `src/components/dashboard/LeadsTable.tsx` — extract the full table + pagination; accept all required data and callback props
- [x] 7.5 Create `src/components/dashboard/SessionSidebar.tsx` — extract the full sidebar content (session picker, all filters, sidebar footer actions)
- [x] 7.6 Update `options.tsx` to import and compose the 4 sub-components, removing all extracted JSX

## 8. Verification

- [x] 8.1 Run `npx tsc --noEmit` — confirm zero errors
- [x] 8.2 Run `npm run lint` — confirm zero lint warnings
- [x] 8.3 Run `npm test` — confirm all existing unit tests pass
- [x] 8.4 Load the unpacked extension in Chrome (`npm run dev`) and manually verify: start scraping → toast on complete, validation errors show as toasts, delete session shows AlertDialog, clear all shows AlertDialog, batch delete shows AlertDialog
- [x] 8.5 Confirm `src/contents/scraper.ts` has no local `ScrapedData` declaration
