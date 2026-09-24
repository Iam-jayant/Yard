# Yard — Development Log

> Tracks every meaningful change made during Phase 1 development.
> Purpose: agent continuity, decision rationale, file-level traceability.
> Updated after every task or commit.

---

## Format

Each entry follows this structure:

```
### [DATE] — [TASK ID] — [Short Description]

**What changed:**
- `path/to/file.ts` — description of change
- `path/to/other.ts` — description of change

**Why:**
Brief rationale for non-obvious decisions.

**Commit:** `hash` — `message`
```

---

## Log

---

### 2026-09-22 — T01–T06, T07, T11 — Repo Scaffold & Schema

**Context:** Initial Phase 1 scaffold. Transformed flat repo into locked monorepo structure per PHASE-1.md spec.

**What changed:**

| File | Change |
|---|---|
| `turbo.json` | Created. Turbo v2 `tasks` syntax. Pipelines: build, dev, lint, type-check, db:migrate, db:generate, db:push |
| `package.json` | Created root workspace manifest. Scripts: build, dev, lint, type-check, db:migrate, db:generate, db:push, db:studio, format, clean. Engine: Node 20+, pnpm 9+ |
| `pnpm-workspace.yaml` | Created. Workspace roots: `apps/*`, `packages/*` |
| `.gitignore` | Created. Covers: node_modules, .next, dist, .env files, Prisma, Turbo, Vercel, IDE, coverage |
| `packages/db/prisma/schema.prisma` | Full schema: 7 models (User, District, Idea, Plot, HealthScore, XPTransaction, BuildingCustomization), 3 enums (PlotStatus, DistrictSlug, XPReason). Matches PHASE-1.md exactly |
| `packages/db/index.ts` | PrismaClient singleton with hot-reload guard for Next.js dev mode |
| `packages/db/package.json` | @yard/db package. Deps: @prisma/client. Scripts: generate, migrate, push, studio |
| `packages/types/index.ts` | Shared types: RawSignals, BuildScoreResult interfaces. computeBuildScore() formula (Consistency 40%, Delivery 30%, Impact 20%, Structure 10%). computeBuildingHeight(). XP_EARN_TABLE, XP_SHOP_ITEMS, constants (MAX_ACTIVE_PLOTS=3, IDLE=14d, RUIN=30d) |
| `packages/types/package.json` | @yard/types package. Depends on @yard/db for enum re-exports |
| `packages/config/eslint/index.js` | Shared ESLint config. Extends: recommended + TypeScript + Prettier |
| `packages/config/typescript/base.json` | Shared tsconfig base. Target: ES2022, strict mode, bundler resolution |
| `packages/config/package.json` | @yard/config package |
| `apps/web/package.json` | @yard/web. Deps: next@15, react@19, R3F, drei, three, next-auth@5, tailwindcss |
| `apps/web/next.config.ts` | transpilePackages: @yard/db, @yard/types |
| `apps/web/tailwind.config.ts` | Yard design tokens: bg #0d0d0d, text #e2e2e2, amber #C9983A. Fonts: JetBrains Mono, Inter |
| `apps/web/tsconfig.json` | Extends @yard/config base. JSX preserve, Next.js plugin, workspace path aliases |
| `apps/web/app/layout.tsx` | Root layout with SEO metadata title/description |
| `apps/web/app/page.tsx` | Placeholder for terminal landing |
| `apps/web/lib/utils.ts` | Utility functions: cn(), formatNumber(), timeAgo() |
| `apps/web/.env.example` | All env vars: DATABASE_URL, NEXTAUTH_*, GITHUB_*, SUPABASE_* |
| `apps/agent/package.json` | @yard/agent. Deps: node-cron, @supabase/supabase-js, tsx |
| `apps/agent/tsconfig.json` | Extends base. src → dist compilation |
| `apps/agent/src/index.ts` | Cron entry point. 3 jobs registered: score (0 */6 * * *), idle (0 2 * * *), ruin (0 3 * * *). Job functions commented until implemented |
| `apps/agent/.env.example` | DATABASE_URL, GITHUB_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |
| `docs/PHASE-0-CONSTITUTION.md` | Migrated from Artifacts/yard-phase0.md |
| `docs/PHASE-1.md` | Migrated from Artifacts/PHASE-1.md |
| `docs/AGENT.md` | Migrated from root AGENT.md |
| `.github/workflows/ci.yml` | Migrated from root ci.yml. Steps: checkout, pnpm, node, install, prisma generate, type-check, lint, build |
| `LICENSE` | MIT, copyright Jayant |
| `README.md` | Updated tech stack to Phase 1 (R3F, Supabase Realtime). Fixed doc links |
| `CONTRIBUTING.md` | Fixed doc paths, added db:generate to setup, updated project structure |

**Deleted:**
- `Artifacts/` directory (all content migrated to `docs/`)
- Root `AGENT.md` (moved to `docs/AGENT.md`)
- Root `ci.yml` (moved to `.github/workflows/ci.yml`)
- All `.gitkeep` files (24 removed — unnecessary)

**Why:**
- Phase 1 spec mandates directory structure locked on Day 1
- Turbo v2 uses `tasks` not `pipeline` (deprecated)
- Went with real skeleton code over empty placeholders — schema, types, formula all defined so any contributor can start immediately
- Removed .gitkeep files per Jayant's preference — dirs recreated when real files land

