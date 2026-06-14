import assert from "node:assert/strict";
import { test } from "node:test";
import {
  matchScoring,
  oranjeStageOrder,
  scoreCloseNumber,
  scoreMatchPrediction,
  scoreOranjeStage,
  scoreStagePrediction,
  scoreTextPrediction,
  scoreTotalGoalsPrediction,
  specialScoring,
  stageScoring,
} from "../src/lib/scoring.ts";

test("exacte uitslag levert het maximum (12) op", () => {
  const r = scoreMatchPrediction({ predictedHome: 2, predictedAway: 1, actualHome: 2, actualAway: 1 });
  assert.equal(r.points, matchScoring.exact);
  assert.equal(r.exact, 1);
  assert.equal(r.correct, 1);
});

test("juiste winnaar + één juist teamdoelpunt = 8 (voorbeeld uit de regels)", () => {
  // voorspeld 2-1, uitslag 2-0: winnaar (6) + thuis precies 2 (2) = 8
  const r = scoreMatchPrediction({ predictedHome: 2, predictedAway: 1, actualHome: 2, actualAway: 0 });
  assert.equal(r.points, 8);
  assert.equal(r.exact, 0);
  assert.equal(r.correct, 1);
});

test("juiste richting + juist doelsaldo telt door", () => {
  // voorspeld 1-0, uitslag 2-1: winnaar (6) + doelsaldo +1 (2) = 8
  const r = scoreMatchPrediction({ predictedHome: 1, predictedAway: 0, actualHome: 2, actualAway: 1 });
  assert.equal(r.points, matchScoring.outcome + matchScoring.goalDifference);
});

test("verkeerde uitslag levert 0 op", () => {
  const r = scoreMatchPrediction({ predictedHome: 0, predictedAway: 2, actualHome: 3, actualAway: 0 });
  assert.equal(r.points, 0);
  assert.equal(r.correct, 0);
});

test("gelijkspel exact telt als exact", () => {
  const r = scoreMatchPrediction({ predictedHome: 1, predictedAway: 1, actualHome: 1, actualAway: 1 });
  assert.equal(r.points, matchScoring.exact);
});

test("geen uitslag bekend = 0 punten", () => {
  const r = scoreMatchPrediction({ predictedHome: 1, predictedAway: 1, actualHome: null, actualAway: null });
  assert.equal(r.points, 0);
});

test("punt per wedstrijd kan nooit boven 12 (geen dubbeltelling bij exact)", () => {
  for (let h = 0; h <= 5; h += 1) {
    for (let a = 0; a <= 5; a += 1) {
      const r = scoreMatchPrediction({ predictedHome: h, predictedAway: a, actualHome: h, actualAway: a });
      assert.ok(r.points <= matchScoring.exact, `${h}-${a} gaf ${r.points}`);
    }
  }
});

test("Oranje-multiplier verdubbelt de wedstrijdpunten (tellers blijven 1/0)", () => {
  const base = scoreMatchPrediction({ predictedHome: 2, predictedAway: 1, actualHome: 2, actualAway: 1 });
  const doubled = scoreMatchPrediction({ predictedHome: 2, predictedAway: 1, actualHome: 2, actualAway: 1 }, 2);
  assert.equal(base.points, matchScoring.exact);
  assert.equal(doubled.points, matchScoring.exact * 2);
  assert.equal(doubled.exact, 1);
  assert.equal(doubled.correct, 1);
});

test("Oranje-multiplier op een mis blijft 0", () => {
  const r = scoreMatchPrediction({ predictedHome: 0, predictedAway: 3, actualHome: 2, actualAway: 0 }, 2);
  assert.equal(r.points, 0);
});

test("rondekeuzes: punten per juist land, alleen voor overlap", () => {
  const points = scoreStagePrediction("quarterfinal", ["NED", "BRA", "FRA"], ["NED", "FRA", "ARG"]);
  assert.equal(points, 2 * stageScoring.quarterfinal);
});

test("rondekeuzes zonder uitkomst = 0", () => {
  assert.equal(scoreStagePrediction("semifinal", ["NED"], []), 0);
});

test("tekstvoorspelling matcht hoofdletter- en accent-ongevoelig", () => {
  assert.equal(scoreTextPrediction("MEX", ["mex"], specialScoring.teamMostGoals), specialScoring.teamMostGoals);
  assert.equal(scoreTextPrediction("Curaçao", ["curacao"], 10), 10);
  assert.equal(scoreTextPrediction("X", ["Y"], 10), 0);
});

test("scoreCloseNumber: exact vs dichtbij vs mis", () => {
  assert.equal(scoreCloseNumber(10, 10, 12, 6, 1), 12);
  assert.equal(scoreCloseNumber(10, 11, 12, 6, 1), 6);
  assert.equal(scoreCloseNumber(10, 20, 12, 6, 1), 0);
  assert.equal(scoreCloseNumber(null, 10), 0);
});

test("totaal goals beloont exact, dichtbij en bijna", () => {
  assert.equal(scoreTotalGoalsPrediction(172, 172), specialScoring.totalGoalsExact);
  assert.equal(scoreTotalGoalsPrediction(168, 172), specialScoring.totalGoalsClose);
  assert.equal(scoreTotalGoalsPrediction(162, 172), specialScoring.totalGoalsNear);
  assert.equal(scoreTotalGoalsPrediction(150, 172), 0);
  assert.equal(scoreTotalGoalsPrediction(null, 172), 0);
});

test("hoe ver komt Oranje: exact = vol, één ronde ernaast = deel, verder = 0", () => {
  assert.equal(scoreOranjeStage("kwart", "kwart"), specialScoring.oranjeExact);
  assert.equal(scoreOranjeStage("kwart", "halve"), specialScoring.oranjeClose);
  assert.equal(scoreOranjeStage("groep", "kampioen"), 0);
  assert.equal(scoreOranjeStage(null, "kwart"), 0);
  // volgorde klopt en is uniek
  assert.equal(new Set(oranjeStageOrder).size, oranjeStageOrder.length);
});
