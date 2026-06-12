import assert from "node:assert/strict";
import { test } from "node:test";
import { isValidChoice, pollPercentages } from "../src/lib/live-poll.ts";

test("pollPercentages rounds per option and totals the votes", () => {
  const r = pollPercentages({ a: 3, b: 1, c: 0 });
  assert.equal(r.total, 4);
  assert.equal(r.a, 75);
  assert.equal(r.b, 25);
  assert.equal(r.c, 0);
});

test("pollPercentages is 0% across the board with no votes", () => {
  const r = pollPercentages({ a: 0, b: 0, c: 0 });
  assert.deepEqual({ total: r.total, a: r.a, b: r.b, c: r.c }, { total: 0, a: 0, b: 0, c: 0 });
});

test("isValidChoice rejects 'c' unless a third option exists", () => {
  assert.equal(isValidChoice("a", false), true);
  assert.equal(isValidChoice("b", false), true);
  assert.equal(isValidChoice("c", false), false);
  assert.equal(isValidChoice("c", true), true);
  assert.equal(isValidChoice("d", true), false);
  assert.equal(isValidChoice(undefined, true), false);
});
