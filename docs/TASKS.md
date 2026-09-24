# Yard — Phase 1 Task Tracker

> Agent: Claude Opus 4.6 via Antigravity IDE
> Track progress by checking boxes as tasks complete.
> Tasks are ordered — do not skip ahead. Dependencies flow top to bottom.

---

## M1 — Repo Scaffold
*Done when: `pnpm dev` runs, GitHub login works, DB schema is live*

- [x] **T01** — Init Turborepo with pnpm workspaces. Create root `package.json`, `turbo.json`, `pnpm-workspace.yaml` as per Phase 1 spec
- [x] **T02** — Scaffold `apps/web` — Next.js 15 App Router, TypeScript, Tailwind CSS
- [x] **T03** — Scaffold `apps/agent` — Node.js + TypeScript, standalone service
- [x] **T04** — Scaffold `packages/db` — Prisma, export PrismaClient singleton
- [x] **T05** — Scaffold `packages/types` — shared TypeScript types + BuildScore formula
- [x] **T06** — Scaffold `packages/config` — shared ESLint config + TypeScript base config
- [x] **T07** — Write full Prisma schema: User, Idea, Plot, HealthScore, XPTransaction, BuildingCustomization, District — exactly as defined in PHASE-1.md
- [x] **T08** — Run first migration, verify all tables exist in Supabase
- [x] **T09** — Set up Supabase Auth with GitHub OAuth provider via `@supabase/ssr`. Create server/client utilities, auth callback route, middleware for session refresh. Store githubId, username, avatarUrl on first sign-in
- [x] **T10** — Set up Supabase client in `apps/web` (anon key for client, service role for server)
- [x] **T11** — Create `.env.example` for `apps/web` and `apps/agent` with all required keys documented
- [x] **T12** — Verify: `pnpm dev` runs all apps, GitHub login creates a User row in DB

---

## M2 — City Renderer
*Done when: City loads with districts, beacons glow, buildings render at correct heights, hover shows plot info*

