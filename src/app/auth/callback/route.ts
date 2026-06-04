import { type EmailOtpType, type User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectTarget } from "@/lib/supabase/auth-redirect";
import { createOptionalAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { persistSignupProfileFromMetadata, type SignupProfileClient } from "@/lib/supabase/signup-profile";

export const dynamic = "force-dynamic";

function otpTypes(primary: string | null) {
  return Array.from(new Set([primary, "email", "magiclink", "signup", "recovery"].filter(Boolean))) as EmailOtpType[];
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

async function persistVerifiedSignupProfile(user: User) {
  if (!user) return "/";
  const admin = createOptionalAdminClient();
  if (!admin) return "/";

  const result = await persistSignupProfileFromMetadata(admin as unknown as SignupProfileClient, user);
  if (result.ok) return "/";
  if (result.reason === "nickname-taken") return "/?profiel=bezet";
  if (result.reason === "upsert-error") return "/?profiel=fout";
  return "/";
}

async function redirectAfterVerifiedAuth(request: NextRequest, requestedNext: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profileRedirect = user ? await persistVerifiedSignupProfile(user) : "/";
  if (profileRedirect !== "/") return redirectTo(request, profileRedirect);
  return redirectTo(request, requestedNext);
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
    return error ? redirectTo(request, "/?auth=fout") : redirectAfterVerifiedAuth(request, next);
  }

  if (tokenHash) {
    for (const otpType of otpTypes(type)) {
      const { error } = await supabase.auth.verifyOtp({ type: otpType, token_hash: tokenHash });
      if (!error) return redirectAfterVerifiedAuth(request, next);
    }
  }

  return redirectTo(request, "/?auth=fout");
}
