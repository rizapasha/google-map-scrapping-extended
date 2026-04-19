## ADDED Requirements

### Requirement: Continuous Integration Pipeline
A CI pipeline SHALL run automatically on every Pull Request or push targeting the `main` branch to guarantee code quality.

#### Scenario: Running CI on pull request
- **WHEN** a developer opens a Pull Request
- **THEN** GitHub Actions triggers the `ci.yml` workflow.
- **AND** the workflow executes linting, formatting checks, type-checking, and the unit test suite.
- **AND** the PR is blocked if any of these checks fail.

### Requirement: Interactive Release Pipeline
A CD pipeline SHALL be available via `workflow_dispatch` to package and release the extension.

#### Scenario: Developer triggers a release
- **WHEN** a developer navigates to the Actions tab and triggers the `Release New Version` workflow with an input (e.g., `minor`)
- **THEN** the runner automatically bumps the `package.json` version, creates a Git commit (e.g., `chore(release): v1.1.0`), and generates a Git tag.
- **AND** it builds the extension and zips the production artifact.
- **AND** it pushes the commit and tag back to the `main` branch.
- **AND** it publishes a GitHub Release using the generated tag, attaching the compiled `.zip` file for public consumption.