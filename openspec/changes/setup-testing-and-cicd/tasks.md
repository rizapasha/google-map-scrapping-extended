## 1. Setup Vitest and Refactor Helpers

- [x] 1.1 Install `vitest` as a dev dependency (`npm install -D vitest`).
- [x] 1.2 Create `vitest.config.ts` if necessary (for path aliases like `~/*`).
- [x] 1.3 Add a `"test"` script to `package.json` pointing to `vitest run`.
- [x] 1.4 Refactor core logic: create `src/lib/utils/scraper-utils.ts` and move `calculateLeadScore`, `formatWhatsAppLink`, and `formatMapsLink` into it. Update `options.tsx` to import them.
- [x] 1.5 Create `src/lib/utils/scraper-utils.test.ts` and write passing unit tests for the extracted helper functions.

## 2. Create Continuous Integration (CI) Workflow

- [x] 2.1 Create the directory structure: `mkdir -p .github/workflows`.
- [x] 2.2 Create `.github/workflows/ci.yml`.
- [x] 2.3 Configure `ci.yml` to trigger on `push` to `main` and `pull_request` to `main`.
- [x] 2.4 Add steps to `ci.yml` to checkout code, setup Node.js v18, install dependencies, and run `npm run lint`, `npx tsc --noEmit`, and `npm test`.

## 3. Create Release Automation (CD) Workflow

- [ ] 3.1 Create `.github/workflows/release.yml`.
- [ ] 3.2 Configure it to trigger on `workflow_dispatch` with an input `bump_type` (choice of patch, minor, major).
- [ ] 3.3 Add the Node.js setup and dependency installation steps.
- [ ] 3.4 Add a step to run tests (`npm test`) as a safety gate before releasing.
- [ ] 3.5 Add Git Bot configuration steps (`git config user.name/email`).
- [ ] 3.6 Add the version bump step: `npm version ${{ github.event.inputs.bump_type }} -m "chore(release): v%s"`.
- [ ] 3.7 Add the build step: `npm run build`.
- [ ] 3.8 Add a step to zip the built extension: `cd build/chrome-mv3-prod && zip -r ../../google-maps-scraper.zip .`
- [ ] 3.9 Add a step to push the new commit and tags back to the repository (`git push origin main --follow-tags`).
- [ ] 3.10 Add the `softprops/action-gh-release@v2` step to create the GitHub release using the generated tag and attaching the `.zip` file. Ensure the workflow file specifies `permissions: contents: write`.