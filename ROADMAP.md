# Acornic Roadmap

## Current stage

Acornic is in the pre-MVP stage. The repository contains:

- A public landing page, sign-up and login flows, and a protected dashboard
- Supabase SSR clients and environment validation
- A multilingual schema for profiles, languages, decks, cards, and review events
- Row Level Security policies for user-owned data
- A complete private deck and vocabulary-card management workflow
- A tested review scheduler, due-card queue, rating flow, and review history
- Unit tests for authentication, language, deck/card, and review boundaries

The private vocabulary-learning workflow works locally. Hosted infrastructure is configured and the production release candidate is live; the real production sign-up-to-review flow still needs to be verified.

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
- Production email confirmation and the authenticated deck-to-review flow have not been exercised.

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

- [ ] Test the critical flow from account creation through deck review.
- [x] Complete accessibility and responsive-layout checks.
- [x] Configure a hosted Supabase project and apply version-controlled migrations.
- [ ] Deploy to Vercel and verify authentication, RLS, and the learning flow in production. Deployment and RLS are verified; authenticated production testing remains.

**Done when:** the private multilingual learning loop works reliably in production.
