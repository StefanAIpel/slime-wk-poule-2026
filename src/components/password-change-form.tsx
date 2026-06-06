"use client";

import { KeyRound } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/browser";

const passwordCopy = {
  nl: {
    tooShort: "Kies een wachtwoord van minstens 8 tekens.",
    mismatch: "De twee wachtwoorden zijn niet hetzelfde.",
    sessionExpired: "Je sessie is verlopen. Log opnieuw in en probeer het dan nog eens.",
    genericError: "Wijzigen lukte niet. Probeer het zo nog eens.",
    samePassword: "Je nieuwe wachtwoord moet anders zijn dan je huidige wachtwoord.",
    reauth: "Voor de zekerheid is opnieuw inloggen nodig. Log uit en weer in, en wijzig daarna je wachtwoord.",
    weak: "Kies een sterker wachtwoord (minstens 8 tekens).",
    saved: "Je wachtwoord is gewijzigd. Je kunt voortaan met dit nieuwe wachtwoord inloggen.",
    title: "Wachtwoord wijzigen",
    newPassword: "Nieuw wachtwoord",
    newPasswordPlaceholder: "Minstens 8 tekens",
    confirmPassword: "Nieuw wachtwoord nog een keer",
    confirmPasswordPlaceholder: "Herhaal je wachtwoord",
    saving: "Opslaan…",
    save: "Wachtwoord opslaan",
  },
  en: {
    tooShort: "Choose a password of at least 8 characters.",
    mismatch: "The two passwords do not match.",
    sessionExpired: "Your session has expired. Sign in again and try once more.",
    genericError: "Changing your password did not work. Please try again in a moment.",
    samePassword: "Your new password must be different from your current password.",
    reauth: "For safety, please sign out and back in before changing your password.",
    weak: "Choose a stronger password (at least 8 characters).",
    saved: "Your password has been changed. You can sign in with this new password from now on.",
    title: "Change password",
    newPassword: "New password",
    newPasswordPlaceholder: "At least 8 characters",
    confirmPassword: "Repeat new password",
    confirmPasswordPlaceholder: "Repeat your password",
    saving: "Saving…",
    save: "Save password",
  },
} as const;

/**
 * Laat een ingelogde speler een nieuw wachtwoord kiezen. Supabase staat
 * `updateUser({ password })` toe zolang de sessie geldig is, dus we hoeven het
 * oude wachtwoord niet opnieuw te vragen.
 */
export function PasswordChangeForm({ locale = "nl" }: { locale?: Locale }) {
  const copy = passwordCopy[locale];
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage({ tone: "error", text: copy.tooShort });
      return;
    }
    if (password !== confirm) {
      setMessage({ tone: "error", text: copy.mismatch });
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
      setMessage({ tone: "error", text: copy.sessionExpired });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (error) {
      // Supabase-foutcodes vertalen naar begrijpelijke meldingen.
      const raw = `${error.code ?? ""} ${error.message ?? ""}`.toLowerCase();
      let text: string = copy.genericError;
      if (raw.includes("different") || raw.includes("same_password")) {
        text = copy.samePassword;
      } else if (raw.includes("reauthentication") || raw.includes("session")) {
        text = copy.reauth;
      } else if (raw.includes("weak") || raw.includes("at least")) {
        text = copy.weak;
      }
      setMessage({ tone: "error", text });
      return;
    }
    setPassword("");
    setConfirm("");
    setMessage({ tone: "ok", text: copy.saved });
  }

  return (
    <form onSubmit={submit} className="panel grid gap-3 p-5">
      <div className="flex items-center gap-3">
        <KeyRound aria-hidden="true" className="size-7 text-[#7c4dff]" />
        <h2 className="text-xl font-bold text-[#081634]">{copy.title}</h2>
      </div>
      <label className="grid gap-1 text-sm font-bold text-[#081634]">
        {copy.newPassword}
        <input
          className="field"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={copy.newPasswordPlaceholder}
        />
      </label>
      <label className="grid gap-1 text-sm font-bold text-[#081634]">
        {copy.confirmPassword}
        <input
          className="field"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={copy.confirmPasswordPlaceholder}
        />
      </label>
      {message ? (
        <p className={`text-sm font-bold ${message.tone === "ok" ? "text-green-700" : "text-red-700"}`}>{message.text}</p>
      ) : null}
      <button className="button-secondary w-fit" type="submit" disabled={busy}>
        {busy ? copy.saving : copy.save}
      </button>
    </form>
  );
}
