"use client";

import { useMemo, useState } from "react";
import { formatAmsterdam } from "@/lib/format";
import { calculateGroupStandings, type ScoreLookup } from "@/lib/group-standings";
import type { MatchWithTeams } from "@/lib/types";

type GroupPredictionCardProps = {
  group: string;
  matches: MatchWithTeams[];
  initialScores: Record<number, { home: number; away: number }>;
  disabled?: boolean;
};

function scoreMapFromState(scores: Record<number, { home: number; away: number }>): ScoreLookup {
  return new Map(Object.entries(scores).map(([id, score]) => [Number(id), score]));
}

export function GroupPredictionCard({ group, matches, initialScores, disabled }: GroupPredictionCardProps) {
  const [scores, setScores] = useState(initialScores);
  const standings = useMemo(() => {
    return calculateGroupStandings(matches, scoreMapFromState(scores)).get(group) ?? [];
  }, [group, matches, scores]);

  function updateScore(matchId: number, side: "home" | "away", value: string) {
    const parsed = Number.parseInt(value, 10);
    const next = Number.isFinite(parsed) ? Math.max(0, Math.min(20, parsed)) : 0;
    setScores((current) => ({
      ...current,
      [matchId]: {
        home: current[matchId]?.home ?? 1,
        away: current[matchId]?.away ?? 1,
        [side]: next,
      },
    }));
  }

  return (
    <section className="panel overflow-hidden">
      <div className="wc-header px-4 py-3 text-white">
        <h2 className="text-xl font-black">Groep {group}</h2>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1fr_330px]">
        <div className="divide-y divide-slate-200">
          {matches.map((match) => {
            const existing = scores[match.id] ?? { home: 1, away: 1 };
            return (
              <div key={match.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="text-xs font-black uppercase tracking-normal text-[#48617f]">
                    Wedstrijd {match.id} - {formatAmsterdam(match.starts_at)} - {match.venue}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-lg font-black text-[#081634]">
                    <span>{match.home?.name_nl ?? match.home_code}</span>
                    <span className="text-[#48617f]">tegen</span>
                    <span>{match.away?.name_nl ?? match.away_code}</span>
                  </div>
                </div>
                <fieldset className="flex items-center gap-2" disabled={disabled}>
                  <legend className="sr-only">Voorspel score wedstrijd {match.id}</legend>
                  <input
                    className="score-input"
                    name={`match_${match.id}_home`}
                    type="number"
                    min={0}
                    max={20}
                    value={existing.home}
                    onChange={(event) => updateScore(match.id, "home", event.target.value)}
                    aria-label={`${match.home?.name_nl ?? match.home_code} goals`}
                  />
                  <span className="font-black text-[#48617f]">-</span>
                  <input
                    className="score-input"
                    name={`match_${match.id}_away`}
                    type="number"
                    min={0}
                    max={20}
                    value={existing.away}
                    onChange={(event) => updateScore(match.id, "away", event.target.value)}
                    aria-label={`${match.away?.name_nl ?? match.away_code} goals`}
                  />
                </fieldset>
              </div>
            );
          })}
        </div>
        <aside className="border-t border-slate-200 bg-[#f4fbf0] p-4 lg:border-l lg:border-t-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-lg font-black text-[#081634]">Stand uit jouw scores</h3>
            <span className="rounded-full bg-[#25a84a] px-2 py-1 text-xs font-black text-white">live</span>
          </div>
          <div className="grid grid-cols-[32px_1fr_38px_38px_38px] gap-2 text-xs font-black uppercase text-[#48617f]">
            <span>#</span>
            <span>Land</span>
            <span>Pt</span>
            <span>DS</span>
            <span>V-T</span>
          </div>
          <div className="mt-2 grid gap-2">
            {standings.map((standing, index) => (
              <div
                key={standing.code}
                className={`grid grid-cols-[32px_1fr_38px_38px_38px] gap-2 rounded-lg px-2 py-2 text-sm font-black ${
                  index < 2 ? "bg-white text-[#081634]" : index === 2 ? "bg-yellow-50 text-[#8a5a00]" : "text-[#48617f]"
                }`}
              >
                <span>{index + 1}</span>
                <span>{standing.code}</span>
                <span>{standing.points}</span>
                <span>{standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}</span>
                <span>
                  {standing.goalsFor}-{standing.goalsAgainst}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-bold leading-5 text-[#48617f]">
            De nummers 1 en 2 gaan door. De beste acht nummers 3 worden automatisch meegenomen als laatste 32.
          </p>
        </aside>
      </div>
    </section>
  );
}
