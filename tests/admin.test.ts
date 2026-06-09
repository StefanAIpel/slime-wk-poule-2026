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
  for (const action of ["adminSetResult", "createKidAccount", "adminRecalculate"]) {
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

test("pool member counts come from a server-side aggregate, not a full-table fetch", () => {
  assert.match(adminData, /pool_members\(count\)/);
  assert.doesNotMatch(adminData, /from\("pool_members"\)\.select\("pool_id"\)/);
});

test("CI workflow runs test, lint and build", () => {
  assert.match(ciWorkflow, /npm test/);
  assert.match(ciWorkflow, /npm run lint/);
  assert.match(ciWorkflow, /npm run build/);
});
