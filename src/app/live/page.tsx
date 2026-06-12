import { ArrowRight, CalendarDays, ListOrdered } from "lucide-react";
import { LiveAutoRefresh } from "@/components/live-auto-refresh";
import { ShareRow } from "@/components/share-button";
import { SiteMessageBanner } from "@/components/site-message-banner";
import { TeamFlag } from "@/components/team-flag";
import { getEvents, getWcFixtures, isLiveStatus, isStartingSoon, splitFixtures, type LiveFixture, type LiveTeam } from "@/lib/apifootball-live";
import { goalLines, type GoalLine } from "@/lib/live-events";
import { LIVE_URL } from "@/lib/constants";
import { getServerLocale } from "@/lib/server-locale";
import { activeSiteMessage, fetchSiteMessage } from "@/lib/site-messages";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n";

export const revalidate = 15;

const copy = {
  nl: {
    kicker: "WK 2026 live",
    heroTitle: "WK 2026 Live:",
    heroTitleSub: "uitslagen, standen & schema",
    heroSub: "100% gratis. Blijf op de hoogte van élke WK 2026-wedstrijd — aankomend, bezig of gespeeld — en volg alles live: tussenstanden, opstellingen, statistieken en het complete speelschema.",
    schedule: "Hele WK speelschema",
    shareText: "Volg het WK 2026 live op SlimeScore: uitslagen, stand en schema.",
    shareTitle: "WK 2026 live — SlimeScore",
    now: "Nu bezig",
    latest: "Laatste uitslagen",
    upcoming: "Aankomend",
    upcomingAll: "Alle komende wedstrijden",
    moreMatches: "Meer wedstrijden",
    allUpcoming: "Alle komende WK-wedstrijden",
    compactUpcoming: "Compact overzicht",
    emptyNow: "Op dit moment is er geen WK-wedstrijd bezig.",
    emptyLatest: "Nog geen gespeelde wedstrijden.",
    emptyUpcoming: "Geen geplande wedstrijden gevonden.",
    rest: "Rust",
    live: "Live",
    finished: "Afgelopen",
    startingSoon: "Begint zo",
    cardCta: "Opstellingen & details",
    cardCtaLive: "Bekijk statistieken, opstellingen & verloop",
    soon: "Zodra het toernooi begint zie je hier de lopende wedstrijd, de laatste uitslagen en het volledige schema — alles op één plek.",
  },
  en: {
    kicker: "World Cup 2026 live",
    heroTitle: "World Cup 2026 Live:",
    heroTitleSub: "scores, standings & schedule",
    heroSub: "100% free. Stay on top of every 2026 World Cup match — upcoming, live or finished — and follow it all in real time: live scores, line-ups, stats and the complete schedule.",
    schedule: "Total World Cup Schedule",
    shareText: "Follow the 2026 World Cup live on SlimeScore: scores, standings and schedule.",
    shareTitle: "World Cup 2026 live — SlimeScore",
    now: "Now playing",
    latest: "Latest results",
    upcoming: "Upcoming",
    upcomingAll: "All upcoming matches",
    moreMatches: "More matches",
    allUpcoming: "All upcoming WC matches",
    compactUpcoming: "Compact view",
    emptyNow: "No World Cup match is being played right now.",
    emptyLatest: "No matches played yet.",
    emptyUpcoming: "No scheduled matches found.",
    rest: "HT",
    live: "Live",
    finished: "Finished",
    startingSoon: "Starts soon",
    cardCta: "Line-ups & details",
    cardCtaLive: "View stats, line-ups & timeline",
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
  if (isLiveStatus(fixture.statusShort))
    return {
      text: fixture.statusShort === "HT" ? c.rest : fixture.elapsed !== null ? `LIVE · ${fixture.elapsed}'` : "LIVE",
      live: true,
      soon: false,
    };
  if (["FT", "AET", "PEN"].includes(fixture.statusShort)) return { text: fixture.statusShort === "FT" ? c.finished : fixture.statusShort, live: false, soon: false };
  if (isStartingSoon(fixture)) return { text: c.startingSoon, live: false, soon: true };
  return { text: whenLabel(fixture.date, locale), live: false, soon: false };
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

function ScorerList({ goals, locale }: { goals: GoalLine[]; locale: Locale }) {
  if (!goals.length) return <span />;
  return (
    <span className="live-match-scorer-list">
      {goals.map((goal, index) => (
        <span key={`${goal.minute}-${goal.player}-${index}`}>
          ⚽ {goal.minute} {goal.player}
          {goal.penalty ? " (p)" : ""}
          {goal.ownGoal ? (locale === "en" ? " (o.g.)" : " (e.d.)") : ""}
        </span>
      ))}
    </span>
  );
}

function MatchCard({ fixture, locale, featured = false, goals }: { fixture: LiveFixture; locale: Locale; featured?: boolean; goals?: GoalLine[] }) {
  const when = statusWhen(fixture, locale);
  const played = when.live || ["FT", "AET", "PEN"].includes(fixture.statusShort);
  const meta = [roundLabel(fixture, locale), fixture.venue].filter(Boolean).join(" · ");
  const homeGoals = (goals ?? []).filter((goal) => goal.teamId === fixture.home.id);
  const awayGoals = (goals ?? []).filter((goal) => goal.teamId === fixture.away.id);
  const hasScorers = featured && homeGoals.length + awayGoals.length > 0;
  return (
    <a href={`/live/match/${fixture.id}`} className={featured ? "live-match-card live-match-card-featured" : "live-match-card"}>
      <div className="live-match-meta">
        <span className="live-match-round">{meta}</span>
        <span className={when.live ? "live-match-when is-live" : when.soon ? "live-match-when is-soon" : "live-match-when"}>{when.text}</span>
      </div>
      <div className="live-match-body">
        <TeamInline team={fixture.home} locale={locale} />
        <span className="live-match-sep" aria-hidden="true">-</span>
        <TeamInline team={fixture.away} locale={locale} />
        <span className={played ? "live-match-score" : "live-match-score live-match-score-todo"}>
          {played ? `${fixture.home.goals ?? 0} - ${fixture.away.goals ?? 0}` : "- : -"}
        </span>
      </div>
      {hasScorers ? (
        <div className="live-match-scorers">
          <ScorerList goals={homeGoals} locale={locale} />
          <ScorerList goals={awayGoals} locale={locale} />
        </div>
      ) : null}
      <span className={featured ? "live-match-cta live-match-cta-strong" : "live-match-cta"}>
        {featured ? copy[locale].cardCtaLive : copy[locale].cardCta}
        <ArrowRight aria-hidden="true" className="size-3.5" />
      </span>
    </a>
  );
}

function Section({
  title,
  tone,
  fixtures,
  empty,
  locale,
  action,
  goalsByFixture,
}: {
  title: string;
  tone: "live" | "latest" | "upcoming";
  fixtures: LiveFixture[];
  empty: string;
  locale: Locale;
  action?: { href: string; label: string; icon: "arrow" | "list" };
  goalsByFixture?: ReadonlyMap<number, GoalLine[]>;
}) {
  const isLive = tone === "live";
  const ActionIcon = action?.icon === "list" ? ListOrdered : ArrowRight;
  return (
    <section id={tone === "upcoming" ? "alle-komende" : undefined} className={`panel live-section live-section-${tone} overflow-hidden`}>
      <header className={`live-section-header is-${tone}`}>
        <span>{title}</span>
        {fixtures.length && isLive ? <span className="live-section-count">{fixtures.length}</span> : null}
      </header>
      {fixtures.length ? (
        <div className="divide-y divide-slate-200">
          {fixtures.map((f) => <MatchCard key={f.id} fixture={f} locale={locale} featured={isLive} goals={goalsByFixture?.get(f.id)} />)}
        </div>
      ) : (
        <p className="p-4 text-sm font-bold text-[var(--text-muted)]">{empty}</p>
      )}
      {action ? (
        <footer className="live-section-footer">
          <a href={action.href} className="live-section-more">
            <ActionIcon aria-hidden="true" className="size-4" />
            {action.label}
          </a>
        </footer>
      ) : null}
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

export default async function LivePage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const locale = await getServerLocale();
  const params = await searchParams;
  const c = copy[locale];
  const supabase = await createClient();
  const [all, messageRow] = await Promise.all([getWcFixtures(), fetchSiteMessage(supabase, "live")]);
  const siteMessage = activeSiteMessage(messageRow, locale);

  if (!all) {
    return (
      <div className="grid gap-4">
        <Hero locale={locale} />
        <SiteMessageBanner body={siteMessage} />
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm font-bold leading-6 text-[#114b82]">{c.soon}</div>
      </div>
    );
  }

  const { live, recent, upcoming } = splitFixtures(all);
  const allUpcoming = all.filter((f) => !f.friendly && f.statusShort === "NS" && !isStartingSoon(f)).sort((a, b) => a.date.localeCompare(b.date));
  const showAllUpcoming = params.view === "upcoming";
  const upcomingFixtures = showAllUpcoming ? allUpcoming : upcoming;

  // Doelpuntenmakers voor de "Nu bezig"-kaarten (begonnen wedstrijden; max 6
  // gelijktijdig — events zijn 60s gecachet, dus dit blijft binnen de API-limiet).
  const startedNow = live.filter((f) => f.statusShort !== "NS").slice(0, 6);
  const goalsByFixture = new Map(
    await Promise.all(
      startedNow.map(async (f) => [f.id, goalLines(await getEvents(f.id))] as const),
    ),
  );

  return (
    <div className="grid gap-4">
      <LiveAutoRefresh seconds={15} />
      <Hero locale={locale} />
      <SiteMessageBanner body={siteMessage} />
      <div className="live-sections-grid">
        <Section title={c.now} tone="live" fixtures={live} empty={c.emptyNow} locale={locale} goalsByFixture={goalsByFixture} />
        <Section title={c.latest} tone="latest" fixtures={recent} empty={c.emptyLatest} locale={locale} action={{ href: "/live/schema", label: c.moreMatches, icon: "arrow" }} />
        <Section
          title={showAllUpcoming ? c.upcomingAll : c.upcoming}
          tone="upcoming"
          fixtures={upcomingFixtures}
          empty={c.emptyUpcoming}
          locale={locale}
          action={showAllUpcoming ? { href: "/live", label: c.compactUpcoming, icon: "arrow" } : { href: "/live?view=upcoming#alle-komende", label: c.allUpcoming, icon: "list" }}
        />
      </div>
    </div>
  );
}
