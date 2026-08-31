# Acornic Roadmap

## Current stage

Acornic has reached its first production MVP. The repository contains:

- A public landing page, sign-up and login flows, and a protected dashboard
- Supabase SSR clients and environment validation
- A multilingual schema for profiles, languages, decks, cards, and review events
- Row Level Security policies for user-owned data
- A complete private deck and vocabulary-card management workflow
- A tested review scheduler, due-card queue, rating flow, and review history
- Unit tests for authentication, language, deck/card, and review boundaries

The private multilingual learning loop works locally and in production at `https://acornic.vercel.app`.

## Current technical status

- ESLint, TypeScript, and all 28 unit tests pass through `npm run check`.
- The local migrations, database lint, and 18 cross-user RLS tests pass.
- The local sign-up, confirmation, login, protected-routing, and logout flow is verified.
- The local deck and card create, view, edit, and delete flow is verified.
- The local answer reveal, rating, scheduling, progress, and history flow is verified.
- The production build passes.
- The repository is tracked in Git and pushed to its private GitHub remote.
- The hosted Acornic Supabase project has both versioned migrations applied; remote schema lint and all 18 RLS tests pass.
- The Vercel production release is live at `https://acornic.vercel.app`.
- The public and anonymous-protected production routes, accessibility checks, and mobile/desktop layouts are verified.
- The production account creation, email confirmation, authentication, deck/card management, and review flow are verified.

## Milestone 0: Stabilize the foundation

- [x] Exclude generated Supabase files from ESLint and restore a passing `npm run check`.
- [x] Run the local migration, database lint, and authorization tests with two users.
- [x] Verify sign-up, confirmation, login, protected routing, and logout locally.
- [x] Run a production build.
- [x] Create the initial Git commit.
- [x] Push the repository to GitHub.

**Done when:** a fresh checkout can be configured and verified using the README instructions.

## Milestone 1: Deck and card management

- [x] Add validated data-access functions and Server Actions for decks and cards.
- [x] Let users create, view, edit, and delete multilingual decks and vocabulary cards.
- [x] Provide accessible loading, empty, success, and error states.
- [x] Add integration tests proving users cannot access another user's data.

**Done when:** an authenticated user can maintain a private vocabulary deck from the UI.

## Milestone 2: Review workflow

- [x] Implement the first simple review-scheduling algorithm behind the existing contract.
- [x] Add due-card queries, answer reveal, rating controls, and review-event recording.
- [x] Show basic review progress and history.
- [x] Test scheduling rules separately from React and persistence.

**Done when:** a user can complete a review session and see future reviews change based on ratings.

## Milestone 3: MVP release

- [x] Test the critical flow from account creation through deck review.
- [x] Complete accessibility and responsive-layout checks.
- [x] Configure a hosted Supabase project and apply version-controlled migrations.
- [x] Deploy to Vercel and verify authentication, RLS, and the learning flow in production.

**Done when:** the private multilingual learning loop works reliably in production.

## Milestone 4: Release reliability

- [x] Add GitHub Actions checks for linting, TypeScript, unit tests, production builds, and local RLS tests.
- [x] Add a small automated browser smoke test for public pages, protected routing, and the core learning flow.
- [x] Configure production error monitoring and a basic uptime check.
- [x] Document backup, restore, and rollback procedures for Supabase and Vercel.

**Done when:** regressions and production failures are detected automatically, and a release can be safely rolled back.

**Evidence (31 August 2026):** [CI run 33392427348](https://github.com/myverp/Acornic/actions/runs/33392427348)
passed linting, 28 unit tests, the production build, database linting, 18 RLS
assertions, and two Playwright browser smoke tests. Vercel deployed
[production](https://acornic.vercel.app) successfully, and
[uptime run 33394472751](https://github.com/myverp/Acornic/actions/runs/33394472751)
passed against its canonical URL. Vercel Web Analytics and structured server
failure logs provide production observability; backup, restore, and rollback
steps are in [docs/operations.md](docs/operations.md).

## Later improvements

1. Add CSV import and export for vocabulary cards to reduce manual data entry and keep user data portable.
2. Add deck search, filtering, and sorting once larger collections make navigation difficult.
3. Improve review insights with due-card forecasts and per-deck accuracy, without adding complex gamification.
4. Let users suspend cards and reset a card's review progress when the learning content changes.
