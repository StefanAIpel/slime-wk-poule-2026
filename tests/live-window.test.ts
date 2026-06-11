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
