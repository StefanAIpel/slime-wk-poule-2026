import { CalendarDays, MapPin } from "lucide-react";
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

/** Compact lijstje met de eerstvolgende wedstrijden — ook nuttig zonder login. */
export async function UpcomingMatches({ limit = 3, locale = "nl" }: { limit?: number; locale?: Locale }) {
  const admin = createOptionalAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("matches")
    .select(
      "id,starts_at,group_letter,venue,home_code,away_code,home_label,away_label,status,home_score,away_score,home:teams!matches_home_code_fkey(name_nl),away:teams!matches_away_code_fkey(name_nl)",
    )
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);

  const rows = (data ?? []) as unknown as Row[];
  if (!rows.length) return null;

  return (
    <div className="panel p-3">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-[var(--ink)]">
          <CalendarDays aria-hidden="true" className="size-5 text-[var(--blue)]" />
          {locale === "en" ? "Upcoming WC matches" : "Eerstvolgende WK-wedstrijden"}
        </h2>
        <a href={localizedHref("/schema", locale)} className="text-sm font-semibold text-[var(--blue)]">
          {locale === "en" ? "Full schedule" : "Hele schema"}
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
                {venueHourOffset(m.starts_at, m.venue) !== null ? (
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
                  <span className="schedule-team-name font-medium tracking-wide text-[var(--ink)]" title={teamNameForLocale(m.home_code, m.home?.name_nl ?? m.home_label, locale) || undefined}>
                    {teamAbbrev(m.home_code, m.home_label ?? m.home?.name_nl)}
                  </span>
                </div>
                <span className="upcoming-team-separator">
                  <span aria-hidden="true">-</span>
                  <span className="sr-only">{locale === "en" ? "versus" : "tegen"}</span>
                </span>
                <div className="schedule-team-cell schedule-team-cell-away">
                  <TeamFlag code={m.away_code} name={teamNameForLocale(m.away_code, m.away?.name_nl, locale)} locale={locale} />
                  <span className="schedule-team-name font-medium tracking-wide text-[var(--ink)]" title={teamNameForLocale(m.away_code, m.away?.name_nl ?? m.away_label, locale) || undefined}>
                    {teamAbbrev(m.away_code, m.away_label ?? m.away?.name_nl)}
                  </span>
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
