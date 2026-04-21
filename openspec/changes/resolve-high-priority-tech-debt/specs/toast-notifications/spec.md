## ADDED Requirements

### Requirement: Toast provider is mounted in extension pages
The application SHALL mount a `<Toaster />` component (from `sonner`) at the root of both the Side Panel page (`sidepanel.tsx`) and the Options/Dashboard page (`options.tsx`) so that toast notifications are available throughout each page's component tree.

#### Scenario: Toast displays on scraping completion
- **WHEN** the background or content script signals scraping has finished
- **THEN** the side panel displays a non-blocking success toast with the count of scraped items

#### Scenario: Toast displays on error
- **WHEN** the scraping process fails or the content script is unreachable
- **THEN** the side panel displays a destructive/error toast with a human-readable message

#### Scenario: Toast does not block UI interaction
- **WHEN** a toast notification is displayed
- **THEN** the user can still interact with all form inputs, buttons, and navigation elements simultaneously

### Requirement: Destructive actions use AlertDialog confirmation
The application SHALL replace all native `confirm()` calls with Shadcn `AlertDialog` for any action that permanently deletes data.

#### Scenario: Delete session confirmation
- **WHEN** the user clicks "Delete Session" in the dashboard sidebar
- **THEN** an `AlertDialog` modal appears describing the action and requiring explicit confirmation before data is deleted

#### Scenario: Clear all data confirmation
- **WHEN** the user clicks "Clear All" in the dashboard sidebar
- **THEN** an `AlertDialog` modal appears and data is only cleared upon clicking the confirm button

#### Scenario: Delete selected rows confirmation
- **WHEN** the user clicks "Delete" in the batch action bar with rows selected
- **THEN** an `AlertDialog` modal appears stating how many records will be deleted

#### Scenario: Cancellation aborts action
- **WHEN** the user clicks "Cancel" or dismisses the AlertDialog
- **THEN** no data is modified and the dialog closes

### Requirement: Validation feedback uses toast
The application SHALL replace `alert()` calls used for input validation in the side panel with inline toast error messages.

#### Scenario: Empty field validation
- **WHEN** the user clicks "Start Scraping" without filling in Context or Location
- **THEN** a toast error message appears indicating which field is missing, without blocking interaction

#### Scenario: Invalid limit validation
- **WHEN** the user enters a limit outside the 1–5000 range
- **THEN** a toast error message appears describing the valid range
