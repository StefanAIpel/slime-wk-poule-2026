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

test("live subsite is host-routed and hides the main chrome", () => {
  assert.match(middleware, /live\.slimescore\.com/);
  assert.match(middleware, /x-slimescore-surface/);
  assert.match(middleware, /`\/live\$\{path\}`/);
  assert.match(layout, /isLiveSurface/);
  assert.match(layout, /isLiveSurface \? null :/);
});

test("live subsite only shows Schema + Live and links to Slime Soccer / WK-poule", () => {
  assert.match(liveNav, /label: "Live"/);
  assert.match(liveNav, /label: "Schema"/);
  assert.match(liveLayout, /SlimeSoccerBanner/);
  assert.match(liveLayout, /includeWk/);
  assert.doesNotMatch(liveLayout, /BottomNav|SiteHeader/);
});

test("live data is WC-only, server-side and degrades without an API key", () => {
  assert.match(liveLib, /league=\$\{LEAGUE\}&season=\$\{SEASON\}/);
  assert.match(liveLib, /API_FOOTBALL_KEY/);
  assert.match(liveLib, /if \(!key\) return null/);
  assert.match(liveLib, /fixtures\/lineups/);
  assert.match(liveLib, /fixtures\/statistics/);
  assert.match(liveLib, /fixtures\/events/);
  assert.match(livePage, /splitFixtures/);
  assert.match(livePage, /Live-data wordt binnenkort/);
  assert.match(livePage, /LiveAutoRefresh/);
});

test("live schema mirrors the main ScheduleExplorer", () => {
  assert.match(liveSchema, /ScheduleExplorer/);
  assert.match(liveSchema, /getScheduleMatches/);
});
