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
const authRecoveryTemplate = await readFile(new URL("../supabase/templates/slimescore_recovery.html", import.meta.url), "utf8");

test("FrontPage has email-password login as the primary returning-player flow", () => {
  assert.match(loginForm, /aria-label=\"Inloggen met mail en wachtwoord\"/);
  assert.match(loginForm, /type=\"password\"/);
  assert.match(loginForm, /autoComplete=\"current-password\"/);
  assert.match(loginForm, /signInWithPassword\(\{[\s\S]*email:/);
  assert.match(loginForm, /mail en wachtwoord/);
});

test("successful login always leaves the same homepage URL to avoid mobile auth hangs", () => {
  assert.match(loginForm, /function openScorecard\(reason: string\)/);
  assert.match(loginForm, /redirectUrl\.searchParams\.set\(\"login\", reason\)/);
  assert.match(loginForm, /redirectUrl\.searchParams\.set\(\"_auth\", Date\.now\(\)\.toString\(36\)\)/);
  assert.match(loginForm, /window\.location\.replace\(target\)/);
  assert.doesNotMatch(loginForm, /window\.location\.href = next \?\? \"\/\"/);
});

test("registration page is honest that account details are chosen before email confirmation", () => {
  assert.doesNotMatch(aanmeldenPage, /geen wachtwoord nodig|zonder wachtwoordgedoe/i);
  assert.match(loginForm, /naam, teamnaam en wachtwoord/i);
  assert.match(loginForm, /Check daarna je mailbox om je account te bevestigen/);
  // De "Registratiemail"-banner is weg; de pagina opent standaard op de inlog-tab.
  assert.doesNotMatch(aanmeldenPage, /registratiemail/i);
  assert.match(aanmeldenPage, /initialMode=\"login\"/);
});

test("registration email template is SlimeScore-branded and supports code-first confirmation on every device", () => {
  assert.doesNotMatch(authEmailTemplate, /inlogcode|zonder wachtwoordgedoe|Open SlimeScore|inloglink/i);
  assert.match(authEmailTemplate, /SlimeScore\.com/);
  assert.match(authEmailTemplate, /Bevestig je registratie/);
  assert.match(authEmailTemplate, /WK 2026-poule/);
  assert.match(authEmailTemplate, /{{ \.Token }}/);
  assert.match(authEmailTemplate, /{{ \.ConfirmationURL }}/);
  assert.match(authEmailTemplate, /Code uit de mail/);
  assert.match(authEmailTemplate, /Voorspel\. Deel\. Win de poule\./);
  assert.match(authEmailTemplate, /WK 2026 vriendenpoule/);
});

test("new players enter profile, password and legal acceptance before confirmation mail", () => {
  assert.match(loginForm, /aria-label=\"Nieuw SlimeScore-account maken\"/);
  assert.match(loginForm, /Naam of bijnaam/);
  assert.match(loginForm, /Teamnaam/);
  assert.match(loginForm, /type=\"password\"/);
  assert.match(loginForm, /passwordConfirm/);
  assert.match(loginForm, /termsAccepted/);
  assert.match(loginForm, /supabase\.auth\.signUp/);
  assert.match(loginForm, /signup_flow: \"profile_password_confirm\"/);
  assert.doesNotMatch(loginForm, /signInWithOtp/);
});

test("registration surfaces actionable Supabase mail errors instead of a vague retry message", () => {
  assert.match(loginForm, /function registrationErrorMessage\(errorMessage: string\)/);
  assert.match(loginForm, /e-mailadres wordt door de maildienst geweigerd/);
  assert.match(loginForm, /bevestigingsmail versturen lukte niet/);
  assert.match(loginForm, /Controleer je e-mailadres en probeer opnieuw/);
  assert.doesNotMatch(loginForm, /setMessage\(\"Account maken lukte niet\. Controleer je gegevens en probeer het opnieuw\.\"\)/);
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
  assert.match(signupProfile, /avatar_key: \"wk2026-international\"/);
  assert.match(actions, /avatar_key: isAvatarKey\(avatarKey\) \? avatarKey : null/);
  assert.doesNotMatch(actions, /auth\.updateUser\(\{ password \}\)/);
});

test("homepage salvages verified signups that arrive already logged in without a profile", () => {
  assert.match(homePage, /persistSignupProfileFromMetadata/);
  assert.match(homePage, /signupProfile\.ok\) redirect\("\/"\)/);
});

test("unconfirmed players can explicitly resend and code-confirm the registration mail", () => {
  assert.match(loginForm, /auth\.resend\(\{[\s\S]*type: \"signup\"/);
  assert.match(loginForm, /Mail opnieuw sturen/);
  assert.match(loginForm, /buildEmailRedirectTo\(origin, next\)/);
  assert.match(loginForm, /verifyOtp\(\{[\s\S]*type: \"email\"/);
  assert.match(loginForm, /Registratie bevestigen met mailcode/);
  assert.match(loginForm, /Gebruik de bevestigingscode uit die mail hieronder/);
});

test("existing players can reset their password with a copyable email code instead of relying on mobile links", () => {
  assert.match(loginForm, /Wachtwoord vergeten\?/);
  assert.match(loginForm, /resetPasswordForEmail/);
  assert.match(loginForm, /verifyOtp\(\{[\s\S]*type: \"recovery\"/);
  assert.match(loginForm, /Code uit de resetmail/);
  assert.match(loginForm, /Nieuw wachtwoord opslaan/);
  assert.match(loginForm, /Je hebt net al een resetmail aangevraagd\. Gebruik de code uit die mail hieronder/);
  assert.match(authRecoveryTemplate, /{{ \.Token }}/);
  assert.match(authRecoveryTemplate, /Code uit deze resetmail/);
  assert.match(authRecoveryTemplate, /niet de vaste inlogcode die een kind van de beheerder krijgt/);
  assert.match(authRecoveryTemplate, /Neem contact op met de poulebeheerder/);
  assert.doesNotMatch(authRecoveryTemplate, /{{ \.ConfirmationURL }}/);
  assert.doesNotMatch(authRecoveryTemplate, /Kies nieuw wachtwoord<\/a>|Werkt de knop niet|Kopieer deze link/i);
  assert.match(authRecoveryTemplate, /Voorspel\. Deel\. Win de poule\./);
  assert.match(authRecoveryTemplate, /WK 2026 vriendenpoule/);
});

test("password recovery survives mobile mail-app roundtrips without the original webview state", () => {
  assert.match(loginForm, /Ik heb de resetmail al ontvangen/);
  assert.match(loginForm, /setResetCodeEntry\(true\)/);
  assert.match(loginForm, /status === \"sent\" \|\| resetCodeEntry/);
  assert.match(loginForm, /aria-label=\"E-mailadres voor resetmail\"/);
  assert.match(loginForm, /niet de vaste inlogcode die een kind van de beheerder krijgt/);
  assert.doesNotMatch(loginForm, /window\.location\.href = provider\.(?:appUrl|url)/);
});

test("webmail buttons open outside the SlimeScore tab instead of replacing the reset form", () => {
  assert.match(loginForm, /href=\{provider\.appUrl\}/);
  assert.match(loginForm, /href=\{provider\.url\}/);
  assert.match(loginForm, /target=\"_blank\"/);
  assert.match(loginForm, /rel=\"noopener noreferrer\"/);
  assert.match(loginForm, /Open Gmail-app/);
  assert.match(loginForm, /Gmail in browser/);
  assert.match(loginForm, /Ik heb de resetmail al ontvangen/);
});

test("webmail shortcut is picked by email domain for common providers without exposing niche-provider copy", () => {
  assert.match(loginForm, /match: \[\"outlook\.com\", \"hotmail\.com\", \"live\.nl\", \"live\.com\", \"msn\.com\"\], label: \"Open Outlook\", url: \"https:\/\/outlook\.live\.com\/mail\/\"/);
  assert.match(loginForm, /const domain = email\.split\("@"\)\[1\]\?\.toLowerCase\(\) \?\? "";/);
  assert.match(loginForm, /w\.match\.includes\(domain\)/);
  assert.doesNotMatch(loginForm, /Zoho|zohomail|Notification/);
});

test("confirmation and recovery screens keep provider-neutral spam folder hints", () => {
  assert.match(loginForm, /Niet gezien\? Check Spam of Ongewenst/);
  assert.match(authEmailTemplate, /Check ook Spam of Ongewenst/);
  assert.match(authRecoveryTemplate, /Check ook Spam of Ongewenst/);
  assert.doesNotMatch(loginForm, /Zoho|zohomail|Notification/);
  assert.doesNotMatch(authEmailTemplate, /Notification/);
  assert.doesNotMatch(authRecoveryTemplate, /Notification/);
});

test("recovery links remain accepted by the auth callback fallback", () => {
  assert.match(finishAuth, /\"recovery\"/);
  assert.match(callbackRoute, /\"recovery\"/);
});
