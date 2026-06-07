"use client";

import { Check, ExternalLink, KeyRound, LogIn, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { kidEmail } from "@/lib/kid";
import type { Locale } from "@/lib/i18n";
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, TEAM_NAME_MAX_LENGTH, TEAM_NAME_MIN_LENGTH } from "@/lib/limits";
import { buildEmailRedirectTo, safeRedirectTarget } from "@/lib/supabase/auth-redirect";
import { createClient } from "@/lib/supabase/browser";

type WebmailProvider = {
  match: string[];
  label: string;
  url: string;
  appUrl?: string;
  kind?: "gmail";
};

const webmail: WebmailProvider[] = [
  {
    match: ["gmail.com", "googlemail.com"],
    label: "Open Gmail",
    url: "https://mail.google.com/mail/u/0/#inbox",
    appUrl: "googlegmail://",
    kind: "gmail",
  },
  { match: ["outlook.com", "hotmail.com", "live.nl", "live.com", "msn.com"], label: "Open Outlook", url: "https://outlook.live.com/mail/" },
  { match: ["yahoo.com", "yahoo.nl"], label: "Open Yahoo Mail", url: "https://mail.yahoo.com/" },
  { match: ["icloud.com", "me.com", "mac.com"], label: "Open iCloud Mail", url: "https://www.icloud.com/mail/" },
  { match: ["proton.me", "protonmail.com"], label: "Open Proton Mail", url: "https://mail.proton.me/" },
];

const rememberedEmailKey = "slimescore:last-email";
const mailFolderHint = "Niet gezien? Check Spam of Ongewenst.";

