"use client";

import { KeyRound, LogIn, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Mode = "login" | "register" | "recovery";
type Status = "idle" | "loading" | "sent" | "success" | "error";

const rememberedEmailKey = "slimescore:last-email";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [rememberEmail, setRememberEmail] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const recoveryRequested = mode === "recovery" && (status === "sent" || Boolean(resetCode));

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const rememberedEmail = window.localStorage.getItem(rememberedEmailKey);
      if (rememberedEmail) setEmail(rememberedEmail);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  function rememberCurrentEmail() {
    if (rememberEmail && email.trim()) {
      window.localStorage.setItem(rememberedEmailKey, email.trim());
    } else {
      window.localStorage.removeItem(rememberedEmailKey);
    }
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setStatus("idle");
    setMessage("");
    setResetCode("");
    setNewPassword("");
    setNewPasswordConfirm("");
  }

  async function onLogin(event: React.FormEvent<HTMLFormElement>) {
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
        setMessage("Mail of wachtwoord klopt niet. Eerste keer? Gebruik ‘Registreren via mail-link’. ");
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
    window.location.assign("/");
  }

  async function onRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/confirm`,
        shouldCreateUser: true,
      },
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
    setMessage("Check je mail en open de link. Daarna kies je naam, teamnaam en wachtwoord.");
  }

  async function onRequestRecovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/auth/confirm`,
    });

    if (error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
        setStatus("sent");
        setMessage("Er is waarschijnlijk net al een resetmail verstuurd. Gebruik de code uit de nieuwste mail hieronder.");
        return;
      }
      setStatus("error");
      setMessage("Resetmail versturen lukte niet. Controleer je e-mailadres en probeer opnieuw.");
      return;
    }

    rememberCurrentEmail();
    setStatus("sent");
    setMessage("Check je mail voor de resetcode. Vul die hieronder in en kies een nieuw wachtwoord.");
  }

  async function onCompleteRecovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (newPassword.length < 8 || newPassword !== newPasswordConfirm) {
      setStatus("error");
      setMessage("Kies twee keer hetzelfde wachtwoord van minstens 8 tekens.");
      return;
    }

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: resetCode.trim(),
      type: "recovery",
    });

    if (verifyError) {
      setStatus("error");
      setMessage("De resetcode klopt niet of is verlopen. Vraag eventueel een nieuwe resetmail aan.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setStatus("error");
      setMessage("Nieuw wachtwoord opslaan lukte niet. Kies minstens 8 tekens en probeer opnieuw.");
      return;
    }

    rememberCurrentEmail();
    setStatus("success");
    setMessage("Wachtwoord aangepast. Je scorekaart wordt geopend.");
    window.location.assign("/");
  }

  const isLoading = status === "loading";

  return (
    <div className="panel grid gap-4 p-4" aria-label="Inloggen of registreren">
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#eaf1ff] p-1" role="tablist" aria-label="Account keuze">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={`rounded-lg px-2 py-2 text-sm font-black ${mode === "login" ? "bg-white text-[#081634] shadow" : "text-[#174176]"}`}
          onClick={() => switchMode("login")}
        >
          Inloggen
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={`rounded-lg px-2 py-2 text-sm font-black ${mode === "register" ? "bg-white text-[#081634] shadow" : "text-[#174176]"}`}
          onClick={() => switchMode("register")}
        >
          Nieuw
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "recovery"}
          className={`rounded-lg px-2 py-2 text-sm font-black ${mode === "recovery" ? "bg-white text-[#081634] shadow" : "text-[#174176]"}`}
          onClick={() => switchMode("recovery")}
        >
          Reset
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={onLogin} className="grid gap-3" aria-label="Inloggen met mail en wachtwoord">
          <div>
            <h2 className="text-xl font-black text-[#081634]">Inloggen met mail en wachtwoord</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#48617f]">
              Heb je al geregistreerd? Dan kom je hiermee direct terug op je scorekaart.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            E-mailadres
            <input
              className="field"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jij@example.nl"
            />
          </label>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            Wachtwoord
            <input
              className="field"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Je gekozen wachtwoord"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-[#48617f]">
            <input
              type="checkbox"
              className="size-4 accent-[#128f47]"
              checked={rememberEmail}
              onChange={(event) => setRememberEmail(event.target.checked)}
            />
            Onthoud mijn e-mailadres op dit apparaat
          </label>
          <button className="button-primary w-full" type="submit" disabled={isLoading}>
            <LogIn aria-hidden="true" className="size-5" />
            {isLoading ? "Inloggen…" : "Inloggen"}
          </button>
          <button className="button-plain w-full" type="button" onClick={() => switchMode("recovery")}>
            <KeyRound aria-hidden="true" className="size-5" />
            Wachtwoord vergeten?
          </button>
        </form>
      ) : mode === "register" ? (
        <form onSubmit={onRegister} className="grid gap-3" aria-label="Registreren via mail-link">
          <div>
            <h2 className="text-xl font-black text-[#081634]">Registreren via mail-link</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#48617f]">
              Eerste keer? Vul je mail in. Na de link kies je je naam, teamnaam en wachtwoord.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            E-mailadres
            <input
              className="field"
              type="email"
              name="register-email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jij@example.nl"
            />
          </label>
          <button className="button-primary w-full" type="submit" disabled={isLoading}>
            <Mail aria-hidden="true" className="size-5" />
            {isLoading ? "Mail wordt verstuurd…" : "Stuur registratiemail"}
          </button>
          <button className="button-plain w-full" type="button" onClick={() => switchMode("login")}>
            <KeyRound aria-hidden="true" className="size-5" />
            Ik heb al een wachtwoord
          </button>
        </form>
      ) : recoveryRequested ? (
        <form onSubmit={onCompleteRecovery} className="grid gap-3" aria-label="Nieuw wachtwoord instellen">
          <div>
            <h2 className="text-xl font-black text-[#081634]">Nieuw wachtwoord instellen</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#48617f]">
              Vul de code uit je resetmail in en kies twee keer hetzelfde nieuwe wachtwoord.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            E-mailadres
            <input className="field" type="email" name="reset-email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            Resetcode uit mail
            <input className="field" name="reset-code" inputMode="numeric" required value={resetCode} onChange={(event) => setResetCode(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            Nieuw wachtwoord
            <input className="field" type="password" name="new-password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            Herhaal nieuw wachtwoord
            <input className="field" type="password" name="new-password-confirm" autoComplete="new-password" required minLength={8} value={newPasswordConfirm} onChange={(event) => setNewPasswordConfirm(event.target.value)} />
          </label>
          <button className="button-primary w-full" type="submit" disabled={isLoading}>
            <KeyRound aria-hidden="true" className="size-5" />
            {isLoading ? "Opslaan…" : "Wachtwoord aanpassen"}
          </button>
          <button className="button-plain w-full" type="button" onClick={() => switchMode("recovery")}>
            Nieuwe resetmail aanvragen
          </button>
        </form>
      ) : (
        <form onSubmit={onRequestRecovery} className="grid gap-3" aria-label="Wachtwoord vergeten">
          <div>
            <h2 className="text-xl font-black text-[#081634]">Wachtwoord vergeten?</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#48617f]">
              Vul je e-mailadres in. Je krijgt een resetcode waarmee je direct een nieuw wachtwoord kiest.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            E-mailadres
            <input className="field" type="email" name="recovery-email" inputMode="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="jij@example.nl" />
          </label>
          <button className="button-primary w-full" type="submit" disabled={isLoading}>
            <Mail aria-hidden="true" className="size-5" />
            {isLoading ? "Mail wordt verstuurd…" : "Stuur resetmail"}
          </button>
          <button className="button-plain w-full" type="button" onClick={() => switchMode("login")}>
            Terug naar inloggen
          </button>
        </form>
      )}

      <p aria-live="polite" className={`text-sm font-semibold ${status === "error" ? "text-red-700" : "text-[#174176]"}`}>
        {message ||
          (mode === "login"
            ? "Nog geen account? Kies ‘Nieuw account’ en open de mail-link."
            : mode === "register"
              ? "Je krijgt één registratielink per e-mail."
              : "Gebruik de resetcode uit je mail; geen tijdelijk wachtwoord nodig.")}
      </p>
    </div>
  );
}
