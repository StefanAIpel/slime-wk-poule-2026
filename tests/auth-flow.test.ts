import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const loginForm = await readFile(new URL("../src/components/login-form.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../src/app/actions.ts", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const aanmeldenPage = await readFile(new URL("../src/app/aanmelden/page.tsx", import.meta.url), "utf8");
const finishAuth = await readFile(new URL("../src/lib/supabase/finish-auth.ts", import.meta.url), "utf8");
const callbackRoute = await readFile(new URL("../src/app/auth/callback/route.ts", import.meta.url), "utf8");
const signupProfile = await readFile(new URL("../src/lib/supabase/signup-profile.ts", import.meta.url), "utf8");
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
  assert.match(loginForm, /Nieuw SlimeScore-account maken/);
  assert.match(loginForm, /Naam of bijnaam/);
  assert.match(loginForm, /Teamnaam/);
  assert.match(loginForm, /type=\"password\"/);
  assert.match(loginForm, /passwordConfirm/);
  assert.match(loginForm, /termsAccepted/);
  assert.match(loginForm, /supabase\.auth\.signUp/);
  assert.match(loginForm, /signup_flow: \"profile_password_confirm\"/);
  assert.doesNotMatch(loginForm, /signInWithOtp/);
});

test("registration form cannot leak passwords through a native GET fallback", () => {
  assert.match(loginForm, /<form method=\"post\" onSubmit=\{onRegisterSubmit\}/);
  assert.doesNotMatch(loginForm, /name=\"password\"/);
  assert.doesNotMatch(loginForm, /name=\"password_confirm\"/);
  assert.doesNotMatch(loginForm, /name=\"email\"/);
  assert.doesNotMatch(loginForm, /name=\"nickname\"/);
  assert.doesNotMatch(loginForm, /name=\"team_name\"/);
});


test("verified signup profile data is persisted after email confirmation", () => {
  assert.match(callbackRoute, /persistVerifiedSignupProfile/);
  assert.match(callbackRoute, /persistSignupProfileFromMetadata/);
  assert.match(signupProfile, /user_metadata/);
  assert.match(signupProfile, /terms_accepted_at/);
  assert.match(signupProfile, /privacy_accepted_at/);
  assert.doesNotMatch(actions, /auth\.updateUser\(\{ password \}\)/);
});

test("homepage salvages verified signups that arrive already logged in without a profile", () => {
  assert.match(homePage, /persistSignupProfileFromMetadata/);
  assert.match(homePage, /signupProfile\.ok\) redirect\("\/"\)/);
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
