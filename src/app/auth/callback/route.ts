import { type EmailOtpType, type User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectTarget } from "@/lib/supabase/auth-redirect";
import { createOptionalAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function otpTypes(primary: string | null) {
  return Array.from(new Set([primary, "email", "magiclink", "signup", "recovery"].filter(Boolean))) as EmailOtpType[];
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

function signupText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

async function persistVerifiedSignupProfile(user: User) {
  const metadata = user.user_metadata ?? {};
  if (metadata.signup_flow !== "profile_password_confirm") return "/";

  const nickname = signupText(metadata.nickname, 24);
  const teamName = signupText(metadata.team_name, 28);
  const termsAcceptedAt = signupText(metadata.terms_accepted_at, 40) || new Date().toISOString();
  const privacyAcceptedAt = signupText(metadata.privacy_accepted_at, 40) || termsAcceptedAt;

  if (nickname.length < 4 || teamName.length < 4) return "/?profiel=te-kort";

  const admin = createOptionalAdminClient();
  if (!admin) return "/";

  const { data: taken } = await admin
    .from("profiles")
    .select("id")
    .ilike("nickname", nickname)
    .neq("id", user.id)
    .maybeSingle();
  if (taken) return "/?profiel=bezet";

  const { error } = await admin.from("profiles").upsert({
    id: user.id,
    nickname,
    team_name: teamName,
    avatar_key: null,
    terms_accepted_at: termsAcceptedAt,
    privacy_accepted_at: privacyAcceptedAt,
  });
  if (error) return "/?profiel=fout";
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
