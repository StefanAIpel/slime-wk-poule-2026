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

function webmailFor(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return webmail.find((w) => w.match.includes(domain)) ?? null;
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
  function openMail() {
    if (!provider.appUrl) {
      window.open(provider.url, "_blank", "noopener,noreferrer");
      return;
    }

    const openedAt = Date.now();
    window.location.href = provider.appUrl;

    window.setTimeout(() => {
      if (Date.now() - openedAt < 1800) {
        window.location.href = provider.url;
      }
    }, 900);
  }

  return (
    <button className={provider.kind === "gmail" ? "gmail-open-button w-full" : "button-primary w-full"} type="button" onClick={openMail}>
      {provider.kind === "gmail" ? <GmailIcon /> : <ExternalLink aria-hidden="true" className="size-5" />}
      {provider.label}
    </button>
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
  const [code, setCode] = useState("");
  const [rememberEmail, setRememberEmail] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const surfaceClass = surface === "inline" ? "grid gap-3" : "panel grid gap-3 p-4";

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
    setMessage("");
  }

  function rememberCurrentEmail() {
    if (rememberEmail && email.trim()) {
      window.localStorage.setItem(rememberedEmailKey, email.trim());
    } else {
      window.localStorage.removeItem(rememberedEmailKey);
    }
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
        setMessage("Open eerst de registratiemail. Daarna kies je je naam en wachtwoord.");
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

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: buildEmailRedirectTo(origin, next), shouldCreateUser: true },
    });

    if (error) {
      setStatus("error");
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
        setMessage("Je hebt net al een registratiemail aangevraagd. Wacht ongeveer 1 minuut en probeer het daarna opnieuw.");
      } else {
        setMessage("Het versturen van de registratiemail lukte niet. Controleer je e-mailadres en probeer het opnieuw.");
      }
      return;
    }
    rememberCurrentEmail();
    setStatus("sent");
    setMessage("Registratielink verstuurd. Open de mail; daarna kies je naam, teamnaam en wachtwoord.");
  }

  async function onForgotSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: buildEmailRedirectTo(origin, "/?reset=wachtwoord"),
    });

    if (error) {
      setStatus("error");
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
        setMessage("Je hebt net al een wachtwoordlink aangevraagd. Wacht ongeveer 1 minuut en probeer daarna opnieuw.");
      } else {
        setMessage("Wachtwoordmail versturen lukte niet. Controleer je e-mailadres en probeer opnieuw.");
      }
      return;
    }

    rememberCurrentEmail();
    setStatus("sent");
    setMessage("Wachtwoordlink verstuurd. Open de mail en kies daarna je nieuwe wachtwoord.");
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
      <form onSubmit={onCodeSubmit} className={surfaceClass} aria-label="Inloggen met code">
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

  if (status === "sent") {
    const provider = webmailFor(email);
    const isResetMail = mode === "forgot";
    return (
      <div className={surfaceClass}>
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 font-bold text-[#0f7a39]">
          <Check aria-hidden="true" className="size-5" />
          {isResetMail ? "Wachtwoordmail verstuurd" : "Registratiemail verstuurd"}
        </div>
        <p className="text-sm font-bold leading-6 text-[#0f5132]">
          {isResetMail
            ? "Open de link in je mail. Daarna kies je meteen een nieuw wachtwoord."
            : "Open de inloglink in je mail. Daarna maak je je profiel af met naam, wachtwoord, voorwaarden en privacy."}
        </p>
        <p aria-live="polite" className="text-sm font-bold leading-5 text-[#0f5132]">
          {message || "De link is tijdelijk geldig."}
        </p>
        {provider ? <WebmailButton provider={provider} /> : null}
        <button className="button-secondary w-full" type="button" onClick={() => { setStatus("idle"); setMessage(""); }}>
          Ander e-mailadres / opnieuw sturen
        </button>
      </div>
    );
  }

  return (
    <div className={surfaceClass} aria-label="Inloggen of registreren">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#eaf1ff] p-1" role="tablist" aria-label="Account keuze">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={`rounded-lg px-3 py-2 text-sm font-bold ${mode === "login" ? "bg-white text-[#101a2b] shadow" : "text-[#174176]"}`}
          onClick={() => resetMode("login")}
        >
          Inloggen
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={`rounded-lg px-3 py-2 text-sm font-bold ${mode === "register" ? "bg-white text-[#101a2b] shadow" : "text-[#174176]"}`}
          onClick={() => resetMode("register")}
        >
          Nieuw account
        </button>
      </div>

      {mode === "forgot" ? (
        <form onSubmit={onForgotSubmit} className="grid gap-3" aria-label="Wachtwoord opnieuw aanvragen">
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
            {status === "loading" ? "Versturen…" : "Stuur wachtwoordlink"}
          </button>
          <p aria-live="polite" className={`text-sm font-medium leading-5 ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
            {message || "Nog nooit een wachtwoord gekozen of vergeten? Stuur jezelf een link en kies een nieuw wachtwoord."}
          </p>
          <button type="button" className="text-sm font-bold text-[#0e7a44] underline" onClick={() => resetMode("login")}>
            Terug naar inloggen
          </button>
        </form>
      ) : mode === "login" ? (
        <form onSubmit={onPasswordSubmit} className="grid gap-3" aria-label="Inloggen met mail en wachtwoord">
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
          <p aria-live="polite" className={`text-center text-xs font-medium leading-5 ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
            {message || "Al geregistreerd? Log direct in met mail en wachtwoord."}
          </p>
        </form>
      ) : (
        <form onSubmit={onRegisterSubmit} className="grid gap-3" aria-label="Registreren via mail-link">
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
            {status === "loading" ? "Versturen…" : "Stuur registratiemail"}
          </button>
          <p aria-live="polite" className={`text-sm font-medium leading-5 ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
            {message || "Eerste keer? Open de mail-link. Daarna kies je naam, teamnaam en wachtwoord."}
          </p>
        </form>
      )}

      <button
        type="button"
        className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#0e7a44]"
        onClick={() => resetMode("code")}
      >
        <KeyRound aria-hidden="true" className="size-4" />
        Ik heb een vaste code zonder e-mail
      </button>
    </div>
  );
}
