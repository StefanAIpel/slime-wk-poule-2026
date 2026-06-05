"use client";

import { useMemo, useState } from "react";

import { TeamFlag } from "@/components/team-flag";
import type { Team } from "@/lib/types";

type StageKey = "round16" | "quarterfinal" | "semifinal" | "finalists";

type SelectionState = Record<StageKey, string[]>;

const stageLimits: Record<StageKey, number> = {
  round16: 16,
  quarterfinal: 8,
  semifinal: 4,
  finalists: 2,
};

const stageCopy: Record<StageKey, { title: string; hint: string; empty: string }> = {
  round16: {
    title: "Achtste finale",
    hint: "Kies precies 16 landen. Meer kan niet; minder geeft een waarschuwing.",
    empty: "Er zijn nog geen landen beschikbaar.",
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
    hint: "Kies precies 2 finalisten. Wijzigbaar t/m 28 juni 21:00.",
    empty: "Kies eerst halvefinalisten; daarna verschijnen hier je opties.",
  },
};

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

function labelForCount(count: number, expected: number) {
  if (count === expected) return `Goed: ${count}/${expected} gekozen.`;
  if (count === 0) return `Nog niets gekozen — kies precies ${expected}.`;
  if (count < expected) return `Nog ${expected - count} kiezen (${count}/${expected}).`;
  return `Te veel gekozen: haal er ${count - expected} weg.`;
}

export function KnockoutPredictionPicker({
  teams,
  initialSelections,
  mainDisabled,
  lateDisabled,
}: {
  teams: Team[];
  initialSelections: Partial<SelectionState>;
  mainDisabled?: boolean;
  lateDisabled?: boolean;
}) {
  const validCodes = useMemo(() => new Set(teams.map((team) => team.code.toUpperCase())), [teams]);
  const [notice, setNotice] = useState<{ stage: StageKey; message: string } | null>(null);
  const [state, setState] = useState<SelectionState>(() => {
    const round16 = uniqueValidCodes(initialSelections.round16, validCodes, stageLimits.round16);
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
      round16: teams,
      quarterfinal: teams.filter((team) => state.round16.includes(team.code)),
      semifinal: teams.filter((team) => state.quarterfinal.includes(team.code)),
      finalists: teams.filter((team) => state.semifinal.includes(team.code)),
    }),
    [teams, state.round16, state.quarterfinal, state.semifinal],
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
      setNotice({ stage, message: `Max ${limit} bereikt. Haal eerst een land weg als je wilt wisselen.` });
      return;
    }

    const nextCodes = checked ? [...current, code] : current.filter((selectedCode) => selectedCode !== code);
    setNotice(null);
    setState((previous) => cascadeSelection(previous, stage, nextCodes));
  }

  function renderStage(stage: StageKey, disabled?: boolean) {
    const copy = stageCopy[stage];
    const limit = stageLimits[stage];
    const selected = state[stage];
    const selectedSet = new Set(selected);
    const options = teamsByStage[stage];
    const complete = selected.length === limit;
    const status = notice?.stage === stage ? notice.message : labelForCount(selected.length, limit);
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
            {options.map((team) => (
              <label key={`${stage}-${team.code}`} className="knockout-picker-option">
                <input
                  name={stage}
                  type="checkbox"
                  value={team.code}
                  checked={selectedSet.has(team.code)}
                  onChange={(event) => toggleStage(stage, team.code, event.currentTarget.checked)}
                />
                <TeamFlag code={team.code} name={team.name_nl} size="sm" />
                <span className="knockout-picker-code">{team.code}</span>
                <span className="knockout-picker-name">{team.name_nl}</span>
              </label>
            ))}
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