- [x] **T13** — Install `@react-three/fiber`, `@react-three/drei`, `three` in `apps/web`
- [x] **T14** — Create `CityScene.tsx` — R3F Canvas root. Isometric camera, dark background (#0d0d0d), ambient + directional lighting with warm accent
- [x] **T15** — Create `CameraControls.tsx` — pan, zoom, orbit. Lock vertical angle to isometric range. Mouse drag to pan, scroll to zoom
- [x] **T16** — Create `District.tsx` — flat ground plane per district. Each district at its defined gridOriginX/Z. Label rendered above as HTML overlay
- [x] **T17** — Create `Building.tsx` — voxel box mesh. Height = `1 + (score.total / 100) * 24` floors. Windows as emissive small boxes on facade. Default color: dark green (#1a2e1a). Lit state vs dim state based on plot status
- [x] **T18** — Create `Beacon.tsx` — for UNCLAIMED plots. Pulsing glow ring animation (scale oscillation), animated flag mesh above plot, amber point light (#C9983A). Most visually prominent element on the map
- [x] **T19** — Create `Ruin.tsx` — for RUIN status plots. Irregular broken box geometry, no lights, grey desaturated color, cracked texture via vertex displacement
- [x] **T20** — Create `PlotPopup.tsx` — HTML overlay on plot hover. Shows: idea title, district, status badge, BuildScore, builder username (if claimed). Click navigates to `/plot/[id]`
- [x] **T21** — Create `CityHUD.tsx` — fixed overlay on city canvas. Shows: live builder count, plot count, active district filter buttons
- [x] **T22** — Wire `(city)/page.tsx` — fetch all plots from DB, pass to CityScene, position each on grid by `plot.gridX` / `plot.gridZ`
- [x] **T23** — Add low-graphics toggle in CityHUD — disables shadows, reduces geometry complexity, lowers pixel ratio
- [x] **T24** — Verify: city loads, beacons pulse on unclaimed plots, buildings vary in height, hover popup works, low-graphics mode reduces load

---

## M3 — Core Mechanics
*Done when: A builder can claim a plot, push commits, and watch their building grow*

- [ ] **T25** — Create `POST /api/ideas` — validate input (title, description, districtId, tags), create Idea + Plot in UNCLAIMED status, assign grid position within district
- [ ] **T26** — Create `GET /api/plots` — return all plots with pagination. Filter params: `district`, `status`, `page`. Include HealthScore and builder info
- [ ] **T27** — Create `GET /api/plots/[id]` — single plot with full detail: idea, builder, HealthScore breakdown, customizations
- [ ] **T28** — Create `POST /api/plots/[id]/claim` — auth required. Validate: plot is UNCLAIMED or RUIN, builder has < 3 active plots, repoUrl is valid GitHub URL. Set status = ACTIVE, claimedAt = now
- [ ] **T29** — GitHub webhook registration on claim — after claim succeeds, call `POST /repos/{owner}/{repo}/hooks` with builder's GitHub access token. Register events: push, pull_request, release, deployment_status, issues, watch (stars), fork. Store returned webhookId on Plot
- [ ] **T30** — Create `POST /api/webhooks/github` — verify `X-Hub-Signature-256` header. Parse `X-GitHub-Event`. Route to correct handler. Return 200 immediately before processing (async)
- [ ] **T31** — Webhook handler: `push` — extract distinct commit dates in last 30 days, update `commitDaysLast30` on HealthScore
- [ ] **T32** — Webhook handler: `pull_request` where action = closed and merged = true — increment `mergedPRs`, award +50 XP to builder
- [ ] **T33** — Webhook handler: `release` where action = published — increment `releases`, award +40 XP
- [ ] **T34** — Webhook handler: `deployment_status` where state = success — increment `deploys`, award +30 XP
- [ ] **T35** — Webhook handler: `issues` where action = closed — increment `closedIssues`, award +10 XP
- [ ] **T36** — Webhook handler: `star` (watch event) — update `stars` count from payload, award +5 XP. Webhook handler: `fork` — update `forks` count, award +15 XP
- [ ] **T37** — After every webhook handler: call `computeBuildScore(signals)` from `@yard/types`, upsert HealthScore, broadcast update on Supabase Realtime channel `plots:{plotId}`
- [ ] **T38** — Subscribe to Supabase Realtime in `CityScene.tsx` — on `plots:{plotId}` update, update the building height in the Three.js scene without full re-render
- [ ] **T39** — Enforce builder cap in claim route — if user already has 3 plots where status = ACTIVE or IDLE, return 403 with message "Builder cap reached (3 active plots)"
- [ ] **T40** — Verify: claim a plot → push a commit → webhook fires → HealthScore updates → building grows in city in near real-time

---

## M4 — XP & Customization
*Done when: Builder earns XP, buys an item from shop, sees it rendered on their building*

- [ ] **T41** — Create `lib/xp/engine.ts` — `awardXP(userId, amount, reason, plotId?)` function. Writes XPTransaction row, increments User.xpBalance atomically
- [ ] **T42** — Wire `awardXP` into all webhook handlers (T32–T36 above must call this)
- [ ] **T43** — Create `GET /api/xp` — return current user's xpBalance and last 20 XPTransactions with reason labels
- [ ] **T44** — Create `POST /api/xp/shop` — body: `{ itemSlug, plotId }`. Validate: user owns plot, user has enough XP, item not already owned. Deduct XP, write BuildingCustomization row
- [ ] **T45** — Create `XPBar.tsx` — shows current XP balance and a recent transaction ticker. Mount in app layout for logged-in users
- [ ] **T46** — Create `Shop.tsx` — grid of available customization items with name, XP cost, preview description. Shows "Owned" badge if already purchased. Purchase button calls `/api/xp/shop`
- [ ] **T47** — Render customizations in `Building.tsx` — read BuildingCustomization.items array, conditionally add meshes: antenna (thin cylinder + blinking light), neon border (emissive edge lines), color override (material color), fire torch (particle-lite sprite)
- [ ] **T48** — Verify: earn XP via a merged PR webhook, open shop, purchase antenna light, see it appear on building in city

---

## M5 — Agent + Polish + Launch Ready
*Done when: Terminal landing ships, cron jobs run, any stranger can use the site*

- [ ] **T49** — Create `TerminalLoader.tsx` — typewriter animation, line by line, 80ms per character. Lines as per PHASE-1.md terminal script. Dynamic numbers from DB (builder count, plot count, unclaimed count). After completion, fade city canvas in underneath. Font: JetBrains Mono
- [ ] **T50** — Wire terminal as `app/page.tsx` root landing — no navbar, no border, raw centered terminal on #0d0d0d background. Two CTA buttons appear after animation: `EXPLORE THE CITY` and `DROP AN IDEA`
- [ ] **T51** — Create `app/(city)/plot/[id]/page.tsx` — full plot detail: idea title + description, district badge, status, BuildScore breakdown (4 pillars as bar chart), builder info, repo link, customizations applied, Idea Giver credit
- [ ] **T52** — Create `app/(city)/district/[slug]/page.tsx` — district overview: all plots in this district, filter by status, sorted by BuildScore desc. District description and stats (total plots, active builders)
- [ ] **T53** — Create builder profile page `app/profile/[username]/page.tsx` — GitHub avatar, username, XP balance, all active plots, plot history
- [ ] **T54** — Create idea submission UI — modal or dedicated page. Fields: title, description, district selector, tags. Calls `POST /api/ideas`. On success, redirect to new plot's beacon in the city
- [ ] **T55** — Create plot claim UI — from plot detail page, "Claim this Plot" button (auth-gated). Input: GitHub repo URL. Validates format before submitting. Calls `POST /api/plots/[id]/claim`
- [ ] **T56** — Set up cron scheduler in `apps/agent/src/index.ts` using `node-cron`
- [ ] **T57** — Implement `score.job.ts` — every 6h, fetch GitHub signals for all ACTIVE + IDLE plots via GitHub REST API, compute BuildScore, upsert HealthScore, broadcast via Supabase Realtime
- [ ] **T58** — Implement `idle.job.ts` — every 24h at 02:00 UTC, find ACTIVE plots with `commitDaysLast30 = 0` for 14+ days, set status = IDLE, set idleAt
- [ ] **T59** — Implement `ruin.job.ts` — every 24h at 03:00 UTC, find IDLE plots where `idleAt < now - 30 days`, set status = RUIN, clear builderId, delete GitHub webhook via API
- [ ] **T60** — Implement structured logger in `apps/agent/src/logger/index.ts` — log job name, start time, end time, plots processed, plots changed, errors array
- [ ] **T61** — Seed 50 ideas across all 5 districts (10 each) — **Jayant does this manually via the UI or a seed script**
- [ ] **T62** — Final check: CI pipeline green, all .env.example files complete, low-graphics mode works, mobile viewport renders city legibly

---

## Progress

| Milestone | Tasks | Done |
|---|---|---|
| M1 — Scaffold | T01–T12 | 12/12 ✅ |
| M2 — City Renderer | T13–T24 | 12/12 ✅ |
| M3 — Core Mechanics | T25–T40 | 0/16 |
| M4 — XP & Shop | T41–T48 | 0/8 |
| M5 — Polish & Launch | T49–T62 | 0/14 |
| **Total** | | **24/62** |

---

*Yard · TASKS.md · Phase 1 · v1.0*
