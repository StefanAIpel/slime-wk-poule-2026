"use client";

import { Check, ClipboardPaste, ExternalLink, KeyRound, Mail } from "lucide-react";
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

export function LoginForm({ surface = "panel", next }: { surface?: "panel" | "inline"; next?: string }) {
  const [mode, setMode] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const surfaceClass = surface === "inline" ? "grid gap-3" : "panel grid gap-3 p-4";

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
          {message || "Deze code krijg je alleen als je poulebeheerder die heeft aangemaakt."}
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
    setIsVerifyingEmailOtp(false);
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: buildEmailRedirectTo(origin, next), shouldCreateUser: true },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage("Code of link verstuurd.");
  }

  async function onEmailOtpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = emailOtp.replace(/\D/g, "");
    if (!email || token.length < 6) {
      setStatus("sent");
      setMessage("Vul de code uit je mail in.");
      return;
    }

    setIsVerifyingEmailOtp(true);
    setStatus("sent");
    setMessage("Code controleren…");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error) {
      setIsVerifyingEmailOtp(false);
      setStatus("sent");
      setMessage("Code klopt niet of is verlopen. Probeer opnieuw of stuur een nieuwe mail.");
      return;
    }

    window.location.href = next ?? "/voorspellingen";
  }

  async function pasteEmailOtp() {
    if (!navigator.clipboard?.readText) {
      setMessage("Kopieer de code uit je mail en plak hem in het veld.");
      return;
    }
    try {
      const pasted = (await navigator.clipboard.readText()).replace(/\D/g, "").slice(0, 8);
      if (!pasted) {
        setMessage("Geen code gevonden op je klembord.");
        return;
      }
      setEmailOtp(pasted);
      setMessage("Code geplakt. Tik op inloggen.");
    } catch {
      setMessage("Plakken lukte niet automatisch. Houd het veld ingedrukt en kies Plak.");
    }
  }

  if (status === "sent") {
    const provider = webmailFor(email);
    return (
      <div className={surfaceClass}>
        <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 font-bold text-[#c2410c]">
          <Check aria-hidden="true" className="size-5" />
          Link en code verstuurd
        </div>
        <p className="text-sm font-bold leading-6 text-[#9a3412]">
          Kies wat handig is: open de link in je mail, of kopieer de code en plak hem hieronder.
        </p>
        <form onSubmit={onEmailOtpSubmit} className="grid gap-2">
          <label className="grid gap-2 text-sm font-semibold text-[#101a2b]">
            Code uit je mail
            <div className="flex gap-2">
              <input
                className="field min-w-0 flex-1 text-center text-xl font-black tracking-[0.28em]"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                enterKeyHint="go"
                aria-describedby="mail-code-help"
                value={emailOtp}
                onChange={(event) => setEmailOtp(event.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="123456"
              />
              <button className="button-secondary min-h-12 px-3" type="button" onClick={pasteEmailOtp}>
                <ClipboardPaste aria-hidden="true" className="size-5" />
                <span className="sr-only">Code plakken</span>
              </button>
            </div>
            <span id="mail-code-help" className="text-xs font-bold text-[#9a3412]">Kopieer de code uit je mail; plak-knop mag ook.</span>
          </label>
          <button className="button-primary w-full" type="submit" disabled={isVerifyingEmailOtp}>
            <KeyRound aria-hidden="true" className="size-5" />
            {isVerifyingEmailOtp ? "Controleren…" : "Inloggen met code"}
          </button>
        </form>
        <p aria-live="polite" className="text-sm font-bold leading-5 text-[#c2410c]">
          {message || "Code of link 1 uur geldig."}
        </p>
        {provider ? <WebmailButton provider={provider} /> : null}
        <button className="button-secondary w-full" type="button" onClick={() => { setStatus("idle"); setEmailOtp(""); setMessage(""); }}>
          Ander e-mailadres / opnieuw sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={surfaceClass} aria-label="Aanmelden met e-mail">
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
        {status === "loading" ? "Versturen…" : "Mail link en code"}
      </button>
      <p aria-live="polite" className={`text-sm font-medium leading-5 ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
        {message || "Je krijgt een link én een code. Beide 1 uur geldig."}
      </p>
      <button
        type="button"
        className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#0e7a44]"
        onClick={() => { setMode("code"); setStatus("idle"); setMessage(""); }}
      >
        <KeyRound aria-hidden="true" className="size-4" />
        Ik heb een poulecode
      </button>
    </form>
  );
}
