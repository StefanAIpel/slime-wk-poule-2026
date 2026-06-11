import assert from "node:assert/strict";
import { test } from "node:test";
import { KICKOFF_SOON_MS, isKickoffSoon } from "../src/lib/live-window.ts";

const NOW = new Date("2026-06-11T19:00:00Z").getTime();
const iso = (msFromNow: number) => new Date(NOW + msFromNow).toISOString();

test("a scheduled match promotes to live from 30 minutes before kick-off", () => {
  assert.equal(isKickoffSoon("NS", iso(31 * 60 * 1000), NOW), false, "31 min out: not yet");
  assert.equal(isKickoffSoon("NS", iso(KICKOFF_SOON_MS), NOW), true, "exactly 30 min out: promote");
  assert.equal(isKickoffSoon("NS", iso(5 * 60 * 1000), NOW), true, "5 min out: promote");
});

test("a kicked-off match stuck on NS still counts as busy (API lag), but not forever", () => {
  assert.equal(isKickoffSoon("NS", iso(-60 * 60 * 1000), NOW), true, "1h after scheduled, still NS: busy");
  assert.equal(isKickoffSoon("NS", iso(-4 * 60 * 60 * 1000), NOW), false, "4h after: drop");
});

test("only NS matches are promoted (live/finished handled elsewhere)", () => {
  assert.equal(isKickoffSoon("1H", iso(5 * 60 * 1000), NOW), false);
  assert.equal(isKickoffSoon("FT", iso(-10 * 60 * 1000), NOW), false);
});

test("a finished match lingers in 'Nu bezig' for ~30 min, then moves to results", async () => {
  const { isJustFinished } = await import("../src/lib/live-window.ts");
  // Groepswedstrijd duurt ±2u: tot 2,5u na aftrap geldt "net klaar".
  assert.equal(isJustFinished("FT", iso(-2 * 60 * 60 * 1000), NOW), true, "FT, 2h after kickoff: linger");
  assert.equal(isJustFinished("FT", iso(-3 * 60 * 60 * 1000), NOW), false, "FT, 3h after kickoff: move to results");
  assert.equal(isJustFinished("NS", iso(-2 * 60 * 60 * 1000), NOW), false, "not finished: no linger");
  assert.equal(isJustFinished("PEN", iso(-2 * 60 * 60 * 1000), NOW), true, "PEN counts as finished");
});

test("goalLines extracts scorers with minute, side and markers", async () => {
  const { goalLines } = await import("../src/lib/live-events.ts");
  const event = (over: Record<string, unknown>) => ({
    time: { elapsed: 14, extra: null },
    team: { id: 1, name: "Mexico" },
    player: { name: "R. Jiménez" },
    assist: { name: null },
    type: "Goal",
    detail: "Normal Goal",
    ...over,
  });
  const lines = goalLines([
    event({}),
    event({ detail: "Penalty", time: { elapsed: 45, extra: 3 }, team: { id: 2, name: "Zuid-Afrika" }, player: { name: "P. Tau" } }),
    event({ detail: "Missed Penalty" }),
    event({ type: "Card", detail: "Yellow Card" }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any);
  assert.equal(lines.length, 2);
  assert.deepEqual(lines[0], { minute: "14'", player: "R. Jiménez", teamId: 1, ownGoal: false, penalty: false });
  assert.deepEqual(lines[1], { minute: "45+3'", player: "P. Tau", teamId: 2, ownGoal: false, penalty: true });
});
