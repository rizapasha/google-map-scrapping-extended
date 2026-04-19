## ADDED Requirements

### Requirement: Unit Testing Capability
The project MUST include a unit testing framework (Vitest) capable of testing standalone utility functions.

#### Scenario: Running test suites locally
- **WHEN** a developer runs `npm test` or `pnpm test`
- **THEN** the test framework executes all `*.test.ts` files within the `src/` directory.
- **AND** assertions accurately validate the logic of core functions like `calculateLeadScore` and `formatWhatsAppLink`.