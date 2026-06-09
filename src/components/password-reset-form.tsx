"use client";

import { Check, KeyRound } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/browser";

const resetCopy = {
  nl: {
    tooShort: "Kies minimaal 8 tekens.",
    mismatch: "De twee wachtwoorden zijn niet gelijk.",
    error: "Wachtwoord opslaan lukte niet. Vraag een nieuwe link aan en probeer opnieuw.",
    saved: "Wachtwoord opgeslagen. Je gaat terug naar je scorekaart.",
    formAria: "Nieuw wachtwoord kiezen",
    kicker: "Wachtwoord opnieuw instellen",
    title: "Kies je nieuwe wachtwoord",
    intro: "Dit werkt ook voor bestaande accounts die eerder alleen via mail-link binnenkwamen.",
    newPassword: "Nieuw wachtwoord",
    newPasswordPlaceholder: "Minimaal 8 tekens",
    repeat: "Herhaal wachtwoord",
    repeatPlaceholder: "Nog een keer",
    saving: "Opslaan…",
    savedButton: "Opgeslagen",
    saveButton: "Wachtwoord opslaan",
    helper: "Na opslaan kun je voortaan op de FrontPage inloggen met mail + wachtwoord.",
    redirect: "/?login=wachtwoord",
  },
  en: {
    tooShort: "Choose at least 8 characters.",
    mismatch: "The two passwords do not match.",
    error: "Saving your password did not work. Request a new link and try again.",
    saved: "Password saved. You are going back to your scorecard.",
    formAria: "Choose a new password",
    kicker: "Reset password",
    title: "Choose your new password",
    intro: "This also works for existing accounts that previously used email-link login only.",
    newPassword: "New password",
    newPasswordPlaceholder: "At least 8 characters",
    repeat: "Repeat password",
    repeatPlaceholder: "One more time",
    saving: "Saving…",
    savedButton: "Saved",
    saveButton: "Save password",
    helper: "After saving, you can sign in on the FrontPage with email + password.",
    redirect: "/en?login=wachtwoord",
  },
} satisfies Record<Locale, Record<string, string>>;

export function PasswordResetForm({ locale = "nl" }: { locale?: Locale }) {
  const copy = resetCopy[locale];
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
      setMessage(copy.tooShort);
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage(copy.mismatch);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage(copy.error);
      return;
    }

    setStatus("success");
    setMessage(copy.saved);
    window.location.replace(copy.redirect);
  }

  return (
    <form onSubmit={onSubmit} className="panel grid gap-4 p-5" aria-label={copy.formAria}>
      <div>
        <p className="text-sm font-black uppercase tracking-normal text-[#0e7a44]">{copy.kicker}</p>
        <h1 className="mt-1 text-2xl font-black text-[#081634]">{copy.title}</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#48617f]">
          {copy.intro}
        </p>
      </div>
      <label className="grid gap-2 text-sm font-bold text-[#081634]">
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
      <label className="grid gap-2 text-sm font-bold text-[#081634]">
        {copy.repeat}
        <input
          className="field"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder={copy.repeatPlaceholder}
        />
      </label>
      <button className="button-primary w-full" type="submit" disabled={status === "loading" || status === "success"}>
        {status === "success" ? <Check aria-hidden="true" className="size-5" /> : <KeyRound aria-hidden="true" className="size-5" />}
        {status === "loading" ? copy.saving : status === "success" ? copy.savedButton : copy.saveButton}
      </button>
      <p aria-live="polite" className={`text-sm font-bold leading-5 ${status === "error" ? "text-red-700" : "text-[#48617f]"}`}>
        {message || copy.helper}
      </p>
    </form>
  );
}
