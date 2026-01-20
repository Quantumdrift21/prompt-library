# Testing Guide

This project employs a comprehensive testing strategy covering Unit, Integration, and End-to-End (E2E) testing.

## 1. Unit & Integration Testing
We use **Vitest** for unit and component testing.

-   **Command:** `npm run test`
-   **Scope:** Services, Hooks, and Component logic.
-   **Files:** Located in `__tests__` directories or next to source files with `.test.tsx` extension.

## 2. End-to-End (E2E) Testing
We use **Playwright** for verifying critical user journeys across browsers (Chromium, Firefox, WebKit).

-   **Command:** `npm run test:e2e` (runs headless)
-   **UI Mode:** `npx playwright test --ui` (interactive debugging)
-   **Scope:** Discovery flow, Authentication flow (mocked), core navigation.
-   **Config:** `playwright.config.ts`

### Best Practices
-   Use `page.locator` or `page.getByRole` for resilient selectors.
-   Avoid fixed waits (`waitForTimeout`); use assertions like `expect(locator).toBeVisible()`.
-   Run tests locally before pushing to ensure `CI/CD` passes.

## 3. Performance Testing
We use **Lighthouse** for auditing performance, accessibility, and SEO.

-   **Command:** `npx lighthouse http://localhost:5173 --output html --output-path=lighthouse-report.html` (requires server running)

## 4. CI/CD Pipeline
GitHub Actions automatically runs tests on `push` to `main`.
-   **Workflow:** `.github/workflows/ci.yml`
-   **Steps:** Lint -> Unit Test -> E2E Test.
