"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ENTRY_DEADLINE, POST_GROUP_DEADLINE } from "@/lib/constants";
import { clampInt } from "@/lib/format";
import { calculateRound32, type ScoreLookup } from "@/lib/group-standings";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const stageSelectionLimits: Record<string, number> = {
  round16: 16,
  quarterfinal: 8,
  semifinal: 4,
  finalists: 2,
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  return { supabase, user };
}

function cleanText(value: FormDataEntryValue | null, max = 50) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, max);
}

function poolCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  return Array.from(bytes)
    .slice(0, 8)
    .map((byte) => alphabet[byte % alphabet.length])
    .join("");
}

const reservedNames = ["anoniem", "naam volgt", "speler", "onbekend"];

export async function saveProfile(formData: FormData) {
  const { supabase, user } = await requireUser();
  const admin = createAdminClient();
  const nickname = cleanText(formData.get("nickname"), 24);
  const teamName = cleanText(formData.get("team_name"), 28);
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("password_confirm") ?? "");
  const acceptedTerms = formData.get("terms") === "on";

  if (nickname.length < 2 || teamName.length < 2) {
    redirect("/?profiel=te-kort");
  }
  if (password.length < 8) {
    redirect("/?profiel=wachtwoord");
  }
  if (password !== passwordConfirm) {
    redirect("/?profiel=wachtwoord-match");
  }
  if (!acceptedTerms) {
    redirect("/?profiel=akkoord");
  }
  if (reservedNames.includes(nickname.toLowerCase())) {
    redirect("/?profiel=gereserveerd");
  }

  // Naam moet uniek zijn voor een nette ranglijst (hoofdletter-ongevoelig).
  const { data: taken } = await admin
    .from("profiles")
    .select("id")
    .ilike("nickname", nickname)
    .neq("id", user.id)
    .maybeSingle();
  if (taken) {
    redirect("/?profiel=bezet");
  }

  const { error: passwordError } = await supabase.auth.updateUser({ password });
  if (passwordError) {
    redirect("/?profiel=wachtwoord");
  }

  const acceptedAt = new Date().toISOString();
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    nickname,
    team_name: teamName,
    terms_accepted_at: acceptedAt,
    privacy_accepted_at: acceptedAt,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/");
}

export async function createPool(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const name = cleanText(formData.get("name"), 50);

  if (name.length < 2) redirect("/poules?fout=naam");

  await admin.from("profiles").upsert({ id: user.id });

  let code = poolCode();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await admin
      .from("pools")
      .insert({ name, code, owner_id: user.id })
      .select("id")
      .single();

    if (!error && data) {
      const member = await admin
        .from("pool_members")
        .insert({ pool_id: data.id, user_id: user.id, role: "owner" });
      if (member.error) throw new Error(member.error.message);
      revalidatePath("/poules");
      revalidatePath("/");
      redirect(`/poules?aangemaakt=${code}`);
    }

    code = poolCode();
  }

  throw new Error("Kon geen unieke poulecode maken.");
}

export async function joinPool(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const code = cleanText(formData.get("code"), 10).toUpperCase();

  const { data: pool, error } = await admin.from("pools").select("id").eq("code", code).single();
  if (error || !pool) redirect("/poules?fout=code");

  await admin.from("profiles").upsert({ id: user.id });
  const { error: memberError } = await admin
    .from("pool_members")
    .upsert({ pool_id: pool.id, user_id: user.id, role: "member" });

  if (memberError) throw new Error(memberError.message);
  revalidatePath("/poules");
  revalidatePath("/");
  redirect(`/poules?joined=${code}`);
}

export async function removeMember(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const poolId = cleanText(formData.get("pool_id"), 60);
  const memberId = cleanText(formData.get("user_id"), 60);

  const { data: owner } = await admin
    .from("pool_members")
    .select("role")
    .eq("pool_id", poolId)
    .eq("user_id", user.id)
    .single();

  if (owner?.role !== "owner" && memberId !== user.id) {
    redirect("/poules?fout=rechten");
  }

  const { error } = await admin.from("pool_members").delete().eq("pool_id", poolId).eq("user_id", memberId);
  if (error) throw new Error(error.message);
  revalidatePath("/poules");
  redirect("/poules?bijgewerkt=1");
}

export async function updatePoolStyle(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const poolId = cleanText(formData.get("pool_id"), 60);
  const description = cleanText(formData.get("description"), 180) || null;
  const badgeEmoji = cleanText(formData.get("badge_emoji"), 8) || "🏆";
  const accentColor = cleanText(formData.get("accent_color"), 7);

  if (!/^#[0-9A-Fa-f]{6}$/.test(accentColor)) {
    redirect("/poules?fout=kleur");
  }

  const { data: manager } = await admin
    .from("pool_members")
    .select("role")
    .eq("pool_id", poolId)
    .eq("user_id", user.id)
    .in("role", ["owner", "moderator"])
    .maybeSingle();

  if (!manager) redirect("/poules?fout=rechten");

  const { error } = await admin
    .from("pools")
    .update({ description, badge_emoji: badgeEmoji, accent_color: accentColor })
    .eq("id", poolId);

  if (error) throw new Error(error.message);
  revalidatePath("/poules");
  revalidatePath("/");
  redirect("/poules?bijgewerkt=1");
}

