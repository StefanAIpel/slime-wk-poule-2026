"use client";

import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { TeamFlag } from "@/components/team-flag";
import { fifaRankLabel } from "@/lib/fifa-ranking";
import { formatAmsterdam, teamAbbrev, teamNameForLocale, venueLabel } from "@/lib/format";
import {
  calculateGroupStandings,
  compareStandingRows,
  emptyStandingRow,
  type ScoreLookup,
} from "@/lib/group-standings";
import type { Locale } from "@/lib/i18n";
import type { MatchWithTeams } from "@/lib/types";

type Score = { home: number | null; away: number | null };

type GroupPredictionCardProps = {
  group: string;
  matches: MatchWithTeams[];
  initialScores: Record<number, Score>;
  disabled?: boolean;
  /** Wedstrijden die niet meer wijzigbaar zijn (binnen 30 min vóór aftrap of al begonnen). */
  lockedIds?: number[];
  locale?: Locale;
};

const groupPredictionCopy = {
  nl: {
    group: "Groep",
    complete: "Compleet",
    predict: (home: string, away: string) => `Voorspel ${home} vs ${away}`,
    goals: (team: string) => `${team} doelpunten`,
    standings: "Stand uit jouw scores",
    live: "live",
    country: "Land",
    points: "Pt",
    goalDifference: "DS",
    locked: "Gesloten",
    advance: "Nummers 1 en 2 gaan door; de beste acht nummers 3 tellen automatisch mee in de laatste 32.",
  },
  en: {
    group: "Group",
    complete: "Complete",
    predict: (home: string, away: string) => `Predict ${home} vs ${away}`,
    goals: (team: string) => `${team} goals`,
    standings: "Standings from your scores",
    live: "live",
    country: "Country",
    points: "Pts",
    goalDifference: "GD",
    locked: "Closed",
    advance: "Numbers 1 and 2 advance; the best eight number 3 teams automatically count toward the last 32.",
  },
} as const;

function scoreMapFromState(scores: Record<number, Score>): ScoreLookup {
  const map: ScoreLookup = new Map();
  for (const [id, score] of Object.entries(scores)) {
    if (score.home !== null && score.away !== null) map.set(Number(id), { home: score.home, away: score.away });
  }
  return map;
}

