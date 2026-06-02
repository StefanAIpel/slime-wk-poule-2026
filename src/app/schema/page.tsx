import { CalendarDays, Trophy } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ScheduleExplorer, type ScheduleMatch } from "@/components/schedule-explorer";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MatchWithTeams } from "@/lib/types";

export const revalidate = 3600;

export default async function SchedulePage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("matches")
    .select("*,home:teams!matches_home_code_fkey(*),away:teams!matches_away_code_fkey(*)")
    .order("id");

  const matches = (data ?? []) as MatchWithTeams[];
  const scheduleMatches: ScheduleMatch[] = matches.map((match) => ({
    id: match.id,
    group: match.group_letter ?? null,
    homeCode: match.home_code,
    homeName: match.home?.name_nl ?? null,
    awayCode: match.away_code,
    awayName: match.away?.name_nl ?? null,
    startsAt: match.starts_at ?? null,
    venue: match.venue ?? null,
  }));
  const groupCount = new Set(matches.map((m) => m.group_letter).filter(Boolean)).size;

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero
          title="Speelschema"
          subtitle="Filter op groep, team of datum en vind elke wedstrijd in seconden — met Nederlandse tijden."
        />
      </header>

      <section className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="dark-panel p-4 text-white">
          <CalendarDays aria-hidden="true" className="mb-3 size-7 text-[#ffd44d]" />
          <div className="text-3xl font-black">{matches.length}</div>
          <div className="mt-1 text-sm font-bold text-blue-100">wedstrijden in de app</div>
        </div>
        <div className="dark-panel p-4 text-white">
          <Trophy aria-hidden="true" className="mb-3 size-7 text-[#ffd44d]" />
          <div className="text-3xl font-black">{groupCount}</div>
          <div className="mt-1 text-sm font-bold text-blue-100">groepen van vier landen</div>
        </div>
        <a className="dark-panel p-4 text-white no-underline" href="/voorspellingen">
          <div className="text-sm font-semibold uppercase text-[#ffd44d]">Scorekaart</div>
          <div className="mt-1 text-2xl font-black">Voorspellen</div>
          <div className="mt-1 text-sm font-bold text-blue-100">Log in en vul direct je uitslagen in.</div>
        </a>
      </section>

      <ScheduleExplorer matches={scheduleMatches} />

      <BottomNav current="/schema" showPrivate={false} />
    </main>
  );
}
