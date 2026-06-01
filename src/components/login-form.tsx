"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

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
      options: {
        emailRedirectTo: `${origin}/auth/confirm`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("Check je mail en open de link. Daarna kom je hier terug om je bijnaam en teamnaam te kiezen.");
  }

  return (
    <form onSubmit={onSubmit} className="panel grid gap-3 p-4" aria-label="Aanmelden met e-mail">
      <label className="grid gap-2 text-sm font-black text-[#081634]">
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
        {status === "loading" ? "Mail wordt verstuurd" : "Stuur inloglink"}
      </button>
      <p aria-live="polite" className={`text-sm font-semibold ${status === "error" ? "text-red-700" : "text-[#174176]"}`}>
        {message || "Geen wachtwoord nodig. Je krijgt een eenmalige link per e-mail."}
      </p>
    </form>
  );
}
