import { ArrowLeft } from "lucide-react";
import { TeamFlag } from "@/components/team-flag";
import { getFixtureById, getFixtureDetail, getHeadToHead, isLiveStatus, manOfTheMatch, type LiveFixture, type MatchEvent, type TeamLineup, type TeamPlayers, type TeamStatistics } from "@/lib/apifootball-live";
import { formatEventMinute } from "@/lib/live-events";
import { getServerLocale } from "@/lib/server-locale";
import type { Locale } from "@/lib/i18n";

export const revalidate = 30;

const copy = {
  nl: { back: "Terug naar live", finished: "Afgelopen", rest: "Rust", events: "Wedstrijdverloop", stats: "Statistieken", lineups: "Opstellingen", coach: "Coach", motm: "Man van de wedstrijd", h2h: "Onderlinge duels", notFound: "Deze wedstrijd kon niet geladen worden.", soon: "Opstellingen en statistieken verschijnen rond de aftrap." },
  en: { back: "Back to live", finished: "Finished", rest: "HT", events: "Match events", stats: "Statistics", lineups: "Line-ups", coach: "Coach", motm: "Player of the match", h2h: "Head-to-head", notFound: "This match could not be loaded.", soon: "Line-ups and statistics appear around kick-off." },
} as const;

const EVENT_TRANSLATIONS = {
  nl: {
    normalGoal: "Doelpunt",
    ownGoal: "Eigen goal",
    penalty: "Penalty",
    missedPenalty: "Penalty gemist",
    penaltyCancelled: "Penalty geannuleerd",
    goalCancelled: "Goal afgekeurd",
    var: "VAR",
    in: "erin",
    out: "eruit",
  },
  en: {
    normalGoal: "Goal",
    ownGoal: "Own goal",
    penalty: "Penalty",
    missedPenalty: "Penalty missed",
    penaltyCancelled: "Penalty cancelled",
    goalCancelled: "Goal cancelled",
    var: "VAR",
    in: "on",
    out: "off",
  },
} as const;

const STAT_LABELS: Record<string, { icon: string; nl: string; en: string }> = {
  "Shots on Goal": { icon: "🎯", nl: "Schoten op doel", en: "Shots on target" },
  "Shots off Goal": { icon: "↗️", nl: "Schoten naast", en: "Shots off target" },
  "Total Shots": { icon: "⚽", nl: "Schoten totaal", en: "Total shots" },
  "Blocked Shots": { icon: "🧱", nl: "Geblokte schoten", en: "Blocked shots" },
  "Shots insidebox": { icon: "📦", nl: "Schoten in 16", en: "Shots inside box" },
  "Shots outsidebox": { icon: "↔️", nl: "Schoten buiten 16", en: "Shots outside box" },
  Fouls: { icon: "🛑", nl: "Overtredingen", en: "Fouls" },
  "Corner Kicks": { icon: "🚩", nl: "Corners", en: "Corners" },
  Offsides: { icon: "🏁", nl: "Buitenspel", en: "Offsides" },
  "Ball Possession": { icon: "🌀", nl: "Balbezit", en: "Possession" },
  "Yellow Cards": { icon: "🟨", nl: "Gele kaarten", en: "Yellow cards" },
  "Red Cards": { icon: "🟥", nl: "Rode kaarten", en: "Red cards" },
  "Goalkeeper Saves": { icon: "🧤", nl: "Reddingen keeper", en: "Goalkeeper saves" },
  "Total passes": { icon: "🔁", nl: "Passes totaal", en: "Total passes" },
  "Passes accurate": { icon: "✅", nl: "Passes aangekomen", en: "Accurate passes" },
  "Passes %": { icon: "📊", nl: "Passnauwkeurigheid", en: "Pass accuracy" },
  expected_goals: { icon: "📈", nl: "Expected goals", en: "Expected goals" },
  goals_prevented: { icon: "🧤", nl: "Goals voorkomen", en: "Goals prevented" },
};

