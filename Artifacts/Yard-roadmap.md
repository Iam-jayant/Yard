# Yard — Product Roadmap

> **Status:** Pre-build ideation
> **Version:** 0.1 — working draft
> **Phases:** 0 → 5

---

*"A city map where every developer can contribute freely — drop an idea, pick one up, build it, prove it. No gatekeepers. Just work and its evidence."*

---

## The Lexicon

> Official vocabulary — Everyone building Yard uses these exact terms. No ambiguity, no synonyms in code or conversation.

| Term | Definition |
|---|---|
| **Plot** | A single unit of land in the city. Every idea and every active project occupies one plot. |
| **Idea Giver** | Anyone who drops a raw problem or concept onto an empty plot. No commitment to build required. |
| **Builder** | A developer who has claimed a plot and started building. Ownership proven through work, not sign-up. |
| **Wanderer** | A visitor exploring the city map. Not committed yet. May become a Builder or Idea Giver. |
| **Caretaker** | An AI agent that monitors plot health, flags inactivity, prunes ruins. Keeps the city from rotting. |
| **Proof** | The verifiable evidence of work: git history, commits, PRs, deploy logs. First come, first built. |
| **Ruin** | A plot that went idle past the abandonment threshold. Reopens for any Builder to claim. |
| **City Center** | The high-traffic spotlight zone. Algorithm-curated: healthiest, most active, most voted projects. |
| **Desert** | The outer zone. Raw, unclaimed ideas waiting for a Builder to pick them up. |
| **Health Score** | A computed signal per plot: recency of commits, PR activity, issue engagement. Drives visibility. |
| **Claim** | The act of linking a repo + making a first commit on an idea. Locks the plot to you. |
| **District** | A grouping of plots by tech domain or theme. AI district, Web3 district, infra district, etc. |

---

## Perspectives

> Every angle, every decision — Six lenses applied to every phase. A decision that looks good from three perspectives but breaks from a fourth is a bad decision.

| Lens | Focus |
|---|---|
| **Product** | What are we building, for whom, and what does success look like? Features, flows, and user jobs. |
| **Technical** | Stack, architecture, data models, integrations, scalability, and engineering decisions. |
| **Community** | How people join, how contributions work, how governance evolves as the city grows. |
| **Design** | Visual language, UX flows, the city metaphor translated to interface — what it feels like to be here. |
| **Business** | Sustainability, monetization timing, who pays and why, what we protect from commercialization. |
| **AI / Agent** | What the Caretakers do, when they trigger, what they decide vs. escalate to humans. |

---

## Roadmap

> Six phases, one city — Phases are sequential, not parallel. Phase N cannot start until Phase N−1 is fully delivered. No rushing.

---

### Phase 0 — The Constitution

**Timeline:** Weeks 1 – 2
**Goal:** *Before a single line of code: decide what Yard is, what it isn't, and what it will never become.*

#### Product
- Write the **one-sentence mission** — not a paragraph, one sentence
- Define all three roles precisely: Idea Giver, Builder, Wanderer
- Decide: who can submit ideas? Students only, or anyone?
- Establish core rules: what's allowed, what isn't, what gets removed
- Name the competitor landscape: GitHub, Devpost, Buildspace — where do we live that they don't?

#### Technical
- Make stack decisions — document reasoning, not just the choice
- Decide: is the map **literally spatial** (canvas/WebGL) or a metaphorical layout?
- Define the conceptual data model: Plot, Builder, Idea, Session, HealthScore
- Establish contribution guidelines before anyone opens a PR
- Decide: monorepo or split repos?

#### Community & Governance
- Legal structure: open-source project, company, or eventual DAO?
- Who has merge rights on day one?
- Draft a code of conduct before any contributors join
- Plan the first contributor invite wave: who, from where, how many?

#### Design
- Visual direction decision: what does Yard feel like aesthetically?
- How literal is the city metaphor in the UI?
- Rough sketch: what does a first-time Wanderer see on arrival?
- Define the emotional tone: raw and builder-y vs. polished and consumer-y

