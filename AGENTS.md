# Acornic development instructions

## Product principles

- Acornic is a multilingual vocabulary-learning application.
- Never assume that the learning language is German.
- Use ISO-style language codes such as `en`, `de`, `uk`, `es`, and `fr`.
- Prefer a small, working vertical slice over many incomplete features.
- Keep the MVP simple, but do not create architectural shortcuts that will require a rewrite.

## Technology

- Use Next.js App Router and strict TypeScript.
- Use Server Components by default.
- Add `"use client"` only when browser state, effects, or event handlers require it.
- Use Tailwind CSS and shadcn/ui for the interface.
- Use Supabase for PostgreSQL and authentication.
- Store database changes in version-controlled Supabase migrations.
- Deploy the production application to Vercel.

## Architecture

- Keep business logic independent from React components.
- Keep database access in a dedicated data-access layer.
- Do not call Supabase directly from presentational components.
- Validate untrusted input at application boundaries.
- Keep modules small and organized by product feature.
- Avoid premature abstractions, microservices, global state libraries, and unnecessary dependencies.
- Prefer explicit, readable code over clever code.
- Do not silently change existing architectural decisions. Explain significant deviations first.

## Database and security

- Enable Row Level Security on every table containing user-owned data.
- Every user-owned row must have a clear owner or be reachable through an owned parent.
- Test that one user cannot access another user's data.
- Never expose the Supabase service-role key to client code.
- Never commit credentials, API keys, or local environment files.
- Update `.env.example` when adding environment variables.
- Create migrations instead of making undocumented manual database changes.

## UI and accessibility

- Build a calm, clean, responsive interface.
- Reuse established components and design tokens.
- Provide loading, empty, success, and error states.
- Use semantic HTML, labels, visible focus states, and keyboard-accessible controls.
- Avoid unnecessary animations, gradients, and visual clutter.
- Do not use browser-native alert dialogs for normal application flows.

## Quality

- Run type checking and linting after meaningful changes.
- Add unit tests for business logic.
- Add integration tests for data access and authorization when practical.
- Use end-to-end tests only for critical user flows.
- Fix the cause of an error instead of suppressing it with `any`, disabled lint rules, or ignored failures.
- Keep documentation synchronized with setup and architectural changes.

## Scope and external actions

- Do not deploy, create paid resources, modify production data, or rotate credentials without explicit approval.
- Do not perform destructive database operations without confirming the exact target and impact.
- Do not add payments, social features, AI-generated content, or complex gamification unless requested.

## Agent usage

- Use the main agent for architecture, database design, RLS, authentication, integration, and final decisions.
- Do not spawn subagents by default.
- Use at most two subagents at a time.
- Delegate only small, independent, clearly bounded tasks.
- Prefer cheaper models for repository exploration, test planning, lint analysis, documentation, and summarization.
- Do not allow multiple agents to edit the same files.
- Avoid parallel write-heavy tasks.
- Give each subagent only the minimum required context.

## Cost and context efficiency

- Keep explanations concise and prioritize working implementation.
- Do not generate speculative features, excessive documentation, or large code examples that are not needed for the current milestone.
- Read only the files relevant to the current task.
- Avoid repeatedly reading or summarizing unchanged files.
- Reuse existing project conventions and components.
- Do not broaden the scope without explicit approval.
- Do not spawn subagents unless a clearly independent task would benefit from a cheaper model.
- Use subagents only when their expected benefit exceeds the additional context and token cost.
- Ask subagents for concise findings rather than raw logs or complete file dumps.

## Working process

1. Inspect existing code before editing.
2. State relevant assumptions.
3. Make the smallest coherent change.
4. Verify the change.
5. Summarize what changed, what was tested, and what remains.

## Agent skills

### Issue tracker

Issues and specs are tracked as local Markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

This repository uses a single-context domain-doc layout. See `docs/agents/domain.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
