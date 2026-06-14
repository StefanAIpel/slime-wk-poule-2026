import assert from "node:assert/strict";
import { test } from "node:test";
import { computeTournamentFacts } from "../src/lib/tournament-facts.ts";

type Team = { id: number; name: string; code: string | null; group: string | null; logo: string; goals: number | null; winner: boolean | null };
function team(code: string, goals: number | null, winner = false): Team {
  return { id: code.charCodeAt(0), name: code, code, group: "A", logo: "", goals, winner };
}
function fx(id: number, round: string, statusShort: string, home: Team, away: Team) {
  return { id, date: "2026-06-11T19:00:00Z", statusShort, statusLong: "", elapsed: null, round, venue: null, friendly: false, home, away };
}

test("partial tournament does not write end-of-tournament facts", () => {
  const { facts, notes } = computeTournamentFacts([
    fx(1, "Group Stage - 1", "FT", team("NED", 2), team("USA", 1)),
    fx(2, "Group Stage - 1", "NS", team("BRA", null), team("ARG", null)),
  ]);
  assert.equal(facts.total_goals, undefined);
  assert.equal(facts.team_most_goals_code, undefined);
  assert.ok(notes.some((n) => n.includes("total_goals")));
});

test("all matches finished: total goals (in range) + top scoring team", () => {
  const { facts } = computeTournamentFacts([fx(1, "Group Stage - 1", "FT", team("NED", 60), team("USA", 40))]);
  assert.equal(facts.total_goals, 100);
  assert.equal(facts.team_most_goals_code, "NED");
});

test("champion and finalists are derived from the final", () => {
  const { stageResults } = computeTournamentFacts([
    fx(1, "Group Stage - 1", "FT", team("NED", 1), team("USA", 0)),
    fx(2, "Final", "FT", team("NED", 2, true), team("BRA", 1, false)),
  ]);
  assert.deepEqual(stageResults.find((r) => r.stage_key === "champion"), { stage_key: "champion", team_codes: ["NED"] });
  assert.deepEqual(stageResults.find((r) => r.stage_key === "finalists"), { stage_key: "finalists", team_codes: ["NED", "BRA"] });
});

test("penalty shootouts in the knockout are counted when all KO matches are done", () => {
  const { facts } = computeTournamentFacts([
    fx(1, "Round of 16", "PEN", team("NED", 1, true), team("USA", 1)),
    fx(2, "Final", "FT", team("NED", 2, true), team("BRA", 1)),
  ]);
  assert.equal(facts.penalty_shootouts_ko, 1);
});

test("deep mode derives yellow cards, red cards and fastest goal from events", () => {
  const events = new Map([
    [1, [
      { time: { elapsed: 3, extra: null }, team: { id: 1, name: "NED" }, player: { name: "X" }, assist: { name: null }, type: "Goal", detail: "Normal Goal" },
      { time: { elapsed: 22, extra: null }, team: { id: 1, name: "NED" }, player: { name: "Z" }, assist: { name: null }, type: "Card", detail: "Yellow Card" },
      { time: { elapsed: 70, extra: null }, team: { id: 2, name: "USA" }, player: { name: "Y" }, assist: { name: null }, type: "Card", detail: "Red Card" },
    ]],
  ]);
  const { facts } = computeTournamentFacts([fx(1, "Group Stage - 1", "FT", team("NED", 1), team("USA", 0))], events);
  assert.equal(facts.total_yellow_cards, 1);
  assert.equal(facts.total_red_cards, 1);
  assert.equal(facts.fastest_goal_minute, 3);
});
