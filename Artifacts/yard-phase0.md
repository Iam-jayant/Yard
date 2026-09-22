# Yard — Phase 0: The Constitution

> **Status:** FINAL — Signed off by Jayant
> **Version:** 1.0
> **Phase window:** Weeks 1–2
> **Owner:** Jayant
> **Rule:** No code is written until this document exits. Every decision here is final for Phase 1.

---

## Mission

> *An open city where developers drop ideas freely, builders claim plots through work, and no good idea goes unbuilt.*

---

## What Yard Is NOT

Hard boundaries. If a feature pulls toward any of these, it gets cut.

| What it is not | Why this matters |
|---|---|
| Not a social network | Engagement metrics and followers corrupt the proof-of-work core |
| Not a GitHub alternative | We don't host code. We link to it. GitHub is infrastructure, not competition |
| Not a job board | Hiring is an outcome, never the primary surface |
| Not a hackathon platform | We are not time-boxed. The city lives permanently |
| Not a course or learning platform | We don't teach. We give builders a place to prove themselves |
| Not a VC pitch deck platform | No decks, no investor-facing language, no startup theater |
| Not ProductHunt | We surface what's being built, not what just launched |

---

## The Official Lexicon

Every contributor, every line of code, every doc uses these exact terms. No synonyms.

| Term | Definition |
|---|---|
| **Plot** | A single unit of land in the city. Every idea and every active project occupies exactly one plot. |
| **Building** | The visual representation of a plot on the city map. Size and appearance reflect the project's health and customizations. |
| **Idea Giver** | Anyone who drops a raw problem or concept onto an empty plot. No commitment to build required. |
| **Builder** | A developer who has claimed a plot and started building. Ownership proven through work, not sign-up. |
| **Wanderer** | A visitor exploring the city map. Not committed yet. May become either a Builder or Idea Giver. |
| **Caretaker** | An AI agent that monitors plot health, flags inactivity, and flags ruins. Keeps the city from decaying. |
| **Proof** | The verifiable evidence of work: git history, commits, PRs, deploy logs. First to build, first to own. |
| **Ruin** | A plot that went idle past the abandonment threshold. Building visually decays. Reopens for any Builder to claim. |
| **City Center** | The high-traffic spotlight zone. Algorithm-curated: tallest, healthiest, most active buildings live here. |
| **Desert** | The outer zone. Empty lots and unbuilt ideas sitting and waiting for a Builder. |
| **Health Score** | A computed signal per plot: recency of commits, PR activity, issue engagement. Drives building size and visibility. |
| **Claim** | The act of linking a repo and making a first commit on an idea. Locks the plot to that Builder. |
| **District** | A grouping of plots by tech domain. AI district, Web3 district, Infra district, etc. |
| **Idle** | Plot status when no git activity for 14 days. Builder notified. Building starts to dim. |
| **Abandoned** | Plot status when no activity for 30 days after an Idle warning. Caretaker flags it as a Ruin. |
| **XP** | Experience points earned through verified work activity (commits, PRs, merges, reviews). Spent on building customizations. |
| **Customization** | Visual upgrades a Builder buys with XP to decorate their building: antenna lights, neon signs, colorful facades, and more. |

---

## Role Definitions

### Idea Giver
- Anyone can be an Idea Giver — student, professional, company, or anonymous
- Dropping an idea is a public act. Once submitted, the idea is released to the community
- An Idea Giver has no claim over who builds their idea or how
- An Idea Giver is credited permanently on the plot as the originator, regardless of who builds it

### Builder
- A Builder is any developer who claims an unclaimed plot
- Claiming requires: GitHub account linked + repo created + first commit pushed within 48 hours of claiming
- A Builder may hold up to **3 active plots** simultaneously — prevents hoarding
- Ownership is proven by work, not by words. A Builder with no commits is not a Builder
- If a Builder goes Idle, they receive one warning. If they go Abandoned, the plot becomes a Ruin and the building visually decays

### Wanderer
- The default state of every new user
- Can browse, vote, and comment without committing to anything
- Becomes an Idea Giver the moment they drop an idea
- Becomes a Builder the moment they claim a plot
- No pressure to do either. Wandering is valid and welcomed

### Caretaker (AI Agent)
- Not a user. A background process
- Monitors all plots for Health Score changes
- Fires warnings at Idle threshold (14 days no activity)
- Flags Ruins at Abandoned threshold (30 days post-warning)
- Writes plain-English plot summaries for Wanderers browsing the Desert
- Makes no decisions that cannot be contested by the Builder. Every action is logged and visible

