"use client";

import { KeyRound } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

/**
 * Laat een ingelogde speler een nieuw wachtwoord kiezen. Supabase staat
 * `updateUser({ password })` toe zolang de sessie geldig is, dus we hoeven het
 * oude wachtwoord niet opnieuw te vragen.
 */
export function PasswordChangeForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage({ tone: "error", text: "Kies een wachtwoord van minstens 8 tekens." });
      return;
    }
    if (password !== confirm) {
      setMessage({ tone: "error", text: "De twee wachtwoorden zijn niet hetzelfde." });
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setMessage({ tone: "error", text: "Wijzigen lukte niet. Log eventueel opnieuw in en probeer het nog eens." });
      return;
    }
    setPassword("");
    setConfirm("");
    setMessage({ tone: "ok", text: "Je wachtwoord is gewijzigd." });
  }

  return (
    <form onSubmit={submit} className="panel grid gap-3 p-5">
      <div className="flex items-center gap-3">
        <KeyRound aria-hidden="true" className="size-7 text-[#7c4dff]" />
        <h2 className="text-xl font-bold text-[#081634]">Wachtwoord wijzigen</h2>
      </div>
      <label className="grid gap-1 text-sm font-bold text-[#081634]">
        Nieuw wachtwoord
        <input
          className="field"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minstens 8 tekens"
        />
      </label>
      <label className="grid gap-1 text-sm font-bold text-[#081634]">
        Nieuw wachtwoord nog een keer
        <input
          className="field"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Herhaal je wachtwoord"
        />
      </label>
      {message ? (
        <p className={`text-sm font-bold ${message.tone === "ok" ? "text-green-700" : "text-red-700"}`}>{message.text}</p>
      ) : null}
      <button className="button-secondary w-fit" type="submit" disabled={busy}>
        {busy ? "Opslaan…" : "Wachtwoord opslaan"}
      </button>
    </form>
  );
}
