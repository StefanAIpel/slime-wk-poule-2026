"use client";

import { Check, KeyRound } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function PasswordResetForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (password.length < 8) {
      setStatus("error");
      setMessage("Kies minimaal 8 tekens.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("De twee wachtwoorden zijn niet gelijk.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage("Wachtwoord opslaan lukte niet. Vraag een nieuwe link aan en probeer opnieuw.");
      return;
    }

    setStatus("success");
    setMessage("Wachtwoord opgeslagen. Je gaat terug naar je scorekaart.");
    window.setTimeout(() => {
      window.location.href = "/?login=wachtwoord";
    }, 900);
  }

  return (
    <form onSubmit={onSubmit} className="panel grid gap-4 p-5" aria-label="Nieuw wachtwoord kiezen">
      <div>
        <p className="text-sm font-black uppercase tracking-normal text-[#0e7a44]">Wachtwoord opnieuw instellen</p>
        <h1 className="mt-1 text-2xl font-black text-[#081634]">Kies je nieuwe wachtwoord</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#48617f]">
          Dit werkt ook voor bestaande accounts die eerder alleen via mail-link binnenkwamen.
        </p>
      </div>
      <label className="grid gap-2 text-sm font-bold text-[#081634]">
        Nieuw wachtwoord
        <input
          className="field"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimaal 8 tekens"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-[#081634]">
        Herhaal wachtwoord
        <input
          className="field"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Nog een keer"
        />
      </label>
      <button className="button-primary w-full" type="submit" disabled={status === "loading" || status === "success"}>
        {status === "success" ? <Check aria-hidden="true" className="size-5" /> : <KeyRound aria-hidden="true" className="size-5" />}
        {status === "loading" ? "Opslaan…" : status === "success" ? "Opgeslagen" : "Wachtwoord opslaan"}
      </button>
      <p aria-live="polite" className={`text-sm font-bold leading-5 ${status === "error" ? "text-red-700" : "text-[#48617f]"}`}>
        {message || "Na opslaan kun je voortaan op de FrontPage inloggen met mail + wachtwoord."}
      </p>
    </form>
  );
}
