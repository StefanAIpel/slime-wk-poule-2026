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
const liveEvents = await readFile(new URL("../src/lib/live-events.ts", import.meta.url), "utf8");

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
  assert.match(liveNav, /LiveLanguageSwitcher/);
  assert.match(liveNav, /live-subsite-menu/);
  assert.match(liveNav, /\/schema\/knockout/);
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

test("live page has a commercial hero with a Speelschema button, red/green/blue headers and flags", () => {
  assert.match(livePage, /splitFixtures/);
  assert.match(livePage, /LiveAutoRefresh/);
  assert.match(livePage, /heroTitle/);
  assert.match(livePage, /\/live\/schema/);
  assert.match(livePage, /TeamFlag/);
  assert.match(livePage, /live-section-header/);
  assert.match(livePage, /tone="live"/);
  assert.match(livePage, /tone="latest"/);
  assert.match(livePage, /tone="upcoming"/);
  assert.doesNotMatch(livePage, /standing-card-header/);
});

test("live page links compact result blocks to more matches and full upcoming mode", () => {
  assert.match(livePage, /view\?: string/);
  assert.match(livePage, /showAllUpcoming/);
  assert.match(livePage, /allUpcoming/);
  assert.match(livePage, /\/live\?view=upcoming#alle-komende/);
  assert.match(livePage, /href: "\/live\/schema"/);
});

test("live schema mirrors the main ScheduleExplorer and offers a LIVE button", () => {
  assert.match(liveSchema, /ScheduleExplorer/);
  assert.match(liveSchema, /getScheduleMatches/);
  assert.match(liveSchema, /live-badge-btn/);
});

test("match detail uses our flags, newest-first events and avoids technical jargon", () => {
  assert.match(liveMatch, /TeamFlag/);
  assert.match(liveMatch, /sortMatchEventsNewestFirst/);
  assert.match(liveMatch, /elapsedDiff/);
  assert.match(liveMatch, /formatEventMinute/);
  assert.match(liveEvents, /time\.extra/);
  assert.match(liveEvents, /90\+6/);
  assert.match(liveEvents, /elapsed > 90/);
  assert.match(liveMatch, /inferredFinalStoppageExtras/);
  assert.match(liveMatch, /missingApiStoppageExtra/);
  assert.match(liveMatch, /90\+\$\{inferredExtra\}/);
  assert.match(liveMatch, /const inferredExtras = \[6, 2, 1\]/);
  assert.match(liveMatch, /sortedEvents\.map/);
  assert.match(liveMatch, /eventPresentation/);
  assert.doesNotMatch(liveMatch, /yellowCard: "Gele kaart"/);
  assert.doesNotMatch(liveMatch, /redCard: "Rode kaart"/);
  assert.doesNotMatch(liveMatch, /substitution: "Wissel"/);
  assert.match(liveMatch, /penalty: "Penalty"/);
  assert.match(liveMatch, /cleanApiDetail/);
  assert.match(liveMatch, /Schoten op doel/);
  assert.match(liveMatch, /Balbezit/);
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

test("cron live-sync is window-gated, authorized and recalculates", async () => {
  const cron = await readFile(new URL("../src/app/api/cron/live-sync/route.ts", import.meta.url), "utf8");
  const vercel = await readFile(new URL("../vercel.json", import.meta.url), "utf8");
  assert.match(cron, /buiten het wedstrijd-venster/);
  assert.match(cron, /CRON_SECRET/);
  assert.match(cron, /recalculateAllScores/);
  assert.match(cron, /computeTournamentFacts/);
  assert.match(vercel, /\/api\/cron\/live-sync/);
  assert.match(vercel, /\* \* \* \* \*/);
});
