// Leidt toernooi-"facts" (bonusvraag-antwoorden) automatisch af uit API-Football
// fixtures. Deze waarden zijn EIND-toernooi-uitkomsten (bv. total_goals heeft een
// DB-check 100–500), dus we schrijven een fact alleen als het definitief is. De
// overige (oranje_stage, cards_ko_team_code, own_goals_ko) blijven handmatig.

import type { LiveFixture, MatchEvent } from "@/lib/apifootball-live";

const FINISHED = new Set(["FT", "AET", "PEN"]);

export type ComputedFacts = {
  facts: Record<string, number | string>;
  stageResults: { stage_key: string; team_codes: string[] }[];
  notes: string[];
};

function isFinal(round: string) {
  const r = round.toLowerCase();
  return r.includes("final") && !r.includes("semi") && !r.includes("quarter") && !r.includes("3rd") && !r.includes("third") && !r.includes("round");
}

export function computeTournamentFacts(fixtures: LiveFixture[], eventsByFixture?: Map<number, MatchEvent[]>): ComputedFacts {
  const facts: Record<string, number | string> = {};
  const stageResults: { stage_key: string; team_codes: string[] }[] = [];
  const notes: string[] = [];

  const finished = fixtures.filter((f) => FINISHED.has(f.statusShort));
  const allFinished = fixtures.length > 0 && finished.length === fixtures.length;

  // total_goals — alleen definitief als alle wedstrijden gespeeld zijn (DB-check 100–500).
  const totalGoals = finished.reduce((sum, f) => sum + (f.home.goals ?? 0) + (f.away.goals ?? 0), 0);
  if (allFinished && totalGoals >= 100 && totalGoals <= 500) facts.total_goals = totalGoals;
  else notes.push(`total_goals nog niet definitief (${finished.length}/${fixtures.length} gespeeld, som ${totalGoals})`);

  // team_most_goals_code — alleen aan het eind.
  if (allFinished) {
    const goalsByCode = new Map<string, number>();
    for (const f of finished) {
      if (f.home.code) goalsByCode.set(f.home.code, (goalsByCode.get(f.home.code) ?? 0) + (f.home.goals ?? 0));
      if (f.away.code) goalsByCode.set(f.away.code, (goalsByCode.get(f.away.code) ?? 0) + (f.away.goals ?? 0));
    }
    let top: [string, number] | null = null;
    for (const entry of goalsByCode) if (!top || entry[1] > top[1]) top = entry;
    if (top) facts.team_most_goals_code = top[0];
  } else {
    notes.push("team_most_goals_code nog niet definitief");
  }

  // penalty_shootouts_ko — aantal KO-duels beslist via strafschoppen; definitief als alle KO gespeeld.
  const ko = fixtures.filter((f) => !f.round.toLowerCase().includes("group"));
  const koFinished = ko.filter((f) => FINISHED.has(f.statusShort));
  if (ko.length > 0 && koFinished.length === ko.length) {
    facts.penalty_shootouts_ko = ko.filter((f) => f.statusShort === "PEN").length;
  } else {
    notes.push("penalty_shootouts_ko nog niet definitief (niet alle KO gespeeld)");
  }

  // Kampioen + finalisten uit de finale.
  const final = fixtures.find((f) => isFinal(f.round));
  if (final && FINISHED.has(final.statusShort)) {
    if (final.home.code && final.away.code) stageResults.push({ stage_key: "finalists", team_codes: [final.home.code, final.away.code] });
    const winner = final.home.winner ? final.home : final.away.winner ? final.away : null;
    if (winner?.code) stageResults.push({ stage_key: "champion", team_codes: [winner.code] });
  } else {
    notes.push("kampioen/finalisten nog niet bekend (finale niet gespeeld)");
  }

  // Diepe facts (vereisen events per wedstrijd): totaal rode kaarten + snelste goal.
  if (eventsByFixture && allFinished) {
    let reds = 0;
    let fastest: number | null = null;
    for (const f of finished) {
      for (const ev of eventsByFixture.get(f.id) ?? []) {
        if (ev.type === "Card" && ev.detail.toLowerCase().includes("red card")) reds++;
        if (ev.type === "Goal" && !/missed|cancel/i.test(ev.detail)) {
          const minute = (ev.time.elapsed ?? 0) + (ev.time.extra ?? 0);
          if (minute > 0 && (fastest === null || minute < fastest)) fastest = minute;
        }
      }
    }
    facts.total_red_cards = reds;
    if (fastest !== null) facts.fastest_goal_minute = fastest;
  } else if (!eventsByFixture) {
    notes.push("total_red_cards / fastest_goal_minute vereisen deep-modus (events per wedstrijd)");
  }

  return { facts, stageResults, notes };
}
