import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const middleware = await readFile(new URL("../middleware.ts", import.meta.url), "utf8");
const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const liveLib = await readFile(new URL("../src/lib/apifootball-live.ts", import.meta.url), "utf8");
const livePage = await readFile(new URL("../src/app/live/page.tsx", import.meta.url), "utf8");
const liveLayout = await readFile(new URL("../src/app/live/layout.tsx", import.meta.url), "utf8");
const liveNav = await readFile(new URL("../src/components/live-subsite-nav.tsx", import.meta.url), "utf8");
const liveSchema = await readFile(new URL("../src/app/live/schema/page.tsx", import.meta.url), "utf8");
const liveMatch = await readFile(new URL("../src/app/live/match/[id]/page.tsx", import.meta.url), "utf8");

test("live subsite is host-routed and hides the main chrome", () => {
  assert.match(middleware, /live\.slimescore\.com/);
  assert.match(middleware, /live\.slimescore\.app/);
  assert.match(middleware, /x-slimescore-surface/);
  assert.match(middleware, /`\/live\$\{path\}`/);
  assert.match(layout, /isLiveSurface/);
  assert.match(layout, /isLiveSurface \? null :/);
});

test("top header shows the brand with a LIVE sticker and a NL/EN switch", () => {
  assert.match(liveNav, /BrandWordmark/);
  assert.match(liveNav, /LanguageSwitcher/);
  assert.match(liveNav, /live-badge/);
  assert.match(liveLayout, /SlimeSoccerBanner/);
  assert.match(liveLayout, /includeWk/);
  assert.doesNotMatch(liveLayout, /BottomNav|SiteHeader/);
});

test("live data is WC-only, server-side, mapped to our flags and degrades without a key", () => {
  assert.match(liveLib, /league=\$\{LEAGUE\}&season=\$\{SEASON\}/);
  assert.match(liveLib, /API_FOOTBALL_KEY/);
  assert.match(liveLib, /if \(!key\) return null/);
  assert.match(liveLib, /getTeamMap/);
  assert.match(liveLib, /external_id/);
  assert.match(liveLib, /fixtures\/lineups/);
  assert.match(liveLib, /fixtures\/statistics/);
  assert.match(liveLib, /fixtures\/events/);
});

test("live page has a commercial hero with a Speelschema button, blue/green headers and flags", () => {
  assert.match(livePage, /splitFixtures/);
  assert.match(livePage, /LiveAutoRefresh/);
  assert.match(livePage, /heroTitle/);
  assert.match(livePage, /\/live\/schema/);
  assert.match(livePage, /TeamFlag/);
  assert.match(livePage, /live-section-header/);
  assert.doesNotMatch(livePage, /standing-card-header/);
});

test("live schema mirrors the main ScheduleExplorer and offers a LIVE button", () => {
  assert.match(liveSchema, /ScheduleExplorer/);
  assert.match(liveSchema, /getScheduleMatches/);
  assert.match(liveSchema, /live-badge-btn/);
});

test("match detail uses our flags and avoids technical jargon", () => {
  assert.match(liveMatch, /TeamFlag/);
  assert.doesNotMatch(liveMatch, /API-Football/);
});

test("live host serves static files (sw.js, manifest) so the PWA works", () => {
  assert.match(middleware, /\\\.\[a-zA-Z0-9\]\+\$/);
  assert.match(layout, /PwaRegister/);
});

test("match detail shows a player-of-the-match from the players endpoint", () => {
  assert.match(liveLib, /fixtures\/players/);
  assert.match(liveLib, /manOfTheMatch/);
  assert.match(liveMatch, /Motm/);
});

test("live list refreshes fast for the Pro plan", () => {
  assert.match(livePage, /LiveAutoRefresh seconds=\{15\}/);
  assert.match(livePage, /revalidate = 15/);
});