**Deliverables:**
- Vision doc (1–2 pages, shareable with contributors)
- The official Lexicon (this document's vocabulary, finalized)
- Architecture Decision Record 0 (stack choices + reasoning)
- Role definitions doc
- Rough wireframe sketches (paper is fine)
- Code of conduct draft

**Exit Criteria:**
- Any stranger can read the vision doc and explain what Yard is and isn't
- Every core term has one definition everyone agrees on
- Stack is decided — no more bikeshedding after this phase
- At least 3 contributors have confirmed they're in

---

### Phase 1 — Architecture & Design

**Timeline:** Weeks 3 – 5
**Goal:** *Design the full system before building any of it. A developer who skipped Phase 0 should be able to build from Phase 1 docs alone.*

#### Technical
- Full system architecture diagram (services, data flow, boundaries)
- Complete DB schema: all tables, relationships, indexes
- GitHub API integration plan: OAuth scope, webhook events, rate limits
- Auth flow design: GitHub OAuth (natural — repo linking is core)
- Agent architecture: event-driven webhooks vs. cron scheduling
- API contract: endpoints, schemas, error conventions
- Hosting plan: where does each service live?

#### Design
- High-fidelity city map design (the main view)
- Plot detail page: idea + builder info + activity feed
- User profile: your plots, your contributions, your proof
- City center / spotlight design
- Mobile responsive strategy
- Design system: color tokens, typography, core components

#### Product
- Ruthlessly prune the MVP feature list — cut everything that isn't the core loop
- Full user flow for each role (Idea Giver, Builder, Wanderer)
- Define **exactly**: what does "claiming" a plot require?
- Define **exactly**: what makes a plot active vs. idle?

#### AI / Agent
- Design the Health Score formula (weighted inputs, range, decay)
- Agent trigger spec: which events fire which agent actions?
- Notification design: how and when does a Builder get warned?
- Dispute mechanism: can a Builder contest an idle flag?

**Deliverables:**
- System architecture document
- Complete DB schema (reviewable, not just in someone's head)
- API contract document
- Full UI mockups in Figma or equivalent
- Agent spec document
- Health Score formula with worked examples

**Exit Criteria:**
- Any contributor can open the architecture doc and know what to build
- No major technical unknowns remaining — all spiked and resolved
- Designs signed off by at least one non-builder (fresh eyes)
- Todos are tasks, not questions

---

### Phase 2 — The Bare City

**Timeline:** Months 2 – 3
**Goal:** *The core loop, end-to-end. Drop an idea → claim it → show your work. Nothing else.*

#### Product (Core Loop)
1. GitHub OAuth login
2. Idea submission form → creates a Plot in the Desert
3. City map: browsable, filterable by district/tag
4. Plot detail page (idea + status + activity)
5. Claim mechanic: link repo → first commit = plot is yours
6. Activity tracking: last commit, commit count, primary language
7. User profile: your plots, ideas you've dropped
8. Tech stack tagging and basic categorization

#### Technical
- GitHub webhook setup: repo link → activity events → plot update
- Lightweight telemetry pipeline (commit data only at this stage)
- Map rendering: city grid layout, responsive
- Background job queue for webhook processing
- Error handling for disconnected repos / revoked access

> **NOT IN PHASE 2 — DELIBERATELY CUT**
> AI agents · voting · city center algorithm · comments and discussions · monetization · mentorship · co-builder support · notifications · mobile app. These are Phase 3 and beyond. Cut ruthlessly — the loop must work cleanly before anything is added.

**Deliverables:**
- Working web app, deployed (staging environment)
- GitHub OAuth + webhook integration live
- End-to-end: submit → claim → map shows real data
- Basic admin panel for founder visibility

**Exit Criteria:**
- 10 internal test users complete all flows without confusion
- Real git data visible on the map
- Ready to demo to outsiders, no explanation needed
- No critical bugs blocking any flow

---

### Phase 3 — The Agent Layer

**Timeline:** Month 4
**Goal:** *AI Caretakers make the city self-sustaining. Zero human moderators needed. The city keeps itself alive.*

#### AI / Agent
- **Caretaker (required):** monitors repo activity per plot continuously
- Computes Health Score from: commit recency + PR activity + issue engagement
- Flags **Idle** at 14 days no activity → notifies Builder
- Flags **Abandoned** at 45 days → plot reopens to new Builders
- Generates plain-English project summary for each plot page
- Surfaces high-health plots to city center algorithm
- **Mentor (stretch):** reads repo + README, suggests next steps when a Builder is stuck

#### Technical
- Webhook-driven event processing (not just scheduled cron)
- Health Score computation pipeline with versioning
- LLM integration for plot summaries (one call per plot per update)
- Notification system: in-app first, email as fallback
- Builder pause mechanism: "pause" a plot for up to 30 days (life happens)
- Agent decision log: every flag must be traceable

#### Product
- Decide the thresholds — 14 / 45 days, or configurable per district?
- Does Health Score affect map visual? (brighter plot = healthier?)
- Can a Builder dispute an idle flag? What's the process?
- What does a Ruin look like on the map vs. an active plot?

#### Community
- Publish the Caretaker rules publicly — no black-box moderation
- Community appeals process for disputed flags
- Transparency report: how many plots flagged, reclaimed, archived each month

**Deliverables:**
- Caretaker agent live in production
- Health Score visible on each plot
- Idle + abandoned flow working end-to-end
- Plain-English plot summaries generating
- Notification system active

**Exit Criteria:**
- A plot can go idle → abandoned → reclaimed with zero human intervention
- Agents have not produced a false positive that confused a test user
- All agent decisions are logged and auditable

---

### Phase 4 — Open Alpha

**Timeline:** Months 5 – 6
**Goal:** *Real people, real ideas, real builds. Use Yard to build Yard.*

#### Community
- Invite first 50–100 users: hackathon networks, college Discord servers, Twitter
- **Open source the Yard codebase** — meta: contributors build Yard on Yard
- Contributor onboarding guide: how to set up locally, PR conventions
- Community channel (Discord) for builders to find each other
- Weekly async update post: what changed, what's coming

#### Product
- Voting on unclaimed ideas: signal which problems the community cares about
- Comments and discussion threads on plot pages
- City Center goes live: algorithm-curated top active projects
- "Looking for Builder" flag on unclaimed ideas
- "Looking for Contributors" flag on active plots
- Basic analytics for Builders: who viewed your plot, when

#### Data to Track
- What % of ideas get claimed? In what average timeframe?
- What % of claimed plots go idle in first 30 days?
- What brings Wanderers back after their first visit?
- Time from arriving → claiming first plot
- Which districts are most active? Which are deserts?

#### Community Governance
- Public roadmap goes live (this document, evolved)
- Community voting on next features
- First contributor recognized on the platform itself
- Bug bounty: find a real bug, get a Plot badge

**Deliverables:**
- Codebase open-sourced on GitHub
- 50+ active registered users
- Community Discord live and active
- Voting and comments shipped
- City Center algorithm live

**Exit Criteria:**
- 20+ claimed plots with real, tracked activity
- At least 5 projects shipped or meaningfully in-progress
- Community submitting PRs to Yard itself
- Clear picture of what to fix before Beta

---

### Phase 5 — Beta & Sustainability

**Timeline:** Month 7+
**Goal:** *The city pays for itself. Companies want in. Builders get hired. The community grows without needing to be pushed.*

#### Business
- **Sponsored plots** — companies post real unsolved problems, pay for City Center placement
- **Builder hiring board** — "built X on Yard" is verified portfolio proof; companies pay to access the pool
- **City Center boost** — merit-based by default; optional paid boost for companies only, never for individual builders
- Revenue covers infrastructure and salaries before any further growth investment

#### Growth
- **College chapter program** — campus ambassadors at engineering colleges, real presence where students are
- Hackathon integration: Yard as the official team formation and idea sourcing layer
- Case studies: "This product was born on Yard"
- API for external integrations (embed a Yard plot anywhere)

#### Community
- Community governance body: elected Builder council
- Annual "Yard Build" — global hackathon using the platform
- Regional clusters: Indian dev community, SEA, etc.

#### What We Protect
- Sponsored plots must be real, unsolved problems — no fake ideas as ads
- Organic ideas always outnumber sponsored ones in the Desert
- Individual Builder proof-of-work data is never sold
- City Center algorithm weights always stay public

**Deliverables:**
- First paying company on platform
- Builder hiring board live
- College chapter program launched at ≥5 colleges
- First documented "Yard → shipped product" case study

**Exit Criteria:**
- Revenue covers infrastructure costs
- City grows organically — without needing to be pushed
- Community moderates itself — founders not required for daily ops

---

*Yard · Roadmap v0.1 · Working draft · Subject to change*
