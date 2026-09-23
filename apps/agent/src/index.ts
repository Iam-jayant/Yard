// apps/agent/src/index.ts
// Caretaker Agent — Entry Point
// Initialises all cron jobs. No LLM in Phase 1 — pure data jobs.
//
// Full spec: docs/AGENT.md

import cron from "node-cron";

// ─── Job Imports ─────────────────────────────────────────
// Uncomment as jobs are implemented:
// import { runScoreJob } from "./jobs/score.job";
// import { runIdleJob } from "./jobs/idle.job";
// import { runRuinJob } from "./jobs/ruin.job";

console.info("─────────────────────────────────────────");
console.info("  Yard Caretaker Agent v0.1.0");
console.info("  Phase 1 — Cron-based data jobs");
console.info("─────────────────────────────────────────");

// ─── Score Refresh — Every 6 hours ───────────────────────
// Recomputes BuildScore for every ACTIVE and IDLE plot
cron.schedule("0 */6 * * *", async () => {
  console.info(`[score.job] Starting at ${new Date().toISOString()}`);
  // await runScoreJob();
  console.info(`[score.job] Complete`);
});

// ─── Idle Detection — Daily at 2am UTC ───────────────────
// Flags plots with no activity for 14 days as IDLE
cron.schedule("0 2 * * *", async () => {
  console.info(`[idle.job] Starting at ${new Date().toISOString()}`);
  // await runIdleJob();
  console.info(`[idle.job] Complete`);
});

// ─── Ruin Conversion — Daily at 3am UTC ──────────────────
// Converts plots idle for 30+ days into RUIN status
cron.schedule("0 3 * * *", async () => {
  console.info(`[ruin.job] Starting at ${new Date().toISOString()}`);
  // await runRuinJob();
  console.info(`[ruin.job] Complete`);
});

console.info("All cron jobs registered. Caretaker is watching.");
