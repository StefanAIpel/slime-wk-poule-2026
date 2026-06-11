import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BONUS_TOTAL,
  GROUP_MATCH_TOTAL,
  KNOCKOUT_TOTAL,
  predictionCompletion,
} from "../src/lib/prediction-progress.ts";

test("totals match the tournament shape (72 group, 31 knockout, 6 bonus)", () => {
  assert.equal(GROUP_MATCH_TOTAL, 72);
  assert.equal(KNOCKOUT_TOTAL, 31);
  assert.equal(BONUS_TOTAL, 6);
});

test("predictionCompletion computes per-section and overall percentages", () => {
  const full = predictionCompletion({ groupFilled: 72, knockoutFilled: 31, bonusFilled: 6 });
  assert.deepEqual(
    { g: full.groupPct, k: full.knockoutPct, b: full.bonusPct, o: full.overallPct },
    { g: 100, k: 100, b: 100, o: 100 },
  );

  const empty = predictionCompletion({ groupFilled: 0, knockoutFilled: 0, bonusFilled: 0 });
  assert.equal(empty.overallPct, 0);

  const partial = predictionCompletion({ groupFilled: 36, knockoutFilled: 0, bonusFilled: 3 });
  assert.equal(partial.groupPct, 50);
  assert.equal(partial.bonusPct, 50);
  // Totaal weegt naar het aantal velden: (36+0+3) / (72+31+6) = 39/109.
  assert.equal(partial.overallPct, Math.round((39 / 109) * 100));
});

test("predictionCompletion clamps out-of-range counts", () => {
  const over = predictionCompletion({ groupFilled: 999, knockoutFilled: 999, bonusFilled: 999 });
  assert.equal(over.overallPct, 100);
  const under = predictionCompletion({ groupFilled: -5, knockoutFilled: -1, bonusFilled: -2 });
  assert.equal(under.groupPct, 0);
});
