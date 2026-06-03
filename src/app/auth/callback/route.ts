import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectTarget } from "@/lib/supabase/auth-redirect";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function otpTypes(primary: string | null) {
  return Array.from(new Set([primary, "email", "magiclink", "signup"].filter(Boolean))) as EmailOtpType[];
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const next = safeRedirectTarget(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const authError = url.searchParams.get("error_description") ?? url.searchParams.get("error");

  if (authError) return redirectTo(request, "/?auth=fout");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return redirectTo(request, error ? "/?auth=fout" : next);
  }

  if (tokenHash) {
    for (const otpType of otpTypes(type)) {
      const { error } = await supabase.auth.verifyOtp({ type: otpType, token_hash: tokenHash });
      if (!error) return redirectTo(request, next);
    }
  }

  return redirectTo(request, "/?auth=fout");
}