function shortWhen(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", { timeZone: "Europe/Amsterdam", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function MatchHeader({ fixture, locale }: { fixture: LiveFixture; locale: Locale }) {
  const c = copy[locale];
  const live = isLiveStatus(fixture.statusShort);
  const played = live || ["FT", "AET", "PEN"].includes(fixture.statusShort);
  return (
    <section className="panel p-4">
      <p className="text-center text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
        {(fixture.friendly ? (locale === "en" ? "Friendly" : "Oefeninterland") : fixture.round)}{fixture.venue ? ` · ${fixture.venue}` : ""}
      </p>
      {/* Afgekorte datum gecentreerd (ook fijn op mobiel). */}
      <p className="mt-1 text-center text-sm font-bold text-[var(--ink)]">{shortWhen(fixture.date, locale)}</p>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="grid justify-items-center gap-2 text-center">
          <TeamFlag code={fixture.home.code} name={fixture.home.name} size="md" locale={locale} />
          <span className="text-sm font-bold text-[var(--ink)]">{fixture.home.name}</span>
        </div>
        <div className="grid justify-items-center">
          <span className="text-3xl font-black tabular-nums text-[var(--ink)]">{played ? `${fixture.home.goals ?? 0}-${fixture.away.goals ?? 0}` : "–"}</span>
          <span className={live ? "live-row-status is-live mt-1" : "mt-1 text-xs font-bold text-[var(--text-muted)]"}>
            {live ? (fixture.statusShort === "HT" ? c.rest : `${fixture.elapsed ?? ""}'`) : played ? c.finished : ""}
          </span>
        </div>
        <div className="grid justify-items-center gap-2 text-center">
          <TeamFlag code={fixture.away.code} name={fixture.away.name} size="md" locale={locale} />
          <span className="text-sm font-bold text-[var(--ink)]">{fixture.away.name}</span>
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
      <h2 className="mb-3 text-lg font-bold text-[var(--ink)]">{label}</h2>
      <div className="flex items-center gap-3">
        {best.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={best.photo} alt="" aria-hidden="true" className="h-12 w-12 rounded-full object-cover" loading="lazy" />
        ) : null}
        <div className="min-w-0">
          <p className="truncate font-bold text-[var(--ink)]">{best.name}</p>
          <p className="truncate text-xs font-medium text-[var(--text-muted)]">{best.team}{best.goals ? ` · ${best.goals}×` : ""}</p>
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
      <h2 className="mb-3 text-lg font-bold text-[var(--ink)]">{title}</h2>
      <ul className="grid gap-2 text-sm">
        {fixtures.map((f) => (
          <li key={f.id} className="flex items-center gap-2 text-[#2f3d57]">
            <span className="w-20 flex-none text-xs font-medium text-[var(--text-muted)]">{fmt.format(new Date(f.date))}</span>
            <span className="min-w-0 flex-1 truncate font-bold text-[var(--ink)]">{(f.home.code ?? f.home.name)} - {(f.away.code ?? f.away.name)}</span>
            <span className="flex-none font-black tabular-nums text-[var(--ink)]">{f.home.goals ?? 0}-{f.away.goals ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function sortMatchEventsNewestFirst(events: MatchEvent[]) {
  return events
    .map((event, index) => ({ event, index }))
    .sort((a, b) => {
      const elapsedDiff = (b.event.time.elapsed ?? 0) - (a.event.time.elapsed ?? 0);
      if (elapsedDiff) return elapsedDiff;
      const extraDiff = (b.event.time.extra ?? 0) - (a.event.time.extra ?? 0);
      if (extraDiff) return extraDiff;
      return b.index - a.index;
    })
    .map(({ event }) => event);
}

function cleanApiDetail(detail: string) {
  return detail.trim().replace(/\s+\d+$/, "");
}

function eventPresentation(event: MatchEvent, locale: Locale) {
  const c = EVENT_TRANSLATIONS[locale];
  const rawDetail = cleanApiDetail(event.detail || "");
  const detail = rawDetail.toLowerCase();
  const type = event.type.toLowerCase();

  if (type.includes("subst") || detail.includes("substitution")) return { icon: "🔁", label: null, tone: "text-sky-700" };
  if (detail.includes("second yellow")) return { icon: "🟨", label: null, tone: "text-amber-700" };
  if (detail.includes("yellow")) return { icon: "🟨", label: null, tone: "text-amber-700" };
  if (detail.includes("red")) return { icon: "🟥", label: null, tone: "text-red-700" };
  if (detail.includes("own goal")) return { icon: "⚽", label: c.ownGoal, tone: "text-emerald-700" };
  if (detail.includes("missed penalty")) return { icon: "❌", label: c.missedPenalty, tone: "text-red-700" };
  if (detail.includes("penalty cancelled")) return { icon: "❌", label: c.penaltyCancelled, tone: "text-red-700" };
  if (detail === "penalty") return { icon: "⚽", label: c.penalty, tone: "text-emerald-700" };
  if (detail.includes("normal goal") || type.includes("goal")) return { icon: "⚽", label: c.normalGoal, tone: "text-emerald-700" };
  if (detail.includes("cancelled")) return { icon: "❌", label: c.goalCancelled, tone: "text-red-700" };
  if (type.includes("var")) return { icon: "📺", label: c.var, tone: "text-violet-700" };
  if (type.includes("card")) return { icon: "🟨", label: null, tone: "text-amber-700" };
  return { icon: "•", label: rawDetail || event.type, tone: "text-[var(--ink)]" };
}

function eventText(event: MatchEvent, locale: Locale) {
  const isSubstitution = event.type.toLowerCase().includes("subst") || cleanApiDetail(event.detail || "").toLowerCase().includes("substitution");
  const player = event.player.name;
  const assist = event.assist.name;
  if (isSubstitution && player && assist) return `${assist} ${EVENT_TRANSLATIONS[locale].in} · ${player} ${EVENT_TRANSLATIONS[locale].out}`;
  return [player, assist].filter(Boolean).join(" · ");
}

function teamNameForEvent(event: MatchEvent, fixture: LiveFixture) {
  if (event.team.id === fixture.home.id) return fixture.home.name;
  if (event.team.id === fixture.away.id) return fixture.away.name;
  return event.team.name;
}

function Events({ events, title, fixture, locale }: { events: MatchEvent[]; title: string; fixture: LiveFixture; locale: Locale }) {
  if (!events.length) return null;
  const sortedEvents = sortMatchEventsNewestFirst(events);
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[var(--ink)]">{title}</h2>
      <ul className="grid gap-3">
        {sortedEvents.map((event, index) => {
          const presentation = eventPresentation(event, locale);
          const text = eventText(event, locale);
          return (
            <li key={index} className="grid grid-cols-[2.6rem_2rem_minmax(0,1fr)] items-start gap-x-2 text-sm text-[#2f3d57]">
              <span className="pt-1 font-bold tabular-nums text-[var(--text-muted)]">{formatEventMinute(event)}</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-base leading-none" aria-hidden="true">{presentation.icon}</span>
              <span className="min-w-0 leading-snug">
                {presentation.label ? <span className={`font-bold ${presentation.tone}`}>{presentation.label}</span> : null}
                {text ? <span>{presentation.label ? " " : ""}{text}</span> : null}
                <span className="text-[var(--text-muted)]"> ({teamNameForEvent(event, fixture)})</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function statLabel(type: string, locale: Locale) {
  const label = STAT_LABELS[type];
  if (label) return { icon: label.icon, text: label[locale] };
  return { icon: "📌", text: locale === "nl" ? type.replace(/_/g, " ") : type };
}

function Statistics({ stats, title, fixture, locale }: { stats: TeamStatistics[]; title: string; fixture: LiveFixture; locale: Locale }) {
  if (stats.length < 2) return null;
  const [home, away] = stats;
  const value = (team: TeamStatistics, type: string) => team.statistics.find((s) => s.type === type)?.value ?? "–";
  const types = Array.from(new Set([...home.statistics, ...away.statistics].map((s) => s.type)));
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[var(--ink)]">{title}</h2>
      <div className="grid gap-2">
        <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_4.25rem] items-center gap-2 px-2 text-[11px] font-black uppercase tracking-wide text-[var(--text-muted)]">
          <span className="truncate text-left">{fixture.home.code ?? fixture.home.name}</span>
          <span aria-hidden="true" />
          <span className="truncate text-right">{fixture.away.code ?? fixture.away.name}</span>
        </div>
        {types.map((type) => {
          const label = statLabel(type, locale);
          return (
            <div key={type} className="grid grid-cols-[4.25rem_minmax(0,1fr)_4.25rem] items-center gap-2 rounded-xl bg-slate-50 px-2 py-2 text-sm">
              <span className="text-left font-black tabular-nums text-[var(--ink)]">{String(value(home, type))}</span>
              <span className="flex min-w-0 items-center justify-center gap-1.5 text-center text-xs font-bold text-[var(--text-muted)]">
                <span aria-hidden="true">{label.icon}</span>
                <span className="min-w-0 truncate">{label.text}</span>
              </span>
              <span className="text-right font-black tabular-nums text-[var(--ink)]">{String(value(away, type))}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Lineups({ lineups, title, coachLabel }: { lineups: TeamLineup[]; title: string; coachLabel: string }) {
  if (!lineups.length) return null;
  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-lg font-bold text-[var(--ink)]">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {lineups.map((team) => (
          <div key={team.team.id} className="grid gap-2">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={team.team.logo} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
              <span className="font-bold text-[var(--ink)]">{team.team.name}</span>
              {team.formation ? <span className="text-xs font-bold text-[var(--text-muted)]">{team.formation}</span> : null}
            </div>
            <ul className="grid gap-1 text-sm text-[#2f3d57]">
              {team.startXI.map((p) => (
                <li key={p.player.id}><span className="inline-block w-6 font-bold tabular-nums text-[var(--text-muted)]">{p.player.number ?? ""}</span>{p.player.name}</li>
              ))}
            </ul>
            {team.coach.name ? <p className="text-xs font-medium text-[var(--text-muted)]">{coachLabel}: {team.coach.name}</p> : null}
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
      {fixture && detail.events?.length ? <Events events={detail.events} title={c.events} fixture={fixture} locale={locale} /> : null}
      {fixture && detail.statistics?.length ? <Statistics stats={detail.statistics} title={c.stats} fixture={fixture} locale={locale} /> : null}
      {detail.lineups?.length ? <Lineups lineups={detail.lineups} title={c.lineups} coachLabel={c.coach} /> : null}
      {h2h?.length ? <HeadToHead fixtures={h2h} title={c.h2h} locale={locale} /> : null}
      {fixture && !hasDetail ? <p className="panel p-4 text-sm font-bold text-[var(--text-muted)]">{c.soon}</p> : null}
    </div>
  );
}
