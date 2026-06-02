import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { TeamFlag } from "@/components/team-flag";
import { groupLetters } from "@/lib/constants";
import { formatAmsterdam } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MatchWithTeams } from "@/lib/types";

export const revalidate = 3600;

export default async function SchedulePage() {
  const admin = createAdminClient();
  const { data: matches } = await admin
    .from("matches")
    .select("*,home:teams!matches_home_code_fkey(*),away:teams!matches_away_code_fkey(*)")
    .order("id");

  const groupedMatches = groupBy((matches ?? []) as MatchWithTeams[], (match) => match.group_letter ?? "Knock-out");

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero
          title="Groepsfase"
          subtitle="Alle wedstrijden die je voorspelt, met Nederlandse tijden en speelsteden."
        />
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="dark-panel p-4 text-white">
          <CalendarDays aria-hidden="true" className="mb-3 size-7 text-[#ffd44d]" />
          <div className="text-3xl font-black">{matches?.length ?? 0}</div>
          <div className="mt-1 text-sm font-bold text-blue-100">groepswedstrijden in de app</div>
        </div>
        <div className="dark-panel p-4 text-white">
          <Trophy aria-hidden="true" className="mb-3 size-7 text-[#ffd44d]" />
          <div className="text-3xl font-black">12</div>
          <div className="mt-1 text-sm font-bold text-blue-100">groepen van vier landen</div>
        </div>
        <a className="dark-panel p-4 text-white no-underline" href="/voorspellingen">
          <div className="text-sm font-semibold uppercase text-[#ffd44d]">Scorekaart</div>
          <div className="mt-1 text-2xl font-black">Voorspellen</div>
          <div className="mt-1 text-sm font-bold text-blue-100">Log in en vul direct je uitslagen in.</div>
        </a>
      </section>

      <section className="mt-5 grid gap-4">
        {groupLetters.map((group) => {
          const groupMatches = groupedMatches.get(group);
          if (!groupMatches?.length) return null;
          return (
            <article key={group} className="panel overflow-hidden">
              <div className="wc-header px-4 py-3 text-white">
                <h2 className="text-xl font-black">Groep {group}</h2>
              </div>
              <div className="divide-y divide-slate-200">
                {groupMatches.map((match) => (
                  <div key={match.id} className="grid gap-2 p-4 md:grid-cols-[70px_1fr_auto] md:items-center">
                    <div className="text-sm font-black text-[#0866e8]">#{match.id}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-lg font-black text-[#081634]">
                        <TeamFlag code={match.home_code} name={match.home?.name_nl} />
                        <span>{match.home?.name_nl ?? match.home_code}</span>
                        <span className="text-[#48617f]">-</span>
                        <TeamFlag code={match.away_code} name={match.away?.name_nl} />
                        {match.away?.name_nl ?? match.away_code}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold text-[#48617f]">
                        <CalendarDays aria-hidden="true" className="size-4" />
                        {formatAmsterdam(match.starts_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#48617f]">
                      <MapPin aria-hidden="true" className="size-4" />
                      {match.venue}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <BottomNav current="/schema" showPrivate={false} />
    </main>
  );
}

function groupBy<T>(items: T[], keyFn: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return map;
}
