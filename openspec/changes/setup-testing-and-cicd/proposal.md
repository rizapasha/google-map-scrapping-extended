## Why

As the Google Maps scraper grows in complexity, ensuring code stability and streamlining the release process becomes critical. Setting up a robust CI/CD pipeline prevents broken code from being merged and automates the tedious process of bumping versions, building the extension ZIP, and creating GitHub Releases.

## What Changes

- **Testing Framework**: Introduce `Vitest` to the project and extract core utility functions (like URL parsing and lead scoring) into testable modules.
- **CI Pipeline**: Create a GitHub Actions workflow (`ci.yml`) that runs on Pull Requests and pushes to `main`. It will execute linting, type-checking, and unit tests to ensure codebase health.
- **CD / Release Pipeline**: Create an interactive GitHub Actions workflow (`release.yml`) using `workflow_dispatch`. This allows maintainers to select a version bump type (patch, minor, major). The pipeline will automatically bump `package.json`, build the extension, generate a ZIP file, push the version bump commit/tag to Git, and publish a GitHub Release with the attached ZIP.

## Capabilities

### New Capabilities
- `testing-infrastructure`: Capability covering the automated testing of core utility functions.
- `cicd-automation`: Capability managing the GitHub Actions workflows for continuous integration and automated release packaging.

### Modified Capabilities
- *(None)*

## Impact

- **Project Infrastructure**: Adds `.github/workflows/` directory.
- **Dependencies**: Introduces `vitest` and potentially `happy-dom` or `jsdom` to `package.json`.
- **Code Architecture**: Requires refactoring some helper functions out of the monolithic React files (like `options.tsx`) into separate utility files (e.g., `src/lib/utils.ts`) so they can be easily imported into test suites.