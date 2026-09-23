# Yard — Caretaker Agent Specification

> **Status:** ACTIVE
> **Version:** 1.0
> **Phase 1:** Cron-based data jobs, no LLM
> **Phase 2:** LLM layer added on top (Hugging Face free models)
> **Owner:** Jayant

---

## What the Caretaker Is

The Caretaker is a background microservice that keeps the city honest and alive. It has no UI. It talks to nobody directly. It reads the database, calls the GitHub API, updates records, and broadcasts changes.

**In Phase 1 it does three things:**
1. Recomputes BuildScore for every active plot every 6 hours
2. Flags plots that have gone quiet as Idle
3. Converts long-dead Idle plots into Ruins

**In Phase 2 it also:**
- Writes plain-English summaries for each plot (what the project does, what stage it's at)
- Suggests relevant unclaimed plots to Builders based on their past work
- Generates District health reports

The Phase 2 LLM layer sits on top of the same job structure. The architecture is designed for it now.

---

## Architecture

```
apps/agent/
├── src/
│   ├── index.ts          ← Entry point. Initialises all cron jobs
│   ├── jobs/
│   │   ├── score.job.ts  ← BuildScore refresh (every 6h)
│   │   ├── idle.job.ts   ← Idle detection (every 24h)
│   │   └── ruin.job.ts   ← Ruin conversion (every 24h)
│   ├── scorer/
│   │   └── buildscore.ts ← BuildScore formula (mirrors packages/types)
│   ├── github/
│   │   └── api.ts        ← GitHub REST API calls for signal collection
│   ├── notifier/
│   │   └── email.ts      ← Stub — activated in Phase 2
│   └── logger/
│       └── index.ts      ← Structured logging for all job runs
```

---

## Job Specifications

---

### `score.job.ts` — BuildScore Refresh

**Schedule:** Every 6 hours (`0 */6 * * *`)

**Purpose:** Pull fresh GitHub signals for every active plot and recompute its BuildScore. Updated score drives building height in the city in real-time via Supabase Realtime.

**Logic:**

```
1. Query all plots where status = ACTIVE or IDLE
2. For each plot:
   a. Fetch GitHub signals via API (see Signal Collection below)
   b. Run computeBuildScore(signals)
   c. Upsert HealthScore record
   d. Broadcast update on Supabase Realtime channel: plots:{plotId}
3. Log: plots processed, errors, duration
```

**Signal Collection per plot:**

```typescript
// From GitHub REST API using stored repoFullName (owner/repo)

const signals = {
  // Commits in last 30 days → extract distinct calendar days
  commitDaysLast30: await getDistinctCommitDays(repo, 30),

  // PRs merged in last 30 days
  mergedPRs: await getMergedPRCount(repo, 30),

  // Releases published in last 30 days
  releases: await getReleaseCount(repo, 30),

  // Deployments succeeded in last 30 days
  deploys: await getDeployCount(repo, 30),

  // Total stars and forks (current snapshot)
  stars: repoData.stargazers_count,
  forks: repoData.forks_count,

  // Issues opened and closed in last 30 days
  closedIssues: await getClosedIssueCount(repo, 30),
  totalIssues:  await getTotalIssueCount(repo, 30),

  // District max impact — for normalization
  districtMaxImpact: await getDistrictMaxImpact(plot.districtId),
}
```

**Rate limit handling:**
- GitHub REST API allows 5,000 requests/hour per authenticated user
- Use the Caretaker's own PAT (not builder tokens) for read-only signal collection
- If rate limit is hit: pause job, log warning, resume after reset window
- Process plots in batches of 50 with 100ms delay between batches

**Error handling:**
- If a single plot fails: log error, skip, continue to next
- If GitHub returns 404 for a repo: flag plot for manual review, do not mark as Ruin automatically
- Never fail the entire job because of one plot

---

### `idle.job.ts` — Idle Detection

**Schedule:** Every 24 hours (`0 2 * * *`) — runs at 2am UTC

**Purpose:** Identify plots that have gone quiet and mark them Idle. Gives the Builder a warning before things get serious.

**Logic:**

```
1. Query all plots where:
   - status = ACTIVE
   - HealthScore.computedAt is current (within last 7h — confirms score job ran)
   - No commit activity in last 14 days
     (commitDaysLast30 has been 0 for the past 14-day window)

2. For each qualifying plot:
   a. Set status = IDLE
   b. Set idleAt = now()
   c. Log: plot ID, builder username, days since last activity
   d. Trigger notifier (Phase 2 — email to builder)
   e. Broadcast: plots:{plotId} status changed to IDLE

3. In the city:
   - Building lights dim to 20% opacity
   - Building colour desaturates
   - Small visual indicator: "Quiet" badge on plot card
```

**Important:** Idle is a warning, not a punishment. The Builder can resume activity at any time and the plot immediately exits Idle status on next score refresh.

**Idle reversal:**
```
score.job.ts checks: if plot.status = IDLE and commitDaysLast30 > 0:
  → set status = ACTIVE
  → clear idleAt
  → broadcast revival
```

---

### `ruin.job.ts` — Ruin Conversion

**Schedule:** Every 24 hours (`0 3 * * *`) — runs at 3am UTC, after idle job

**Purpose:** Convert long-abandoned plots into Ruins. Opens them for reclaim.

**Logic:**

```
1. Query all plots where:
   - status = IDLE
   - idleAt < (now - 30 days)

2. For each qualifying plot:
   a. Set status = RUIN
   b. Set ruinAt = now()
   c. Clear builderId (plot is now ownerless)
   d. Delete GitHub webhook via GitHub API using stored webhookId
   e. Clear repoUrl and repoFullName
   f. Log: plot ID, original builder, total days abandoned
   g. Broadcast: plots:{plotId} status changed to RUIN

3. In the city:
   - Building renders as Ruin component (cracked walls, no lights)
   - "Abandoned" label visible on plot card
   - Plot appears in Desert view again — beacon state restored
   - Original Idea Giver still credited permanently

4. XP consequence:
   - No XP is deducted from the builder
   - Work done is work done — it stays in their history
   - The plot just becomes available again
```

**Ruin reclaim flow:**
A Ruin can be claimed by any Builder exactly like a fresh unclaimed plot. The git history of the previous builder's repo is not connected. The new Builder starts a fresh repo.

---

## BuildScore Formula — Agent Copy

The formula is identical to `packages/types`. Defined once, imported in both `apps/web` and `apps/agent` from the shared package. Never duplicated.

```typescript
// This file imports from @yard/types — do not redefine the formula here
import { computeBuildScore } from '@yard/types'
```

If the formula ever changes, it changes in one place.

---

## Logging

Every job run produces a structured log entry:

```typescript
// apps/agent/src/logger/index.ts

interface JobLog {
  job: 'score' | 'idle' | 'ruin'
  startedAt: Date
  completedAt: Date
  plotsProcessed: number
  plotsChanged: number
  errors: { plotId: string; message: string }[]
  githubRateLimitRemaining: number
}
```

Logs are written to stdout in Phase 1 (Railway captures them). Phase 2 adds a LogEntry table in the DB for the admin dashboard.

---

## Phase 2 — LLM Layer (Planned, Not Built)

When the LLM layer is added in Phase 2, these jobs are added to the same cron structure:

### `summary.job.ts` — Plot Summaries
**Schedule:** Weekly, or on first claim
**Model:** Hugging Face free inference API (Mistral 7B or similar)

**Prompt structure:**
```
You are the Caretaker of Yard, an open city for developers.

A builder has claimed a plot with this idea:
Title: {idea.title}
Description: {idea.description}
District: {plot.district}
Repo: {plot.repoUrl}
Recent activity: {recentCommitMessages} (last 5 commits)
Current BuildScore: {score.total}/100

Write a 2–3 sentence plain-English summary of what this project is
and what stage it appears to be at. Be direct. No marketing language.
Do not use the words "innovative", "revolutionary", or "cutting-edge".
Output only the summary. No preamble.
```

### `suggest.job.ts` — Plot Recommendations
**Schedule:** On user login
**Model:** Hugging Face free inference

**Prompt structure:**
```
You are the Caretaker of Yard.

A developer has signed in with this GitHub profile:
Username: {user.username}
Languages: {topLanguages}
Recent repos: {recentRepoNames}
Past plots built: {pastPlotTitles}

Here are 10 unclaimed ideas currently in the desert:
{ideas as JSON}

Return the 3 idea IDs most relevant to this developer's background.
Output only a JSON array of 3 idea IDs. Nothing else.
```

**Rule for Phase 2:** If the Hugging Face API is down or rate-limited, the job is skipped silently. LLM outputs are always supplementary — never load-bearing. The city works without them.

---

## Caretaker Principles

1. **Never fail the city.** If the agent crashes, the city still loads. Agent outputs are display enhancements, not required for core functionality.
2. **Every action is logged.** No silent operations. All ruin conversions, idle flags, and score changes have a log entry.
3. **Never delete ideas.** The Caretaker opens plots for reclaim — it never removes the original idea or its attribution.
4. **Builders get one warning.** Idle status always comes before Ruin status. There is no instant Ruin.
5. **LLM outputs are labelled.** In Phase 2, any text generated by the LLM is visually distinguished from human-written content.

---

*Yard · AGENT.md · v1.0*
