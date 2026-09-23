# Contributing to Yard

Thanks for being here. Yard is built on the same principle it stands for — show up, claim your plot, and let the work speak.

---

## Before You Write Any Code

Read the [Phase 0 Constitution](docs/PHASE-0-CONSTITUTION.md). Seriously. Every decision about what Yard is and isn't lives there. If you have a question about direction, the answer is probably already in that document.

For the full technical specification — stack, schema, formulas, milestones — see [Phase 1 Spec](docs/PHASE-1.md).

---

## What We're Looking For

We're early-stage and intentionally small. We're not looking for hype — we're looking for people who have shipped something before and want to build something real.

Good contributions:
- Move a Phase milestone forward
- Fix a real bug with a clear reproduction
- Improve clarity of existing code without adding complexity
- Raise a well-reasoned architectural question in an issue before implementing

Not the right fit right now:
- Feature suggestions outside the current Phase scope
- Rewrites of things that already work
- Adding dependencies without discussion

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+ (we use pnpm workspaces)
- A GitHub account (required — GitHub OAuth is our only auth method)
- PostgreSQL (or a Supabase project for the database)

### Setup

```bash
# Clone the repo
git clone https://github.com/Iam-jayant/Yard.git
cd Yard

# Install dependencies (from root — Turborepo handles the rest)
pnpm install

# Copy environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/agent/.env.example apps/agent/.env

# Fill in your .env values (GitHub OAuth keys, DB URL, Supabase keys)

# Generate Prisma client
pnpm db:generate

# Run the dev environment
pnpm dev
```

---

## Project Structure

```
yard/
├── apps/
│   ├── web/          ← Next.js frontend + API routes
│   └── agent/        ← Caretaker cron microservice
├── packages/
│   ├── db/           ← Prisma schema + migrations + client singleton
│   ├── types/        ← Shared TypeScript types + BuildScore formula
│   └── config/       ← Shared ESLint + TypeScript config
├── docs/
│   ├── PHASE-0-CONSTITUTION.md
│   ├── PHASE-1.md
│   └── AGENT.md
```

If you're new to Turborepo: `pnpm dev` from root runs all apps in parallel. `pnpm dev --filter=@yard/web` runs just the frontend.

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready only. No direct pushes. |
| `dev` | Active development. All PRs target this. |
| `feature/<short-name>` | Your working branch |

**Always branch off `dev`, not `main`.**

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-thing
```

---

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/).

```
feat: add plot claim endpoint
fix: resolve health score calculation off-by-one
chore: update prisma schema for district relation
docs: clarify builder cap rule in contributing guide
refactor: extract plot status logic into shared util
```

Keep the subject line under 72 characters. Add a body if the why isn't obvious.

---

## Pull Request Process

1. **Open an issue first** if your change is non-trivial. Discuss before building.
2. **Target `dev`**, not `main`.
3. **Keep PRs focused.** One thing per PR. If you're doing two things, open two PRs.
4. **Write a clear description.** What does this change? Why? How was it tested?
5. **At least one review required** before merge. Owner can bypass only for critical hotfixes — and that's logged.
6. **CI must pass.** Don't merge red.

### PR Title Format
Follow the same convention as commits: `feat: short description` or `fix: short description`.

---

## Database Changes

All schema changes go through Prisma migrations.

```bash
# After editing packages/db/prisma/schema.prisma
pnpm db:migrate
```

Never edit migration files manually after they've been committed.

---

## Questions

Open an issue with the `question` label. Or reach out to Jayant directly if you're a confirmed contributor.

---

*Yard · CONTRIBUTING.md*
