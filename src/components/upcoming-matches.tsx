import { CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { TeamFlag } from "@/components/team-flag";
import { formatAmsterdam, teamAbbrev, teamNameForLocale, venueHourOffset, venueLabel, venueShortLabel } from "@/lib/format";
import { localizedHref, type Locale } from "@/lib/i18n";
import { createOptionalAdminClient } from "@/lib/supabase/admin";

type Row = {
  id: number;
  starts_at: string | null;
  group_letter: string | null;
  venue: string | null;
  home_code: string | null;
  away_code: string | null;
  home_label: string | null;
  away_label: string | null;
  status: "scheduled" | "live" | "finished" | null;
  home_score: number | null;
  away_score: number | null;
  home: { name_nl: string | null } | null;
  away: { name_nl: string | null } | null;
};

type MatchListKind = "upcoming" | "recent";

function ResultBoxes({ home, away, locale }: { home: number | null; away: number | null; locale: Locale }) {
  const complete = home !== null && away !== null;
  const label = complete
    ? (locale === "en" ? `Result ${home}-${away}` : `Uitslag ${home}-${away}`)
    : (locale === "en" ? "Result not known yet" : "Uitslag nog niet bekend");
  return (
    <span className="match-score-boxes" aria-label={label}>
      <span className={complete ? "score-box score-box-filled" : "score-box"}>{home ?? ""}</span>
      <span className="score-dash" aria-hidden="true">-</span>
      <span className={complete ? "score-box score-box-filled" : "score-box"}>{away ?? ""}</span>
    </span>
  );
}

function TeamLabel({ code, label, nameNl, locale }: { code: string | null; label: string | null; nameNl: string | null; locale: Locale }) {
  const fullName = teamNameForLocale(code, nameNl ?? label, locale);
  const abbrev = teamAbbrev(code, label ?? nameNl);
  return (
    <span className="schedule-team-name font-medium tracking-wide text-[var(--ink)]" title={fullName || undefined}>
      <span className="match-team-abbrev">{abbrev}</span>
      <span className="match-team-full">{fullName}</span>
    </span>
  );
}

function MatchList({ rows, kind, locale }: { rows: Row[]; kind: MatchListKind; locale: Locale }) {
  const isRecent = kind === "recent";
  const Icon = isRecent ? CheckCircle2 : CalendarDays;
  const title = isRecent
    ? (locale === "en" ? "Latest WC results" : "Laatst gespeelde WK-wedstrijden")
    : (locale === "en" ? "Upcoming WC matches" : "Eerstvolgende WK-wedstrijden");
  const schemaLabel = locale === "en" ? "Full schedule" : "Hele schema";

  if (!rows.length) return null;

  return (
    <div className={`panel match-summary-panel match-summary-panel-${kind} p-3`}>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-base font-bold text-[var(--ink)]">
          <Icon aria-hidden="true" className="size-5 text-[var(--blue)]" />
          <span className="truncate">{title}</span>
        </h2>
        <a href={localizedHref("/schema", locale)} className="schedule-full-button">
          {schemaLabel}
        </a>
      </div>
      <div className="divide-y divide-slate-200">
        {rows.map((m) => (
          <div key={m.id} className="flex items-stretch gap-3 py-2">
            <div className="flex items-center">
              <span className="match-group">{m.group_letter ?? "KO"}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="match-meta match-meta-compact">
                <span className="match-time">{formatAmsterdam(m.starts_at, locale === "en" ? "en-GB" : "nl-NL")}</span>
                {!isRecent && venueHourOffset(m.starts_at, m.venue) !== null ? (
                  <span className="match-time-offset" title={locale === "en" ? "Time difference with the Netherlands" : "Tijdverschil met Nederland"}>
                    ({(() => { const o = venueHourOffset(m.starts_at, m.venue)!; return o === 0 ? (locale === "en" ? "same" : "gelijk") : `${o > 0 ? "+" : "−"}${Math.abs(o)}${locale === "en" ? "h" : "u"}`; })()})
                  </span>
                ) : null}
                {m.venue ? (
                  <span className="match-location" title={venueLabel(m.venue)}>
                    <MapPin aria-hidden="true" className="size-3.5" />
                    <span className="sm:hidden">{venueShortLabel(m.venue)}</span>
                    <span className="hidden sm:inline">{venueLabel(m.venue)}</span>
                  </span>
                ) : null}
              </div>
              <div className="upcoming-team-grid mt-2 text-sm">
                <div className="schedule-team-cell schedule-team-cell-home">
                  <TeamFlag code={m.home_code} name={teamNameForLocale(m.home_code, m.home?.name_nl, locale)} locale={locale} />
                  <TeamLabel code={m.home_code} label={m.home_label} nameNl={m.home?.name_nl ?? null} locale={locale} />
                </div>
                <span className="upcoming-team-separator">
                  <span aria-hidden="true">-</span>
                  <span className="sr-only">{locale === "en" ? "versus" : "tegen"}</span>
                </span>
                <div className="schedule-team-cell schedule-team-cell-away">
                  <TeamFlag code={m.away_code} name={teamNameForLocale(m.away_code, m.away?.name_nl, locale)} locale={locale} />
                  <TeamLabel code={m.away_code} label={m.away_label} nameNl={m.away?.name_nl ?? null} locale={locale} />
                </div>
                <ResultBoxes home={m.home_score} away={m.away_score} locale={locale} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const matchSelect = "id,starts_at,group_letter,venue,home_code,away_code,home_label,away_label,status,home_score,away_score,home:teams!matches_home_code_fkey(name_nl),away:teams!matches_away_code_fkey(name_nl)";

/** Compact lijstje met de eerstvolgende wedstrijden — ook nuttig zonder login. */
export async function UpcomingMatches({ limit = 3, locale = "nl" }: { limit?: number; locale?: Locale }) {
  const admin = createOptionalAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("matches")
    .select(matchSelect)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);

  return <MatchList rows={(data ?? []) as unknown as Row[]} kind="upcoming" locale={locale} />;
}

/** Laatste gespeelde wedstrijden met uitslag — getoond onder eerstvolgende wedstrijden. */
export async function RecentMatches({ limit = 3, locale = "nl" }: { limit?: number; locale?: Locale }) {
  const admin = createOptionalAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("matches")
    .select(matchSelect)
    .not("home_score", "is", null)
    .not("away_score", "is", null)
    .order("starts_at", { ascending: false })
    .limit(limit);

  return <MatchList rows={(data ?? []) as unknown as Row[]} kind="recent" locale={locale} />;
}
