// packages/types/index.ts
// All shared TypeScript types + enums + the BuildScore formula
// Single source of truth — imported by @yard/web and @yard/agent

// ─── Re-export Prisma enums for convenience ──────────────

export { PlotStatus, DistrictSlug, XPReason } from "@yard/db";

// ─── BuildScore Types ────────────────────────────────────

export interface RawSignals {
  commitDaysLast30: number; // Distinct calendar days with ≥1 commit in last 30
  mergedPRs: number; // PRs merged in last 30 days
  releases: number; // Releases tagged in last 30 days
  deploys: number; // Deploy events in last 30 days
  stars: number; // Total repo stars (snapshot)
  forks: number; // Total repo forks (snapshot)
  closedIssues: number; // Issues closed in last 30 days
  totalIssues: number; // Total issues opened in last 30 days
  districtMaxImpact: number; // Max impact score in the district (for normalization)
}

export interface BuildScoreResult {
  consistencyScore: number;
  deliveryScore: number;
  impactScore: number;
  structureScore: number;
  total: number;
}

// ─── BuildScore Formula ──────────────────────────────────
// Never based on raw commit count. That can be gamed in 10 minutes.

export function computeBuildScore(signals: RawSignals): BuildScoreResult {
  // ── Consistency (40%) ───────────────────────────────────────
  // Rewards sustained effort over time, not burst activity
  // activeDays = distinct calendar days with at least 1 commit in last 30 days
  const consistencyScore = (signals.commitDaysLast30 / 30) * 100;

  // ── Delivery (30%) ──────────────────────────────────────────
  // Rewards shipping: merged PRs, releases, deploys
  // Capped at 100 — no infinite scaling
  const rawDelivery =
    signals.mergedPRs * 10 + signals.releases * 20 + signals.deploys * 15;
  const deliveryScore = Math.min(rawDelivery, 100);

  // ── Impact (20%) ────────────────────────────────────────────
  // Rewards external validation — others caring about the work
  // Normalized against district max to avoid absolute numbers dominating
  const rawImpact = signals.stars * 2 + signals.forks * 5;
  const impactScore =
    signals.districtMaxImpact > 0
      ? Math.min((rawImpact / signals.districtMaxImpact) * 100, 100)
      : 0;

  // ── Structure (10%) ─────────────────────────────────────────
  // Rewards organised development: issues opened and closed
  // 0 issues = 0 points (not penalised, just not rewarded)
  const structureScore =
    signals.totalIssues > 0
      ? (signals.closedIssues / signals.totalIssues) * 100
      : 0;

  const total =
    consistencyScore * 0.4 +
    deliveryScore * 0.3 +
    impactScore * 0.2 +
    structureScore * 0.1;

  return { consistencyScore, deliveryScore, impactScore, structureScore, total };
}

// ─── XP Constants ────────────────────────────────────────

export const XP_EARN_TABLE = {
  FIRST_COMMIT: 100,
  MERGED_PR: 50,
  WEEKLY_STREAK: 25,
  DEPLOY_EVENT: 30,
  RELEASE_TAGGED: 40,
  ISSUE_CLOSED: 10,
  REPO_STARRED: 5,
  REPO_FORKED: 15,
} as const;

export const XP_SHOP_ITEMS = {
  "neon-sign": { label: "Neon Sign", cost: 200, description: "Custom text sign on building facade" },
  "antenna-light": { label: "Antenna Light", cost: 150, description: "Blinking amber light on rooftop" },
  "custom-color": { label: "Custom Color", cost: 300, description: "Override building's default color" },
  "neon-border": { label: "Neon Border", cost: 250, description: "Glowing edge color around the building" },
  "fire-torch": { label: "Fire Torch", cost: 400, description: "Flame particle effect on rooftop" },
  "district-flag": { label: "District Flag", cost: 350, description: "Custom flag flying above the building" },
  "billboard": { label: "Billboard", cost: 600, description: "Large project name/logo display on facade" },
} as const;

export type ShopItemSlug = keyof typeof XP_SHOP_ITEMS;

// ─── Building Height Constants ───────────────────────────

export const BASE_HEIGHT = 1; // 1 floor minimum
export const MAX_HEIGHT_FLOORS = 24; // Score 100 → 25 floors

export function computeBuildingHeight(scoreTotal: number): number {
  return BASE_HEIGHT + (scoreTotal / 100) * MAX_HEIGHT_FLOORS;
}

// ─── Builder Limits ──────────────────────────────────────

export const MAX_ACTIVE_PLOTS_PER_BUILDER = 3;

// ─── Idle & Ruin Thresholds ──────────────────────────────

export const IDLE_THRESHOLD_DAYS = 14;
export const RUIN_THRESHOLD_DAYS = 30; // Days after idle, not after last activity
