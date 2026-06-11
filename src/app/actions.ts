"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { isAvatarKey } from "@/lib/avatars";
import { ENTRY_DEADLINE, ENTRY_GRACE_DEADLINE, POST_GROUP_DEADLINE, POST_GROUP_WINDOW_START, isMatchLocked } from "@/lib/constants";
import { clampInt } from "@/lib/format";
import { calculateRound32, type ScoreLookup } from "@/lib/group-standings";
import { LOCALE_COOKIE, isSupportedLocale, localizedHref, type Locale } from "@/lib/i18n";
import { kidEmail } from "@/lib/kid";
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, POOL_NAME_MAX_LENGTH, POOL_NAME_MIN_LENGTH, TEAM_NAME_MAX_LENGTH, TEAM_NAME_MIN_LENGTH } from "@/lib/limits";
import { logError } from "@/lib/log";
import { rateLimit } from "@/lib/rate-limit";
import { recalculateAllScores } from "@/lib/recalculate";
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

function optionalInt(value: FormDataEntryValue | null, min = 0, max = 20) {
  const raw = String(value ?? "").trim();
  if (raw === "") return null;
  return clampInt(raw, min, min, max);
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

function isUniqueViolation(error: { code?: string; message?: string } | null | undefined, indexName: string) {
  const message = error?.message?.toLowerCase() ?? "";
  return error?.code === "23505" || message.includes(indexName.toLowerCase()) || message.includes("duplicate key");
}

export async function saveProfile(formData: FormData) {
  const { supabase, user } = await requireUser();
  const admin = createAdminClient();
  const nickname = cleanText(formData.get("nickname"), NICKNAME_MAX_LENGTH);
  const teamName = cleanText(formData.get("team_name"), TEAM_NAME_MAX_LENGTH);
  const termsAccepted = formData.get("terms_accepted") === "yes";
  const avatarKey = cleanText(formData.get("avatar_key"), 64);

  if (!termsAccepted) {
    redirect("/?profiel=akkoord");
  }

  if (nickname.length < NICKNAME_MIN_LENGTH || teamName.length < TEAM_NAME_MIN_LENGTH) {
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

  const acceptedAt = new Date().toISOString();
  const profilePayload = {
    id: user.id,
    nickname,
    team_name: teamName,
    avatar_key: isAvatarKey(avatarKey) ? avatarKey : null,
    terms_accepted_at: acceptedAt,
    privacy_accepted_at: acceptedAt,
  };
  const { error } = await supabase.from("profiles").upsert(profilePayload);

  if (error) {
    if (isUniqueViolation(error, "profiles_nickname_unique_lower")) redirect("/?profiel=bezet");
    const missingLegalColumns = error.message.includes("terms_accepted_at") || error.message.includes("privacy_accepted_at");
    if (!missingLegalColumns) throw new Error(error.message);

    const { error: fallbackError } = await supabase.from("profiles").upsert({
      id: user.id,
      nickname,
      team_name: teamName,
      avatar_key: isAvatarKey(avatarKey) ? avatarKey : null,
    });
    if (fallbackError) throw new Error(fallbackError.message);
  }
  revalidatePath("/");
  redirect("/");
}

export async function updateAccount(formData: FormData) {
  const { supabase, user } = await requireUser();
  const payload: {
    nickname?: string;
    team_name?: string;
    avatar_key?: string | null;
    preferred_locale?: "nl" | "en";
  } = {};
  const avatarKey = cleanText(formData.get("avatar_key"), 64);
  const preferredLocale = cleanText(formData.get("preferred_locale"), 8);
  const hasNickname = formData.has("nickname");
  const hasTeamName = formData.has("team_name");
  const nickname = hasNickname ? cleanText(formData.get("nickname"), NICKNAME_MAX_LENGTH) : "";
  const teamName = hasTeamName ? cleanText(formData.get("team_name"), TEAM_NAME_MAX_LENGTH) : "";
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const redirectLocale: Locale = isSupportedLocale(preferredLocale)
    ? preferredLocale
    : isSupportedLocale(cookieLocale)
      ? cookieLocale
      : "nl";

  if (hasNickname) {
    if (nickname.length < NICKNAME_MIN_LENGTH) {
      redirect(`${localizedHref("/account", redirectLocale)}?fout=te-kort`);
    }
    if (reservedNames.includes(nickname.toLowerCase())) {
      redirect(`${localizedHref("/account", redirectLocale)}?fout=gereserveerd`);
    }
    payload.nickname = nickname;
  }
  if (hasTeamName) {
    if (teamName.length < TEAM_NAME_MIN_LENGTH) {
      redirect(`${localizedHref("/account", redirectLocale)}?fout=te-kort`);
    }
    payload.team_name = teamName;
  }

  // Avatar, teamnaam en taalvoorkeur mag de speler zelf aanpassen; de SlimeScore naam blijft vast na signup.
  if (formData.has("avatar_key")) {
    payload.avatar_key = isAvatarKey(avatarKey) ? avatarKey : null;
  }
  if (isSupportedLocale(preferredLocale)) {
    payload.preferred_locale = preferredLocale;
  }

  if (payload.nickname) {
    const admin = createAdminClient();
    const { data: taken } = await admin
      .from("profiles")
      .select("id")
      .ilike("nickname", payload.nickname)
      .neq("id", user.id)
      .maybeSingle();
    if (taken) redirect(`${localizedHref("/account", redirectLocale)}?fout=bezet`);
  }

  if (Object.keys(payload).length) {
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...payload });
    if (isUniqueViolation(error, "profiles_nickname_unique_lower")) redirect(`${localizedHref("/account", redirectLocale)}?fout=bezet`);
    if (error) throw new Error(error.message);
  }

  if (payload.preferred_locale) {
    cookieStore.set(LOCALE_COOKIE, preferredLocale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }

  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/account");
  revalidatePath("/ranglijst");
  revalidatePath("/poules");
  const savedKind = payload.preferred_locale ? "taal" : hasTeamName ? "profiel" : formData.has("avatar_key") ? "avatar" : "profiel";
  redirect(`${localizedHref("/account", redirectLocale)}?opgeslagen=${savedKind}`);
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

export async function adminSetResult(formData: FormData) {
  const { user } = await requireAdmin();

  const admin = createAdminClient();
  // Ruime limiet: admins voeren legitiem veel uitslagen achter elkaar in.
  if (!(await rateLimit(admin, `admin_setresult:${user.id}`, 120, 60))) redirect("/admin?fout=te-snel");
  const matchId = Number.parseInt(String(formData.get("match_id") ?? ""), 10);
  if (!Number.isFinite(matchId)) redirect("/admin?fout=match");
  const homeScore = clampInt(formData.get("home_score"), 0, 0, 50);
  const awayScore = clampInt(formData.get("away_score"), 0, 0, 50);
  const finished = formData.get("finished") === "on";

  const { error } = await admin
    .from("matches")
    .update({ home_score: homeScore, away_score: awayScore, status: finished ? "finished" : "scheduled" })
    .eq("id", matchId);
  if (error) {
    logError("adminSetResult.update", error, { matchId });
    redirect("/admin?fout=opslaan");
  }

  await admin.from("admin_audit_log").insert({
    actor_email: user.email,
    action: "set_result",
    detail: { match_id: matchId, home_score: homeScore, away_score: awayScore, finished },
  });

  const recalc = await recalculateAllScores(admin);
  if ("error" in recalc) logError("adminSetResult.recalc", recalc.error, { matchId });

  revalidatePath("/admin");
  revalidatePath("/ranglijst");
  revalidatePath("/");
  redirect("/admin?ok=1");
}

function kidCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  return Array.from(bytes)
    .slice(0, 8)
    .map((byte) => alphabet[byte % alphabet.length])
    .join("");
}

export async function createKidAccount(formData: FormData) {
  const { user } = await requireAdmin();

  const admin = createAdminClient();
  if (!(await rateLimit(admin, `admin_kid:${user.id}`, 30, 60))) redirect("/admin?fout=te-snel");
  const nickname = cleanText(formData.get("nickname"), NICKNAME_MAX_LENGTH);
  if (nickname.length < 2) redirect("/admin?fout=kind-naam");

  // Eigen code mag, anders automatisch genereren. Code is hoofdletter-ongevoelig.
  const customCode = cleanText(formData.get("code"), 16).replace(/[^A-Za-z0-9]/g, "");
  // Codes zijn bearer-secrets (de code = wachtwoord). Minimaal 8 tekens tegen raden/brute-force.
  if (customCode && customCode.length < 8) redirect("/admin?fout=kind-code");
  const candidates = customCode ? [customCode] : Array.from({ length: 5 }, () => kidCode());

  for (const code of candidates) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email: kidEmail(code),
      password: code.toLowerCase(),
      email_confirm: true,
      user_metadata: { kid: true },
    });
    if (error || !created?.user) {
      if (customCode) {
        logError("createKidAccount.custom", error ?? "geen gebruiker");
        redirect("/admin?fout=kind-code");
      }
      continue;
    }
    const uid = created.user.id;
    // Leeg profiel → het kind kiest zelf naam + teamnaam bij de eerste login.
    await admin.from("profiles").upsert({ id: uid });
    await admin.from("kid_accounts").insert({ user_id: uid, code, nickname, created_by: user.email });
    await admin.from("admin_audit_log").insert({
      actor_email: user.email,
      action: "create_kid",
      detail: { nickname, code },
    });
    revalidatePath("/admin");
    redirect(`/admin?kind=${code}`);
  }
  redirect("/admin?fout=kind");
}

