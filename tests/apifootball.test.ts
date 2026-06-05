import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSyncPayload, mapStatus, type ApiFixture, type ResolveMaps } from "../src/lib/apifootball.ts";

test("mapStatus maps API-Football short codes to our statuses", () => {
  assert.equal(mapStatus("NS"), "scheduled");
  assert.equal(mapStatus("1H"), "live");
  assert.equal(mapStatus("HT"), "live");
  assert.equal(mapStatus("FT"), "finished");
  assert.equal(mapStatus("AET"), "finished");
  assert.equal(mapStatus("PEN"), "finished");
  assert.equal(mapStatus("PST"), "scheduled");
});

function fixture(partial: {
  id: number;
  short: string;
  homeId?: number;
  awayId?: number;
  homeGoals?: number | null;
  awayGoals?: number | null;
  homeWinner?: boolean | null;
  awayWinner?: boolean | null;
}): ApiFixture {
  return {
    fixture: { id: partial.id, date: "2026-06-11T18:00:00+00:00", status: { short: partial.short } },
    teams: {
      home: partial.homeId ? { id: partial.homeId, winner: partial.homeWinner ?? null } : null,
      away: partial.awayId ? { id: partial.awayId, winner: partial.awayWinner ?? null } : null,
    },
    goals: { home: partial.homeGoals ?? null, away: partial.awayGoals ?? null },
  };
}

const maps: ResolveMaps = {
  matchByFixtureId: new Map([
    [1001, { matchId: 1, stage: "group" }],
    [1002, { matchId: 2, stage: "group" }],
    [2001, { matchId: 104, stage: "final" }],
    [3001, { matchId: 73, stage: "round32" }],
  ]),
  codeByTeamId: new Map([
    [50, "NLD"],
    [51, "BRA"],
    [52, "ARG"],
    [53, "FRA"],
  ]),
};

test("only finished matches with scores end up in results", () => {
  const { results } = buildSyncPayload(
    [
      fixture({ id: 1001, short: "FT", homeId: 50, awayId: 51, homeGoals: 2, awayGoals: 1 }),
      fixture({ id: 1002, short: "1H", homeId: 52, awayId: 53, homeGoals: 1, awayGoals: 0 }), // live -> niet scoren
      fixture({ id: 9999, short: "FT", homeId: 50, awayId: 51, homeGoals: 3, awayGoals: 0 }), // geen mapping -> negeren
    ],
    maps,
  );
  assert.deepEqual(results, [{ id: 1, home_score: 2, away_score: 1, status: "finished" }]);
});

test("final yields finalists and champion via the winner flag (penalty-proof)", () => {
  const { stage_results } = buildSyncPayload(
    [fixture({ id: 2001, short: "PEN", homeId: 50, awayId: 51, homeGoals: 1, awayGoals: 1, awayWinner: true })],
    maps,
  );
  const finalists = stage_results.find((s) => s.stage_key === "finalists");
  const champion = stage_results.find((s) => s.stage_key === "champion");
  assert.deepEqual(finalists?.team_codes.sort(), ["BRA", "NLD"]);
  assert.deepEqual(champion?.team_codes, ["BRA"]);
});

test("knock-out participants are collected per reached round even before the match finishes", () => {
  const { stage_results } = buildSyncPayload(
    [fixture({ id: 3001, short: "NS", homeId: 52, awayId: 53 })],
    maps,
  );
  const round32 = stage_results.find((s) => s.stage_key === "round32");
  assert.deepEqual(round32?.team_codes.sort(), ["ARG", "FRA"]);
});
