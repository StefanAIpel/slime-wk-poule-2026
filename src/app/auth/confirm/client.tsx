"use client";

import { type EmailOtpType } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

function safeRedirectTarget(value: string | null) {
  if (!value) return "/?login=gelukt";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return "/?login=gelukt";
}

function uniqueOtpTypes(primary: string | null) {
  return Array.from(new Set([primary, "email", "magiclink", "signup"].filter(Boolean))) as EmailOtpType[];
}

export function AuthConfirmClient() {
  const router = useRouter();
  const [message, setMessage] = useState("Je inloglink wordt gecontroleerd.");

  useEffect(() => {
    let cancelled = false;

    async function finishLogin() {
      const supabase = createClient();
      const url = new URL(window.location.href);
      const redirectTo = safeRedirectTarget(url.searchParams.get("next"));
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");

      if (!cancelled) setMessage("Sessie wordt klaargezet.");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) throw error;
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
      } else if (tokenHash) {
        let verified = false;
        let lastError: Error | null = null;

        for (const otpType of uniqueOtpTypes(type)) {
          const { error } = await supabase.auth.verifyOtp({
            type: otpType,
            token_hash: tokenHash,
          });
          if (!error) {
            verified = true;
            break;
          }
          lastError = error;
        }

        if (!verified) throw lastError ?? new Error("Inloglink kon niet worden bevestigd.");
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Geen sessie gevonden in de inloglink.");
      }

      if (!cancelled) {
        setMessage("Gelukt. Je scorekaart wordt geopend.");
        router.replace(redirectTo);
        router.refresh();
      }
    }

    finishLogin().catch(() => {
      if (!cancelled) {
        setMessage("Deze link is verlopen of al gebruikt. Vraag een nieuwe inloglink aan.");
        router.replace("/?auth=fout");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#eef6ff] px-4 py-3 text-sm font-black text-[#102c77]">
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-[#064ed6]" />
      <span aria-live="polite">{message}</span>
    </div>
  );
}
