# Yard

> An open city where developers drop ideas freely, builders claim plots through work, and no good idea goes unbuilt.

---

## What is this?

Yard is a developer platform built around one observation: students and indie developers consistently ask *"what should I build?"* — and separately, idea people consistently ask *"why isn't anyone building this?"*

The answer to both questions is each other.

The platform is a visual city. Every idea is a plot of land. Builders claim plots, link a GitHub repo, and prove ownership through commits. An AI Caretaker monitors activity, surfaces active projects, and keeps dead plots from rotting. Builders earn XP through their work and spend it on customizing how their building looks on the map.

No gatekeepers. No forms to fill. Work is proof.

---

## Status

**Pre-alpha. Phase 0 complete. Phase 1 (MVP build) in progress.**

This project is being built openly. The full roadmap and architecture decisions live in [`docs/PHASE-0-CONSTITUTION.md`](docs/PHASE-0-CONSTITUTION.md).

---

## Core Concepts

| Term | What it means |
|---|---|
| **Plot** | One idea, one project — one unit of land in the city |
| **Builder** | Developer who claimed a plot and is proving it through commits |
| **Idea Giver** | Anyone who drops a raw idea onto an empty plot |
| **Wanderer** | Visitor exploring. No commitment required |
| **Caretaker** | AI agent monitoring plot health and keeping the city alive |
| **Health Score** | Computed signal per plot: commits, PRs, activity. Drives building size |
| **XP** | Earned through work. Spent on building customizations |
| **Ruin** | An abandoned plot. Building decays. Up for reclaim |
| **City Center** | The skyline. Tallest, healthiest, most active projects |
| **Desert** | The fringe. Unclaimed ideas waiting for a Builder |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Backend | Next.js API routes |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | GitHub OAuth |
| AI Agent | Node.js microservice + Claude API |
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
