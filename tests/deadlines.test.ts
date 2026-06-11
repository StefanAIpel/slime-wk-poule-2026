import assert from "node:assert/strict";
import { test } from "node:test";
import { isMatchLocked, isNlMatch, matchLockTime } from "../src/lib/entry-rules.ts";

const ENTRY_GRACE_DEADLINE = new Date("2026-06-14T21:00:00+02:00");

test("matchLockTime is 30 minuten vóór de aftrap", () => {
  const start = "2026-06-14T20:00:00Z";
  assert.equal(matchLockTime(start).toISOString(), "2026-06-14T19:30:00.000Z");
});

test("isMatchLocked: open ruim vóór, dicht binnen 30 min en na aftrap", () => {
  const start = "2026-06-14T20:00:00Z";
  assert.equal(isMatchLocked(start, new Date("2026-06-14T19:00:00Z")), false); // 60 min ervoor
  assert.equal(isMatchLocked(start, new Date("2026-06-14T19:30:00Z")), true); // precies op de grens
  assert.equal(isMatchLocked(start, new Date("2026-06-14T19:45:00Z")), true); // binnen 30 min
  assert.equal(isMatchLocked(start, new Date("2026-06-14T21:00:00Z")), true); // al begonnen
  assert.equal(isMatchLocked(null, new Date()), false);
});

test("first nine upcoming matches before the 14 June grace deadline still lock 30 minutes before kickoff", () => {
  const firstNineUpcomingKickoffsAmsterdam = [
    "2026-06-11T21:00:00+02:00", // Mexico - South Africa
    "2026-06-12T04:00:00+02:00", // South Korea - Czechia
    "2026-06-12T21:00:00+02:00", // Canada - Bosnia and Herzegovina
    "2026-06-13T03:00:00+02:00", // United States - Paraguay
    "2026-06-13T21:00:00+02:00", // Qatar - Switzerland
    "2026-06-14T00:00:00+02:00", // Brazil - Morocco
    "2026-06-14T03:00:00+02:00", // Haiti - Scotland
    "2026-06-14T06:00:00+02:00", // Australia - Turkey
    "2026-06-14T19:00:00+02:00", // Germany - Curacao
  ];

  for (const kickoff of firstNineUpcomingKickoffsAmsterdam) {
    const startMs = new Date(kickoff).getTime();
    assert.equal(new Date(startMs).getTime() < ENTRY_GRACE_DEADLINE.getTime(), true, `${kickoff} starts before grace deadline`);
    assert.equal(isMatchLocked(kickoff, new Date(startMs - 31 * 60_000)), false, `${kickoff} remains open 31 minutes before kickoff`);
    assert.equal(isMatchLocked(kickoff, new Date(startMs - 30 * 60_000)), true, `${kickoff} locks exactly 30 minutes before kickoff`);
    assert.equal(isMatchLocked(kickoff, new Date(startMs - 29 * 60_000)), true, `${kickoff} is locked 29 minutes before kickoff`);
  }
});

test("isNlMatch herkent Oranje als thuis of uit", () => {
  assert.equal(isNlMatch("NED", "JPN"), true);
  assert.equal(isNlMatch("TUN", "NED"), true);
  assert.equal(isNlMatch("BRA", "ARG"), false);
  assert.equal(isNlMatch(null, null), false);
});
