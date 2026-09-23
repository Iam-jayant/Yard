# Yard — Phase 1: Build the City

> **Status:** ACTIVE
> **Version:** 1.0
> **Phase window:** Weeks 3–9 (7 weeks)
> **Prerequisite:** Phase 0 Constitution signed off ✅
> **Rule:** Directory structure is locked on Day 1. No deviation without a doc update.

---

## Goal

Ship a working Yard — a visual 3D city where ideas live as beacons, builders claim and grow buildings, and proof of work drives everything visible on the map.

**Phase 1 ends when:**
- The city renders with real plots, real buildings, real BuildScore
- GitHub webhooks are live and computing scores automatically
- XP is being earned and a basic shop exists
- 50 seeded ideas are live across all districts
- Any new user can land, explore, drop an idea, or claim a plot without friction

---

## Stack — Updated from Phase 0

One change from ADR-0: the city renderer is **Three.js via React Three Fiber**, not SVG. Git City confirms this is the correct and proven approach for this exact use case.

| Layer | Choice | Change from Phase 0 |
|---|---|---|
| City renderer | React Three Fiber + @react-three/drei | ⬆ Updated from SVG |
| 3D engine | Three.js (via R3F) | New |
| Frontend | Next.js 15 App Router + Tailwind | Same |
| Database | PostgreSQL via Supabase | Same |
| ORM | Prisma | Same |
| Auth | NextAuth v5 + GitHub OAuth | Same |
| Real-time | Supabase Realtime (replaces SSE) | ⬆ Updated — Supabase makes this free and easy |
| AI Agent | Node.js cron microservice — no LLM yet | Phase 2 for LLM layer |
| Hosting | Vercel (web) + Railway (agent) + Supabase (DB) | Same |
| Monorepo | Turborepo + pnpm workspaces | Same |

---

## Directory Structure — Locked