export function GroupPredictionCard({ group, matches, initialScores, disabled, lockedIds, locale = "nl" }: GroupPredictionCardProps) {
  const copy = groupPredictionCopy[locale];
  const dateLocale = locale === "en" ? "en-GB" : "nl-NL";
  const [scores, setScores] = useState<Record<number, Score>>(initialScores);
  const lockedSet = useMemo(() => new Set(lockedIds ?? []), [lockedIds]);

  // Alle landen in de groep (uit de wedstrijden), zodat de stand ook met nullen
  // alvast volledig zichtbaar is.
  const groupTeamCodes = useMemo(() => {
    const set = new Set<string>();
    for (const match of matches) {
      if (match.home_code) set.add(match.home_code);
      if (match.away_code) set.add(match.away_code);
    }
    return Array.from(set);
  }, [matches]);

  const standings = useMemo(() => {
    const computed = calculateGroupStandings(matches, scoreMapFromState(scores)).get(group) ?? [];
    const byCode = new Map(computed.map((standing) => [standing.code, standing]));
    return groupTeamCodes
      .map((code) => byCode.get(code) ?? emptyStandingRow(code, group))
      .sort(compareStandingRows);
  }, [group, matches, scores, groupTeamCodes]);

  function update(matchId: number, side: "home" | "away", raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    const value = digits === "" ? null : Math.min(20, Number(digits));
    setScores((current) => ({
      ...current,
      [matchId]: {
        home: current[matchId]?.home ?? null,
        away: current[matchId]?.away ?? null,
        [side]: value,
      },
    }));
  }

  const filledCount = matches.filter((match) => {
    const score = scores[match.id];
    return score && score.home !== null && score.away !== null;
  }).length;
  const complete = matches.length > 0 && filledCount === matches.length;

  return (
    <section id={`groep-${group}`} className="panel scroll-mt-24 overflow-hidden">
      <div
        className="wc-header flex items-center justify-between px-4 py-3 text-white"
        style={complete ? { background: "var(--green)" } : undefined}
      >
        <h2 className="text-lg font-bold">{copy.group} {group}</h2>
        <span className="flex items-center gap-1 text-sm font-bold">
          {complete ? (
            <>
              <Check aria-hidden="true" className="size-4" /> {copy.complete}
            </>
          ) : (
            <span className="tabular-nums text-white/85">
              {filledCount}/{matches.length}
            </span>
          )}
        </span>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        <div className="divide-y divide-slate-200">
          {matches.map((match) => {
            const existing = scores[match.id] ?? { home: null, away: null };
            const homeName = teamNameForLocale(match.home_code, match.home?.name_nl, locale);
            const awayName = teamNameForLocale(match.away_code, match.away?.name_nl, locale);
            const homeRank = fifaRankLabel(match.home_code);
            const awayRank = fifaRankLabel(match.away_code);
            const locked = lockedSet.has(match.id);
            return (
              <div key={match.id} className={`p-3 md:p-4${locked ? " opacity-60" : ""}`}>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-xs font-medium text-[var(--muted)]">
                  <span>
                    {formatAmsterdam(match.starts_at, dateLocale)}
                    {match.venue ? ` · ${venueLabel(match.venue)}` : ""}
                  </span>
                  {locked ? (
                    <span className="flex-none rounded-full bg-slate-200 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-slate-600">
                      {copy.locked}
                    </span>
                  ) : null}
                </div>
                <fieldset
                  className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2"
                  disabled={disabled || locked}
                >
                  <legend className="sr-only">{copy.predict(homeName, awayName)}</legend>
                  <div className="flex min-w-0 items-center justify-end gap-2">
                    <span className="prediction-team-label justify-end" title={homeName}>
                      <span>{teamAbbrev(match.home_code, homeName)}</span>
                      {homeRank ? <span className="fifa-rank-chip">{homeRank}</span> : null}
                    </span>
                    <TeamFlag code={match.home_code} name={homeName} locale={locale} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      className="score-input"
                      name={`match_${match.id}_home`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={existing.home ?? ""}
                      onChange={(e) => update(match.id, "home", e.target.value)}
                      onFocus={(e) => e.currentTarget.select()}
                      aria-label={copy.goals(homeName)}
                      placeholder="–"
                    />
                    <span className="text-sm font-semibold text-[var(--muted)]">-</span>
                    <input
                      className="score-input"
                      name={`match_${match.id}_away`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={existing.away ?? ""}
                      onChange={(e) => update(match.id, "away", e.target.value)}
                      onFocus={(e) => e.currentTarget.select()}
                      aria-label={copy.goals(awayName)}
                      placeholder="–"
                    />
                  </div>
                  <div className="flex min-w-0 items-center justify-start gap-2">
                    <TeamFlag code={match.away_code} name={awayName} locale={locale} />
                    <span className="prediction-team-label" title={awayName}>
                      <span>{teamAbbrev(match.away_code, awayName)}</span>
                      {awayRank ? <span className="fifa-rank-chip">{awayRank}</span> : null}
                    </span>
                  </div>
                </fieldset>
              </div>
            );
          })}
        </div>
        <aside className="border-t border-slate-200 bg-[#eef7f1] p-4 lg:border-l lg:border-t-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-[var(--ink)]">{copy.standings}</h3>
            <span className="rounded-full bg-[var(--green)] px-2 py-1 text-xs font-semibold text-white">{copy.live}</span>
          </div>
          <div className="grid grid-cols-[28px_1fr_32px_34px] gap-2 text-xs font-semibold uppercase text-[var(--muted)]">
            <span>#</span>
            <span>{copy.country}</span>
            <span>{copy.points}</span>
            <span>{copy.goalDifference}</span>
          </div>
          <div className="mt-2 grid gap-1.5">
            {standings.map((standing, index) => (
              <div
                key={standing.code}
                className={`grid grid-cols-[28px_1fr_32px_34px] items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium ${
                  index < 2 ? "bg-white text-[var(--ink)]" : index === 2 ? "bg-amber-50 text-[#8a5a00]" : "text-[var(--muted)]"
                }`}
              >
                <span className="font-semibold">{index + 1}</span>
                <span className="flex items-center gap-1.5">
                  <TeamFlag code={standing.code} size="sm" locale={locale} />
                  {standing.code}
                </span>
                <span className="font-semibold">{standing.points}</span>
                <span>{standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-medium leading-5 text-[var(--muted)]">{copy.advance}</p>
        </aside>
      </div>
    </section>
  );
}
