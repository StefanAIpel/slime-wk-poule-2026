import assert from "node:assert/strict";
import { test } from "node:test";
import { formatEventMinute } from "../src/lib/live-events.ts";

test("formatEventMinute keeps explicit API stoppage time as 90+6", () => {
  assert.equal(formatEventMinute({ time: { elapsed: 90, extra: 6 }, comments: null }), "90+6'");
});

test("formatEventMinute reconstructs regular-time stoppage when API sends elapsed as 96", () => {
  assert.equal(formatEventMinute({ time: { elapsed: 96, extra: null }, comments: null }), "90+6'");
});

test("formatEventMinute reconstructs first-half stoppage when API sends elapsed as 47", () => {
  assert.equal(formatEventMinute({ time: { elapsed: 47, extra: null }, comments: null }), "45+2'");
});

test("formatEventMinute preserves extra-time minutes when explicitly marked as extra time", () => {
  assert.equal(formatEventMinute({ time: { elapsed: 96, extra: null }, comments: "extra time" }), "96'");
});

test("live event copy uses penalty wording, not strafschop", async () => {
  const page = await import("node:fs/promises").then((fs) => fs.readFile(new URL("../src/app/live/match/[id]/page.tsx", import.meta.url), "utf8"));
  assert.match(page, /penalty: "Penalty"/);
  assert.doesNotMatch(page, /Strafschop|strafschop/);
});
