import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const loginForm = await readFile(new URL("../src/components/login-form.tsx", import.meta.url), "utf8");
const profileForm = await readFile(new URL("../src/components/profile-form.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../src/app/actions.ts", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");

test("FrontPage has email-password login as the primary returning-player flow", () => {
  assert.match(loginForm, /aria-label=\"Inloggen met mail en wachtwoord\"/);
  assert.match(loginForm, /type=\"password\"/);
  assert.match(loginForm, /autoComplete=\"current-password\"/);
  assert.match(loginForm, /signInWithPassword\(\{[\s\S]*email:/);
  assert.match(homePage, /mail en wachtwoord/);
});

test("new players register by mail link before profile completion", () => {
  assert.match(loginForm, /Registreren via mail-link/);
  assert.match(loginForm, /signInWithOtp/);
  assert.match(loginForm, /shouldCreateUser: true/);
  assert.match(loginForm, /emailRedirectTo: buildEmailRedirectTo/);
});

test("profile completion chooses password and records legal acceptance", () => {
  assert.match(profileForm, /name=\"password\"/);
  assert.match(profileForm, /autoComplete=\"new-password\"/);
  assert.match(profileForm, /name=\"terms_accepted\"/);
  assert.match(actions, /auth\.updateUser\(\{ password \}\)/);
  assert.match(actions, /terms_accepted_at/);
  assert.match(actions, /privacy_accepted_at/);
});
