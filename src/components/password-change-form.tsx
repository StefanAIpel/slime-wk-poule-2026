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

    // Wijzigen kan alleen met een geldige sessie; zonder sessie stuurt Supabase
    // de update weg met een vage fout, dus checken we het zelf eerst.
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setBusy(false);
      setMessage({ tone: "error", text: "Je sessie is verlopen. Log opnieuw in en probeer het dan nog eens." });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (error) {
      // Supabase-foutcodes vertalen naar begrijpelijke meldingen.
      const raw = `${error.code ?? ""} ${error.message ?? ""}`.toLowerCase();
      let text = "Wijzigen lukte niet. Probeer het zo nog eens.";
      if (raw.includes("different") || raw.includes("same_password")) {
        text = "Je nieuwe wachtwoord moet anders zijn dan je huidige wachtwoord.";
      } else if (raw.includes("reauthentication") || raw.includes("session")) {
        text = "Voor de zekerheid is opnieuw inloggen nodig. Log uit en weer in, en wijzig daarna je wachtwoord.";
      } else if (raw.includes("weak") || raw.includes("at least")) {
        text = "Kies een sterker wachtwoord (minstens 8 tekens).";
      }
      setMessage({ tone: "error", text });
      return;
    }
    setPassword("");
    setConfirm("");
    setMessage({ tone: "ok", text: "Je wachtwoord is gewijzigd. Je kunt voortaan met dit nieuwe wachtwoord inloggen." });
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
