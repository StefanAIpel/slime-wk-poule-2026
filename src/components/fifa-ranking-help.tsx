"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { TeamFlag } from "@/components/team-flag";
import { fifaRanking, fifaRankingSource, squadValueSource, type FifaRankingRow } from "@/lib/fifa-ranking";

type FifaHelpCopy = {
  fifaHelpSummary: string;
  fifaIntro: string;
  fifaSearch: string;
  fifaNoResults: string;
  sourceNote: string;
};

/**
 * Inklapbare FIFA-ranglijst onder de oranje balk. Filtert live tijdens het typen
 * (NL én EN: matcht op code, Nederlandse en Engelse landnaam) en houdt de lijst in
 * een gelimiteerde, scrollbare hoogte zodat je makkelijk terug scrollt naar je voorspellingen.
 */
export function FifaRankingHelp({
  locale,
  copy,
  worldCupTeamCodes,
}: {
  locale: "nl" | "en";
  copy: FifaHelpCopy;
  worldCupTeamCodes: string[];
}) {
  const [query, setQuery] = useState("");
  const worldCupSet = useMemo(() => new Set(worldCupTeamCodes), [worldCupTeamCodes]);
  const normalizedSearch = query.trim().toLocaleLowerCase(locale);
  const rows = useMemo(() => {
    if (!normalizedSearch) return fifaRanking;
    return fifaRanking.filter((row) =>
      [row.code, row.name, row.nameNl].some((value) => value.toLocaleLowerCase(locale).includes(normalizedSearch)),
    );
  }, [normalizedSearch, locale]);

  return (
    <details className="panel overflow-hidden">
      <summary className="fifa-help-summary">
        <span>{copy.fifaHelpSummary}</span>
        <ChevronDown aria-hidden="true" className="fifa-help-chevron size-5" />
      </summary>
      <div className="grid gap-2 px-4 pb-4 pt-3">
        <p className="text-xs font-medium leading-5 text-[var(--text-muted)]">{copy.fifaIntro}</p>
        <div className="fifa-ranking-search">
          <input
            className="field"
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder={copy.fifaSearch}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={copy.fifaSearch}
          />
        </div>
        <div className="fifa-ranking-list rounded-lg border border-slate-200">
          {rows.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {rows.map((row) => (
                <FifaRankingItem key={row.code} row={row} locale={locale} isWorldCupTeam={worldCupSet.has(row.code)} />
              ))}
            </div>
          ) : (
            <p className="px-3 py-5 text-center text-sm font-medium text-[var(--text-muted)]">{copy.fifaNoResults}</p>
          )}
        </div>
        <p className="text-xs font-medium leading-5 text-[var(--text-muted)]">
          {copy.sourceNote}: {fifaRankingSource}; {squadValueSource}.
        </p>
      </div>
    </details>
  );
}

function FifaRankingItem({
  row,
  locale,
  isWorldCupTeam,
}: {
  row: FifaRankingRow;
  locale: "nl" | "en";
  isWorldCupTeam: boolean;
}) {
  const name = locale === "nl" ? row.nameNl : row.name;
  const value = formatMarketValue(row.marketValueMillions, locale);

  return (
    <article className={`fifa-ranking-row ${isWorldCupTeam ? "font-black text-[var(--ink)]" : "font-semibold text-slate-700"}`}>
      <span className="fifa-ranking-rank tabular-nums">#{row.rank}</span>
      <div className="fifa-ranking-team">
        <TeamFlag code={row.code} name={name} size="sm" locale={locale} />
        <span className="font-black text-[#064ed6]">{row.code}</span>
        <span className="fifa-ranking-name">{name}</span>
      </div>
      <span className="fifa-ranking-value tabular-nums">{value}</span>
    </article>
  );
}

function formatMarketValue(valueMillions: number | null, locale: "nl" | "en") {
  if (valueMillions === null) return "—";
  if (valueMillions >= 1000) {
    const value = valueMillions / 1000;
    return locale === "nl" ? `€ ${value.toLocaleString("nl-NL", { maximumFractionDigits: 2 })} mld` : `€${value.toFixed(2)}bn`;
  }
  return locale === "nl"
    ? `€ ${valueMillions.toLocaleString("nl-NL", { maximumFractionDigits: 2 })} mln`
    : `€${valueMillions.toFixed(2)}m`;
}
