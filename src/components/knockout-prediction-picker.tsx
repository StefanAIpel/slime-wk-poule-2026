"use client";

import { useMemo, useState } from "react";

import { TeamFlag } from "@/components/team-flag";
import { fifaRankLabel } from "@/lib/fifa-ranking";
import { teamNameForLocale } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Team } from "@/lib/types";

type StageKey = "round16" | "quarterfinal" | "semifinal" | "finalists";

type SelectionState = Record<StageKey, string[]>;

const stageLimits: Record<StageKey, number> = {
  round16: 16,
  quarterfinal: 8,
  semifinal: 4,
  finalists: 2,
};

const stageCopy: Record<Locale, Record<StageKey, { title: string; hint: string; empty: string }>> = {
  nl: {
    round16: {
      title: "Achtste finale",
      hint: "Kies precies 16 landen uit jouw berekende laatste 32. Meer kan niet; minder geeft een waarschuwing.",
      empty: "Vul eerst je groepswedstrijden in; daaruit rollen je laatste 32 landen.",
    },
    quarterfinal: {
      title: "Kwartfinale",
      hint: "Kies precies 8 kwartfinalisten uit jouw 16 landen hierboven.",
      empty: "Kies eerst landen bij de achtste finale; daarna verschijnen hier je opties.",
    },
    semifinal: {
      title: "Halve finale",
      hint: "Kies precies 4 halvefinalisten uit jouw kwartfinalisten.",
      empty: "Kies eerst kwartfinalisten; daarna verschijnen hier je opties.",
    },
    finalists: {
      title: "Finale",
      hint: "Kies precies 2 finalisten. Wijzigbaar t/m zondag 14 juni 21:00.",
      empty: "Kies eerst halvefinalisten; daarna verschijnen hier je opties.",
    },
  },
  en: {
    round16: {
      title: "Round of 16",
      hint: "Choose exactly 16 countries from your calculated last 32. You cannot pick more; fewer gives a warning.",
      empty: "Fill in your group matches first; they produce your last 32 countries.",
    },
    quarterfinal: {
      title: "Quarter-final",
      hint: "Choose exactly 8 quarter-finalists from your 16 countries above.",
      empty: "Choose countries in the round of 16 first; then your options appear here.",
    },
    semifinal: {
      title: "Semi-final",
      hint: "Choose exactly 4 semi-finalists from your quarter-finalists.",
      empty: "Choose quarter-finalists first; then your options appear here.",
    },
    finalists: {
      title: "Final",
      hint: "Choose exactly 2 finalists. Editable until Sunday 14 June 21:00.",
      empty: "Choose semi-finalists first; then your options appear here.",
    },
  },
};

const pickerCopy = {
  nl: {
    good: (count: number, expected: number) => `Goed: ${count}/${expected} gekozen.`,
    none: (expected: number) => `Nog niets gekozen — kies precies ${expected}.`,
    remaining: (count: number, expected: number) => `Nog ${expected - count} kiezen (${count}/${expected}).`,
    tooMany: (count: number, expected: number) => `Te veel gekozen: haal er ${count - expected} weg.`,
    maxReached: (limit: number) => `Max ${limit} bereikt. Haal eerst een land weg als je wilt wisselen.`,
  },
  en: {
    good: (count: number, expected: number) => `Good: ${count}/${expected} selected.`,
    none: (expected: number) => `Nothing selected yet — choose exactly ${expected}.`,
    remaining: (count: number, expected: number) => `${expected - count} still to choose (${count}/${expected}).`,
    tooMany: (count: number, expected: number) => `Too many selected: remove ${count - expected}.`,
    maxReached: (limit: number) => `Maximum ${limit} reached. Remove a country first if you want to switch.`,
  },
} as const;

function uniqueValidCodes(codes: string[] | undefined, validCodes: Set<string>, limit: number) {
  const result: string[] = [];
  for (const code of codes ?? []) {
    const normalized = code.toUpperCase();
    if (!validCodes.has(normalized) || result.includes(normalized)) continue;
    result.push(normalized);
    if (result.length >= limit) break;
  }
  return result;
}

function cleanAgainstOptions(codes: string[], allowed: string[], limit: number) {
  const allowedSet = new Set(allowed);
  return codes.filter((code) => allowedSet.has(code)).slice(0, limit);
}

function labelForCount(count: number, expected: number, locale: Locale) {
  const copy = pickerCopy[locale];
  if (count === expected) return copy.good(count, expected);
  if (count === 0) return copy.none(expected);
  if (count < expected) return copy.remaining(count, expected);
  return copy.tooMany(count, expected);
}

