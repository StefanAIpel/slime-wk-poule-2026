"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAvatarKey } from "@/lib/avatars";
import { ENTRY_DEADLINE, POST_GROUP_DEADLINE, POST_GROUP_WINDOW_START } from "@/lib/constants";
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

  if (nickname.length < 4 || teamName.length < 4) {
    redirect("/?profiel=te-kort");
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

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    nickname,
    team_name: teamName,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/");
}

export async function updateAccount(formData: FormData) {
  const { supabase, user } = await requireUser();
  const admin = createAdminClient();
  const nickname = cleanText(formData.get("nickname"), 24);
  const teamName = cleanText(formData.get("team_name"), 28);
  const avatarKeyRaw = cleanText(formData.get("avatar_key"), 40);
  const avatarKey = isAvatarKey(avatarKeyRaw) ? avatarKeyRaw : null;

  if (nickname.length < 4 || teamName.length < 4) {
    redirect("/account?fout=te-kort");
  }
  if (reservedNames.includes(nickname.toLowerCase())) {
    redirect("/account?fout=gereserveerd");
  }

  const { data: taken } = await admin
    .from("profiles")
    .select("id")
    .ilike("nickname", nickname)
    .neq("id", user.id)
    .maybeSingle();
  if (taken) {
    redirect("/account?fout=bezet");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ nickname, team_name: teamName, avatar_key: avatarKey })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/account");
  revalidatePath("/");
  redirect("/account?opgeslagen=1");
}

export async function deleteAccount(formData: FormData) {
  const { supabase, user } = await requireUser();
  const confirm = cleanText(formData.get("confirm"), 20).toUpperCase();
  if (confirm !== "VERWIJDER") {
    redirect("/account?fout=bevestig");
  }

  const admin = createAdminClient();
  // Profiel weg cascadeert alle poule-/voorspel-/scoredata; daarna het account zelf.
  const { error: profileError } = await admin.from("profiles").delete().eq("id", user.id);
  if (profileError) throw new Error(profileError.message);

  const { error: authError } = await admin.auth.admin.deleteUser(user.id);
  if (authError) throw new Error(authError.message);

  await supabase.auth.signOut();
  redirect("/?verwijderd=1");
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
  const wantsPin = formData.get("pinned") === "on";

  if (body.length < 10) redirect("/poules?fout=bericht-kort");

  const { data: membership } = await admin
    .from("pool_members")
    .select("role")
    .eq("pool_id", poolId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) redirect("/poules?fout=rechten");

  // Anti-spam: maximaal 1 bericht per 15 seconden per gebruiker per poule.
  const { data: last } = await admin
    .from("pool_messages")
    .select("created_at")
    .eq("pool_id", poolId)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last && Date.now() - new Date(last.created_at).getTime() < 15000) {
    redirect("/poules?fout=te-snel");
  }

  const isManager = membership.role === "owner" || membership.role === "moderator";

  const { error } = await admin.from("pool_messages").insert({
    pool_id: poolId,
    author_id: user.id,
    body,
    pinned: wantsPin && isManager,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/poules");
  redirect("/poules?bericht=geplaatst");
}

export async function deletePoolMessage(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const poolId = cleanText(formData.get("pool_id"), 60);
  const messageId = cleanText(formData.get("message_id"), 60);

  const [{ data: membership }, { data: message }] = await Promise.all([
    admin.from("pool_members").select("role").eq("pool_id", poolId).eq("user_id", user.id).maybeSingle(),
    admin.from("pool_messages").select("author_id").eq("id", messageId).maybeSingle(),
  ]);

  const isManager = membership?.role === "owner" || membership?.role === "moderator";
  const isAuthor = message?.author_id === user.id;
  if (!isManager && !isAuthor) redirect("/poules?fout=rechten");

  const { error } = await admin.from("pool_messages").delete().eq("id", messageId).eq("pool_id", poolId);
  if (error) throw new Error(error.message);
  revalidatePath("/poules");
  redirect("/poules?bijgewerkt=1");
}

const POOL_MEDIA_BUCKET = "pool-media";

export async function uploadPoolImage(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const poolId = cleanText(formData.get("pool_id"), 60);
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) redirect("/poules?fout=afbeelding");
  if (!file.type.startsWith("image/")) redirect("/poules?fout=afbeelding");
  if (file.size > 6 * 1024 * 1024) redirect("/poules?fout=afbeelding-groot");

  const { data: manager } = await admin
    .from("pool_members")
    .select("role")
    .eq("pool_id", poolId)
    .eq("user_id", user.id)
    .in("role", ["owner", "moderator"])
    .maybeSingle();
  if (!manager) redirect("/poules?fout=rechten");

  // Auto-conversie: schaal naar max 1600px en comprimeer naar WebP.
  const sharp = (await import("sharp")).default;
  const input = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(input)
    .rotate()
    .resize(1600, 900, { fit: "cover", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  await admin.storage.createBucket(POOL_MEDIA_BUCKET, { public: true }).catch(() => null);
  const { error } = await admin.storage
    .from(POOL_MEDIA_BUCKET)
    .upload(`pools/${poolId}.webp`, webp, { contentType: "image/webp", upsert: true });
  if (error) throw new Error(error.message);

  revalidatePath("/poules");
  redirect("/poules?bijgewerkt=1");
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
  const canEditPostGroup = now >= POST_GROUP_WINDOW_START && now < POST_GROUP_DEADLINE;

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
      const homeRaw = String(formData.get(`match_${match.id}_home`) ?? "").trim();
      const awayRaw = String(formData.get(`match_${match.id}_away`) ?? "").trim();
      if (homeRaw === "" || awayRaw === "") continue;
      const homeScore = clampInt(homeRaw, 0, 0, 20);
      const awayScore = clampInt(awayRaw, 0, 0, 20);
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