const loginCopy = {
  nl: {
    choiceLabel: "Account keuze",
    containerLabel: "Inloggen of registreren",
    loginTab: "Inloggen",
    registerTab: "Nieuw account",
    noAccount: "Nog geen account?",
    registerOneMinute: "Registreer je in 1 minuut",
    haveAccount: "Heb je al een account?",
    loginDirect: "Log direct in",
    forgotAria: "Wachtwoord opnieuw aanvragen",
    passwordLoginAria: "Inloggen met mail en wachtwoord",
    email: "E-mailadres",
    emailResetAria: "E-mailadres voor resetmail",
    emailPlaceholder: "jij@example.nl",
    password: "Wachtwoord",
    currentPasswordPlaceholder: "Je gekozen wachtwoord",
    rememberEmail: "Onthoud mijn e-mailadres op dit apparaat",
    loginLoading: "Inloggen…",
    loginButton: "Inloggen",
    forgotPassword: "Wachtwoord vergeten?",
    loginHint: "Al geregistreerd? Log in met mail + wachtwoord.",
    resetSending: "Versturen…",
    sendResetMail: "Stuur resetmail",
    resetAlreadyReceived: "Ik heb de resetmail al ontvangen",
    forgotHelper: "Nog nooit een wachtwoord gekozen of vergeten? Stuur jezelf een resetmail en kies met de code uit die mail direct een nieuw wachtwoord.",
    backToLogin: "Terug naar inloggen",
    registerAria: "Nieuw SlimeScore-account maken",
    nickname: "Naam of bijnaam",
    nicknamePlaceholder: "Stefan",
    teamName: "Teamnaam",
    teamPlaceholder: "VARschrikkelijk goed",
    newPassword: "Wachtwoord",
    newPasswordPlaceholder: "Minstens 8 tekens",
    passwordAgain: "Wachtwoord nog een keer",
    passwordAgainPlaceholder: "Nogmaals je wachtwoord",
    termsPrefix: "Ik ga akkoord met de",
    terms: "voorwaarden",
    privacyPrefix: "en het",
    privacy: "privacybeleid",
    createLoading: "Account maken…",
    signupButton: "Aanmelden",
    registerHint: "Vul je e-mail, naam, teamnaam en wachtwoord in. Check daarna je mailbox om je account te bevestigen.",
    fixedCode: "Ik heb een vaste code zonder e-mail",
    codeLoginAria: "Inloggen met code",
    poolCode: "Pincode van je poule",
    poolCodePlaceholder: "BIJV. ABCD2345",
    codeLoginButton: "Inloggen met code",
    codeHint: "Deze vaste inlogcode krijg je van de beheerder. Je hebt hiervoor geen e-mail nodig.",
    backToMail: "Terug naar mail en wachtwoord",
    mailFolderHint,
    resetSent: "Resetmail verstuurd",
    resetCode: "Code uit resetmail",
    signupSent: "Bevestigingsmail verstuurd",
    resetCodeFormAria: "Wachtwoord wijzigen met mailcode",
    resetCodeInfo: "Gebruik de code uit je resetmail om hier een nieuw wachtwoord te kiezen. Dit is niet de vaste inlogcode die een kind van de beheerder krijgt.",
    resetCodeLabel: "Code uit de resetmail",
    newPasswordLabel: "Nieuw wachtwoord",
    newPasswordAgain: "Nieuw wachtwoord nog een keer",
    savePasswordLoading: "Opslaan…",
    savePassword: "Nieuw wachtwoord opslaan",
    resendReset: "Resetmail opnieuw sturen",
    signupCodeFormAria: "Registratie bevestigen met mailcode",
    signupCodeLabel: "Code uit de mail",
    confirmLoading: "Bevestigen…",
    confirmSignup: "Registratie bevestigen",
    resendLoading: "Opnieuw sturen…",
    resendMail: "Mail opnieuw sturen",
    otherEmail: "Ander e-mailadres",
  },
  en: {
    choiceLabel: "Account choice",
    containerLabel: "Sign in or create account",
    loginTab: "Sign in",
    registerTab: "Create account",
    noAccount: "No account yet?",
    registerOneMinute: "Create one in 1 minute",
    haveAccount: "Already have an account?",
    loginDirect: "Sign in directly",
    forgotAria: "Request password reset",
    passwordLoginAria: "Sign in with email and password",
    email: "Email address",
    emailResetAria: "Email address for reset mail",
    emailPlaceholder: "you@example.com",
    password: "Password",
    currentPasswordPlaceholder: "Your chosen password",
    rememberEmail: "Remember my email on this device",
    loginLoading: "Signing in…",
    loginButton: "Sign in",
    forgotPassword: "Forgot password?",
    loginHint: "Already registered? Sign in with email + password.",
    resetSending: "Sending…",
    sendResetMail: "Send reset email",
    resetAlreadyReceived: "I already received the reset email",
    forgotHelper: "Never chose a password, or forgot it? Send yourself a reset email and use the code in that email to choose a new password.",
    backToLogin: "Back to sign in",
    registerAria: "Create a new SlimeScore account",
    nickname: "Name or nickname",
    nicknamePlaceholder: "Alex",
    teamName: "Team name",
    teamPlaceholder: "VAR-tastic",
    newPassword: "Password",
    newPasswordPlaceholder: "At least 8 characters",
    passwordAgain: "Password again",
    passwordAgainPlaceholder: "Repeat your password",
    termsPrefix: "I agree to the",
    terms: "terms",
    privacyPrefix: "and the",
    privacy: "privacy policy",
    createLoading: "Creating account…",
    signupButton: "Sign up",
    registerHint: "Enter your email, name, team name and password. Then check your inbox to confirm your account.",
    fixedCode: "I have a fixed code without email",
    codeLoginAria: "Sign in with code",
    poolCode: "Pool PIN code",
    poolCodePlaceholder: "E.G. ABCD2345",
    codeLoginButton: "Sign in with code",
    codeHint: "You get this fixed login code from the pool manager. No email needed.",
    backToMail: "Back to email and password",
    mailFolderHint: "Nothing there? Check Spam or Junk.",
    resetSent: "Reset email sent",
    resetCode: "Reset email code",
    signupSent: "Confirmation email sent",
    resetCodeFormAria: "Change password with email code",
    resetCodeInfo: "Use the code from your reset email to choose a new password here. This is not the fixed login code a child gets from a manager.",
    resetCodeLabel: "Code from the reset email",
    newPasswordLabel: "New password",
    newPasswordAgain: "New password again",
    savePasswordLoading: "Saving…",
    savePassword: "Save new password",
    resendReset: "Send reset email again",
    signupCodeFormAria: "Confirm registration with email code",
    signupCodeLabel: "Code from the email",
    confirmLoading: "Confirming…",
    confirmSignup: "Confirm registration",
    resendLoading: "Sending again…",
    resendMail: "Send email again",
    otherEmail: "Use another email address",
  },
} satisfies Record<Locale, Record<string, string>>;

