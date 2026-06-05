import { type User } from "@supabase/supabase-js";
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, TEAM_NAME_MAX_LENGTH, TEAM_NAME_MIN_LENGTH } from "@/lib/limits";

export type SignupProfileClient = {
  from: (table: string) => {
    select: (columns: string) => {
      ilike: (column: string, value: string) => {
        neq: (column: string, value: string) => {
          maybeSingle: () => Promise<{ data: unknown }>;
        };
      };
    };
    upsert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  };
};

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

export function signupProfileFromMetadata(user: User) {
  const metadata = user.user_metadata ?? {};
  if (metadata.signup_flow !== "profile_password_confirm") return null;

  const nickname = cleanText(metadata.nickname, NICKNAME_MAX_LENGTH);
  const teamName = cleanText(metadata.team_name, TEAM_NAME_MAX_LENGTH);
  const termsAcceptedAt = cleanText(metadata.terms_accepted_at, 40) || new Date().toISOString();
  const privacyAcceptedAt = cleanText(metadata.privacy_accepted_at, 40) || termsAcceptedAt;

  if (nickname.length < NICKNAME_MIN_LENGTH || teamName.length < TEAM_NAME_MIN_LENGTH) return null;

  return {
    id: user.id,
    nickname,
    team_name: teamName,
    avatar_key: "wk2026-international",
    terms_accepted_at: termsAcceptedAt,
    privacy_accepted_at: privacyAcceptedAt,
  };
}

export async function persistSignupProfileFromMetadata(client: SignupProfileClient, user: User) {
  const profile = signupProfileFromMetadata(user);
  if (!profile) return { ok: false as const, reason: "missing-metadata" as const };

  const { data: taken } = await client
    .from("profiles")
    .select("id")
    .ilike("nickname", profile.nickname)
    .neq("id", user.id)
    .maybeSingle();

  if (taken) return { ok: false as const, reason: "nickname-taken" as const };

  const { error } = await client.from("profiles").upsert(profile);
  if (error) return { ok: false as const, reason: "upsert-error" as const, message: error.message };

  return { ok: true as const };
}
