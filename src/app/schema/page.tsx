import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ScheduleExplorer, type ScheduleMatch } from "@/components/schedule-explorer";
import { createOptionalAdminClient } from "@/lib/supabase/admin";
import type { MatchWithTeams } from "@/lib/types";

export const metadata: Metadata = {
  title: "WK 2026 speelschema — alle wedstrijden met Nederlandse tijden",
  description:
    "Compleet WK 2026 speelschema: alle wedstrijden, groepsstanden en de knock-out route t/m de finale op 19 juli — met de aftrap omgerekend naar Nederlandse tijd. Filter op groep, team of datum.",
  alternates: { canonical: "/schema" },
};

export const revalidate = 3600;

export default async function SchedulePage() {
  const admin = createOptionalAdminClient();
  const { data } = admin
    ? await admin
        .from("matches")
        .select("*,home:teams!matches_home_code_fkey(*),away:teams!matches_away_code_fkey(*)")
        .order("id")
    : { data: [] };

  const matches = (data ?? []) as MatchWithTeams[];
  const scheduleMatches: ScheduleMatch[] = matches.map((match) => ({
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

  return (
    <main className="page-shell">
      <header className="mb-5 grid gap-4">
        <Brand />
        <PageHero
          title="Speelschema"
          subtitle="Wedstrijden, groepsstanden en knock-out route in één mobiel overzicht — met Nederlandse tijden."
          slime="/assets/hd-schema-orange-transparent-640.webp"
          mascotClassName="hero-mascot-field hero-mascot-schema"
        />
      </header>

      <ScheduleExplorer matches={scheduleMatches} />

      <BottomNav current="/schema" className="bottom-nav-hide-mobile" />
    </main>
  );
}
