import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

// Leeshelpers voor het admin-dashboard. Alleen aanroepen NA requireAdmin()
// (of de equivalente paginaguard); dit bestand bewaakt zelf geen toegang.

export type AdminMatchRow = {
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

export type AdminAuditRow = { id: number; actor_email: string | null; action: string; detail: unknown; created_at: string };
export type AdminKidRow = { user_id: string; code: string; nickname: string | null; created_at: string };
export type AdminProfileRow = { id: string; nickname: string | null; team_name: string | null; created_at: string };
export type AdminPoolRow = { id: string; name: string; created_at: string };

export async function getAdminDashboard() {
  const admin = createAdminClient();
  const [
    { count: userCount },
    { count: predictionCount },
    { count: poolCount },
    { data: lastScore },
    { data: matches },
    { data: audit },
    { data: kids },
    { data: recentProfiles },
    { data: recentPools },
    { data: poolMembers },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("predictions").select("user_id", { count: "exact", head: true }),
    admin.from("pools").select("id", { count: "exact", head: true }),
    admin.from("scores").select("updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    admin
      .from("matches")
      .select("id,starts_at,group_letter,status,home_score,away_score,home_code,away_code,home_label,away_label,home:teams!matches_home_code_fkey(name_nl),away:teams!matches_away_code_fkey(name_nl)")
      .order("starts_at")
      .limit(120),
    admin.from("admin_audit_log").select("id,actor_email,action,detail,created_at").order("created_at", { ascending: false }).limit(15),
    admin.from("kid_accounts").select("user_id,code,nickname,created_at").order("created_at", { ascending: false }),
    admin.from("profiles").select("id,nickname,team_name,created_at").order("created_at", { ascending: false }).limit(20),
    admin.from("pools").select("id,name,created_at").order("created_at", { ascending: false }).limit(20),
    admin.from("pool_members").select("pool_id"),
  ]);

  const membersByPool = new Map<string, number>();
  for (const member of (poolMembers ?? []) as { pool_id: string }[]) {
    membersByPool.set(member.pool_id, (membersByPool.get(member.pool_id) ?? 0) + 1);
  }

  return {
    userCount: userCount ?? 0,
    predictionCount: predictionCount ?? 0,
    poolCount: poolCount ?? 0,
    lastUpdate: (lastScore as { updated_at: string | null } | null)?.updated_at ?? null,
    matchRows: (matches ?? []) as unknown as AdminMatchRow[],
    auditRows: (audit ?? []) as unknown as AdminAuditRow[],
    kidRows: (kids ?? []) as unknown as AdminKidRow[],
    profileRows: (recentProfiles ?? []) as unknown as AdminProfileRow[],
    poolRows: (recentPools ?? []) as unknown as AdminPoolRow[],
    membersByPool,
  };
}
