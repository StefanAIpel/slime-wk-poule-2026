import { CalendarDays } from "lucide-react";
import { LiveAutoRefresh } from "@/components/live-auto-refresh";
import { TeamFlag } from "@/components/team-flag";
import { getWcFixtures, isLiveStatus, splitFixtures, type LiveFixture, type LiveTeam } from "@/lib/apifootball-live";
import { getServerLocale } from "@/lib/server-locale";
import type { Locale } from "@/lib/i18n";

export const revalidate = 30;

const copy = {
  nl: {
    heroTitle: "Volg het WK 2026 live",
    heroSub: "Alle wedstrijden, uitslagen en standen — direct.",
    schedule: "Speelschema",
    now: "Nu bezig",
    latest: "Laatste uitslagen",
    upcoming: "Aankomend",
    emptyNow: "Op dit moment is er geen WK-wedstrijd bezig.",
    emptyLatest: "Nog geen gespeelde wedstrijden.",
    emptyUpcoming: "Geen geplande wedstrijden gevonden.",
    rest: "Rust",
    live: "Live",
    finished: "Afgelopen",
    soon: "Zodra het toernooi begint zie je hier de lopende wedstrijd, de laatste uitslagen en het volledige schema — alles op één plek.",
  },
  en: {
    heroTitle: "Follow the 2026 World Cup live",
    heroSub: "Every match, result and standing — instantly.",
    schedule: "Schedule",
    now: "Now playing",
    latest: "Latest results",
    upcoming: "Upcoming",
    emptyNow: "No World Cup match is being played right now.",
    emptyLatest: "No matches played yet.",
    emptyUpcoming: "No scheduled matches found.",
    rest: "HT",
    live: "Live",
    finished: "Finished",
    soon: "Once the tournament kicks off you'll find the live match, the latest results and the full schedule here — all in one place.",
  },
} as const;

function kickoff(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", { timeZone: "Europe/Amsterdam", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function statusLabel(fixture: LiveFixture, locale: Locale) {
  const c = copy[locale];
  if (isLiveStatus(fixture.statusShort)) {
    if (fixture.statusShort === "HT") return c.rest;
    return fixture.elapsed !== null ? `${fixture.elapsed}'` : c.live;
  }
  if (["FT", "AET", "PEN"].includes(fixture.statusShort)) return fixture.statusShort === "FT" ? c.finished : fixture.statusShort;
  return kickoff(fixture.date, locale);
}

function TeamCell({ team, locale, align }: { team: LiveTeam; locale: Locale; align: "home" | "away" }) {
  const flag = <TeamFlag code={team.code} name={team.name} size="sm" locale={locale} />;
  const label = (
    <>
      <span className="live-row-code">{team.code ?? team.name.slice(0, 3).toUpperCase()}</span>
      <span className="live-row-name">{team.name}</span>
    </>
  );
  return (
    <span className={align === "home" ? "live-row-team" : "live-row-team live-row-team-away"}>
      {align === "home" ? (
        <>
          {flag}
          {label}
        </>
      ) : (
        <>
          {label}
          {flag}
        </>
      )}
    </span>
  );
}

function FixtureRow({ fixture, locale }: { fixture: LiveFixture; locale: Locale }) {
  const live = isLiveStatus(fixture.statusShort);
  const played = live || ["FT", "AET", "PEN"].includes(fixture.statusShort);
  return (
    <a href={`/live/match/${fixture.id}`} className="live-row">
      <span className={live ? "live-row-status is-live" : "live-row-status"}>{statusLabel(fixture, locale)}</span>
      <span className="live-row-teams">
        <TeamCell team={fixture.home} locale={locale} align="home" />
        <span className="live-row-score">{played ? `${fixture.home.goals ?? 0} - ${fixture.away.goals ?? 0}` : "–"}</span>
        <TeamCell team={fixture.away} locale={locale} align="away" />
      </span>
    </a>
  );
}

function Section({ title, accent, fixtures, empty, locale }: { title: string; accent?: "live"; fixtures: LiveFixture[]; empty: string; locale: Locale }) {
  return (
    <section className="panel overflow-hidden">
      <header className={accent === "live" ? "live-section-header is-live" : "live-section-header"}>
        <span>{title}</span>
        {fixtures.length && accent === "live" ? <span className="live-section-count">{fixtures.length}</span> : null}
      </header>
      {fixtures.length ? (
        <div className="divide-y divide-slate-200">{fixtures.map((f) => <FixtureRow key={f.id} fixture={f} locale={locale} />)}</div>
      ) : (
        <p className="p-4 text-sm font-bold text-[#48617f]">{empty}</p>
      )}
    </section>
  );
}

function Hero({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <section className="live-hero">
      <div className="live-hero-text">
        <h1 className="live-hero-title">{c.heroTitle}</h1>
        <p className="live-hero-sub">{c.heroSub}</p>
      </div>
      <a href="/live/schema" className="live-hero-btn">
        <CalendarDays aria-hidden="true" className="size-4" />
        {c.schedule}
      </a>
    </section>
  );
}

export default async function LivePage() {
  const locale = await getServerLocale();
  const c = copy[locale];
  const all = await getWcFixtures();

  if (!all) {
    return (
      <div className="grid gap-4">
        <Hero locale={locale} />
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm font-bold leading-6 text-[#114b82]">{c.soon}</div>
      </div>
    );
  }

  const { live, recent, upcoming } = splitFixtures(all);

  return (
    <div className="grid gap-4">
      <LiveAutoRefresh seconds={30} />
      <Hero locale={locale} />
      <Section title={c.now} accent="live" fixtures={live} empty={c.emptyNow} locale={locale} />
      <Section title={c.latest} fixtures={recent} empty={c.emptyLatest} locale={locale} />
      <Section title={c.upcoming} fixtures={upcoming} empty={c.emptyUpcoming} locale={locale} />
    </div>
  );
}