**Commits:**
- `1755607` — `docs: migrate specs to docs/ and remove Artifacts/`
- `aff1e59` — `chore: scaffold monorepo apps and packages`
- `5feecab` — `chore: update root configs, add LICENSE and CI workflow`

---

### 2026-09-23 — ADR: Auth stack swap — NextAuth → Supabase Auth

**Decision:** Replace NextAuth v5 with Supabase Auth (`@supabase/ssr`).

**What changed:**

| File | Change |
|---|---|
| `apps/web/package.json` | Removed `next-auth`. Added `@supabase/ssr`, `@supabase/supabase-js` |
| `apps/web/.env.example` | Removed `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`. Supabase handles OAuth credentials via its dashboard |
| `docs/TASKS.md` | T09 updated: "Set up Supabase Auth with GitHub OAuth provider via `@supabase/ssr`" |
| `README.md` | Tech stack table: Auth row → "Supabase Auth + GitHub OAuth" |

**Why:**
- Supabase already handles DB and Realtime — adding Auth consolidates the entire backend-as-a-service layer into one provider
- No separate OAuth app to manage — GitHub provider configured in Supabase dashboard
- `@supabase/ssr` gives server/client session management out of the box with Next.js App Router
- `session.provider_token` gives the GitHub access token needed for webhook registration on plot claim
- One fewer dependency to maintain (no `next-auth`, no `@auth/prisma-adapter`)

**Impact on directory structure:**
- `app/api/auth/[...nextauth]/` → no longer needed (was NextAuth catch-all). Becomes `app/api/auth/callback/` for Supabase OAuth callback
- `lib/auth/config.ts` → becomes Supabase client helpers (createBrowserClient, createServerClient)

**Commits:** Not yet committed — will bundle with T08/T09 work.

---

### 2026-09-23 — T08 — First schema push to Supabase

**What changed:**

| File | Change |
|---|---|
| `packages/db/.env` | Created — DATABASE_URL pointing to Supabase PostgreSQL (direct connection, port 5432) |
| `apps/web/.env.local` | Updated DATABASE_URL from localhost placeholder to Supabase connection |

**Actions taken:**
1. Installed pnpm 9 globally (`npm install -g pnpm@9`)
2. Ran `pnpm install` — 327 packages, 391 resolved. Peer warnings on R3F v8 vs React 19 (will fix in M2 with R3F v9)
3. Ran `pnpm db:generate` — Prisma Client v6.19.3 generated successfully
4. Ran `pnpm db:push` — all 7 tables synced to Supabase in 3.88s

**Tables live in Supabase:**
User, District, Idea, Plot, HealthScore, XPTransaction, BuildingCustomization

**Note:** Used `db push` instead of `migrate dev` — cleaner for initial Supabase setup. Migration history starts with the first schema change going forward.

**Note:** Supabase free tier uses IPv6 for direct connections. The direct connection (`db.xxx.supabase.co:5432`) worked without issues.

---

### 2026-09-23 — T09 + T10 — Supabase Auth + Client Setup

**What changed:**

| File | Change |
|---|---|
| `apps/web/lib/supabase/server.ts` | **New.** Server-side Supabase client. Two variants: `createClient()` (anon, user session) and `createAdminClient()` (service_role, bypasses RLS). Cookie-based session via @supabase/ssr |
| `apps/web/lib/supabase/client.ts` | **New.** Browser-side Supabase client for React client components |
| `apps/web/lib/supabase/middleware.ts` | **New.** Middleware helper — refreshes Supabase session on every request via `getUser()` call |
| `apps/web/middleware.ts` | **New.** Next.js middleware — calls `updateSession()` on all non-static routes |
| `apps/web/app/api/auth/callback/route.ts` | **New.** OAuth callback. Exchanges auth code for session, then upserts User in Prisma DB (githubId, username, avatarUrl, email) |
| `apps/web/app/api/auth/signout/route.ts` | **New.** POST route — clears Supabase session, redirects to home |
| `apps/web/app/(auth)/login/page.tsx` | **New.** Login page with "Sign in with GitHub" button. Requests scopes: `repo read:user user:email`. Dark themed, JetBrains Mono |
| `packages/db/prisma/enable-rls.sql` | **New.** SQL to enable RLS on all 7 tables |

**Auth flow:**
1. User clicks "Sign in with GitHub" on `/login`
2. `supabase.auth.signInWithOAuth()` → redirects to GitHub
3. GitHub → Supabase callback → exchanges code → redirects to `/api/auth/callback`
4. Callback route: `exchangeCodeForSession()` → gets user metadata → `prisma.user.upsert()` to sync DB
5. Redirect to `/` — session available via `createClient()` everywhere

**OAuth scopes requested:**
- `repo` — needed for webhook registration on plot claim (T29)
- `read:user user:email` — profile data sync

**RLS:** Enabled on all 7 tables via SQL execution. No restrictive policies yet — Prisma (direct connection) and service_role both bypass RLS.

---

### Next Up

**T12** — Verify: `pnpm dev` runs, GitHub login creates a User row in DB.

---

*Yard · DEVLOG.md · Phase 1*
