# Acornic

Acornic is a multilingual vocabulary-learning application built with Next.js,
TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

The current pre-MVP includes email/password authentication, a protected
dashboard, private multilingual deck and vocabulary-card management, Supabase
SSR clients, a versioned schema with RLS, and a scheduled review workflow with
answer reveal, ratings, progress, and history. A production release candidate is
available at [acornic.vercel.app](https://acornic.vercel.app).

## Requirements

- Node.js 22 or newer
- npm
- Docker Desktop for the local Supabase stack

## Local setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Start Docker Desktop, then start Supabase:

   ```powershell
   npx supabase start
   ```

3. Copy `.env.example` to `.env.local`. Use the API URL and publishable key
   printed by `supabase start`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:56321
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local publishable key>
   APP_URL=http://localhost:3000
   ```

4. Apply the migration and start the application:

   ```powershell
   npx supabase db reset
   npm run dev
   ```

5. Open `http://localhost:3000`. Local confirmation emails are available in
   Mailpit at `http://127.0.0.1:56324`.

## Verification

```powershell
npm run check
npm run build
npx supabase db lint --local --level error --fail-on error
npx supabase test db --local
```

The database commands require Docker Desktop to be running.

After linking the CLI to the hosted Acornic project, the same schema and RLS
checks can be run with `--linked` instead of `--local`.

## Structure

- `src/app` — route groups, layouts, pages, callback route, and Next.js Proxy
- `src/components/ui` — application-owned shadcn/ui components
- `src/features` — feature actions, validation, and composition
- `src/domain` — framework-independent business contracts and validation
- `src/data` — the dedicated Supabase query layer for feature data
- `src/lib/supabase` — browser, server, and Proxy Supabase clients
- `supabase/migrations` — version-controlled PostgreSQL schema and RLS policies
- `tests/unit` — Vitest unit tests for business boundaries

The simple review algorithm implements `ReviewScheduler` in
`src/domain/review/scheduler.ts`. It keeps scheduling independent from React and
persistence: Again returns in 10 minutes, while Hard, Good, and Easy use staged
intervals up to 60 days.

## Hosted configuration

Production uses the hosted Acornic Supabase project and the Vercel project named
`acornic`. Vercel has the three variables from `.env.example`; Supabase Auth uses
`https://acornic.vercel.app` as its site URL and allows the production and local
`/auth/callback` URLs.

Only the Supabase project URL and publishable key belong in browser-visible
variables. Never add a Supabase secret or service-role key to Vercel client
configuration.
