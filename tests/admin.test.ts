import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const adminPage = readFileSync(new URL("../src/app/admin/page.tsx", import.meta.url), "utf8");
const ciWorkflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
const pendingButton = readFileSync(new URL("../src/components/pending-button.tsx", import.meta.url), "utf8");
const adminGuard = readFileSync(new URL("../src/lib/admin-guard.ts", import.meta.url), "utf8");
const adminData = readFileSync(new URL("../src/lib/admin-data.ts", import.meta.url), "utf8");
const supabaseAdmin = readFileSync(new URL("../src/lib/supabase/admin.ts", import.meta.url), "utf8");
const adminEmails = readFileSync(new URL("../src/lib/admin.ts", import.meta.url), "utf8");
const actions = readFileSync(new URL("../src/app/actions.ts", import.meta.url), "utf8");

function actionBody(name: string) {
  const body = actions.split(`export async function ${name}`)[1];
  assert.ok(body, `action ${name} bestaat niet meer — test bijwerken`);
  return body.split("export async function")[0];
}

test("admin page uses the shared server-side guard (no inline duplicate)", () => {
  assert.match(adminPage, /getAdminUser\(\)/);
  assert.doesNotMatch(adminPage, /isAdminEmail\(/);
});

test("admin guard family is server-only (never in client bundles)", () => {
  for (const [name, source] of [["admin-guard", adminGuard], ["admin-data", adminData], ["supabase/admin", supabaseAdmin], ["admin", adminEmails]] as const) {
    assert.match(source, /^import "server-only";/, `${name} mist server-only`);
  }
});

test("admin data layer enforces the guard itself (defense in depth)", () => {
  assert.match(adminData, /await requireAdmin\(\);/);
});

test("admin server actions all pass through requireAdmin", () => {
  for (const action of ["adminSetResult", "createKidAccount", "adminRecalculate", "adminSetSiteMessage"]) {
    assert.match(actionBody(action), /await requireAdmin\(\)/, `${action} mist requireAdmin`);
  }
});

test("admin recalculate asks for confirmation before submitting", () => {
  assert.match(adminPage, /adminRecalculate\}>\s*<PendingButton[\s\S]*?confirmText=/);
  assert.match(pendingButton, /window\.confirm/);
  assert.match(pendingButton, /event\.preventDefault\(\)/);
});

test("admin shows read-only players and pools panels", () => {
  assert.match(adminPage, /Nieuwste spelers \(20\)/);
  assert.match(adminPage, /Nieuwste WK-poules \(20\)/);
  assert.match(adminPage, /memberCount/);
});

test("admin dashboard exposes read-only operational + anomaly counts (no writes)", () => {
  // Operationele tellingen via head-counts (geen full fetch).
  assert.match(adminData, /from\("bracket_predictions"\)\.select\("user_id", \{ count: "exact", head: true \}\)/);
  assert.match(adminData, /from\("special_predictions"\)\.select\("user_id", \{ count: "exact", head: true \}\)/);
  // Anomalie-tellingen.
  assert.match(adminData, /profilesWithoutScore/);
  assert.match(adminData, /or\("nickname\.is\.null,team_name\.is\.null"\)/);
  assert.match(adminData, /eq\("status", "finished"\)\.or\("home_score\.is\.null,away_score\.is\.null"\)/);
  // Read-only paneel, geen mutatieknop in de datacontrole.
  assert.match(adminPage, /Datacontrole \(alleen-lezen\)/);
});

test("pool member counts come from a server-side aggregate, not a full-table fetch", () => {
  assert.match(adminData, /pool_members\(count\)/);
  assert.doesNotMatch(adminData, /from\("pool_members"\)\.select\("pool_id"\)/);
});

test("CI workflow runs test, lint and build", () => {
  assert.match(ciWorkflow, /npm test/);
  assert.match(ciWorkflow, /npm run lint/);
  assert.match(ciWorkflow, /npm run build/);
});

