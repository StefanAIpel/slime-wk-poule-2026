import assert from "node:assert/strict";
import { test } from "node:test";
import { isMatchLocked, isNlMatch, matchLockTime } from "../src/lib/entry-rules.ts";

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

test("isNlMatch herkent Oranje als thuis of uit", () => {
  assert.equal(isNlMatch("NED", "JPN"), true);
  assert.equal(isNlMatch("TUN", "NED"), true);
  assert.equal(isNlMatch("BRA", "ARG"), false);
  assert.equal(isNlMatch(null, null), false);
});
