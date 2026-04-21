## Context

The extension currently has three distinct code quality problems that have been confirmed by static analysis:

1. **Duplicate type definition**: `ScrapedData` is declared in both `src/contents/scraper.ts` (line 7) and `src/lib/utils/scraper-utils.ts` (line 1). Both are structurally identical today, but they can drift silently — a field added to one won't cause a TypeScript error in the other.

2. **Native browser dialogs**: `alert()` is used in `scraper.ts` (post-scraping notification) and `sidepanel.tsx` (validation). `confirm()` is used in `options.tsx` for all destructive actions (clear DB, delete session, delete selected rows). These block the JS thread, look jarring on Chrome, and are inconsistent with the Shadcn UI design system in use.

3. **Monolithic `options.tsx`**: At 877 lines, the options page mixes state management, data processing, filter logic, and all UI rendering in a single component. This makes it impossible to test sub-sections in isolation and increases the cognitive load for any modification.

## Goals / Non-Goals

**Goals:**
- Establish a single source of truth for `ScrapedData` (zero duplication)
- Replace all `alert()`/`confirm()` with non-blocking, in-design-system equivalents
- Decompose `options.tsx` into ≤5 focused sub-components, each ≤200 lines
- Maintain 100% behavioral parity — no functional changes visible to users beyond improved UX

**Non-Goals:**
- Changing the `ScrapedData` shape or adding new fields
- Redesigning the dashboard layout or adding new filters
- Migrating to a state management library (Zustand, Redux, etc.)
- Adding new test coverage for UI components (tracked separately)

## Decisions

### Decision 1: Toast library — Sonner via Shadcn

**Choice**: Install `sonner` through `npx shadcn add sonner`.  
**Rationale**: Sonner is the canonical Shadcn toast library. It requires a single `<Toaster />` provider, works inside Chrome extension iframes/panels without configuration, and has no conflicting peer dependencies. It replaces `alert()` with `toast.success()`, `toast.error()` calls.  
**Alternative considered**: `@radix-ui/react-toast` (the lower-level primitive). Rejected because Shadcn's `sonner` integration is higher-level, requires less boilerplate, and is already the recommended pattern in the Shadcn docs.

### Decision 2: Confirmation dialogs — Shadcn `AlertDialog`

**Choice**: Replace all `confirm()` calls with Shadcn `AlertDialog` component.  
**Rationale**: `AlertDialog` is already part of the Radix UI dependency tree (via `@radix-ui/react-alert-dialog`). It is non-blocking, accessible (ARIA role=`alertdialog`), and stylistically consistent with the rest of the UI.  
**Alternative considered**: Using `toast` with action buttons. Rejected because destructive confirmations (delete all data) require a more prominent, modal-level confirmation — not an ephemeral notification.

### Decision 3: Component decomposition strategy — Co-location with state lifting

**Choice**: Create `src/components/dashboard/` directory with sub-components that receive data and callbacks as props. State stays in `options.tsx` (now the thin orchestration layer).  
**Rationale**: Avoids introducing a new state management pattern (which would be out of scope). Props drilling is acceptable here because the component tree is only 2 levels deep. Each sub-component becomes independently testable.  
**Alternative considered**: React Context for dashboard state. Rejected as over-engineering for the current scale.

**Component split:**
| Component | Responsibility | Approx. lines |
|-----------|---------------|---------------|
| `options.tsx` | State, data processing, wiring | ~150 |
| `SessionSidebar.tsx` | Sidebar: session picker + all filters + actions | ~220 |
| `StatCards.tsx` | 4 summary stat cards | ~70 |
| `LeadsTable.tsx` | Table header, rows, pagination | ~300 |
| `BatchActionBar.tsx` | Selected-rows action toolbar (export, delete) | ~60 |

### Decision 4: Import path for `ScrapedData`

**Choice**: `scraper.ts` will import `ScrapedData` from `~/lib/utils/scraper-utils` using the Plasmo `~` alias.  
**Rationale**: The `~` alias resolves to `src/` in Plasmo projects. This is the same pattern already used by `options.tsx` and `sidepanel.tsx` for their imports.

## Risks / Trade-offs

- **[Risk] `AlertDialog` requires async confirmation flow** → Mitigation: Wrap destructive handlers in a Promise-based `useConfirmDialog` pattern or simply manage `isOpen` state locally in `options.tsx` with a pending-action ref.
- **[Risk] Sonner `<Toaster />` must be mounted in each extension page** → Mitigation: Add `<Toaster />` to both `sidepanel.tsx` and `options.tsx` render trees. Chrome extension pages are isolated, so this is expected.
- **[Risk] Props drilling in decomposed dashboard** → Acceptable trade-off at current scale. Mitigated by clear interface definitions on each sub-component.
- **[Risk] Regression in scraper notification** → The `alert()` in `scraper.ts` runs in the content script context, which cannot use React. Replace with `chrome.notifications` API or a message sent to the side panel to trigger a toast there.