---

## Core Platform Rules

Immutable laws. Cannot be overridden by features, community votes, or sponsors.

1. **Work is proof.** No plot is owned without commits. Verbal claims mean nothing.
2. **Ideas are public domain.** Once dropped, an idea belongs to whoever builds it best.
3. **Builders cap at 3 active plots.** Anti-hoarding. No exceptions.
4. **Caretaker decisions are always auditable.** Every flag, every action has a visible log.
5. **City Center is algorithm-only for builders.** Sponsors may exist — but they get a clearly-labeled separate lane, never mixed with organic results.
6. **Builder proof-of-work data is never sold.** A Builder's git history and activity on this platform is theirs.
7. **No idea is permanently removed.** Rejected or flagged ideas are archived, not deleted. Transparency over cleanup.
8. **XP is earned, never purchased.** Customizations are a reward for work, not a pay-to-win mechanic.

---

## Competitor Positioning

| Platform | What they do | What they miss |
|---|---|---|
| **GitHub** | Hosts code, manages repos | Discovery of ideas. No "what to build" layer |
| **Devpost** | Hackathon submissions | Time-boxed, competitive, no ongoing builds |
| **Buildspace** | Guided build programs | Curated, not open. You build what they design |
| **ProductHunt** | Launches finished products | Post-build only. Nothing about the in-progress journey |
| **Peerlist** | Developer profiles | Portfolio display, not active contribution |

**Yard's gap:** The space between *"I have an idea but can't build it"* and *"I want to build but don't know what."* Nobody lives there. We do.

---

## Open Questions — Resolved in Phase 0

### Q03 — IP & Ownership Statement

**Decision:** Yard is a neutral attribution layer. Not an IP holder.

- Idea Givers release ideas publicly the moment they are submitted. The act of submission is irrevocable public release (CC0 in spirit — no rights reserved on the idea itself).
- Builders own whatever they build. The code they write belongs to them under whatever license they choose for their repo.
- Yard owns no code, no ideas, and takes no cut of anything built here.
- This will be stated plainly in the Terms of Use and on the plot submission screen.
- Edge case: if a Builder ships a commercial product from a Yard idea, credit to the Idea Giver is permanently visible on the plot page — moral credit, not legal obligation.

### Q05 — Student-Only or Open?

**Decision:** Open to all developers. Student-first in culture and marketing, not in access.

- Enforcing student verification adds friction and excludes self-taught and bootcamp developers who are exactly the same demographic
- Community tone stays student-friendly through curation, language, and idea surfacing — not through an ID gate
- Experienced developers contributing to student ideas is a feature, not a contamination
- Revisit at Phase 4 if community tone drifts

---

## Architecture Decision Record 0 (ADR-0)

### Stack

Every decision below is final after Phase 0 exits.

| Layer | Choice | Reason |
|---|---|---|
| Frontend framework | Next.js (App Router) | SSR for plot pages, file-based routing is contributor-friendly |
| Styling | Tailwind CSS | Low config, consistent, no CSS debates |
| Backend | Next.js API routes | One language, reduces contributor friction |
| Database | PostgreSQL | Relational model fits plots/builders/ideas cleanly |
| ORM | Prisma | Schema file is living documentation |
| Auth | GitHub OAuth only | Required anyway for repo linking. No username/password to manage |
| Real-time | Server-Sent Events (SSE) | Simpler than WebSockets for one-directional activity feeds |
| AI / Agent | Separate Node.js microservice | Isolated so a failing agent never brings down the main app |
| LLM | Claude API (Haiku for health checks, Sonnet for summaries) | Cost-effective at low volume |
| Frontend hosting | Vercel | Free tier, DX, no DevOps overhead |
| Database hosting | Supabase | Managed PostgreSQL, generous free tier |
| Agent hosting | Railway | Lightweight service hosting |
| Monorepo tooling | Turborepo | Shared types and config across apps |

### Monorepo Structure

```
/apps
  /web          ← Next.js frontend + API routes
  /agent        ← Caretaker microservice
/packages
  /db           ← Prisma schema + migrations
  /types        ← Shared TypeScript types
  /config       ← Shared ESLint, TS config
```

### Map Decision — Visual City (Updated)

**Decision: A real visual 2D city map rendered in the browser.**

