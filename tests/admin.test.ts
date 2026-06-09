import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const adminPage = readFileSync(new URL("../src/app/admin/page.tsx", import.meta.url), "utf8");
const ciWorkflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
const confirmButton = readFileSync(new URL("../src/components/confirm-pending-button.tsx", import.meta.url), "utf8");

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

test("CI workflow runs test, lint and build", () => {
  assert.match(ciWorkflow, /npm test/);
  assert.match(ciWorkflow, /npm run lint/);
  assert.match(ciWorkflow, /npm run build/);
});
