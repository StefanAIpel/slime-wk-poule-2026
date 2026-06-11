"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { TeamFlag } from "@/components/team-flag";
import { fifaRanking, type FifaRankingRow } from "@/lib/fifa-ranking";

type FifaHelpCopy = {
  fifaHelpSummary: string;
  fifaHelpDate: string;
  fifaSearch: string;
  fifaNoResults: string;
  colRank: string;
  colCountry: string;
  colValue: string;
};

/**
 * Inklapbare FIFA-ranglijst. Sticky bovenaan het voorspelformulier zodat je tijdens
 * het scrollen steeds hulp kunt inroepen; compact (±top 10 zichtbaar) en filtert live
 * tijdens het typen (NL + EN: code, Nederlandse en Engelse landnaam).
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
    <details className="panel fifa-help-details overflow-hidden">
      <summary className="fifa-help-summary">
        <span className="fifa-help-summary-text">
          <span>{copy.fifaHelpSummary}</span>
          <span className="fifa-help-date">{copy.fifaHelpDate}</span>
        </span>
        <span className="fifa-help-toggle" aria-hidden="true">
          <ChevronDown className="fifa-help-chevron size-4" />
        </span>
      </summary>
      <div className="fifa-help-body">
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
        <div className="fifa-ranking-panel rounded-lg border border-slate-200">
          <div className="fifa-ranking-head">
            <span>{copy.colRank}</span>
            <span>{copy.colCountry}</span>
            <span>{copy.colValue}</span>
          </div>
          <div className={`fifa-ranking-list ${query ? "is-searching" : ""}`}>
            {rows.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <FifaRankingItem key={row.code} row={row} locale={locale} isWorldCupTeam={worldCupSet.has(row.code)} />
                ))}
              </div>
            ) : (
              <p className="px-3 py-4 text-center text-sm font-medium text-[var(--text-muted)]">{copy.fifaNoResults}</p>
            )}
          </div>
        </div>
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

/** Alle bedragen uniform in miljoen met één decimaal, bijv. "€ 1.520,0 mln". */
function formatMarketValue(valueMillions: number | null, locale: "nl" | "en") {
  if (valueMillions === null) return "—";
  const formatted = valueMillions.toLocaleString(locale === "nl" ? "nl-NL" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return locale === "nl" ? `€ ${formatted} mln` : `€${formatted}m`;
}
