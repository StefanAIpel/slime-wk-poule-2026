import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { formatAmsterdam } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { MatchWithTeams } from "@/lib/types";

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: matches } = await supabase
    .from("matches")
    .select("*,home:teams!matches_home_code_fkey(*),away:teams!matches_away_code_fkey(*)")
    .order("id");

  const groupedMatches = groupBy((matches ?? []) as MatchWithTeams[], (match) => match.group_letter ?? "Knock-out");

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4 md:max-w-3xl">
        <Brand />
        <div>
          <p className="mb-3 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-black text-[#ffd44d]">
            WK 2026 wedstrijdschema
          </p>
          <h1 className="text-4xl font-black leading-none text-white">Groepsfase</h1>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-blue-100">
            Alle groepswedstrijden die je in Slime Score voorspelt. De knock-outfase speel je met rondekeuzes,
            finalisten, kampioen en bonusvragen.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
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
          <div className="text-sm font-black uppercase text-[#ffd44d]">Scorekaart</div>
          <div className="mt-2 text-2xl font-black">Voorspellen</div>
          <div className="mt-1 text-sm font-bold text-blue-100">Log in en vul direct je uitslagen in.</div>
        </a>
      </section>

      <section className="mt-5 grid gap-4">
        {Array.from(groupedMatches.entries()).map(([group, groupMatches]) => (
          <article key={group} className="panel overflow-hidden">
            <div className="wc-header px-4 py-3 text-white">
              <h2 className="text-xl font-black">Groep {group}</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {groupMatches.map((match) => (
                <div key={match.id} className="grid gap-2 p-4 md:grid-cols-[90px_1fr_auto] md:items-center">
                  <div className="text-sm font-black text-[#0866e8]">#{match.id}</div>
                  <div>
                    <div className="text-lg font-black text-[#081634]">
                      {match.home?.name_nl ?? match.home_code} <span className="text-[#48617f]">-</span>{" "}
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
        ))}
      </section>

      <BottomNav current="/schema" />
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
