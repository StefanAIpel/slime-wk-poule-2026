import "server-only";

import { requireAdmin } from "@/lib/admin-guard";
import { predictionCompletion, type PredictionCompletion } from "@/lib/prediction-progress";
import type { SiteMessageRow } from "@/lib/site-messages";
import { createAdminClient } from "@/lib/supabase/admin";

// Leeshelpers voor het admin-dashboard. getAdminDashboard() dwingt zelf de
// admin-guard af (defense in depth): dit bestand hanteert de service-role en
// levert o.a. kid-logincodes, dus een vergeten paginaguard mag nooit genoeg zijn.

type MatchRow = {
  id: number;
  starts_at: string | null;
  group_letter: string | null;
  status: string | null;
  home_score: number | null;
  away_score: number | null;
  home_code: string | null;
  away_code: string | null;
  home_label: string | null;
  away_label: string | null;
  home: { name_nl: string | null } | null;
  away: { name_nl: string | null } | null;
};

type AuditRow = { id: number; actor_email: string | null; action: string; detail: unknown; created_at: string };
type KidRow = { user_id: string; code: string; nickname: string | null; created_at: string };
type ProfileRow = { id: string; nickname: string | null; team_name: string | null; created_at: string };
type PoolRow = { id: string; name: string; created_at: string; pool_members: { count: number }[] };
type CompletionRow = {
  user_id: string;
  nickname: string | null;
  team_name: string | null;
  group_filled: number;
  knockout_filled: number;
  bonus_filled: number;
  pool_count: number;
};
export type CompletionEntry = {
  userId: string;
  nickname: string | null;
  teamName: string | null;
  poolCount: number;
  completion: PredictionCompletion;
};

export async function getAdminDashboard() {
  await requireAdmin();
  const admin = createAdminClient();
  const [
    { count: userCount },
    { count: predictionCount },
    { count: poolCount },
    { count: bracketCount },
    { count: specialCount },
    { count: scoreCount },
    { count: profilesMissingNames },
    { count: finishedWithoutResult },
    { data: lastScore },
    { data: matches },
    { data: audit },
    { data: kids },
    { data: recentProfiles },
    { data: recentPools },
    { data: siteMessages },
    { data: completion },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("predictions").select("user_id", { count: "exact", head: true }),
    admin.from("pools").select("id", { count: "exact", head: true }),
    admin.from("bracket_predictions").select("user_id", { count: "exact", head: true }),
    admin.from("special_predictions").select("user_id", { count: "exact", head: true }),
    admin.from("scores").select("user_id", { count: "exact", head: true }),
    // Anomalieën (read-only, alleen tellen): onvolledige profielen en gespeelde
    // wedstrijden zonder uitslag — handig om snel datagaten te spotten.
    admin.from("profiles").select("id", { count: "exact", head: true }).or("nickname.is.null,team_name.is.null"),
    admin.from("matches").select("id", { count: "exact", head: true }).eq("status", "finished").or("home_score.is.null,away_score.is.null"),
    admin.from("scores").select("updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    admin
      .from("matches")
      .select("id,starts_at,group_letter,status,home_score,away_score,home_code,away_code,home_label,away_label,home:teams!matches_home_code_fkey(name_nl),away:teams!matches_away_code_fkey(name_nl)")
      .order("starts_at")
      .limit(120),
    admin.from("admin_audit_log").select("id,actor_email,action,detail,created_at").order("created_at", { ascending: false }).limit(15),
    admin.from("kid_accounts").select("user_id,code,nickname,created_at").order("created_at", { ascending: false }),
    admin.from("profiles").select("id,nickname,team_name,created_at").order("created_at", { ascending: false }).limit(20),
    // Ledenaantal als server-side aggregate (geteld in Postgres), niet als
    // full-table-fetch: die zou stil afkappen op de PostgREST max-rows-cap.
    admin.from("pools").select("id,name,created_at,pool_members(count)").order("created_at", { ascending: false }).limit(20),
    admin.from("site_messages").select("placement,body_nl,body_en,show_from,show_until").order("placement"),
    // Per-speler invulvoortgang (server-side aggregate-view): minst-ingevuld eerst,
    // zodat je snel ziet wie nog moet aanvullen. Cap op 50 voor een overzichtelijk paneel.
    admin
      .from("prediction_completion")
      .select("user_id,nickname,team_name,group_filled,knockout_filled,bonus_filled,pool_count")
      .order("group_filled", { ascending: true })
      .order("knockout_filled", { ascending: true })
      .limit(50),
  ]);

  const completionRows = ((completion ?? []) as unknown as CompletionRow[]).map((row) => ({
    userId: row.user_id,
    nickname: row.nickname,
    teamName: row.team_name,
    poolCount: row.pool_count,
    completion: predictionCompletion({
      groupFilled: row.group_filled,
      knockoutFilled: row.knockout_filled,
      bonusFilled: row.bonus_filled,
    }),
  })) satisfies CompletionEntry[];

  const poolRows = ((recentPools ?? []) as unknown as PoolRow[]).map((pool) => ({
    id: pool.id,
    name: pool.name,
    created_at: pool.created_at,
    memberCount: pool.pool_members?.[0]?.count ?? 0,
  }));

  const users = userCount ?? 0;
  const scores = scoreCount ?? 0;

  return {
    userCount: users,
    predictionCount: predictionCount ?? 0,
    poolCount: poolCount ?? 0,
    bracketCount: bracketCount ?? 0,
    specialCount: specialCount ?? 0,
    scoreCount: scores,
    // FK garandeert scores.user_id ⊆ profiles.id, dus dit is exact (geen anti-join nodig).
    anomalies: {
      profilesWithoutScore: Math.max(0, users - scores),
      profilesMissingNames: profilesMissingNames ?? 0,
      finishedWithoutResult: finishedWithoutResult ?? 0,
    },
    lastUpdate: (lastScore as { updated_at: string | null } | null)?.updated_at ?? null,
    matchRows: (matches ?? []) as unknown as MatchRow[],
    auditRows: (audit ?? []) as unknown as AuditRow[],
    kidRows: (kids ?? []) as unknown as KidRow[],
    profileRows: (recentProfiles ?? []) as unknown as ProfileRow[],
    poolRows,
    siteMessageRows: (siteMessages ?? []) as unknown as SiteMessageRow[],
    completionRows,
  };
}
