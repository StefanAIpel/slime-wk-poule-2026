"use client";

import { Check, ExternalLink, KeyRound, LogIn, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { kidEmail } from "@/lib/kid";
import { buildEmailRedirectTo } from "@/lib/supabase/auth-redirect";
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
const mailFolderHint = "Check ook Spam of Ongewenst als je de mail niet ziet.";

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

export function LoginForm({
  surface = "panel",
  next,
  initialMode = "login",
}: {
  surface?: "panel" | "inline";
  next?: string;
  initialMode?: Extract<LoginMode, "login" | "register">;
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
      window.location.href = "/?login=wachtwoord";
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
      window.location.href = "/?login=registratie";
    }, 700);
  }

  async function onPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setStatus("error");
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("invalid login") || errorMessage.includes("invalid credentials")) {
        setMessage("Mail of wachtwoord klopt niet. Nog nooit een wachtwoord gekozen? Gebruik ‘Wachtwoord vergeten?’.");
      } else if (errorMessage.includes("email not confirmed")) {
        setMessage("Open eerst de bevestigingsmail. Daarna kun je inloggen met je e-mail en wachtwoord.");
      } else {
        setMessage("Inloggen lukte niet. Controleer je gegevens en probeer het opnieuw.");
      }
      return;
    }

    rememberCurrentEmail();
    setStatus("success");
    setMessage("Ingelogd. Je scorekaart wordt geopend.");
    window.location.href = next ?? "/";
  }

  async function onRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const cleanNickname = nickname.trim().replace(/\s+/g, " ").slice(0, 24);
    const cleanTeamName = teamName.trim().replace(/\s+/g, " ").slice(0, 28);
    if (cleanNickname.length < 4 || cleanTeamName.length < 4) {
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
    const supabase = createClient();
    const normalized = code.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithPassword({ email: kidEmail(normalized), password: normalized });
    if (error) {
      setStatus("error");
      setMessage("Die code klopt niet. Vraag je ouder/beheerder om de juiste code.");
      return;
    }
    window.location.href = next ?? "/";
  }

  if (mode === "code") {
    return (
      <form method="post" onSubmit={onCodeSubmit} className={surfaceClass} aria-label="Inloggen met code">
        <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
          Pincode van je poule
          <input
            className="field uppercase tracking-widest"
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            required
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="BIJV. ABCD2345"
          />
        </label>
        <button className="button-primary w-full" type="submit" disabled={status === "loading"}>
          <KeyRound aria-hidden="true" className="size-5" />
          {status === "loading" ? "Inloggen…" : "Inloggen met code"}
        </button>
        <p aria-live="polite" className={`text-sm font-medium ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
          {message || "Deze vaste inlogcode krijg je van de beheerder. Je hebt hiervoor geen e-mail nodig."}
        </p>
        <button type="button" className="text-sm font-bold text-[#0e7a44] underline" onClick={() => resetMode("login")}>
          Terug naar mail en wachtwoord
        </button>
      </form>
    );
  }

  if (status === "sent" || resetCodeEntry) {
    const provider = webmailFor(email);
    const isResetMail = mode === "forgot";
    return (
      <div className={surfaceClass}>
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 font-bold text-[#0f7a39]">
          <Check aria-hidden="true" className="size-5" />
          {isResetMail
            ? status === "sent"
              ? "Resetmail verstuurd naar je e-mail"
              : "Code uit resetmail invullen"
            : "Bevestigingsmail verstuurd naar je e-mail"}
        </div>
        {message ? (
          <p aria-live="polite" className="text-sm font-medium leading-5 text-[#0f5132]">
            {message}
          </p>
        ) : null}
        {provider ? <WebmailButton provider={provider} /> : null}
        <p className="rounded-lg bg-[#fff8e6] p-2 text-xs font-bold leading-5 text-[#7a4a00]">
          {mailFolderHint}
        </p>

        {isResetMail ? (
          <form method="post" onSubmit={onResetCodeSubmit} className="grid gap-3 rounded-xl border border-green-100 bg-white/70 p-3" aria-label="Wachtwoord wijzigen met mailcode">
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              E-mailadres
              <input
                aria-label="E-mailadres voor resetmail"
                className="field"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jij@example.nl"
              />
            </label>
            <p className="rounded-lg bg-[#eef6ff] p-2 text-xs font-bold leading-5 text-[#305074]">
              Gebruik de code uit je resetmail om hier een nieuw wachtwoord te kiezen. Dit is niet de vaste inlogcode die een kind van de beheerder krijgt.
            </p>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              Code uit de resetmail
              <input
                className="field text-center text-lg font-black tracking-[0.3em]"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={resetCode}
                onChange={(event) => setResetCode(event.target.value)}
                placeholder="123456"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              Nieuw wachtwoord
              <input
                className="field"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={resetNewPassword}
                onChange={(event) => setResetNewPassword(event.target.value)}
                placeholder="Minstens 8 tekens"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              Nieuw wachtwoord nog een keer
              <input
                className="field"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={resetPasswordConfirm}
                onChange={(event) => setResetPasswordConfirm(event.target.value)}
                placeholder="Nogmaals"
              />
            </label>
            <button className="button-primary w-full" type="submit" disabled={resetSubmitting}>
              <KeyRound aria-hidden="true" className="size-5" />
              {resetSubmitting ? "Opslaan…" : "Nieuw wachtwoord opslaan"}
            </button>
            <button className="button-secondary w-full" type="button" onClick={onResendPasswordResetMail} disabled={resetSubmitting}>
              Resetmail opnieuw sturen
            </button>
          </form>
        ) : (
          <form method="post" onSubmit={onSignupCodeSubmit} className="grid gap-3 rounded-xl border border-green-100 bg-white/70 p-3" aria-label="Registratie bevestigen met mailcode">
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              Code uit de mail
              <input
                className="field text-center text-lg font-black tracking-[0.3em]"
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
              {signupSubmitting ? "Bevestigen…" : "Registratie bevestigen"}
            </button>
            <button className="button-secondary w-full" type="button" onClick={onResendSignupConfirmation} disabled={resendSubmitting || signupSubmitting}>
              {resendSubmitting ? "Opnieuw sturen…" : "Bevestigingsmail opnieuw sturen"}
            </button>
          </form>
        )}

        <button className="text-sm font-bold text-[#0e7a44] underline" type="button" onClick={() => { setStatus("idle"); setResetCodeEntry(false); setMessage(""); }}>
          Ander e-mailadres
        </button>
      </div>
    );
  }

  return (
    <div className={surfaceClass} aria-label="Inloggen of registreren">
      <div className="auth-mode-tabs" role="tablist" aria-label="Account keuze">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={`auth-mode-tab ${mode === "login" ? "is-active" : ""}`}
          onClick={() => resetMode("login")}
        >
          <span aria-hidden="true" className="auth-mode-tab-marker" />
          Inloggen
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={`auth-mode-tab ${mode === "register" ? "is-active" : ""}`}
          onClick={() => resetMode("register")}
        >
          <span aria-hidden="true" className="auth-mode-tab-marker" />
          Nieuw account
        </button>
      </div>

      {mode === "forgot" ? (
        <form method="post" onSubmit={onForgotSubmit} className="grid gap-3" aria-label="Wachtwoord opnieuw aanvragen">
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            E-mailadres
            <input
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jij@example.nl"
            />
          </label>
          <button className="button-primary w-full" type="submit" disabled={status === "loading"}>
            <Mail aria-hidden="true" className="size-5" />
            {status === "loading" ? "Versturen…" : "Stuur resetmail"}
          </button>
          <button
            className="button-secondary w-full"
            type="button"
            onClick={() => {
              rememberCurrentEmail();
              setResetCodeEntry(true);
              setStatus("idle");
              setMessage("Vul je e-mailadres, de code uit de resetmail en je nieuwe wachtwoord in. Je hoeft je mail-app niet open te houden.");
            }}
          >
            Ik heb de resetmail al ontvangen
          </button>
          <p aria-live="polite" className={`auth-forgot-helper font-medium ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
            {message || "Nog nooit een wachtwoord gekozen of vergeten? Stuur jezelf een resetmail en kies met de code uit die mail direct een nieuw wachtwoord."}
          </p>
          <button type="button" className="text-sm font-bold text-[#0e7a44] underline" onClick={() => resetMode("login")}>
            Terug naar inloggen
          </button>
        </form>
      ) : mode === "login" ? (
        <form method="post" onSubmit={onPasswordSubmit} className="grid gap-3" aria-label="Inloggen met mail en wachtwoord">
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            E-mailadres
            <input
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jij@example.nl"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            Wachtwoord
            <input
              className="field"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Je gekozen wachtwoord"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#475670]">
            <input
              type="checkbox"
              className="size-4 accent-[#0e7a44]"
              checked={rememberEmail}
              onChange={(event) => setRememberEmail(event.target.checked)}
            />
            Onthoud mijn e-mailadres op dit apparaat
          </label>
          <button className="button-primary w-full" type="submit" disabled={status === "loading"}>
            <LogIn aria-hidden="true" className="size-5" />
            {status === "loading" ? "Inloggen…" : "Inloggen"}
          </button>
          <button type="button" className="text-center text-xs font-semibold text-[#0e7a44] underline" onClick={() => resetMode("forgot")}>
            Wachtwoord vergeten?
          </button>
          <p
            aria-live="polite"
            className={status === "error" ? "text-center text-xs font-medium leading-5 text-red-700" : "auth-login-hint text-[#475670]"}
          >
            {message || "Al geregistreerd? Log in met mail + wachtwoord."}
          </p>
        </form>
      ) : (
        <form method="post" onSubmit={onRegisterSubmit} className="grid gap-3" aria-label="Nieuw SlimeScore-account maken">
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            E-mailadres
            <input
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jij@example.nl"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            Naam of bijnaam
            <input
              className="field"
              autoComplete="name"
              required
              minLength={4}
              maxLength={24}
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Stefan"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            Teamnaam
            <input
              className="field"
              required
              minLength={4}
              maxLength={28}
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="VARschrikkelijk goed"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            Wachtwoord
            <input
              className="field"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minstens 8 tekens"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            Wachtwoord nog een keer
            <input
              className="field"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="Nogmaals je wachtwoord"
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
              Ik ga akkoord met de{" "}
              <a className="font-bold text-[#064ed6]" href="/voorwaarden" target="_blank" rel="noopener noreferrer">voorwaarden</a>{" "}
              en het{" "}
              <a className="font-bold text-[#064ed6]" href="/privacy" target="_blank" rel="noopener noreferrer">privacybeleid</a>.
            </span>
          </label>
          <button className="button-primary w-full" type="submit" disabled={status === "loading"}>
            <Mail aria-hidden="true" className="size-5" />
            {status === "loading" ? "Account maken…" : "Aanmelden"}
          </button>
          <p aria-live="polite" className={`text-sm font-medium leading-5 ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
            {message || "We sturen één bevestigingsmail. Na bevestiging log je in met je e-mail en wachtwoord."}
          </p>
        </form>
      )}

      <button
        type="button"
        className="fixed-code-button"
        onClick={() => resetMode("code")}
      >
        <KeyRound aria-hidden="true" className="size-4" />
        Ik heb een vaste code zonder e-mail
      </button>
    </div>
  );
}
