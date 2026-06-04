import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const loginForm = await readFile(new URL("../src/components/login-form.tsx", import.meta.url), "utf8");
const profileForm = await readFile(new URL("../src/components/profile-form.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../src/app/actions.ts", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const predictionsPage = await readFile(new URL("../src/app/voorspellingen/page.tsx", import.meta.url), "utf8");
const syncResultsRoute = await readFile(new URL("../src/app/api/sync-results/route.ts", import.meta.url), "utf8");

test("public homepage offers password login for existing players", () => {
  assert.match(loginForm, /signInWithPassword/);
  assert.match(loginForm, /type=\"password\"/);
  assert.match(loginForm, /autoComplete=\"current-password\"/);
  assert.match(loginForm, /Inloggen met mail en wachtwoord/);
});

test("public homepage keeps email-link registration as the new-player flow", () => {
  assert.match(loginForm, /signInWithOtp/);
  assert.match(loginForm, /shouldCreateUser: true/);
  assert.match(loginForm, /Registreren via mail-link/);
  assert.match(homePage, /Registreren via mail-link/);
});

test("profile completion requires name, password confirmation and legal agreement", () => {
  assert.match(profileForm, /name=\"password\"/);
  assert.match(profileForm, /name=\"password_confirm\"/);
  assert.match(profileForm, /name=\"terms\"/);
  assert.match(profileForm, /voorwaarden/);
  assert.match(profileForm, /privacybeleid/);
  assert.match(actions, /const passwordConfirm = String\(formData\.get\(\"password_confirm\"\)/);
  assert.match(actions, /password !== passwordConfirm/);
  assert.match(actions, /auth\.updateUser\(\{ password \}\)/);
});

test("login form includes password recovery via Supabase recovery OTP", () => {
  assert.match(loginForm, /Wachtwoord vergeten\?/);
  assert.match(loginForm, /resetPasswordForEmail/);
  assert.match(loginForm, /verifyOtp\(\{[\s\S]*type: \"recovery\"/);
  assert.match(loginForm, /auth\.updateUser\(\{ password: newPassword \}\)/);
  assert.match(loginForm, /name=\"reset-code\"/);
  assert.match(loginForm, /name=\"new-password-confirm\"/);
});

test("post-group predictions include team-most-goals and Oranje stage until 28 June", () => {
  assert.match(predictionsPage, /name=\"team_most_goals_code\"/);
  assert.match(predictionsPage, /name=\"oranje_stage\"/);
  assert.match(actions, /team_most_goals_code: cleanText\(formData\.get\(\"team_most_goals_code\"\)/);
  assert.match(actions, /oranje_stage: cleanText\(formData\.get\(\"oranje_stage\"\)/);
  assert.match(syncResultsRoute, /team_most_goals_code/);
  assert.match(syncResultsRoute, /oranje_stage/);
});