test("health endpoint is secret-guarded and exposes only counts (no PII)", () => {
  const health = readFileSync(new URL("../src/app/api/health/route.ts", import.meta.url), "utf8");
  assert.match(health, /RESULT_SYNC_SECRET/);
  assert.match(health, /status: 401/);
  // Alleen head-counts; nooit hele rijen/kid-codes teruggeven.
  assert.doesNotMatch(health, /kid_accounts/);
  assert.doesNotMatch(health, /\.select\("code/);
  // Build-herkomst: CLI-deploys (buiten git) zijn herkenbaar aan sha null.
  assert.match(health, /VERCEL_GIT_COMMIT_SHA/);
});

test("admin mutations are rate-limited (defense in depth)", () => {
  for (const key of ["admin_setresult", "admin_kid", "admin_recalc", "admin_sitemsg"]) {
    assert.match(actions, new RegExp(`rateLimit\\(admin, \`${key}:`));
  }
});

test("admin site messages: editor per page, audit log and banner wiring", () => {
  const homePage = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const predictionsPage = readFileSync(new URL("../src/app/voorspellingen/page.tsx", import.meta.url), "utf8");
  const body = actionBody("adminSetSiteMessage");

  // Alleen bekende plekken; alles geauditeerd en via upsert (één rij per plek).
  assert.match(body, /placement !== "home" && placement !== "voorspellingen"/);
  assert.match(body, /action: "set_site_message"/);
  assert.match(body, /from\("site_messages"\)\.upsert\(/);

  assert.match(adminPage, /action=\{adminSetSiteMessage\}/);
  assert.match(adminPage, /type="datetime-local" name="show_from"/);
  assert.match(homePage, /<SiteMessageBanner body=\{siteMessage\} \/>/);
  assert.match(predictionsPage, /<SiteMessageBanner body=\{siteMessage\} \/>/);
});

test("site messages also cover the live subsite", () => {
  const livePage = readFileSync(new URL("../src/app/live/page.tsx", import.meta.url), "utf8");
  assert.match(actionBody("adminSetSiteMessage"), /placement !== "live"/);
  assert.match(adminPage, /placement: "live" as const/);
  assert.match(livePage, /fetchSiteMessage\(supabase, "live"\)/);
  assert.match(livePage, /<SiteMessageBanner body=\{siteMessage\} \/>/);
});

test("admin shows per-user completion from the server-side aggregate view (no full fetch)", () => {
  // Aggregatie-view i.p.v. duizenden voorspellingsrijen (PostgREST max-rows-cap).
  assert.match(adminData, /from\("prediction_completion"\)/);
  assert.doesNotMatch(adminData, /from\("predictions"\)\.select\("[^"]*match_id/);
  assert.match(adminData, /predictionCompletion\(\{/);
  assert.match(adminPage, /Invulvoortgang per speler/);
  assert.match(adminPage, /completionRows\.map/);
});

test("admin can configure a live poll; live page shows it in a 60/40 right column", async () => {
  const livePage = readFileSync(new URL("../src/app/live/page.tsx", import.meta.url), "utf8");
  const globalsCss = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const route = readFileSync(new URL("../src/app/api/live-poll/route.ts", import.meta.url), "utf8");
  // Admin-actie achter requireAdmin + rate limit + auditlog.
  assert.match(actionBody("adminSetLivePoll"), /await requireAdmin\(\)/);
  assert.match(actions, /rateLimit\(admin, `admin_poll:/);
  assert.match(actionBody("adminSetLivePoll"), /action: "set_live_poll"/);
  assert.match(adminPage, /action=\{adminSetLivePoll\}/);
  // Stemmen: 1 per apparaat (cookie), upsert via service-role.
  assert.match(route, /ss_poll_voter/);
  assert.match(route, /from\("live_poll_votes"\)\.upsert\(/);
  // Live-pagina: 60/40 met de poll in de rechterkolom.
  assert.match(livePage, /<LivePoll locale=\{locale\} \/>/);
  assert.match(livePage, /live-col-main/);
  assert.match(livePage, /live-col-side/);
  assert.match(globalsCss, /grid-template-columns: 1\.5fr 1fr;/);
  assert.match(globalsCss, /\.live-col-side \.live-row-code \{\n    display: inline;/);
});
