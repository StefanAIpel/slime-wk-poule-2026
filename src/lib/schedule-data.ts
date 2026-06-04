import type { ScheduleMatch } from "@/components/schedule-explorer";
import { createOptionalAdminClient } from "@/lib/supabase/admin";
import type { MatchWithTeams } from "@/lib/types";

export async function getScheduleMatches(): Promise<ScheduleMatch[]> {
  const admin = createOptionalAdminClient();
  const { data } = admin
    ? await admin
        .from("matches")
        .select("*,home:teams!matches_home_code_fkey(*),away:teams!matches_away_code_fkey(*)")
        .order("id")
    : { data: [] };

  const matches = (data ?? []) as MatchWithTeams[];
  return matches.map((match) => ({
    id: match.id,
    stage: match.stage ?? null,
    group: match.group_letter ?? null,
    homeCode: match.home_code,
    homeName: match.home?.name_nl ?? null,
    homeLabel: match.home_label ?? null,
    awayCode: match.away_code,
    awayName: match.away?.name_nl ?? null,
    awayLabel: match.away_label ?? null,
    startsAt: match.starts_at ?? null,
    venue: match.venue ?? null,
    status: match.status ?? "scheduled",
    homeScore: match.home_score ?? null,
    awayScore: match.away_score ?? null,
    winnerCode: match.winner_code ?? null,
  }));
}
