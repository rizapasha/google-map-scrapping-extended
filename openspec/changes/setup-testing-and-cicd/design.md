## Context

The Google Maps Scraper currently requires manual building (`npm run build`) and packaging for distribution. Furthermore, without an automated test suite, refactoring logic in the future could inadvertently break core features like lead scoring or URL formatting. Establishing a CI/CD pipeline using GitHub Actions and a lightweight test runner like Vitest will ensure long-term maintainability and streamline the release of new versions to the community or team.

## Goals / Non-Goals

**Goals:**
- Setup a CI pipeline that runs ESLint, TypeScript compilation, and Unit Tests on every push and pull request to the `main` branch.
- Implement an interactive Continuous Deployment (CD) pipeline utilizing GitHub Actions `workflow_dispatch` to allow developers to trigger a new release (Patch, Minor, Major).
- The CD pipeline must automatically bump the version in `package.json`, build the Plasmo extension, zip the build output, commit and tag the version change back to the repository, and create a GitHub Release attaching the ZIP file.
- Extract utility functions (`calculateLeadScore`, `formatWhatsAppLink`, etc.) into a standalone module and write basic unit tests for them using Vitest to prove the CI pipeline works.

**Non-Goals:**
- End-to-End (E2E) testing involving actual headless Chrome browsers navigating Google Maps (e.g., using Puppeteer or Playwright) is out of scope for this change due to complexity and flakiness on CI environments.
- We will not automate the submission to the Chrome Web Store API. The pipeline will stop at creating a GitHub Release containing the ZIP file.

## Decisions

- **Test Runner**: We choose `vitest` over `jest` because it is blazingly fast, requires minimal configuration in modern ES module / React projects, and integrates seamlessly with TypeScript.
- **Workflow Triggers**: 
  - `ci.yml`: Triggers on `push` to `main` and `pull_request` to `main`.
  - `release.yml`: Triggers on `workflow_dispatch`. We will define an input `bump_type` with choices `patch`, `minor`, and `major`.
- **Version Bumping Strategy**: We will use the native `npm version ${{ github.event.inputs.bump_type }} -m "chore(release): v%s"` command within the action. This updates the `package.json` and creates a Git commit and tag locally in the runner. We will then push these back to `origin main`.
- **Release Action**: We will use `softprops/action-gh-release@v2` to create the GitHub Release and upload the artifact because it is standard, reliable, and handles tag-driven releases elegantly.

## Risks / Trade-offs

- **[Risk] GitHub Token Permissions**: The default `GITHUB_TOKEN` provided to actions might not have write access to push commits or tags back to the repository.
  - **Mitigation**: We must explicitly define `permissions: contents: write` within the `release.yml` workflow, and advise repository admins to ensure workflow write permissions are enabled in repo settings.
- **[Trade-off] Build Path Dependencies**: Plasmo outputs builds to specific folders (e.g., `build/chrome-mv3-prod`). If Plasmo changes its output directory structure in future updates, the zip step will fail.
  - **Mitigation**: Keep the path strictly defined as a variable in the workflow so it's easy to update if needed.