```
yard/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── callback/
│   │   │   │       └── route.ts
│   │   │   ├── (city)/
│   │   │   │   ├── page.tsx                    ← City map (main view)
│   │   │   │   ├── plot/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx            ← Individual plot page
│   │   │   │   └── district/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx            ← District view
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   │   └── [...nextauth]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── plots/
│   │   │   │   │   ├── route.ts                ← GET all plots, POST new idea
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts            ← GET, PATCH, DELETE plot
│   │   │   │   │       └── claim/
│   │   │   │   │           └── route.ts        ← POST claim a plot
│   │   │   │   ├── ideas/
│   │   │   │   │   └── route.ts                ← POST new idea (pre-claim)
│   │   │   │   ├── webhooks/
│   │   │   │   │   └── github/
│   │   │   │   │       └── route.ts            ← GitHub webhook receiver
│   │   │   │   └── xp/
│   │   │   │       ├── route.ts                ← GET XP balance
│   │   │   │       └── shop/
│   │   │   │           └── route.ts            ← POST purchase customization
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx                        ← Terminal landing
│   │   ├── components/
│   │   │   ├── city/
│   │   │   │   ├── CityScene.tsx               ← R3F Canvas root + scene setup
│   │   │   │   ├── Building.tsx                ← Voxel building mesh generator
│   │   │   │   ├── Beacon.tsx                  ← Unclaimed plot beacon animation
│   │   │   │   ├── Ruin.tsx                    ← Decayed building mesh
│   │   │   │   ├── District.tsx                ← District zone + ground plane
│   │   │   │   ├── CameraControls.tsx          ← Pan, zoom, rotate controls
│   │   │   │   ├── CityHUD.tsx                 ← Overlay: district labels, stats
│   │   │   │   └── PlotPopup.tsx               ← On-hover plot preview
│   │   │   ├── plot/
│   │   │   │   ├── PlotCard.tsx
│   │   │   │   ├── PlotStatusBadge.tsx
│   │   │   │   ├── ClaimButton.tsx
│   │   │   │   └── BuildScoreBar.tsx
│   │   │   ├── terminal/
│   │   │   │   └── TerminalLoader.tsx          ← Landing boot sequence
│   │   │   ├── xp/
│   │   │   │   ├── XPBar.tsx
│   │   │   │   ├── XPTransaction.tsx
│   │   │   │   └── Shop.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Badge.tsx
│   │   │       └── Tooltip.tsx
│   │   ├── lib/
│   │   │   ├── auth/
│   │   │   │   └── config.ts                   ← NextAuth config + GitHub OAuth
│   │   │   ├── github/
│   │   │   │   ├── api.ts                      ← GitHub REST API calls
│   │   │   │   └── webhooks.ts                 ← Webhook signature verification
│   │   │   ├── score/
│   │   │   │   └── buildscore.ts               ← BuildScore formula (shared logic)
│   │   │   ├── xp/
│   │   │   │   └── engine.ts                   ← XP earn and spend logic
│   │   │   └── utils.ts
│   │   ├── public/
│   │   ├── .env.example
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── agent/
│       ├── src/
│       │   ├── jobs/
│       │   │   ├── score.job.ts                ← Recompute BuildScore every 6h
│       │   │   ├── idle.job.ts                 ← Flag plots idle at 14 days
│       │   │   └── ruin.job.ts                 ← Flag ruins at 30 days post-idle
│       │   ├── scorer/
│       │   │   └── buildscore.ts               ← Identical formula, imported from @yard/types
│       │   ├── notifier/
│       │   │   └── email.ts                    ← Placeholder — Phase 2 activation
│       │   └── index.ts                        ← Cron scheduler entry point
│       ├── .env.example
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── db/
│   │   ├── prisma/
│   │   │   ├── schema.prisma               ← Source of truth for all models
│   │   │   └── migrations/
│   │   ├── index.ts                        ← Export PrismaClient singleton
│   │   └── package.json
│   ├── types/
│   │   ├── index.ts                        ← All shared TypeScript types + enums
│   │   └── package.json
│   └── config/
│       ├── eslint/
│       │   └── index.js
│       ├── typescript/
│       │   └── base.json
│       └── package.json
│
├── docs/
│   ├── PHASE-0-CONSTITUTION.md
│   ├── PHASE-1.md                          ← This file
│   └── AGENT.md                            ← Caretaker spec
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── package.json                            ← pnpm workspace root
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Prisma Schema

```prisma
// packages/db/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────

enum PlotStatus {
  UNCLAIMED   // Idea exists, no builder yet — renders as beacon
  ACTIVE      // Builder claimed, commits flowing
  IDLE        // No activity for 14 days — building dims
  ABANDONED   // No activity 30 days after idle warning
  RUIN        // Formally decayed — open for reclaim
}

enum District {
  AI          // AI / ML / Data
  WEB3        // Crypto / Blockchain / DeFi
  INFRA       // DevOps / Cloud / Tooling
  WEB         // Frontend / Full-stack / Apps
  OPEN        // Everything else
}

enum XPReason {
  FIRST_COMMIT
  MERGED_PR
  WEEKLY_STREAK
  DEPLOY_EVENT
  RELEASE_TAGGED
  ISSUE_CLOSED
  REPO_STARRED
  REPO_FORKED
}

// ─── Models ──────────────────────────────────────────────

model User {
  id            String   @id @default(cuid())
  githubId      String   @unique
  username      String   @unique
  email         String?
  avatarUrl     String?
  xpBalance     Int      @default(0)
  createdAt     DateTime @default(now())

  plots         Plot[]
  ideas         Idea[]
  xpTxns        XPTransaction[]
  customizations BuildingCustomization[]
}

model District {
  id          String   @id @default(cuid())
  slug        District @unique
  label       String
  description String
  gridOriginX Float    // City map X position of district center
  gridOriginZ Float    // City map Z position of district center

  plots       Plot[]
}

model Idea {
  id          String   @id @default(cuid())
  title       String
  description String
  tags        String[]
  giverId     String
  districtId  String
  createdAt   DateTime @default(now())

  giver       User     @relation(fields: [giverId], references: [id])
  district    District @relation(fields: [districtId], references: [id])
  plot        Plot?
}

