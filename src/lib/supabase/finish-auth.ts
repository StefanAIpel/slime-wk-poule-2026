"use client";

import { type EmailOtpType } from "@supabase/supabase-js";
import { safeRedirectTarget } from "@/lib/supabase/auth-redirect";
import { createClient } from "@/lib/supabase/browser";

export type FinishAuthResult =
  | { ok: true; redirectTo: string; handled: true }
  | { ok: false; redirectTo: string; handled: boolean; error: string };

function otpTypes(primary: string | null) {
  return Array.from(new Set([primary, "email", "magiclink", "signup", "recovery"].filter(Boolean))) as EmailOtpType[];
}

export function hasAuthCallbackPayload(url = new URL(window.location.href)) {
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
  return Boolean(
    hashParams.get("access_token") ||
      hashParams.get("refresh_token") ||
      hashParams.get("error") ||
      url.searchParams.get("code") ||
      url.searchParams.get("token_hash"),
  );
}

export async function finishSupabaseAuth(url = new URL(window.location.href)): Promise<FinishAuthResult> {
  const redirectTo = safeRedirectTarget(url.searchParams.get("next"));
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  const hashError = hashParams.get("error_description") ?? hashParams.get("error");
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const supabase = createClient();

  try {
    if (hashError) throw new Error(hashError);

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) throw error;
      return { ok: true, redirectTo, handled: true };
    }

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      return { ok: true, redirectTo, handled: true };
    }

    if (tokenHash) {
      let lastError: Error | null = null;
      for (const otpType of otpTypes(type)) {
        const { error } = await supabase.auth.verifyOtp({
          type: otpType,
          token_hash: tokenHash,
        });
        if (!error) return { ok: true, redirectTo, handled: true };
        lastError = error;
      }
      throw lastError ?? new Error("Inloglink kon niet worden bevestigd.");
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) return { ok: true, redirectTo, handled: true };
    return { ok: false, redirectTo: "/?auth=fout", handled: false, error: "Geen sessie gevonden." };
  } catch (error) {
    return {
      ok: false,
      redirectTo: "/?auth=fout",
      handled: true,
      error: error instanceof Error ? error.message : "Onbekende auth-fout.",
    };
  }
}
