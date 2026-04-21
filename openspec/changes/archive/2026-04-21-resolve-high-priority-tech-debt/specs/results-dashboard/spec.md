## MODIFIED Requirements

### Requirement: Destructive action confirmation
The dashboard SHALL use `AlertDialog` (Shadcn) instead of native `window.confirm()` for all actions that permanently delete data, to provide an accessible, non-blocking, design-system-consistent confirmation flow.

#### Scenario: Delete session requires AlertDialog confirmation
- **WHEN** the user clicks "Delete Session" in the sidebar footer
- **THEN** an `AlertDialog` opens with a title, description of the session being deleted, a Cancel button, and a destructive Continue button; data is only deleted if Continue is clicked

#### Scenario: Clear all data requires AlertDialog confirmation
- **WHEN** the user clicks "Clear All" in the sidebar footer
- **THEN** an `AlertDialog` opens warning that all data will be permanently deleted; data is only cleared if the user confirms

#### Scenario: Batch delete selected rows requires AlertDialog confirmation
- **WHEN** the user clicks "Delete" in the BatchActionBar
- **THEN** an `AlertDialog` opens stating the number of records to be deleted; deletion only proceeds on confirmation

#### Scenario: User can cancel without side effects
- **WHEN** the user dismisses any confirmation AlertDialog
- **THEN** no data is deleted and the dialog closes cleanly

## ADDED Requirements

### Requirement: Post-action toast feedback
The dashboard SHALL display a `sonner` toast notification after completing or failing data operations to give the user unambiguous feedback.

#### Scenario: Session deleted successfully
- **WHEN** the user confirms a session deletion
- **THEN** a success toast appears: "Session deleted"

#### Scenario: All data cleared
- **WHEN** the user confirms "Clear All"
- **THEN** a success toast appears: "All data cleared"

#### Scenario: Selected rows deleted
- **WHEN** the user confirms batch deletion
- **THEN** a success toast appears stating how many records were deleted