model Plot {
  id           String      @id @default(cuid())
  ideaId       String      @unique
  builderId    String?
  districtId   String
  status       PlotStatus  @default(UNCLAIMED)
  repoUrl      String?
  repoFullName String?     // owner/repo for GitHub API
  webhookId    Int?        // GitHub webhook ID for cleanup
  claimedAt    DateTime?
  idleAt       DateTime?
  ruinAt       DateTime?
  gridX        Float       // Position in city grid
  gridZ        Float
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  idea         Idea        @relation(fields: [ideaId], references: [id])
  builder      User?       @relation(fields: [builderId], references: [id])
  district     District    @relation(fields: [districtId], references: [id])
  healthScore  HealthScore?
  customization BuildingCustomization?
}

model HealthScore {
  id               String   @id @default(cuid())
  plotId           String   @unique

  // Raw signals
  commitDaysLast30 Int      @default(0)   // Distinct days with commits in last 30
  mergedPRs        Int      @default(0)   // PRs merged in last 30 days
  releases         Int      @default(0)   // Releases tagged in last 30 days
  deploys          Int      @default(0)   // Deploy events in last 30 days
  stars            Int      @default(0)   // Total repo stars
  forks            Int      @default(0)   // Total repo forks
  closedIssues     Int      @default(0)   // Issues closed in last 30 days
  totalIssues      Int      @default(0)   // Total issues opened in last 30 days

  // Computed scores (0–100 each)
  consistencyScore Float    @default(0)
  deliveryScore    Float    @default(0)
  impactScore      Float    @default(0)
  structureScore   Float    @default(0)
  total            Float    @default(0)   // Weighted total — drives building height

  computedAt       DateTime @default(now())

  plot             Plot     @relation(fields: [plotId], references: [id])
}

model XPTransaction {
  id        String    @id @default(cuid())
  userId    String
  amount    Int
  reason    XPReason
  plotId    String?
  createdAt DateTime  @default(now())

  user      User      @relation(fields: [userId], references: [id])
}

