import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const adminPage = readFileSync(new URL("../src/app/admin/page.tsx", import.meta.url), "utf8");
const ciWorkflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
const confirmButton = readFileSync(new URL("../src/components/confirm-pending-button.tsx", import.meta.url), "utf8");
const adminGuard = readFileSync(new URL("../src/lib/admin-guard.ts", import.meta.url), "utf8");
const supabaseAdmin = readFileSync(new URL("../src/lib/supabase/admin.ts", import.meta.url), "utf8");
const actions = readFileSync(new URL("../src/app/actions.ts", import.meta.url), "utf8");

test("admin page keeps the server-side admin guard", () => {
  assert.match(adminPage, /isAdminEmail\(user\.email\)/);
  assert.match(adminPage, /redirect\("\/"\)/);
});

test("admin recalculate asks for confirmation before submitting", () => {
  assert.match(adminPage, /<ConfirmPendingButton/);
  assert.match(adminPage, /confirmText="Alle ranglijsten opnieuw doorrekenen/);
  assert.match(confirmButton, /window\.confirm/);
  assert.match(confirmButton, /event\.preventDefault\(\)/);
});

test("admin shows read-only players and pools panels", () => {
  assert.match(adminPage, /Nieuwste spelers \(20\)/);
  assert.match(adminPage, /Nieuwste WK-poules \(20\)/);
  assert.match(adminPage, /membersByPool/);
});

test("admin guard is a single server-only primitive", () => {
  assert.match(adminGuard, /^import "server-only";/);
  assert.match(adminGuard, /isAdminEmail\(user\.email\)/);
  assert.match(adminGuard, /redirect\("\/"\)/);
});

test("service-role client is server-only (never in client bundles)", () => {
  assert.match(supabaseAdmin, /^import "server-only";/);
});

test("admin server actions all pass through requireAdmin", () => {
  for (const action of ["adminSetResult", "createKidAccount", "adminRecalculate"]) {
    const body = actions.split(`export async function ${action}`)[1]?.slice(0, 300) ?? "";
    assert.match(body, /await requireAdmin\(\)/, `${action} mist requireAdmin`);
  }
});

test("CI workflow runs test, lint and build", () => {
  assert.match(ciWorkflow, /npm test/);
  assert.match(ciWorkflow, /npm run lint/);
  assert.match(ciWorkflow, /npm run build/);
});
