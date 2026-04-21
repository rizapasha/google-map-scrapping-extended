## ADDED Requirements

### Requirement: Dashboard sub-components are isolated
The Options page SHALL be decomposed into the following named sub-components, each in `src/components/dashboard/`, with all rendering logic moved out of `options.tsx`:

- `SessionSidebar`: Renders the collapsible sidebar with session picker, all filter controls, and sidebar action buttons.
- `StatCards`: Renders the four summary metric cards (Total Places, Highly Rated, With Phone, With Website).
- `LeadsTable`: Renders the data table with header, paginated rows, and pagination controls.
- `BatchActionBar`: Renders the selected-row count badge and batch action buttons (Export, Delete).

#### Scenario: options.tsx acts as orchestration layer
- **WHEN** the Options page renders
- **THEN** `options.tsx` only manages state declarations, data processing (filter/sort/paginate), and passes props to sub-components; it contains no JSX rendering logic beyond mounting sub-components

#### Scenario: Sub-component receives typed props
- **WHEN** a sub-component is imported
- **THEN** it has a fully typed TypeScript props interface that declares all required data and callback functions

### Requirement: Sub-components are independently importable
Each dashboard sub-component SHALL be importable in isolation without importing all of `options.tsx`.

#### Scenario: StatCards renders with data props
- **WHEN** `<StatCards>` is mounted with valid data props
- **THEN** it renders the four metric cards without requiring any shared module-level state

#### Scenario: LeadsTable renders with paginated data
- **WHEN** `<LeadsTable>` is mounted with a `paginatedData` array and pagination props
- **THEN** it renders the table rows and pagination controls independently

### Requirement: No behavioral regression after decomposition
The decomposition SHALL preserve all existing user-visible behavior of the dashboard.

#### Scenario: Filter interactions still work after refactor
- **WHEN** the user changes any filter in the sidebar
- **THEN** the table updates exactly as it did before the refactor

#### Scenario: Row selection and batch actions still work
- **WHEN** the user selects rows and clicks a batch action
- **THEN** the action executes correctly as before