export function KnockoutPredictionPicker({
  teams,
  initialSelections,
  round16Pool,
  mainDisabled,
  lateDisabled,
  locale = "nl",
}: {
  teams: Team[];
  initialSelections: Partial<SelectionState>;
  round16Pool?: string[];
  mainDisabled?: boolean;
  lateDisabled?: boolean;
  locale?: Locale;
}) {
  const validCodes = useMemo(() => new Set(teams.map((team) => team.code.toUpperCase())), [teams]);
  // De laatste 32 die uit de groepsvoorspellingen rollen. Alleen daaruit kies je je achtste finalisten.
  const round16Set = useMemo(
    () => (round16Pool ? new Set(round16Pool.map((code) => code.toUpperCase())) : null),
    [round16Pool],
  );
  const round16Teams = useMemo(
    () => (round16Set ? teams.filter((team) => round16Set.has(team.code.toUpperCase())) : teams),
    [teams, round16Set],
  );
  const [notice, setNotice] = useState<{ stage: StageKey; message: string } | null>(null);
  const [state, setState] = useState<SelectionState>(() => {
    const round16Raw = uniqueValidCodes(initialSelections.round16, validCodes, stageLimits.round16);
    const round16 = round16Set ? round16Raw.filter((code) => round16Set.has(code)) : round16Raw;
    const quarterfinal = cleanAgainstOptions(
      uniqueValidCodes(initialSelections.quarterfinal, validCodes, stageLimits.quarterfinal),
      round16,
      stageLimits.quarterfinal,
    );
    const semifinal = cleanAgainstOptions(
      uniqueValidCodes(initialSelections.semifinal, validCodes, stageLimits.semifinal),
      quarterfinal,
      stageLimits.semifinal,
    );
    const finalists = cleanAgainstOptions(
      uniqueValidCodes(initialSelections.finalists, validCodes, stageLimits.finalists),
      semifinal,
      stageLimits.finalists,
    );
    return { round16, quarterfinal, semifinal, finalists };
  });

  const teamsByStage = useMemo(
    () => ({
      round16: round16Teams,
      quarterfinal: teams.filter((team) => state.round16.includes(team.code)),
      semifinal: teams.filter((team) => state.quarterfinal.includes(team.code)),
      finalists: teams.filter((team) => state.semifinal.includes(team.code)),
    }),
    [teams, round16Teams, state.round16, state.quarterfinal, state.semifinal],
  );

  function cascadeSelection(previous: SelectionState, stage: StageKey, nextCodes: string[]): SelectionState {
    if (stage === "round16") {
      const quarterfinal = cleanAgainstOptions(previous.quarterfinal, nextCodes, stageLimits.quarterfinal);
      const semifinal = cleanAgainstOptions(previous.semifinal, quarterfinal, stageLimits.semifinal);
      const finalists = cleanAgainstOptions(previous.finalists, semifinal, stageLimits.finalists);
      return { ...previous, round16: nextCodes, quarterfinal, semifinal, finalists };
    }
    if (stage === "quarterfinal") {
      const semifinal = cleanAgainstOptions(previous.semifinal, nextCodes, stageLimits.semifinal);
      const finalists = cleanAgainstOptions(previous.finalists, semifinal, stageLimits.finalists);
      return { ...previous, quarterfinal: nextCodes, semifinal, finalists };
    }
    if (stage === "semifinal") {
      const finalists = cleanAgainstOptions(previous.finalists, nextCodes, stageLimits.finalists);
      return { ...previous, semifinal: nextCodes, finalists };
    }
    return { ...previous, finalists: nextCodes };
  }

  function toggleStage(stage: StageKey, code: string, checked: boolean) {
    const current = state[stage];
    const limit = stageLimits[stage];
    if (checked && !current.includes(code) && current.length >= limit) {
      setNotice({ stage, message: pickerCopy[locale].maxReached(limit) });
      return;
    }

    const nextCodes = checked ? [...current, code] : current.filter((selectedCode) => selectedCode !== code);
    setNotice(null);
    setState((previous) => cascadeSelection(previous, stage, nextCodes));
  }

  function renderStage(stage: StageKey, disabled?: boolean) {
    const copy = stageCopy[locale][stage];
    const limit = stageLimits[stage];
    const selected = state[stage];
    const selectedSet = new Set(selected);
    const options = teamsByStage[stage];
    const complete = selected.length === limit;
    const status = notice?.stage === stage ? notice.message : labelForCount(selected.length, limit, locale);
    const isDisabled = disabled || options.length === 0;

    return (
      <fieldset key={stage} className="knockout-picker-card" disabled={isDisabled} data-complete={complete ? "true" : "false"}>
        <legend className="knockout-picker-title">{copy.title}</legend>
        <p className="knockout-picker-hint">{copy.hint}</p>
        <p className={`knockout-picker-status ${complete ? "knockout-picker-status-ok" : "knockout-picker-status-warn"}`} aria-live="polite">
          {status}
        </p>
        {options.length ? (
          <div className="knockout-picker-grid">
            {options.map((team) => {
              const teamName = teamNameForLocale(team.code, team.name_nl, locale);
              const rank = fifaRankLabel(team.code);
              return (
                <label key={`${stage}-${team.code}`} className="knockout-picker-option">
                  <input
                    name={stage}
                    type="checkbox"
                    value={team.code}
                    checked={selectedSet.has(team.code)}
                    onChange={(event) => toggleStage(stage, team.code, event.currentTarget.checked)}
                  />
                  <TeamFlag code={team.code} name={teamName} size="sm" locale={locale} />
                  <span className="knockout-picker-code">{team.code}</span>
                  <span className="knockout-picker-name">
                    <span>{teamName}</span>
                    {rank ? <span className="fifa-rank-chip">{rank}</span> : null}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="knockout-picker-empty">{copy.empty}</p>
        )}
      </fieldset>
    );
  }

  return (
    <div className="knockout-picker">
      {renderStage("round16", mainDisabled)}
      {renderStage("quarterfinal", mainDisabled)}
      {renderStage("semifinal", mainDisabled)}
      {renderStage("finalists", lateDisabled)}
    </div>
  );
}