export async function postPoolMessage(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const poolId = cleanText(formData.get("pool_id"), 60);
  const body = cleanText(formData.get("body"), 500);
  const pinned = formData.get("pinned") === "on";

  if (body.length < 2) redirect("/poules?fout=bericht");

  const { data: manager } = await admin
    .from("pool_members")
    .select("role")
    .eq("pool_id", poolId)
    .eq("user_id", user.id)
    .in("role", ["owner", "moderator"])
    .maybeSingle();

  if (!manager) redirect("/poules?fout=rechten");

  const { error } = await admin.from("pool_messages").insert({
    pool_id: poolId,
    author_id: user.id,
    body,
    pinned,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/poules");
  redirect("/poules?bericht=geplaatst");
}

export async function setMemberRole(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const poolId = cleanText(formData.get("pool_id"), 60);
  const memberId = cleanText(formData.get("user_id"), 60);
  const role = cleanText(formData.get("role"), 12);

  if (!["moderator", "member"].includes(role)) redirect("/poules?fout=rol");

  const { data: owner } = await admin
    .from("pool_members")
    .select("role")
    .eq("pool_id", poolId)
    .eq("user_id", user.id)
    .single();

  if (owner?.role !== "owner" || memberId === user.id) redirect("/poules?fout=rechten");

  const { error } = await admin
    .from("pool_members")
    .update({ role })
    .eq("pool_id", poolId)
    .eq("user_id", memberId)
    .neq("role", "owner");

  if (error) throw new Error(error.message);
  revalidatePath("/poules");
  redirect("/poules?bijgewerkt=1");
}

export async function savePredictions(formData: FormData) {
  const { supabase, user } = await requireUser();
  const now = new Date();
  const canEditMain = now < ENTRY_DEADLINE;
  const canEditPostGroup = now < POST_GROUP_DEADLINE;

  const { data: matches, error: matchError } = await supabase
    .from("matches")
    .select("id,group_letter,home_code,away_code")
    .eq("stage", "group");
  if (matchError) throw new Error(matchError.message);

  if (canEditMain) {
    const predictionRows: {
      user_id: string;
      match_id: number;
      home_score: number;
      away_score: number;
    }[] = [];
    const scoreLookup: ScoreLookup = new Map();

    for (const match of matches ?? []) {
      const home = formData.get(`match_${match.id}_home`);
      const away = formData.get(`match_${match.id}_away`);
      if (home === null || away === null) continue;
      const homeScore = clampInt(home, 0, 0, 20);
      const awayScore = clampInt(away, 0, 0, 20);
      predictionRows.push({
        user_id: user.id,
        match_id: match.id,
        home_score: homeScore,
        away_score: awayScore,
      });
      scoreLookup.set(match.id, { home: homeScore, away: awayScore });
    }

    if (predictionRows.length) {
      const { error } = await supabase.from("predictions").upsert(predictionRows);
      if (error) throw new Error(error.message);
    }

    const round32 = calculateRound32(matches ?? [], scoreLookup);
    const { error: round32Error } = await supabase.from("bracket_predictions").upsert({
      user_id: user.id,
      stage_key: "round32",
      team_codes: round32,
    });
    if (round32Error) throw new Error(round32Error.message);

    const stageKeys = ["round16", "quarterfinal", "semifinal", "finalists"] as const;
    for (const stageKey of stageKeys) {
      const teams = Array.from(new Set(formData.getAll(stageKey).map(String).filter(Boolean))).slice(
        0,
        stageSelectionLimits[stageKey],
      );
      const { error } = await supabase.from("bracket_predictions").upsert({
        user_id: user.id,
        stage_key: stageKey,
        team_codes: teams,
      });
      if (error) throw new Error(error.message);
    }
  }

  if (canEditMain || canEditPostGroup) {
    const champion = cleanText(formData.get("champion_code"), 3).toUpperCase() || null;
    const finalists = Array.from(new Set(formData.getAll("finalists").map(String).filter(Boolean))).slice(0, 2);
    const special = {
      user_id: user.id,
      top_scorer: cleanText(formData.get("top_scorer"), 60) || null,
      total_goals: clampInt(formData.get("total_goals"), 172, 100, 400),
      group_zero_zero_count: clampInt(formData.get("group_zero_zero_count"), 4, 0, 30),
      total_red_cards: clampInt(formData.get("total_red_cards"), 8, 0, 50),
      total_corners: clampInt(formData.get("total_corners"), 840, 400, 1400),
      fastest_goal_minute: clampInt(formData.get("fastest_goal_minute"), 3, 1, 120),
      host_city_most_goals: cleanText(formData.get("host_city_most_goals"), 50) || null,
      champion_code: champion,
      finalists,
      penalty_shootouts_ko: clampInt(formData.get("penalty_shootouts_ko"), 4, 0, 20),
      own_goals_ko: clampInt(formData.get("own_goals_ko"), 2, 0, 20),
      cards_ko_team_code: cleanText(formData.get("cards_ko_team_code"), 3).toUpperCase() || null,
      team_most_goals_code: cleanText(formData.get("team_most_goals_code"), 3).toUpperCase() || null,
      oranje_stage: cleanText(formData.get("oranje_stage"), 20) || null,
      post_group_updated_at: canEditPostGroup ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from("special_predictions").upsert(special);
    if (error) throw new Error(error.message);

    if (champion) {
      const { error: championError } = await supabase.from("bracket_predictions").upsert({
        user_id: user.id,
        stage_key: "champion",
        team_codes: [champion],
      });
      if (championError) throw new Error(championError.message);
    }
  }

  revalidatePath("/voorspellingen");
  revalidatePath("/");
  redirect("/voorspellingen?opgeslagen=1");
}
