"use client";

import { Check, ExternalLink, KeyRound, Mail } from "lucide-react";
import { useState } from "react";
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

export function LoginForm() {
  const [mode, setMode] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

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
    window.location.href = "/";
  }

  if (mode === "code") {
    return (
      <form onSubmit={onCodeSubmit} className="panel grid gap-3 p-4" aria-label="Inloggen met code">
        <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
          Inlogcode (voor kinderen zonder e-mail)
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
          {message || "De code krijg je van de beheerder van je WK-poule."}
        </p>
        <button type="button" className="text-sm font-bold text-[#0e7a44] underline" onClick={() => { setMode("email"); setStatus("idle"); setMessage(""); }}>
          Terug naar inloggen met e-mail
        </button>
      </form>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: buildEmailRedirectTo(origin), shouldCreateUser: true },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    const provider = webmailFor(email);
    return (
      <div className="panel grid gap-3 p-4">
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 font-bold text-[#0f7a39]">
          <Check aria-hidden="true" className="size-5" />
          Inloglink verstuurd!
        </div>
        <p className="text-sm font-medium leading-6 text-[#475670]">
          We hebben een link gestuurd naar <strong className="text-[#101a2b]">{email}</strong>. Open die mail en klik op de
          link om aan te melden. De link is <strong className="text-[#101a2b]">±1 uur geldig</strong> en werkt één keer.
        </p>
        {provider ? <WebmailButton provider={provider} /> : null}
        <button className="button-secondary w-full" type="button" onClick={() => setStatus("idle")}>
          Ander e-mailadres / opnieuw sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="panel grid gap-3 p-4" aria-label="Aanmelden met e-mail">
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
        {status === "loading" ? "Versturen…" : "Stuur inloglink"}
      </button>
      <p aria-live="polite" className={`text-sm font-medium leading-5 ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
        {message || "Eenmalige inloglink voor je WK 2026-poule (±1 uur geldig, werkt 1×)."}
      </p>
      <button
        type="button"
        className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#0e7a44]"
        onClick={() => { setMode("code"); setStatus("idle"); setMessage(""); }}
      >
        <KeyRound aria-hidden="true" className="size-4" />
        Inloggen met code
      </button>
    </form>
  );
}