function webmailFor(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return webmail.find((w) => w.match.includes(domain)) ?? null;
}

function registrationErrorMessage(errorMessage: string) {
  if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
    return "Je hebt net al een bevestigingsmail aangevraagd. Gebruik de bevestigingscode uit die mail hieronder, of wacht ongeveer 1 minuut en stuur opnieuw.";
  }
  if (errorMessage.includes("already registered") || errorMessage.includes("already exists") || errorMessage.includes("user already")) {
    return "Dit e-mailadres bestaat al. Log in of gebruik ‘Wachtwoord vergeten?’.";
  }
  if (errorMessage.includes("not authorized") || errorMessage.includes("cannot be used") || errorMessage.includes("disposable")) {
    return "Dit e-mailadres wordt door de maildienst geweigerd. Probeer een ander e-mailadres of app Stefan even met dit adres.";
  }
  if (errorMessage.includes("invalid") || errorMessage.includes("validate email") || errorMessage.includes("email address")) {
    return "Controleer je e-mailadres en probeer opnieuw.";
  }
  if (errorMessage.includes("sending") || errorMessage.includes("smtp") || errorMessage.includes("mailer") || errorMessage.includes("email provider")) {
    return "De bevestigingsmail versturen lukte niet. Probeer straks opnieuw of gebruik een ander e-mailadres.";
  }
  return "Account maken lukte niet. Probeer straks opnieuw of gebruik een ander e-mailadres.";
}

function GmailIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path fill="#EA4335" d="M3.5 6.7v10.8c0 .8.7 1.5 1.5 1.5h2.1V9.7L12 13.4l4.9-3.7V19H19c.8 0 1.5-.7 1.5-1.5V6.7L12 13.1 3.5 6.7Z" />
      <path fill="#FBBC04" d="M3.5 6.7 12 13.1l3.5-2.6V6.2L12 8.8 5.2 3.7C4.5 3.2 3.5 3.7 3.5 4.6v2.1Z" />
      <path fill="#34A853" d="M16.9 19H19c.8 0 1.5-.7 1.5-1.5V6.7l-3.6 2.7V19Z" />
      <path fill="#4285F4" d="M3.5 17.5c0 .8.7 1.5 1.5 1.5h2.1V9.4L3.5 6.7v10.8Z" />
      <path fill="#C5221F" d="M16.9 9.4 20.5 6.7V4.6c0-.9-1-1.4-1.7-.9l-1.9 1.4v4.3Z" />
    </svg>
  );
}

