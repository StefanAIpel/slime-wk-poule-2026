import { CalendarDays } from "lucide-react";
import { LiveAutoRefresh } from "@/components/live-auto-refresh";
import { ShareRow } from "@/components/share-button";
import { TeamFlag } from "@/components/team-flag";
import { getWcFixtures, isLiveStatus, splitFixtures, type LiveFixture, type LiveTeam } from "@/lib/apifootball-live";
import { LIVE_URL } from "@/lib/constants";
import { getServerLocale } from "@/lib/server-locale";
import type { Locale } from "@/lib/i18n";

export const revalidate = 15;

const copy = {
  nl: {
    kicker: "WK 2026 live",
    heroTitle: "WK 2026 Live:",
    heroTitleSub: "uitslagen, standen & schema",
    heroSub: "Volg elke WK 2026-wedstrijd live — tussenstanden, opstellingen en statistieken, plus het volledige speelschema. Gratis, zonder gedoe.",
    schedule: "Hele WK speelschema",
    shareText: "Volg het WK 2026 live op SlimeScore: uitslagen, stand en schema.",
    shareTitle: "WK 2026 live — SlimeScore",
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
    kicker: "World Cup 2026 live",
    heroTitle: "World Cup 2026 Live:",
    heroTitleSub: "scores, standings & schedule",
    heroSub: "Follow every 2026 World Cup match live — live scores, line-ups and stats, plus the full schedule. Free, no fuss.",
    schedule: "Total World Cup Schedule",
    shareText: "Follow the 2026 World Cup live on SlimeScore: scores, standings and schedule.",
    shareTitle: "World Cup 2026 live — SlimeScore",
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

function whenLabel(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", { timeZone: "Europe/Amsterdam", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

const KNOCKOUT: Record<string, [string, string]> = {
  "round of 32": ["Zestiende finale", "Round of 32"],
  "round of 16": ["Achtste finale", "Round of 16"],
  "quarter-finals": ["Kwartfinale", "Quarter-finals"],
  "semi-finals": ["Halve finale", "Semi-finals"],
  "3rd place final": ["Troostfinale", "Third place"],
  final: ["Finale", "Final"],
};

function roundLabel(fixture: LiveFixture, locale: Locale) {
  if (fixture.friendly) return locale === "en" ? "Friendly" : "Oefeninterland";
  const key = fixture.round.toLowerCase();
  // De API gebruikt voor de groepsfase matchday-nummers ("Group Stage - 1"),
  // niet de poule-letter. Die halen we uit de teamgroep.
  if (key.includes("group")) {
    const group = fixture.home.group ?? fixture.away.group;
    if (group) return locale === "en" ? `Group ${group}` : `Groep ${group}`;
    return locale === "en" ? "Group stage" : "Groepsfase";
  }
  for (const [needle, [nl, en]] of Object.entries(KNOCKOUT)) {
    if (key.includes(needle)) return locale === "en" ? en : nl;
  }
  return fixture.round;
}

function statusWhen(fixture: LiveFixture, locale: Locale) {
  const c = copy[locale];
  if (isLiveStatus(fixture.statusShort)) return { text: fixture.statusShort === "HT" ? c.rest : fixture.elapsed !== null ? `${fixture.elapsed}'` : c.live, live: true };
  if (["FT", "AET", "PEN"].includes(fixture.statusShort)) return { text: fixture.statusShort === "FT" ? c.finished : fixture.statusShort, live: false };
  return { text: whenLabel(fixture.date, locale), live: false };
}

function TeamInline({ team, locale }: { team: LiveTeam; locale: Locale }) {
  return (
    <span className="live-match-team">
      <TeamFlag code={team.code} name={team.name} size="sm" locale={locale} />
      <span className="live-row-code">{team.code ?? team.name.slice(0, 3).toUpperCase()}</span>
      <span className="live-row-name">{team.name}</span>
    </span>
  );
}

function MatchCard({ fixture, locale }: { fixture: LiveFixture; locale: Locale }) {
  const when = statusWhen(fixture, locale);
  const played = when.live || ["FT", "AET", "PEN"].includes(fixture.statusShort);
  const meta = [roundLabel(fixture, locale), fixture.venue].filter(Boolean).join(" · ");
  return (
    <a href={`/live/match/${fixture.id}`} className="live-match-card">
      <div className="live-match-meta">
        <span className="live-match-round">{meta}</span>
        <span className={when.live ? "live-match-when is-live" : "live-match-when"}>{when.text}</span>
      </div>
      <div className="live-match-body">
        <TeamInline team={fixture.home} locale={locale} />
        <span className="live-match-sep" aria-hidden="true">-</span>
        <TeamInline team={fixture.away} locale={locale} />
        <span className={played ? "live-match-score" : "live-match-score live-match-score-todo"}>
          {played ? `${fixture.home.goals ?? 0} - ${fixture.away.goals ?? 0}` : "- : -"}
        </span>
      </div>
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
        <div className="divide-y divide-slate-200">{fixtures.map((f) => <MatchCard key={f.id} fixture={f} locale={locale} />)}</div>
      ) : (
        <p className="p-4 text-sm font-bold text-[#48617f]">{empty}</p>
      )}
    </section>
  );
}

function Hero({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <div className="hero-band hero-band-visual hero-home live-hero-band">
      <picture className="hero-photo">
        <source media="(min-width: 760px)" srcSet="/assets/stadion-2x1.webp" />
        <img src="/assets/stadion-3to5.webp" alt="" aria-hidden="true" fetchPriority="high" decoding="async" />
      </picture>
      <div className="hero-content">
        <div className="world-cup-kicker">
          <span>{c.kicker}</span>
          <span>USA</span>
          <span>Canada</span>
          <span>Mexico</span>
        </div>
        <h1 className="live-hero-title">
          <span>{c.heroTitle}</span>
          <span className="live-hero-title-subline">{c.heroTitleSub}</span>
        </h1>
        <p className="live-hero-sub">{c.heroSub}</p>
        <div className="live-hero-actions">
          <a href="/live/schema" className="button-primary live-hero-cta">
            <CalendarDays aria-hidden="true" className="size-5" />
            {c.schedule}
          </a>
          <ShareRow url={`${LIVE_URL}`} text={c.shareText} title={c.shareTitle} locale={locale} compact onDark />
        </div>
      </div>
      {/* Kleine mascotte in de hoek (subtiel, niet zo groot als de hoofdpagina). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/transparant-avatar/memphis_wkbal_700_transparant.webp" alt="" aria-hidden="true" className="live-hero-mascot" />
    </div>
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
      <LiveAutoRefresh seconds={15} />
      <Hero locale={locale} />
      <Section title={c.now} accent="live" fixtures={live} empty={c.emptyNow} locale={locale} />
      <Section title={c.latest} fixtures={recent} empty={c.emptyLatest} locale={locale} />
      <Section title={c.upcoming} fixtures={upcoming} empty={c.emptyUpcoming} locale={locale} />
    </div>
  );
}
