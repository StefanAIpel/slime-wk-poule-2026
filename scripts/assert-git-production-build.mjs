#!/usr/bin/env node

/**
 * Production builds must come from Vercel's Git integration, never from a local
 * `vercel --prod` tree. Git deploys expose VERCEL_GIT_COMMIT_SHA/REF; local CLI
 * prod deploys do not, which previously put stale agent branches live.
 */
const isVercelProduction = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";
const gitSha = process.env.VERCEL_GIT_COMMIT_SHA;
const gitRef = process.env.VERCEL_GIT_COMMIT_REF;

if (isVercelProduction && (!gitSha || !gitRef)) {
  console.error("Blocked production build: missing VERCEL_GIT_COMMIT_SHA/REF.");
  console.error("Production deploys for SlimeScore must come from Git main, not local Vercel CLI/API deploys.");
  process.exit(1);
}

if (isVercelProduction && gitRef !== "main") {
  console.error(`Blocked production build: VERCEL_GIT_COMMIT_REF=${gitRef}.`);
  console.error("Production deploys for SlimeScore must build from main.");
  process.exit(1);
}