function WebmailButton({ provider }: { provider: WebmailProvider }) {
  const primaryClass = provider.kind === "gmail" ? "gmail-open-button w-full" : "button-primary w-full";

  if (provider.appUrl) {
    return (
      <div className="grid gap-2">
        <a className={primaryClass} href={provider.appUrl} target="_blank" rel="noopener noreferrer">
          {provider.kind === "gmail" ? <GmailIcon /> : <ExternalLink aria-hidden="true" className="size-5" />}
          {provider.kind === "gmail" ? "Open Gmail-app" : provider.label}
        </a>
        <a className="button-secondary w-full" href={provider.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden="true" className="size-5" />
          {provider.kind === "gmail" ? "Gmail in browser" : `${provider.label} in browser`}
        </a>
      </div>
    );
  }

  return (
    <a className={primaryClass} href={provider.url} target="_blank" rel="noopener noreferrer">
      {provider.kind === "gmail" ? <GmailIcon /> : <ExternalLink aria-hidden="true" className="size-5" />}
      {provider.label}
    </a>
  );
}

type LoginMode = "login" | "register" | "code" | "forgot";
type LoginReason = "wachtwoord" | "code";
type PasswordLoginResult =
  | { ok: true; redirectTo: string }
  | { ok: false; message: string };

export function LoginForm({
  surface = "panel",
  next,
  initialMode = "login",
  locale = "nl",
}: {
  surface?: "panel" | "inline";
  next?: string;
  initialMode?: Extract<LoginMode, "login" | "register" | "code">;
  locale?: Locale;
}) {
  const [mode, setMode] = useState<LoginMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [teamName, setTeamName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [code, setCode] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");
  const [resetCodeEntry, setResetCodeEntry] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [resendSubmitting, setResendSubmitting] = useState(false);
  const [signupSubmitting, setSignupSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const surfaceClass = surface === "inline" ? "login-form-inline grid gap-3" : "panel grid gap-3 p-4";
  const copy = loginCopy[locale];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const rememberedEmail = window.localStorage.getItem(rememberedEmailKey);
      if (rememberedEmail) setEmail(rememberedEmail);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  function resetMode(nextMode: LoginMode) {
    setMode(nextMode);
    setStatus("idle");
    setResetCodeEntry(false);
    setMessage("");
  }

  function rememberCurrentEmail() {
    if (rememberEmail && email.trim()) {
      window.localStorage.setItem(rememberedEmailKey, email.trim());
    } else {
      window.localStorage.removeItem(rememberedEmailKey);
    }
  }

  function openScorecard(reason: string) {
    const redirectUrl = new URL(safeRedirectTarget(next ?? null), window.location.origin);
    redirectUrl.searchParams.set("login", reason);
    redirectUrl.searchParams.set("_auth", Date.now().toString(36));
    const target = `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
    window.location.replace(target);
  }

  async function submitPasswordLogin(emailAddress: string, passwordValue: string, reason: LoginReason): Promise<PasswordLoginResult> {
    try {
      const response = await fetch("/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: emailAddress.trim(),
          password: passwordValue,
          next: next ?? "/",
          reason,
        }),
      });
      const result = (await response.json().catch(() => null)) as PasswordLoginResult | null;
      if (result?.ok) return result;
      return { ok: false, message: result?.message ?? "Inloggen lukte niet. Controleer je gegevens en probeer het opnieuw." };
    } catch {
      return { ok: false, message: "Inloggen lukte niet. Controleer je verbinding en probeer opnieuw." };
    }
  }

  async function sendPasswordResetMail() {
    setStatus("loading");
    setResetCodeEntry(false);
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: buildEmailRedirectTo(origin, "/?reset=wachtwoord"),
    });

    if (error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
        rememberCurrentEmail();
        setStatus("sent");
        setResetCodeEntry(true);
        setMessage("Je hebt net al een resetmail aangevraagd. Gebruik de code uit die mail hieronder, of wacht ongeveer 1 minuut en stuur opnieuw.");
      } else {
        setStatus("error");
        setMessage("Wachtwoordmail versturen lukte niet. Controleer je e-mailadres en probeer opnieuw.");
      }
      return;
    }

    rememberCurrentEmail();
    setStatus("sent");
    setResetCodeEntry(true);
    setMessage("");
  }

  async function onResendSignupConfirmation() {
    setResendSubmitting(true);
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: buildEmailRedirectTo(origin, next) },
    });

    setResendSubmitting(false);
    if (error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
        setMessage("Je hebt net al een bevestigingsmail aangevraagd. Gebruik de bevestigingscode uit die mail hieronder, of wacht ongeveer 1 minuut en stuur opnieuw.");
      } else {
        setMessage("Opnieuw sturen lukte niet. Controleer je e-mailadres of probeer straks opnieuw.");
      }
      return;
    }

    setMessage(`Nieuwe bevestigingsmail verstuurd. ${mailFolderHint}`);
  }

  async function onResendPasswordResetMail() {
    setResetSubmitting(true);
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: buildEmailRedirectTo(origin, "/?reset=wachtwoord"),
    });

    setResetSubmitting(false);
    if (error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
        setResetCodeEntry(true);
        setMessage("Je hebt net al een resetmail aangevraagd. Wacht ongeveer 1 minuut en probeer daarna opnieuw.");
      } else {
        setMessage("Resetmail opnieuw sturen lukte niet. Controleer je e-mailadres of probeer straks opnieuw.");
      }
      return;
    }

    setResetCodeEntry(true);
    setMessage(`Nieuwe resetmail verstuurd. ${mailFolderHint}`);
  }

  async function onResetCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetSubmitting(true);
    setMessage("Code wordt gecontroleerd…");

    const normalizedCode = resetCode.trim().replace(/\s+/g, "");
    if (!email.trim()) {
      setResetSubmitting(false);
      setMessage("Vul ook het e-mailadres in waarop je de code kreeg.");
      return;
    }
    if (normalizedCode.length < 6) {
      setResetSubmitting(false);
      setMessage("Vul de code uit de resetmail in.");
      return;
    }
    if (resetNewPassword.length < 8) {
      setResetSubmitting(false);
      setMessage("Kies een nieuw wachtwoord van minstens 8 tekens.");
      return;
    }
    if (resetNewPassword !== resetPasswordConfirm) {
      setResetSubmitting(false);
      setMessage("De twee wachtwoorden zijn niet hetzelfde.");
      return;
    }

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: normalizedCode,
      type: "recovery",
    });
    if (verifyError) {
      setResetSubmitting(false);
      setMessage("Die resetmail-code klopt niet of is verlopen. Vraag een nieuwe resetmail aan. Lukt het dan nog niet? Neem contact op met de poulebeheerder.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: resetNewPassword });
    if (updateError) {
      setResetSubmitting(false);
      setMessage("Wachtwoord opslaan lukte niet. Vraag een nieuwe resetmail aan en probeer opnieuw. Blijft het misgaan? Neem contact op met de poulebeheerder.");
      return;
    }

    setMessage("Wachtwoord opgeslagen. Je scorekaart wordt geopend.");
    window.setTimeout(() => {
      openScorecard("wachtwoord");
    }, 700);
  }

  async function onSignupCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupSubmitting(true);
    setMessage("Bevestigingscode wordt gecontroleerd…");

    const normalizedCode = signupCode.trim().replace(/\s+/g, "");
    if (normalizedCode.length < 6) {
      setSignupSubmitting(false);
      setMessage("Vul de bevestigingscode uit de mail in.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: normalizedCode,
      type: "email",
    });
    if (error) {
      setSignupSubmitting(false);
      setMessage("Die bevestigingscode klopt niet of is verlopen. Stuur eventueel een nieuwe bevestigingsmail.");
      return;
    }

    rememberCurrentEmail();
    setMessage("Registratie bevestigd. Je scorekaart wordt geopend.");
    window.setTimeout(() => {
      openScorecard("registratie");
    }, 700);
  }

  async function onPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const result = await submitPasswordLogin(email, password, "wachtwoord");
    if (!result.ok) {
      setStatus("error");
      setMessage(result.message);
      return;
    }

    rememberCurrentEmail();
    setStatus("success");
    setMessage("Ingelogd. Je scorekaart wordt geopend.");
    window.location.replace(result.redirectTo);
  }

  async function onRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const cleanNickname = nickname.trim().replace(/\s+/g, " ").slice(0, NICKNAME_MAX_LENGTH);
    const cleanTeamName = teamName.trim().replace(/\s+/g, " ").slice(0, TEAM_NAME_MAX_LENGTH);
    if (cleanNickname.length < NICKNAME_MIN_LENGTH || cleanTeamName.length < TEAM_NAME_MIN_LENGTH) {
      setStatus("error");
      setMessage("Vul je naam en teamnaam allebei met minstens 4 tekens in.");
      return;
    }
    if (password.length < 8) {
      setStatus("error");
      setMessage("Kies een wachtwoord van minstens 8 tekens.");
      return;
    }
    if (password !== passwordConfirm) {
      setStatus("error");
      setMessage("De twee wachtwoorden zijn niet hetzelfde.");
      return;
    }
    if (!termsAccepted) {
      setStatus("error");
      setMessage("Vink aan dat je akkoord gaat met de voorwaarden en het privacybeleid.");
      return;
    }

    const acceptedAt = new Date().toISOString();
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: buildEmailRedirectTo(origin, next),
        data: {
          signup_flow: "profile_password_confirm",
          nickname: cleanNickname,
          team_name: cleanTeamName,
          terms_accepted_at: acceptedAt,
          privacy_accepted_at: acceptedAt,
        },
      },
    });

    if (error) {
      setStatus("error");
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
        rememberCurrentEmail();
        setStatus("sent");
        setMessage(registrationErrorMessage(errorMessage));
      } else {
        setMessage(registrationErrorMessage(errorMessage));
      }
      return;
    }
    rememberCurrentEmail();
    setStatus("sent");
    setMessage("");
  }

  async function onForgotSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendPasswordResetMail();
  }

  async function onCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const normalized = code.trim().toLowerCase();
    const result = await submitPasswordLogin(kidEmail(normalized), normalized, "code");
    if (!result.ok) {
      setStatus("error");
      setMessage("Die code klopt niet. Vraag je ouder/beheerder om de juiste code.");
      return;
    }
    setStatus("success");
    setMessage("Ingelogd. Je scorekaart wordt geopend.");
    window.location.replace(result.redirectTo);
  }

  if (mode === "code") {
    return (
      <form method="post" onSubmit={onCodeSubmit} className={surfaceClass} aria-label={copy.codeLoginAria}>
        <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
          {copy.poolCode}
          <input
            className="field uppercase tracking-widest"
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            required
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder={copy.poolCodePlaceholder}
          />
        </label>
        <button className="button-primary w-full" type="submit" disabled={status === "loading"}>
          <KeyRound aria-hidden="true" className="size-5" />
          {status === "loading" ? copy.loginLoading : copy.codeLoginButton}
        </button>
        <p aria-live="polite" className={`text-sm font-medium ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
          {message || copy.codeHint}
        </p>
        <button type="button" className="text-sm font-bold text-[#0e7a44] underline" onClick={() => resetMode("login")}>
          {copy.backToMail}
        </button>
      </form>
    );
  }

  if (status === "sent" || resetCodeEntry) {
    const provider = webmailFor(email);
    const isResetMail = mode === "forgot";
    return (
      <div className={surfaceClass}>
        <div className="auth-sent-banner flex items-center gap-2 rounded-lg bg-green-50 p-3 font-bold text-[#0f7a39]">
          <Check aria-hidden="true" className="size-5" />
          <span>
            {isResetMail
              ? status === "sent"
                ? copy.resetSent
                : copy.resetCode
              : copy.signupSent}
          </span>
        </div>
        {message ? (
          <p aria-live="polite" className="auth-sent-message text-sm font-medium leading-5 text-[#0f5132]">
            {message}
          </p>
        ) : null}
        {provider ? <WebmailButton provider={provider} /> : null}
        <p className="auth-mail-hint rounded-lg bg-[#fff8e6] p-2 text-xs font-bold leading-5 text-[#7a4a00]">
          {copy.mailFolderHint}
        </p>

        {isResetMail ? (
          <form method="post" onSubmit={onResetCodeSubmit} className="auth-code-panel grid gap-3 rounded-xl border border-green-100 bg-white/70 p-3" aria-label={copy.resetCodeFormAria}>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              {copy.email}
              <input
                aria-label={copy.emailResetAria}
                className="field"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
              />
            </label>
            <p className="rounded-lg bg-[#eef6ff] p-2 text-xs font-bold leading-5 text-[#305074]">
              {copy.resetCodeInfo}
            </p>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              {copy.resetCodeLabel}
              <input
                className="auth-code-field field text-center text-lg font-black tracking-[0.3em]"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={resetCode}
                onChange={(event) => setResetCode(event.target.value)}
                placeholder="123456"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              {copy.newPasswordLabel}
              <input
                className="field"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={resetNewPassword}
                onChange={(event) => setResetNewPassword(event.target.value)}
                placeholder={copy.newPasswordPlaceholder}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              {copy.newPasswordAgain}
              <input
                className="field"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={resetPasswordConfirm}
                onChange={(event) => setResetPasswordConfirm(event.target.value)}
                placeholder={copy.passwordAgainPlaceholder}
              />
            </label>
            <button className="button-primary w-full" type="submit" disabled={resetSubmitting}>
              <KeyRound aria-hidden="true" className="size-5" />
              {resetSubmitting ? copy.savePasswordLoading : copy.savePassword}
            </button>
            <button className="button-secondary w-full" type="button" onClick={onResendPasswordResetMail} disabled={resetSubmitting}>
              {copy.resendReset}
            </button>
          </form>
        ) : (
          <form method="post" onSubmit={onSignupCodeSubmit} className="auth-code-panel grid gap-3 rounded-xl border border-green-100 bg-white/70 p-3" aria-label={copy.signupCodeFormAria}>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              {copy.signupCodeLabel}
              <input
                className="auth-code-field field text-center text-lg font-black tracking-[0.3em]"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={signupCode}
                onChange={(event) => setSignupCode(event.target.value)}
                placeholder="123456"
              />
            </label>
            <button className="button-primary w-full" type="submit" disabled={signupSubmitting}>
              <Check aria-hidden="true" className="size-5" />
              {signupSubmitting ? copy.confirmLoading : copy.confirmSignup}
            </button>
            <button className="button-secondary w-full" type="button" onClick={onResendSignupConfirmation} disabled={resendSubmitting || signupSubmitting}>
              {resendSubmitting ? copy.resendLoading : copy.resendMail}
            </button>
          </form>
        )}

        <button className="text-sm font-bold text-[#0e7a44] underline" type="button" onClick={() => { setStatus("idle"); setResetCodeEntry(false); setMessage(""); }}>
          {copy.otherEmail}
        </button>
      </div>
    );
  }

  return (
    <div className={surfaceClass} aria-label={copy.containerLabel}>
      <div className="auth-mode-tabs" role="tablist" aria-label={copy.choiceLabel}>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={`auth-mode-tab ${mode === "login" ? "is-active" : ""}`}
          onClick={() => resetMode("login")}
        >
          <span aria-hidden="true" className="auth-mode-tab-marker" />
          {copy.loginTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={`auth-mode-tab ${mode === "register" ? "is-active" : ""}`}
          onClick={() => resetMode("register")}
        >
          <span aria-hidden="true" className="auth-mode-tab-marker" />
          {copy.registerTab}
        </button>
      </div>

      {mode === "login" || mode === "register" ? (
        <p className="auth-switch-hint text-center text-xs font-semibold text-[#475670]">
          {mode === "login" ? (
            <>
              {copy.noAccount}{" "}
              <button type="button" className="font-bold text-[#0e7a44] underline" onClick={() => resetMode("register")}>
                {copy.registerOneMinute}
              </button>
            </>
          ) : (
            <>
              {copy.haveAccount}{" "}
              <button type="button" className="font-bold text-[#0e7a44] underline" onClick={() => resetMode("login")}>
                {copy.loginDirect}
              </button>
            </>
          )}
        </p>
      ) : null}

      {mode === "forgot" ? (
        <form method="post" onSubmit={onForgotSubmit} className="grid gap-3" aria-label={copy.forgotAria}>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            {copy.email}
            <input
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.emailPlaceholder}
            />
          </label>
          <button className="button-primary w-full" type="submit" disabled={status === "loading"}>
            <Mail aria-hidden="true" className="size-5" />
            {status === "loading" ? copy.resetSending : copy.sendResetMail}
          </button>
          <button
            className="button-secondary w-full"
            type="button"
            onClick={() => {
              rememberCurrentEmail();
              setResetCodeEntry(true);
              setStatus("idle");
              setMessage(locale === "en" ? "Enter your email, the code from the reset email and your new password. You do not need to keep your mail app open." : "Vul je e-mailadres, de code uit de resetmail en je nieuwe wachtwoord in. Je hoeft je mail-app niet open te houden.");
            }}
          >
            {copy.resetAlreadyReceived}
          </button>
          <p aria-live="polite" className={`auth-forgot-helper font-medium ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
            {message || copy.forgotHelper}
          </p>
          <button type="button" className="text-sm font-bold text-[#0e7a44] underline" onClick={() => resetMode("login")}>
            {copy.backToLogin}
          </button>
        </form>
      ) : mode === "login" ? (
        <form method="post" onSubmit={onPasswordSubmit} className="grid gap-3" aria-label={copy.passwordLoginAria}>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            {copy.email}
            <input
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.emailPlaceholder}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            {copy.password}
            <input
              className="field"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={copy.currentPasswordPlaceholder}
            />
          </label>
          <label className="flex items-center gap-2 text-[0.7rem] font-semibold text-[#475670]">
            <input
              type="checkbox"
              className="size-4 accent-[#0e7a44]"
              checked={rememberEmail}
              onChange={(event) => setRememberEmail(event.target.checked)}
            />
            {copy.rememberEmail}
          </label>
          <button className="button-primary w-full" type="submit" disabled={status === "loading"}>
            <LogIn aria-hidden="true" className="size-5" />
            {status === "loading" ? copy.loginLoading : copy.loginButton}
          </button>
          <button type="button" className="text-center text-xs font-semibold text-[#0e7a44] underline" onClick={() => resetMode("forgot")}>
            {copy.forgotPassword}
          </button>
          <p
            aria-live="polite"
            className={status === "error" ? "text-center text-xs font-medium leading-5 text-red-700" : "auth-login-hint text-[#475670]"}
          >
            {message || copy.loginHint}
          </p>
        </form>
      ) : (
        <form method="post" onSubmit={onRegisterSubmit} className="grid gap-3" aria-label={copy.registerAria}>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            {copy.email}
            <input
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.emailPlaceholder}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            {copy.nickname}
            <input
              className="field"
              autoComplete="name"
              required
              minLength={NICKNAME_MIN_LENGTH}
              maxLength={NICKNAME_MAX_LENGTH}
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder={copy.nicknamePlaceholder}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            {copy.teamName}
            <input
              className="field"
              required
              minLength={TEAM_NAME_MIN_LENGTH}
              maxLength={TEAM_NAME_MAX_LENGTH}
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder={copy.teamPlaceholder}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            {copy.newPassword}
            <input
              className="field"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={copy.newPasswordPlaceholder}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            {copy.passwordAgain}
            <input
              className="field"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder={copy.passwordAgainPlaceholder}
            />
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#f7faff] p-3 text-sm font-semibold leading-5 text-[#48617f]">
            <input
              className="mt-1 size-4 accent-[#0e7a44]"
              type="checkbox"
              value="yes"
              required
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
            />
            <span>
              {copy.termsPrefix}{" "}
              <a className="font-bold text-[#064ed6]" href="/voorwaarden" target="_blank" rel="noopener noreferrer">{copy.terms}</a>{" "}
              {copy.privacyPrefix}{" "}
              <a className="font-bold text-[#064ed6]" href="/privacy" target="_blank" rel="noopener noreferrer">{copy.privacy}</a>.
            </span>
          </label>
          <button className="button-primary w-full" type="submit" disabled={status === "loading"}>
            <Mail aria-hidden="true" className="size-5" />
            {status === "loading" ? copy.createLoading : copy.signupButton}
          </button>
          <p aria-live="polite" className={`text-sm font-medium leading-5 ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
            {message || copy.registerHint}
          </p>
        </form>
      )}

      <button
        type="button"
        className="fixed-code-button"
        onClick={() => resetMode("code")}
      >
        <KeyRound aria-hidden="true" className="size-4" />
        {copy.fixedCode}
      </button>
    </div>
  );
}
