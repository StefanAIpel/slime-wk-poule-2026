import { ArrowLeft } from "lucide-react";
import { getFixtureById, getFixtureDetail, isLiveStatus, type LiveFixture, type MatchEvent, type TeamLineup, type TeamStatistics } from "@/lib/apifootball-live";

export const revalidate = 30;

function kickoff(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", { timeZone: "Europe/Amsterdam", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function MatchHeader({ fixture }: { fixture: LiveFixture }) {
  const played = isLiveStatus(fixture.statusShort) || ["FT", "AET", "PEN"].includes(fixture.statusShort);
  return (
    <section className="panel p-4">
      <p className="text-center text-xs font-bold uppercase tracking-wide text-[#48617f]">
        {fixture.round}{fixture.venue ? ` · ${fixture.venue}` : ""}
      </p>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="grid justify-items-center gap-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fixture.home.logo} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
          <span className="text-sm font-bold text-[#081634]">{fixture.home.name}</span>
        </div>
        <div className="grid justify-items-center">
          <span className="text-3xl font-black tabular-nums text-[#081634]">{played ? `${fixture.home.goals ?? 0}-${fixture.away.goals ?? 0}` : "–"}</span>
          <span className={isLiveStatus(fixture.statusShort) ? "live-row-status is-live mt-1" : "mt-1 text-xs font-bold text-[#48617f]"}>
            {isLiveStatus(fixture.statusShort) ? (fixture.statusShort === "HT" ? "Rust" : `${fixture.elapsed ?? ""}'`) : played ? "Afgelopen" : kickoff(fixture.date)}
          </span>
        </div>
        <div className="grid justify-items-center gap-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fixture.away.logo} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
          <span className="text-sm font-bold text-[#081634]">{fixture.away.name}</span>
        </div>
      </div>
    </section>
  );
}

function Events({ events }: { events: MatchEvent[] }) {
  if (!events.length) return null;
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[#081634]">Wedstrijdverloop</h2>
      <ul className="grid gap-2">
        {events.map((event, index) => (
          <li key={index} className="flex items-baseline gap-2 text-sm text-[#2f3d57]">
            <span className="w-9 flex-none font-bold tabular-nums text-[#48617f]">{`${event.time.elapsed ?? 0}${event.time.extra ? `+${event.time.extra}` : ""}'`}</span>
            <span className="font-bold text-[#081634]">{event.detail || event.type}</span>
            <span className="min-w-0">{[event.player.name, event.assist.name].filter(Boolean).join(" · ")} ({event.team.name})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Statistics({ stats }: { stats: TeamStatistics[] }) {
  if (stats.length < 2) return null;
  const [home, away] = stats;
  const value = (team: TeamStatistics, type: string) => team.statistics.find((s) => s.type === type)?.value ?? "–";
  const types = Array.from(new Set(home.statistics.map((s) => s.type)));
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[#081634]">Statistieken</h2>
      <div className="grid gap-2">
        {types.map((type) => (
          <div key={type} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 text-sm">
            <span className="text-left font-bold tabular-nums text-[#081634]">{String(value(home, type))}</span>
            <span className="text-center text-xs font-medium text-[#48617f]">{type}</span>
            <span className="text-right font-bold tabular-nums text-[#081634]">{String(value(away, type))}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Lineups({ lineups }: { lineups: TeamLineup[] }) {
  if (!lineups.length) return null;
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[#081634]">Opstellingen</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {lineups.map((team) => (
          <div key={team.team.id} className="grid gap-2">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={team.team.logo} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
              <span className="font-bold text-[#081634]">{team.team.name}</span>
              {team.formation ? <span className="text-xs font-bold text-[#48617f]">{team.formation}</span> : null}
            </div>
            <ul className="grid gap-1 text-sm text-[#2f3d57]">
              {team.startXI.map((p) => (
                <li key={p.player.id}><span className="inline-block w-6 font-bold tabular-nums text-[#48617f]">{p.player.number ?? ""}</span>{p.player.name}</li>
              ))}
            </ul>
            {team.coach.name ? <p className="text-xs font-medium text-[#48617f]">Coach: {team.coach.name}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function LiveMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fixtureId = Number(id);
  const [fixture, detail] = await Promise.all([getFixtureById(fixtureId), getFixtureDetail(fixtureId)]);

  return (
    <div className="grid gap-4">
      <a href="/live" className="inline-flex w-fit items-center gap-1 text-sm font-bold text-[#0866e8]">
        <ArrowLeft aria-hidden="true" className="size-4" /> Terug naar live
      </a>
      {fixture ? <MatchHeader fixture={fixture} /> : (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-[#8a5a00]">
          Deze wedstrijd kon niet geladen worden (of de live-koppeling is nog niet actief).
        </div>
      )}
      {detail.events?.length ? <Events events={detail.events} /> : null}
      {detail.statistics?.length ? <Statistics stats={detail.statistics} /> : null}
      {detail.lineups?.length ? <Lineups lineups={detail.lineups} /> : null}
      {fixture && !detail.events?.length && !detail.statistics?.length && !detail.lineups?.length ? (
        <p className="panel p-4 text-sm font-bold text-[#48617f]">Opstellingen en statistieken verschijnen rond de aftrap, zodra API-Football ze levert.</p>
      ) : null}
    </div>
  );
}
