import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const loginForm = await readFile(new URL("../src/components/login-form.tsx", import.meta.url), "utf8");
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

test("registration page is honest that account details are chosen before email confirmation", () => {
  assert.doesNotMatch(aanmeldenPage, /geen wachtwoord nodig|korte code|plak de code/i);
  assert.match(aanmeldenPage, /naam, teamnaam en wachtwoord/i);
  assert.match(aanmeldenPage, /registratiemail/i);
  assert.match(aanmeldenPage, /initialMode=\"register\"/);
});

test("registration email template is SlimeScore-branded confirmation, not a login link", () => {
  assert.doesNotMatch(authEmailTemplate, /inlogcode|Code uit je mail|zonder wachtwoordgedoe|Open SlimeScore|inloglink/i);
  assert.match(authEmailTemplate, /SlimeScore\.com/);
  assert.match(authEmailTemplate, /Bevestig je registratie/);
  assert.match(authEmailTemplate, /WK 2026-poule/);
  assert.match(authEmailTemplate, /{{ \.ConfirmationURL }}/);
});

test("new players enter profile, password and legal acceptance before confirmation mail", () => {
  assert.match(loginForm, /aria-label=\"Nieuw SlimeScore-account maken\"/);
  assert.match(loginForm, /name=\"nickname\"/);
  assert.match(loginForm, /name=\"team_name\"/);
  assert.match(loginForm, /name=\"password\"/);
  assert.match(loginForm, /name=\"password_confirm\"/);
  assert.match(loginForm, /name=\"terms_accepted\"/);
  assert.match(loginForm, /signUp\(\{[\s\S]*password/);
  assert.match(loginForm, /emailRedirectTo: buildEmailRedirectTo/);
  assert.doesNotMatch(loginForm, /signInWithOtp|shouldCreateUser|Registratielink verstuurd|Open de inloglink/i);
  assert.match(loginForm, /Bevestigingsmail verstuurd naar je e-mail/);
});

test("verified signup profile data is persisted after email confirmation", () => {
  assert.match(callbackRoute, /persistVerifiedSignupProfile/);
  assert.match(callbackRoute, /user_metadata/);
  assert.match(callbackRoute, /terms_accepted_at/);
  assert.match(callbackRoute, /privacy_accepted_at/);
  assert.doesNotMatch(actions, /auth\.updateUser\(\{ password \}\)/);
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
