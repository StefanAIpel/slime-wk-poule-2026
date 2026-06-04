import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const loginForm = await readFile(new URL("../src/components/login-form.tsx", import.meta.url), "utf8");
const profileForm = await readFile(new URL("../src/components/profile-form.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../src/app/actions.ts", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const aanmeldenPage = await readFile(new URL("../src/app/aanmelden/page.tsx", import.meta.url), "utf8");
const finishAuth = await readFile(new URL("../src/lib/supabase/finish-auth.ts", import.meta.url), "utf8");
const callbackRoute = await readFile(new URL("../src/app/auth/callback/route.ts", import.meta.url), "utf8");
const authEmailTemplate = await readFile(new URL("../supabase/templates/slimescore_auth.html", import.meta.url), "utf8");

test("FrontPage has email-password login as the primary returning-player flow", () => {
  assert.match(loginForm, /aria-label=\"Inloggen met mail en wachtwoord\"/);
  assert.match(loginForm, /type=\"password\"/);
  assert.match(loginForm, /autoComplete=\"current-password\"/);
  assert.match(loginForm, /signInWithPassword\(\{[\s\S]*email:/);
  assert.match(loginForm, /mail en wachtwoord/);
});

test("registration page is honest that a password is needed after the mail link", () => {
  assert.doesNotMatch(aanmeldenPage, /geen wachtwoord nodig/i);
  assert.doesNotMatch(aanmeldenPage, /korte code|plak de code/i);
  assert.match(aanmeldenPage, /wachtwoord kiezen/i);
  assert.match(aanmeldenPage, /registratiemail/i);
  assert.match(aanmeldenPage, /initialMode=\"register\"/);
});

test("registration email template points to password onboarding, not passwordless code login", () => {
  assert.doesNotMatch(authEmailTemplate, /inlogcode|Code uit je mail|zonder wachtwoordgedoe/i);
  assert.match(authEmailTemplate, /registratielink/i);
  assert.match(authEmailTemplate, /wachtwoord/i);
  assert.match(authEmailTemplate, /{{ \.ConfirmationURL }}/);
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

test("existing players can request a password reset mail from the FrontPage", () => {
  assert.match(loginForm, /Wachtwoord vergeten\?/);
  assert.match(loginForm, /resetPasswordForEmail/);
  assert.match(loginForm, /reset=wachtwoord/);
  assert.match(homePage, /PasswordResetForm/);
});

test("recovery links are accepted by the auth callback fallback", () => {
  assert.match(finishAuth, /\"recovery\"/);
  assert.match(callbackRoute, /\"recovery\"/);
});