model BuildingCustomization {
  id          String   @id @default(cuid())
  plotId      String   @unique
  userId      String
  items       String[] // Array of item slugs: ["neon-sign", "antenna-light"]
  updatedAt   DateTime @updatedAt

  plot        Plot     @relation(fields: [plotId], references: [id])
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## BuildScore Formula

**Never based on raw commit count.** That can be gamed in 10 minutes.

```typescript
// packages/types/index.ts + shared in lib/score/buildscore.ts

export function computeBuildScore(signals: RawSignals): BuildScoreResult {

  // ── Consistency (40%) ───────────────────────────────────────
  // Rewards sustained effort over time, not burst activity
  // activeDays = distinct calendar days with at least 1 commit in last 30 days
  const consistencyScore = (signals.commitDaysLast30 / 30) * 100;

  // ── Delivery (30%) ──────────────────────────────────────────
  // Rewards shipping: merged PRs, releases, deploys
  // Capped at 100 — no infinite scaling
  const rawDelivery = (signals.mergedPRs * 10) +
                      (signals.releases  * 20) +
                      (signals.deploys   * 15);
  const deliveryScore = Math.min(rawDelivery, 100);

  // ── Impact (20%) ────────────────────────────────────────────
  // Rewards external validation — others caring about the work
  // Normalized against district max to avoid absolute numbers dominating
  const rawImpact = (signals.stars * 2) + (signals.forks * 5);
  const impactScore = Math.min((rawImpact / signals.districtMaxImpact) * 100, 100);

  // ── Structure (10%) ─────────────────────────────────────────
  // Rewards organised development: issues opened and closed
  // 0 issues = 0 points (not penalised, just not rewarded)
  const structureScore = signals.totalIssues > 0
    ? (signals.closedIssues / signals.totalIssues) * 100
    : 0;

  const total =
    (consistencyScore * 0.40) +
    (deliveryScore    * 0.30) +
    (impactScore      * 0.20) +
    (structureScore   * 0.10);

  return { consistencyScore, deliveryScore, impactScore, structureScore, total };
}
```

---

## Building Visual States

This is the core city UX. Every state has a distinct visual so a Wanderer understands a plot's story at a glance.

| State | Trigger | Visual |
|---|---|---|
| **Beacon** | Unclaimed idea, no builder | Pulsing glow ring, animated waving flag, warm amber light. Most visually attention-grabbing state on purpose |
| **Foundation** | Claimed, < 7 days, BuildScore 0–10 | Flat platform + scaffolding poles. Active construction crane on top |
| **Rising** | BuildScore 11–30 | 2–4 floor structure. Windows start appearing. Lights on some floors |
| **Growing** | BuildScore 31–55 | Mid-rise 5–9 floors. Lit windows, building has a face |
| **Landmark** | BuildScore 56–79 | High-rise 10–18 floors. Neon accents on facade, visible from across the map |
| **Skyline** | BuildScore 80–100 | Skyscraper. Antenna, full neon, glowing roof. City Center tier |
| **Idle** | No activity 14 days | Lights dim to 20%, building colour desaturates |
| **Ruin** | 30 days post-idle | Cracked walls, broken windows, no lights, no activity indicators |

**Building height formula:**
```
buildingHeight = BASE_HEIGHT + (score.total / 100) * MAX_HEIGHT_FLOORS
// BASE_HEIGHT = 1 floor, MAX_HEIGHT_FLOORS = 24 floors
// Score 0 → 1 floor, Score 100 → 25 floors
```

**Customizations applied on top of base building:**
Neon signs, antenna lights, color facades, rooftop effects — all visible on the built mesh. Never alter the score-driven height. Cosmetic only.

---

## XP System

XP is earned exclusively through verified work signals from GitHub webhooks and cron checks.

### Earning XP

| Activity | XP | Notes |
|---|---|---|
| First commit after claiming | +100 | One-time per plot |
| Merged PR | +50 | Via webhook, per PR |
| Weekly active streak | +25 | ≥ 3 active days in a 7-day window |
| Deploy event | +30 | Via webhook (deployment event) |
| Release tagged | +40 | Via webhook (release published) |
| Issue closed | +10 | Via webhook |
| Repo receives a star | +5 | Via webhook |
| Repo gets forked | +15 | Via webhook |

### Spending XP — Customization Shop

| Item | XP Cost | Visual Effect |
|---|---|---|
| Neon Sign | 200 | Custom text sign on building facade |
| Antenna Light | 150 | Blinking amber light on rooftop |
| Custom Color | 300 | Override building's default color |
| Neon Border | 250 | Glowing edge color around the building |
| Fire Torch | 400 | Flame particle effect on rooftop |
| District Flag | 350 | Custom flag flying above the building |
| Billboard | 600 | Large project name/logo display on facade |

**Rule:** XP is earned, never purchased. Purchasing XP with money is permanently against core rules. This gets called out explicitly in the shop UI.

---

## Terminal Landing Experience

When any user hits `yard.dev`, before anything else loads, they see a terminal boot sequence — no borders, no cards, no navbar. Raw terminal in the center of a dark screen.

```
$ git clone git@yard.dev:world/the-city.git

  Cloning into 'the-city'...
  remote: Enumerating plots: 247 done.
  remote: Counting builders: 83 done.
  remote: Resolving ideas in the desert: 164 done.
  Receiving objects: 100% (247/247) | done.
  Resolving districts: 100% (5/5) done.
  Checking out the skyline... done.

$ cd the-city && yarn start

  ▸ Loading city engine...          DONE
  ▸ Booting 5 districts...          DONE
  ▸ Wiring 83 builders...           DONE
  ▸ Turning on the lights...        DONE

  Welcome to Yard.
  83 builders. 247 plots. 164 ideas waiting in the desert.

  [ EXPLORE THE CITY ]     [ DROP AN IDEA ]
```

- Numbers are dynamic — pulled from DB on render
- Typewriter animation, line by line, ~80ms per character
- After sequence completes, city map fades in underneath
- Font: JetBrains Mono
- Colours: dark background (#0d0d0d), primary text (#e2e2e2), highlighted output in amber (#C9983A)
- No sign-up prompt on landing. You wander first.

---

## GitHub Deep Integration

Phase 1 ships full GitHub webhook integration. This is what makes BuildScore real.

### OAuth Flow
1. User clicks "Sign in with GitHub" 
2. GitHub OAuth → NextAuth callback
3. Store `githubId`, `username`, `accessToken` (encrypted)
4. Access token used for API calls on the user's behalf

### Webhook Setup (on plot claim)
When a Builder claims a plot and provides a repo URL:

1. Extract `owner/repo` from the URL
2. Call `POST /repos/{owner}/{repo}/hooks` with the GitHub API using the Builder's access token
3. Register events: `push`, `pull_request`, `release`, `issues`, `deployment_status`, `star`, `fork`
4. Store `webhookId` on the Plot record
5. Webhook target: `https://yard.dev/api/webhooks/github`

### Webhook Receiver (`/api/webhooks/github`)
```
1. Verify X-Hub-Signature-256 header
2. Parse event type from X-GitHub-Event header
3. Route to correct handler:
   push              → update commitDaysLast30, award XP if applicable
   pull_request      → on merged: update mergedPRs, award +50 XP
   release           → update releases, award +40 XP
   deployment_status → on success: update deploys, award +30 XP
   issues            → on closed: update closedIssues, award +10 XP
   star              → update stars count, award +5 XP to builder
   fork              → update forks count, award +15 XP to builder
4. Trigger BuildScore recompute for the affected plot
5. Broadcast score update via Supabase Realtime
```

### Cleanup (on plot abandonment)
When a plot becomes a Ruin and is reclaimed by a new Builder, delete the old webhook via GitHub API using stored `webhookId`.

---

## Districts & Seeding Plan

**5 districts at launch.** Jayant seeds 10 quality ideas per district before any public access.

| District | Slug | Theme | Seed ideas |
|---|---|---|---|
| AI District | `ai` | AI, ML, data pipelines, LLM tooling | 10 |
| Web3 District | `web3` | Blockchain, DeFi, ZK, privacy, protocols | 10 |
| Infra District | `infra` | DevOps, cloud tooling, CLIs, observability | 10 |
| Web District | `web` | Full-stack apps, frontend, SaaS | 10 |
| Open District | `open` | Everything else. Wildcard zone | 10 |

**Quality bar for seeded ideas:**
- One clear problem statement
- One sentence on why it matters
- Not vague ("a better X") — specific and buildable
- Tagged correctly to the district

**City map layout:**
- Districts occupy distinct zones on the grid
- City Center sits at the geometric center — dynamically populated by top BuildScore plots from any district
- Desert zone on the outer edges — beacon plots visible from the center

---

## Milestones

### M1 — Repo Scaffold (Week 1)
- Turborepo + pnpm workspace setup
- All directories created per structure above
- Prisma schema written and first migration run
- NextAuth with GitHub OAuth working
- Basic Next.js app running

**Done when:** `pnpm dev` runs, you can sign in with GitHub, and the DB has the schema.

---

### M2 — City Renderer (Weeks 2–3)
- R3F Canvas with isometric camera
- District zones rendered as ground planes
- Beacon component (animated glow + flag for unclaimed plots)
- Building component (voxel mesh, height driven by BuildScore)
- Ruin component
- Camera controls (pan, zoom, orbit)
- Plot hover → PlotPopup overlay
- Low-graphics toggle (disable shadows, reduce geometry)

**Done when:** The city loads with seeded plots visible, beacons glowing, and clicking a plot opens its info.

---

### M3 — Core Mechanics (Weeks 3–5)
- Idea submission form → creates Plot in UNCLAIMED state
- Plot claim flow → links repo, sets up GitHub webhook
- Webhook receiver live and logging events
- BuildScore cron computing every 6 hours
- Building height updating in real-time via Supabase Realtime
- Builder cap enforced (max 3 active plots per user)

**Done when:** A Builder can claim a plot, push commits, and watch their building grow.

---

### M4 — XP & Customization (Weeks 5–6)
- XP transactions recording via webhook events
- XP balance visible in user profile
- Customization Shop UI
- Purchased items persisting in BuildingCustomization table
- Customizations rendering on the building mesh in the city

**Done when:** A Builder earns XP, opens the shop, buys an antenna light, and sees it on their building in the city.

---

### M5 — Seed, Polish & Launch Prep (Weeks 6–7)
- Jayant seeds 50 ideas across all districts
- Terminal landing animation
- Idle and Ruin cron jobs live in Agent
- Plot pages (full detail view)
- District pages (overview of a zone)
- Builder profile page
- Low-graphics mode
- CI pipeline (lint + type check + build on every PR)
- Basic error monitoring (Vercel error logs to start)
- .env.example files complete and documented

**Done when:** A stranger lands on yard.dev, understands it in 10 seconds, can browse plots, and can drop or claim without reading any docs.

---

## Caretaker Agent (Phase 1 Version)

The agent runs as a standalone cron service. No LLM in Phase 1 — pure data jobs.

**Jobs:**
```
score.job.ts    → runs every 6 hours
                  for each ACTIVE plot:
                    fetch GitHub signals via API
                    compute BuildScore
                    update HealthScore table
                    broadcast via Supabase Realtime

idle.job.ts     → runs every 24 hours
                  for each ACTIVE plot where last commit > 14 days ago:
                    set status = IDLE
                    record idleAt timestamp
                    (email notification — placeholder, Phase 2)

ruin.job.ts     → runs every 24 hours
                  for each IDLE plot where idleAt > 30 days ago:
                    set status = RUIN
                    record ruinAt timestamp
                    clear builderId (plot open for reclaim)
                    delete GitHub webhook
```

See `docs/AGENT.md` for full Caretaker specification.

---

## Environment Variables

```bash
# apps/web/.env.example

# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# GitHub OAuth App
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# GitHub Webhook
GITHUB_WEBHOOK_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

```bash
# apps/agent/.env.example

DATABASE_URL=postgresql://...
GITHUB_TOKEN=          # PAT for fallback API calls
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## API Routes — Quick Reference

| Method | Route | Description |
|---|---|---|
| GET | `/api/plots` | All plots (paginated, filterable by district/status) |
| POST | `/api/plots` | Submit a new idea → creates UNCLAIMED plot |
| GET | `/api/plots/[id]` | Single plot with full detail |
| PATCH | `/api/plots/[id]` | Update plot (builder only) |
| POST | `/api/plots/[id]/claim` | Claim a plot — links repo, sets up webhook |
| GET | `/api/xp` | Current user's XP balance + transaction history |
| POST | `/api/xp/shop` | Purchase a customization item |
| POST | `/api/webhooks/github` | GitHub webhook receiver (public, signature-verified) |

---

## Phase 1 Exit Criteria

- [ ] City renders with all 5 districts visible
- [ ] 50 seeded ideas live as beacons in the correct districts
- [ ] GitHub OAuth works — login, session, logout
- [ ] Plot claim flow works end to end: claim → webhook registered → commits flow → building grows
- [ ] BuildScore computes and updates building height in the city
- [ ] XP earns on webhook events
- [ ] XP shop works — purchase an item, see it on the building
- [ ] Terminal landing animation ships
- [ ] Agent cron jobs running: idle flagging, ruin flagging, score refresh
- [ ] Low-graphics mode available
- [ ] Any user can land, understand, and act without reading docs
- [ ] CI pipeline green

**Phase 1 closes when every item above is checked.**

---

*Yard · PHASE-1.md · v1.0*
