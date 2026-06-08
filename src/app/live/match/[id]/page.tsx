import { ArrowLeft } from "lucide-react";
import { TeamFlag } from "@/components/team-flag";
import { getFixtureById, getFixtureDetail, getHeadToHead, isLiveStatus, manOfTheMatch, type LiveFixture, type MatchEvent, type TeamLineup, type TeamPlayers, type TeamStatistics } from "@/lib/apifootball-live";
import { getServerLocale } from "@/lib/server-locale";
import type { Locale } from "@/lib/i18n";

export const revalidate = 30;

const copy = {
  nl: { back: "Terug naar live", finished: "Afgelopen", rest: "Rust", events: "Wedstrijdverloop", stats: "Statistieken", lineups: "Opstellingen", coach: "Coach", motm: "Man van de wedstrijd", h2h: "Onderlinge duels", notFound: "Deze wedstrijd kon niet geladen worden.", soon: "Opstellingen en statistieken verschijnen rond de aftrap." },
  en: { back: "Back to live", finished: "Finished", rest: "HT", events: "Match events", stats: "Statistics", lineups: "Line-ups", coach: "Coach", motm: "Player of the match", h2h: "Head-to-head", notFound: "This match could not be loaded.", soon: "Line-ups and statistics appear around kick-off." },
} as const;

function shortWhen(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", { timeZone: "Europe/Amsterdam", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function MatchHeader({ fixture, locale }: { fixture: LiveFixture; locale: Locale }) {
  const c = copy[locale];
  const live = isLiveStatus(fixture.statusShort);
  const played = live || ["FT", "AET", "PEN"].includes(fixture.statusShort);
  return (
    <section className="panel p-4">
      <p className="text-center text-xs font-bold uppercase tracking-wide text-[#48617f]">
        {fixture.round}{fixture.venue ? ` · ${fixture.venue}` : ""}
      </p>
      {/* Afgekorte datum gecentreerd (ook fijn op mobiel). */}
      <p className="mt-1 text-center text-sm font-bold text-[#081634]">{shortWhen(fixture.date, locale)}</p>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="grid justify-items-center gap-2 text-center">
          <TeamFlag code={fixture.home.code} name={fixture.home.name} size="md" locale={locale} />
          <span className="text-sm font-bold text-[#081634]">{fixture.home.name}</span>
        </div>
        <div className="grid justify-items-center">
          <span className="text-3xl font-black tabular-nums text-[#081634]">{played ? `${fixture.home.goals ?? 0}-${fixture.away.goals ?? 0}` : "–"}</span>
          <span className={live ? "live-row-status is-live mt-1" : "mt-1 text-xs font-bold text-[#48617f]"}>
            {live ? (fixture.statusShort === "HT" ? c.rest : `${fixture.elapsed ?? ""}'`) : played ? c.finished : ""}
          </span>
        </div>
        <div className="grid justify-items-center gap-2 text-center">
          <TeamFlag code={fixture.away.code} name={fixture.away.name} size="md" locale={locale} />
          <span className="text-sm font-bold text-[#081634]">{fixture.away.name}</span>
        </div>
      </div>
    </section>
  );
}

function Motm({ players, label }: { players: TeamPlayers[] | null; label: string }) {
  const best = manOfTheMatch(players);
  if (!best) return null;
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[#081634]">{label}</h2>
      <div className="flex items-center gap-3">
        {best.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={best.photo} alt="" aria-hidden="true" className="h-12 w-12 rounded-full object-cover" loading="lazy" />
        ) : null}
        <div className="min-w-0">
          <p className="truncate font-bold text-[#081634]">{best.name}</p>
          <p className="truncate text-xs font-medium text-[#48617f]">{best.team}{best.goals ? ` · ${best.goals}×` : ""}</p>
        </div>
        <span className="ml-auto rounded-lg bg-emerald-50 px-3 py-1 text-lg font-black tabular-nums text-emerald-700">{best.rating.toFixed(1)}</span>
      </div>
    </section>
  );
}

function HeadToHead({ fixtures, title, locale }: { fixtures: LiveFixture[]; title: string; locale: Locale }) {
  if (!fixtures.length) return null;
  const fmt = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", { year: "2-digit", month: "short", day: "numeric" });
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[#081634]">{title}</h2>
      <ul className="grid gap-2 text-sm">
        {fixtures.map((f) => (
          <li key={f.id} className="flex items-center gap-2 text-[#2f3d57]">
            <span className="w-20 flex-none text-xs font-medium text-[#48617f]">{fmt.format(new Date(f.date))}</span>
            <span className="min-w-0 flex-1 truncate font-bold text-[#081634]">{(f.home.code ?? f.home.name)} - {(f.away.code ?? f.away.name)}</span>
            <span className="flex-none font-black tabular-nums text-[#081634]">{f.home.goals ?? 0}-{f.away.goals ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Events({ events, title }: { events: MatchEvent[]; title: string }) {
  if (!events.length) return null;
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[#081634]">{title}</h2>
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

function Statistics({ stats, title }: { stats: TeamStatistics[]; title: string }) {
  if (stats.length < 2) return null;
  const [home, away] = stats;
  const value = (team: TeamStatistics, type: string) => team.statistics.find((s) => s.type === type)?.value ?? "–";
  const types = Array.from(new Set(home.statistics.map((s) => s.type)));
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[#081634]">{title}</h2>
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

function Lineups({ lineups, title, coachLabel }: { lineups: TeamLineup[]; title: string; coachLabel: string }) {
  if (!lineups.length) return null;
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[#081634]">{title}</h2>
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
            {team.coach.name ? <p className="text-xs font-medium text-[#48617f]">{coachLabel}: {team.coach.name}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function LiveMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getServerLocale();
  const c = copy[locale];
  const fixtureId = Number(id);
  const [fixture, detail] = await Promise.all([getFixtureById(fixtureId), getFixtureDetail(fixtureId)]);
  const h2h = fixture ? await getHeadToHead(fixture.home.id, fixture.away.id) : null;
  const hasDetail = Boolean(detail.events?.length || detail.statistics?.length || detail.lineups?.length || detail.players?.length);

  return (
    <div className="grid gap-4">
      <a href="/live" className="inline-flex w-fit items-center gap-1 text-sm font-bold text-[#0866e8]">
        <ArrowLeft aria-hidden="true" className="size-4" /> {c.back}
      </a>
      {fixture ? <MatchHeader fixture={fixture} locale={locale} /> : (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-[#8a5a00]">{c.notFound}</div>
      )}
      {fixture ? <Motm players={detail.players} label={c.motm} /> : null}
      {detail.events?.length ? <Events events={detail.events} title={c.events} /> : null}
      {detail.statistics?.length ? <Statistics stats={detail.statistics} title={c.stats} /> : null}
      {detail.lineups?.length ? <Lineups lineups={detail.lineups} title={c.lineups} coachLabel={c.coach} /> : null}
      {h2h?.length ? <HeadToHead fixtures={h2h} title={c.h2h} locale={locale} /> : null}
      {fixture && !hasDetail ? <p className="panel p-4 text-sm font-bold text-[#48617f]">{c.soon}</p> : null}
    </div>
  );
}