export async function adminRecalculate() {
  const { user } = await requireAdmin();

  const admin = createAdminClient();
  // Zware operatie (herrekent alle ranglijsten): krappe limiet tegen dubbelklik/spam.
  if (!(await rateLimit(admin, `admin_recalc:${user.id}`, 10, 60))) redirect("/admin?fout=te-snel");
  const recalc = await recalculateAllScores(admin);
  await admin.from("admin_audit_log").insert({
    actor_email: user.email,
    action: "recalculate",
    detail: "error" in recalc ? { error: recalc.error } : { users: recalc.recalculatedUsers },
  });
  revalidatePath("/admin");
  revalidatePath("/ranglijst");
  redirect("/admin?ok=1");
}

export async function createPool(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const name = cleanText(formData.get("name"), POOL_NAME_MAX_LENGTH);

  if (name.length < POOL_NAME_MIN_LENGTH) redirect("/poules?fout=naam");

  const { data: existingPoolName } = await admin
    .from("pools")
    .select("id")
    .ilike("name", name)
    .maybeSingle();
  if (existingPoolName) redirect("/poules?fout=naam-bezet");

  // Rate limit: max 5 nieuwe poules per 10 minuten per gebruiker.
  if (!(await rateLimit(admin, `pool_create:${user.id}`, 5, 600))) redirect("/poules?fout=te-snel");

  // Anti-misbruik: maximaal aantal eigen poules per gebruiker.
  const { count: ownedCount } = await admin
    .from("pools")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id);
  if ((ownedCount ?? 0) >= 20) redirect("/poules?fout=limiet");

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
      redirect(`/poules?aangemaakt=${code}&pool=${data.id}`);
    }

    if (isUniqueViolation(error, "pools_name_unique_lower")) redirect("/poules?fout=naam-bezet");

    code = poolCode();
  }

  throw new Error("Kon geen unieke poulecode maken.");
}

