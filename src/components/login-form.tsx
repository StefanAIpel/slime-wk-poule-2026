"use client";

import { Check, ExternalLink, Mail } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const webmail: { match: string[]; label: string; url: string }[] = [
  { match: ["gmail.com", "googlemail.com"], label: "Open Gmail", url: "https://mail.google.com/" },
  { match: ["outlook.com", "hotmail.com", "live.nl", "live.com", "msn.com"], label: "Open Outlook", url: "https://outlook.live.com/mail/" },
  { match: ["yahoo.com", "yahoo.nl"], label: "Open Yahoo Mail", url: "https://mail.yahoo.com/" },
  { match: ["icloud.com", "me.com", "mac.com"], label: "Open iCloud Mail", url: "https://www.icloud.com/mail/" },
  { match: ["proton.me", "protonmail.com"], label: "Open Proton Mail", url: "https://mail.proton.me/" },
];

function webmailFor(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return webmail.find((w) => w.match.includes(domain)) ?? null;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/confirm`, shouldCreateUser: true },
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
          link om aan te melden.
        </p>
        {provider ? (
          <a className="button-primary w-full" href={provider.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" className="size-5" />
            {provider.label}
          </a>
        ) : null}
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
      <p aria-live="polite" className={`text-sm font-medium ${status === "error" ? "text-red-700" : "text-[#475670]"}`}>
        {message || "Nieuw of bestaand account — je krijgt een eenmalige link per e-mail. Geen wachtwoord."}
      </p>
    </form>
  );
}