**What the city looks like:**
- The city is rendered as an actual city map — not a card grid, not a list feed
- Each plot is a **building** on the map. Buildings vary in height, width, and footprint based on project activity and Health Score
- Active, high-Health plots are tall prominent buildings — visible from anywhere on the map
- New or low-activity plots are small structures — present but humble
- Abandoned plots visually decay into ruins — broken walls, dark windows
- Empty lots (unclaimed ideas) sit as bare desert plots waiting for a Builder
- City Center occupies the visual center — the tallest skyline
- Districts are distinct zones on the map — separated by roads and visual language
- Desert is the outer fringe — sparse, open, raw

**Builder customizations (XP system):**
- Builders earn XP through verified work: commits, merged PRs, reviews, deploy activity
- XP is spent in a Customization Shop on visual upgrades for their building
- Examples: antenna lights, neon signs, colorful light rigs, rooftop decorations, facade colors
- This makes the city feel alive and personal — no two buildings look the same
- XP is strictly earned, never purchased. Pay-to-win is against core rules.

**Rendering approach:**
- SVG or Canvas — decision deferred to Phase 1 based on contributor bandwidth
- SVG: simpler, accessible, easier for contributors to work with
- Canvas: better performance at high plot counts
- Both are viable. Phase 1 spikes both and picks based on performance benchmarks at 500+ plots

**Color palette and visual design:**
- Final palette deferred to Phase 1. Direction: dark environment, warm accent lighting, city-at-night feel
- No decision locked in Phase 0 — this gets its own design spike in Phase 1

---

## Conceptual Data Model

Full schema is Phase 1 work. This is the entity layer.

```
User
  └── has many Plots (as Builder)
  └── has many Ideas (as Idea Giver)
  └── has XP balance and XP transaction history

Idea
  └── belongs to one User (Idea Giver)
  └── has one Plot (once claimed)
  └── belongs to one District
  └── has Tags[]

Plot
  └── has one Idea
  └── has one Builder (User)
  └── has one HealthScore
  └── has PlotStatus: [ unclaimed | active | idle | abandoned | ruin ]
  └── has one repoUrl
  └── belongs to one District
  └── has BuildingConfig (customizations applied)

HealthScore
  └── belongs to one Plot
  └── fields: commitScore, prScore, issueScore, deployScore, total, computedAt
  └── total drives building size on the map

District
  └── has many Plots
  └── has a theme / domain tag

XPTransaction
  └── belongs to one User
  └── fields: amount, reason (commit | pr_merged | review | deploy), timestamp

BuildingConfig
  └── belongs to one Plot
  └── fields: customizations[] (list of applied items), purchasedAt[]
```

---

## Community & Governance

### Legal Structure
MIT License on the codebase. No company incorporated at Phase 0.

### Merge Rights (Day One)
- **Jayant** — owner, final merge authority
- **Up to 2 trusted contributors** — granted merge rights after first meaningful PR
- No direct pushes to `main`. Every change goes through a PR with at least one review.

### Branch Strategy
- `main` — production-ready only
- `dev` — integration branch, all PRs target this
- `feature/<name>` — contributor branches

### Contributor Scale
Starting with 1–2 contributors. No big announcements. No hype. Build first, grow organically.

---

## Phase 0 Deliverables

| Deliverable | Status |
|---|---|
| One-sentence mission | ✅ |
| Official Lexicon | ✅ |
| Role definitions | ✅ |
| Core platform rules | ✅ |
| Competitor positioning | ✅ |
| IP & ownership statement (Q03) | ✅ |
| Student-only vs open decision (Q05) | ✅ |
| ADR-0: Stack decisions | ✅ |
| ADR-0: Map decision — visual city + XP system | ✅ |
| ADR-0: Monorepo structure | ✅ |
| Conceptual data model | ✅ |
| Community governance structure | ✅ |
| README.md | ✅ |
| CONTRIBUTING.md | ✅ |
| CODE_OF_CONDUCT.md | ✅ |
| Jayant sign-off | ✅ Signed off |

---

## Phase 0 Exit Criteria — All Met

- [x] Any stranger can read this document and explain what Yard is and isn't
- [x] Every core term has exactly one definition
- [x] Stack is decided and locked
- [x] Map decision is locked — visual 2D city, SVG/Canvas decision deferred to Phase 1
- [x] XP and customization system is defined at concept level
- [x] IP statement is clear
- [x] Code of conduct exists
- [x] Contributing guide exists
- [x] Jayant has reviewed and signed off

**Phase 0 is CLOSED. Phase 1 begins.**

---

*Yard · Phase 0 Constitution · v1.0 · Final*