export async function joinPool(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const code = cleanText(formData.get("code"), 10).toUpperCase();

  // Rate limit: max 15 join-pogingen per 10 min (tegen het raden van codes).
  if (!(await rateLimit(admin, `pool_join:${user.id}`, 15, 600))) redirect("/poules?fout=te-snel");

  // Zachte limiet: aan maximaal 20 WK-poules tegelijk meedoen (tegen datavervuiling).
  const { count: joinedCount } = await admin
    .from("pool_members")
    .select("pool_id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if ((joinedCount ?? 0) >= 20) redirect("/poules?fout=limiet");

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

export async function resetPoolCode(formData: FormData) {
  const { user } = await requireUser();
  const admin = createAdminClient();
  const poolId = cleanText(formData.get("pool_id"), 60);

  const { data: pool } = await admin.from("pools").select("owner_id").eq("id", poolId).maybeSingle();
  if (!pool || pool.owner_id !== user.id) redirect("/poules?fout=rechten");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = poolCode();
    const { error } = await admin.from("pools").update({ code }).eq("id", poolId);
    if (!error) {
      revalidatePath("/poules");
      redirect(`/poules?aangemaakt=${code}`);
    }
  }
  throw new Error("Kon geen nieuwe poulecode maken.");
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

  // Anti-spam: max 5 berichten per minuut per gebruiker per poule.
  if (!(await rateLimit(admin, `pool_msg:${user.id}:${poolId}`, 5, 60))) redirect("/poules?fout=te-snel");

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
const POOL_BANNER_MAX_WIDTH = 1600;
const POOL_BANNER_MAX_HEIGHT = 900;

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

  const { data: poolBefore } = await admin.from("pools").select("banner_path").eq("id", poolId).maybeSingle();
  const oldBannerPath = typeof poolBefore?.banner_path === "string" ? poolBefore.banner_path : null;

  // Auto-conversie: bewaar de originele verhouding binnen een ruime banner-limiet.
  // Geen crop, geen uitrekken: banners met tekst/logo's moeten zoveel mogelijk zichtbaar blijven.
  const sharp = (await import("sharp")).default;
  const input = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(input)
    .rotate()
    .resize({
      width: POOL_BANNER_MAX_WIDTH,
      height: POOL_BANNER_MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  await admin.storage.createBucket(POOL_MEDIA_BUCKET, { public: true }).catch(() => null);
  const bannerVersion = Date.now().toString(36);
  const bannerPath = `pools/${poolId}-${bannerVersion}.webp`;
  const { error } = await admin.storage
    .from(POOL_MEDIA_BUCKET)
    .upload(bannerPath, webp, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);

  const bannerUpdatedAt = new Date().toISOString();
  const { error: updateError } = await admin
    .from("pools")
    .update({ banner_path: bannerPath, banner_updated_at: bannerUpdatedAt })
    .eq("id", poolId);
  if (updateError) throw new Error(updateError.message);

  if (oldBannerPath && oldBannerPath !== bannerPath) {
    await admin.storage.from(POOL_MEDIA_BUCKET).remove([oldBannerPath]).catch(() => null);
  }

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
  const canEditPreKickoffBonus = now < ENTRY_DEADLINE;
  const canEditMain = now < ENTRY_GRACE_DEADLINE;
  // Wereldkampioen, finalisten, penaltyseries en "hoe ver komt Oranje" blijven
  // wijzigbaar t/m 28 juni 21:00 (niet pas óp 28 juni).
  const canEditLate = now < POST_GROUP_DEADLINE;

  const { data: matches, error: matchError } = await supabase
    .from("matches")
    .select("id,group_letter,home_code,away_code,starts_at")
    .eq("stage", "group");
  if (matchError) throw new Error(matchError.message);

  if (canEditMain) {
    const predictionRows: {
      user_id: string;
      match_id: number;
      home_score: number;
      away_score: number;
    }[] = [];

    for (const match of matches ?? []) {
      // Elke wedstrijd sluit 30 min vóór de aftrap; gestarte/gespeelde wedstrijden
      // negeren we (geen wijziging, geen nieuwe invoer → late invullers missen die punten).
      if (isMatchLocked(match.starts_at, now)) continue;
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
    }

    if (predictionRows.length) {
      const { error } = await supabase.from("predictions").upsert(predictionRows);
      if (error) {
        logError("savePredictions.upsert", error, { userId: user.id, rows: predictionRows.length });
        throw new Error(error.message);
      }
    }

    // Laatste 32 uit de VOLLEDIGE set opgeslagen voorspellingen (incl. eerder
    // ingevulde/vergrendelde wedstrijden), zodat partiële invoer de bracket niet wist.
    const { data: allPredictions } = await supabase
      .from("predictions")
      .select("match_id,home_score,away_score")
      .eq("user_id", user.id);
    const scoreLookup: ScoreLookup = new Map();
    for (const prediction of allPredictions ?? []) {
      if (prediction.home_score !== null && prediction.away_score !== null) {
        scoreLookup.set(prediction.match_id, { home: prediction.home_score, away: prediction.away_score });
      }
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

  if (canEditMain || canEditLate) {
    // Upsert raakt alleen de meegegeven kolommen; gesloten velden laten we weg
    // zodat ze niet worden overschreven.
    const special: Record<string, unknown> = { user_id: user.id };

    if (canEditPreKickoffBonus) {
      // Vooraf vast te leggen bonusvragen (sluiten bij de aftrap).
      special.total_goals = optionalInt(formData.get("total_goals"), 100, 400);
      special.total_red_cards = optionalInt(formData.get("total_red_cards"), 0, 50);
      special.fastest_goal_minute = optionalInt(formData.get("fastest_goal_minute"), 1, 120);
      special.team_most_goals_code = cleanText(formData.get("team_most_goals_code"), 3).toUpperCase() || null;
    }

    let champion: string | null = null;
    let finalists: string[] = [];
    if (canEditLate) {
      // Wijzigbaar t/m 28 juni 21:00.
      champion = cleanText(formData.get("champion_code"), 3).toUpperCase() || null;
      finalists = Array.from(new Set(formData.getAll("finalists").map(String).filter(Boolean))).slice(0, 2);
      special.champion_code = champion;
      special.finalists = finalists;
      special.penalty_shootouts_ko = optionalInt(formData.get("penalty_shootouts_ko"), 0, 20);
      special.own_goals_ko = null;
      special.cards_ko_team_code = cleanText(formData.get("cards_ko_team_code"), 3).toUpperCase() || null;
      special.oranje_stage = cleanText(formData.get("oranje_stage"), 16) || null;
      special.post_group_updated_at = now >= POST_GROUP_WINDOW_START ? new Date().toISOString() : null;
    }

    const { error } = await supabase.from("special_predictions").upsert(special);
    if (error) throw new Error(error.message);

    if (canEditLate) {
      const { error: finalistsError } = await supabase.from("bracket_predictions").upsert({
        user_id: user.id,
        stage_key: "finalists",
        team_codes: finalists,
      });
      if (finalistsError) throw new Error(finalistsError.message);

      const { error: championError } = await supabase.from("bracket_predictions").upsert({
        user_id: user.id,
        stage_key: "champion",
        team_codes: champion ? [champion] : [],
      });
      if (championError) throw new Error(championError.message);
    }
  }

  revalidatePath("/voorspellingen");
  revalidatePath("/");
  redirect("/voorspellingen?opgeslagen=1");
}

/**
 * Herberekent de laatste-32 (round32) uit ALLE opgeslagen groepsvoorspellingen
 * van de gebruiker en schrijft die weg. Gedeeld door de grote opslag en de autosave,
 * zodat de bracket altijd in sync blijft met losse score-wijzigingen.
 */
async function syncRound32(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<void> {
  const [{ data: matches }, { data: predictions }] = await Promise.all([
    supabase.from("matches").select("id,group_letter,home_code,away_code").eq("stage", "group"),
    supabase.from("predictions").select("match_id,home_score,away_score").eq("user_id", userId),
  ]);
  const scoreLookup: ScoreLookup = new Map();
  for (const prediction of predictions ?? []) {
    if (prediction.home_score !== null && prediction.away_score !== null) {
      scoreLookup.set(prediction.match_id, { home: prediction.home_score, away: prediction.away_score });
    }
  }
  const round32 = calculateRound32(matches ?? [], scoreLookup);
  await supabase.from("bracket_predictions").upsert({
    user_id: userId,
    stage_key: "round32",
    team_codes: round32,
  });
}

/**
 * Slaat één groepswedstrijd direct op (autosave vanuit het voorspelformulier).
 * Idempotent: upsert op PK (user_id, match_id). Her-checkt deadline + lock server-side
 * en houdt de round32-bracket bij. Geeft een status terug i.p.v. te redirecten,
 * zodat de client een "opgeslagen ✓"/"opnieuw"-indicator kan tonen.
 */
export async function autosavePrediction(input: {
  matchId: number;
  home: number;
  away: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase, user } = await requireUser();
  const now = new Date();
  if (now >= ENTRY_GRACE_DEADLINE) return { ok: false, error: "gesloten" };

  const matchId = Number(input?.matchId);
  if (!Number.isInteger(matchId)) return { ok: false, error: "match" };

  // Alleen bestaande, niet-vergrendelde groepswedstrijden mogen via autosave.
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id,stage,starts_at")
    .eq("id", matchId)
    .maybeSingle();
  if (matchError) return { ok: false, error: matchError.message };
  if (!match || match.stage !== "group") return { ok: false, error: "match" };
  if (isMatchLocked(match.starts_at, now)) return { ok: false, error: "vergrendeld" };

  const home = Math.trunc(Number(input?.home));
  const away = Math.trunc(Number(input?.away));
  if (!Number.isFinite(home) || !Number.isFinite(away) || home < 0 || home > 20 || away < 0 || away > 20) {
    return { ok: false, error: "ongeldig" };
  }

  const { error } = await supabase
    .from("predictions")
    .upsert({ user_id: user.id, match_id: matchId, home_score: home, away_score: away });
  if (error) {
    logError("autosavePrediction.upsert", error, { userId: user.id, matchId });
    return { ok: false, error: "opslaan" };
  }

  await syncRound32(supabase, user.id);
  return { ok: true };
}

/**
 * Autosave voor de knock-outkeuzes en bonusvragen. Spiegelt exact de niet-groep-logica
 * van savePredictions (zelfde deadline-gates en kolommen), maar zonder redirect en zonder
 * de round32-herberekening (die hangt aan de groepsscores en wordt door de
 * wedstrijd-autosave bijgehouden). De client stuurt de volledige FormData mee.
 */
export async function autosaveExtras(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase, user } = await requireUser();
  const now = new Date();
  const canEditPreKickoffBonus = now < ENTRY_DEADLINE;
  const canEditMain = now < ENTRY_GRACE_DEADLINE;
  const canEditLate = now < POST_GROUP_DEADLINE;

  try {
    if (canEditMain) {
      const stageKeys = ["round16", "quarterfinal", "semifinal"] as const;
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
        if (error) {
          logError("autosaveExtras.bracket", error, { userId: user.id, stageKey });
          return { ok: false, error: "opslaan" };
        }
      }
    }

    if (canEditMain || canEditLate) {
      const special: Record<string, unknown> = { user_id: user.id };

      if (canEditPreKickoffBonus) {
        special.total_goals = optionalInt(formData.get("total_goals"), 100, 400);
        special.total_red_cards = optionalInt(formData.get("total_red_cards"), 0, 50);
        special.fastest_goal_minute = optionalInt(formData.get("fastest_goal_minute"), 1, 120);
        special.team_most_goals_code = cleanText(formData.get("team_most_goals_code"), 3).toUpperCase() || null;
      }

      let champion: string | null = null;
      let finalists: string[] = [];
      if (canEditLate) {
        champion = cleanText(formData.get("champion_code"), 3).toUpperCase() || null;
        finalists = Array.from(new Set(formData.getAll("finalists").map(String).filter(Boolean))).slice(0, 2);
        special.champion_code = champion;
        special.finalists = finalists;
        special.penalty_shootouts_ko = optionalInt(formData.get("penalty_shootouts_ko"), 0, 20);
        special.own_goals_ko = null;
        special.cards_ko_team_code = cleanText(formData.get("cards_ko_team_code"), 3).toUpperCase() || null;
        special.oranje_stage = cleanText(formData.get("oranje_stage"), 16) || null;
        special.post_group_updated_at = now >= POST_GROUP_WINDOW_START ? new Date().toISOString() : null;
      }

      const { error } = await supabase.from("special_predictions").upsert(special);
      if (error) {
        logError("autosaveExtras.special", error, { userId: user.id });
        return { ok: false, error: "opslaan" };
      }

      if (canEditLate) {
        const { error: finalistsError } = await supabase
          .from("bracket_predictions")
          .upsert({ user_id: user.id, stage_key: "finalists", team_codes: finalists });
        if (finalistsError) {
          logError("autosaveExtras.finalists", finalistsError, { userId: user.id });
          return { ok: false, error: "opslaan" };
        }
        const { error: championError } = await supabase
          .from("bracket_predictions")
          .upsert({ user_id: user.id, stage_key: "champion", team_codes: champion ? [champion] : [] });
        if (championError) {
          logError("autosaveExtras.champion", championError, { userId: user.id });
          return { ok: false, error: "opslaan" };
        }
      }
    }

    return { ok: true };
  } catch (error) {
    logError("autosaveExtras", error, { userId: user.id });
    return { ok: false, error: "opslaan" };
  }
}
