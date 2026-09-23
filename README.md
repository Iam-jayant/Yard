# Yard

> An open city where developers drop ideas freely, builders claim plots through work, and no good idea goes unbuilt.

---

## What is this?

Yard is a developer platform built around one observation: students and indie developers consistently ask *"what should I build?"* — and separately, idea people consistently ask *"why isn't anyone building this?"*

The answer to both questions is each other.

The platform is a visual 3D city. Every idea is a plot of land. Builders claim plots, link a GitHub repo, and prove ownership through commits. An AI Caretaker monitors activity, surfaces active projects, and keeps dead plots from rotting. Builders earn XP through their work and spend it on customizing how their building looks on the map.

No gatekeepers. No forms to fill. Work is proof.

---

## Status

**Pre-alpha. Phase 0 complete. Phase 1 (Build the City) in progress.**

This project is being built openly. Read the full specs:
- [`docs/PHASE-0-CONSTITUTION.md`](docs/PHASE-0-CONSTITUTION.md) — The constitution. What Yard is and isn't.
- [`docs/PHASE-1.md`](docs/PHASE-1.md) — Full build spec: stack, schema, formulas, milestones.
- [`docs/AGENT.md`](docs/AGENT.md) — Caretaker agent specification.

---

## Core Concepts

| Term | What it means |
|---|---|
| **Plot** | One idea, one project — one unit of land in the city |
| **Builder** | Developer who claimed a plot and is proving it through commits |
| **Idea Giver** | Anyone who drops a raw idea onto an empty plot |
| **Wanderer** | Visitor exploring. No commitment required |
| **Caretaker** | AI agent monitoring plot health and keeping the city alive |
| **BuildScore** | Computed signal per plot: consistency, delivery, impact, structure. Drives building height |
| **XP** | Earned through verified work. Spent on building customizations |
| **Ruin** | An abandoned plot. Building decays. Up for reclaim |
| **City Center** | The skyline. Tallest, healthiest, most active projects |
| **Desert** | The fringe. Unclaimed ideas waiting for a Builder |

---

## Tech Stack

| Layer | Choice |
|---|---|
| City renderer | React Three Fiber + @react-three/drei |
| 3D engine | Three.js (via R3F) |
| Frontend | Next.js 15 App Router + Tailwind CSS |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | NextAuth v5 + GitHub OAuth |
| Real-time | Supabase Realtime |
| AI Agent | Node.js cron microservice (Phase 2 for LLM layer) |
| Hosting | Vercel (web) · Railway (agent) · Supabase (DB) |
| Monorepo | Turborepo + pnpm workspaces |

---

## Getting Involved

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before anything else.

We're intentionally small at this stage — 1 to 2 contributors. If you want in, reach out directly.

---

## License

MIT — see [`LICENSE`](LICENSE).

---

*Built on the same principles it runs on.*
