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

test("match cards show a tappable cta so users find line-ups/details", () => {
  assert.match(livePage, /live-match-cta/);
  assert.match(livePage, /cardCta: "Opstellingen & details"/);
  assert.match(livePage, /cardCta: "Line-ups & details"/);
  assert.match(livePage, /copy\[locale\]\.cardCta\}/);
  // Grote "Nu bezig"-kaart: knop-stijl CTA die uitnodigt om de stats te openen.
  assert.match(livePage, /live-match-cta-strong/);
  assert.match(livePage, /cardCtaLive: "Bekijk statistieken, opstellingen & verloop"/);
  assert.match(livePage, /cardCtaLive: "View stats, line-ups & timeline"/);
});

test("live cards: blinking badge, scorers under the score, just-finished linger", async () => {
  const apifootballLive = await readFile(new URL("../src/lib/apifootball-live.ts", import.meta.url), "utf8");
  const globalsCss = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  // Live badge zegt LIVE + minuut en knippert (met reduced-motion uitzondering).
  assert.match(livePage, /`LIVE · \$\{fixture\.elapsed\}'`/);
  assert.match(globalsCss, /\.live-match-when\.is-live::before \{[\s\S]*?animation: live-blink/);
  assert.match(globalsCss, /@keyframes live-blink/);
  assert.match(globalsCss, /prefers-reduced-motion: reduce[\s\S]*?\.live-match-when\.is-live::before \{\n    animation: none;/);
  // Doelpuntenmakers (thuis links, uit rechts) op de featured kaart.
  assert.match(livePage, /goalLines\(await getEvents\(f\.id\)\)/);
  assert.match(livePage, /live-match-scorers/);
  // Net afgelopen blijft ±30 min in "Nu bezig" en pas daarna naar "Laatste uitslagen".
  assert.match(apifootballLive, /isJustFinished\(f, now\)/);
  assert.match(apifootballLive, /FINISHED_STATUSES\.has\(f\.statusShort\) && !isJustFinished\(f, now\)/);
  // Featured kaart: 3-letter code op mobiel, volle naam vanaf tablet.
  assert.match(globalsCss, /\.live-match-card-featured \.live-row-code \{\n  display: inline;/);
});

test("matches promote to 'Nu bezig' (large + soon badge) 30 min before kick-off", async () => {
  const apifootballLive = await readFile(new URL("../src/lib/apifootball-live.ts", import.meta.url), "utf8");
  const matchPage = await readFile(new URL("../src/app/live/match/[id]/page.tsx", import.meta.url), "utf8");
  // splitFixtures promotes starting-soon matches into the live bucket and drops them from upcoming.
  assert.match(apifootballLive, /isStartingSoon/);
  assert.match(apifootballLive, /LIVE_STATUSES\.has\(f\.statusShort\) \|\| isStartingSoon\(f, now\)/);
  assert.match(apifootballLive, /statusShort === "NS" && !isStartingSoon\(f, now\)/);
  // Featured (large) card already used for the live section, plus a 'soon' badge.
  assert.match(livePage, /featured=\{isLive\}/);
  assert.match(livePage, /is-soon/);
  assert.match(livePage, /startingSoon: "Begint zo"/);
  // The match detail page auto-refreshes while live or starting soon (stats/line-ups).
  assert.match(matchPage, /LiveAutoRefresh/);
  assert.match(matchPage, /isLiveStatus\(fixture\.statusShort\) \|\| isStartingSoon\(fixture\)/);
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
  assert.doesNotMatch(liveMatch, /inferredFinalStoppageExtras/);
  assert.doesNotMatch(liveMatch, /missingApiStoppageExtra/);
  assert.doesNotMatch(liveMatch, /90\+\$\{inferredExtra\}/);
  assert.doesNotMatch(liveMatch, /const inferredExtras = \[6, 2, 1\]/);
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

test("featured teams center around the score and line-ups are 2 columns on mobile", async () => {
  const globalsCss = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const matchPage = await readFile(new URL("../src/app/live/match/[id]/page.tsx", import.meta.url), "utf8");
  // Beide teamblokken gecentreerd in hun kolom (uitteam hing links tegen de score).
  assert.match(globalsCss, /\.live-match-card-featured \.live-match-team \{[\s\S]*?justify-self: center;/);
  // Opstellingen altijd naast elkaar; mobiel met kleiner font.
  assert.match(matchPage, /className="lineups-grid"/);
  assert.match(globalsCss, /\.lineups-grid \{\n  display: grid;\n  grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(globalsCss, /\.lineups-grid \.lineup-player-list \{\n    font-size: 0\.74rem;/);
});

test("featured score sits on the country-code line; hero schedule button has roomier leading", async () => {
  const globalsCss = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(globalsCss, /\.live-match-card-featured \.live-match-score \{[\s\S]*?align-self: end;/);
  assert.match(globalsCss, /\.live-hero-cta \{[\s\S]*?line-height: 1\.28;/);
});

test("match detail has a subtle share row (specific match url, 'Volg nu live') and a tighter event list", async () => {
  const matchPage = await readFile(new URL("../src/app/live/match/[id]/page.tsx", import.meta.url), "utf8");
  const globalsCss = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  // Deelknop direct onder de wedstrijd, link naar déze wedstrijd, "Volg nu live".
  assert.match(matchPage, /function MatchShare/);
  assert.match(matchPage, /<MatchShare fixture=\{fixture\} locale=\{locale\} \/>/);
  assert.match(matchPage, /url=\{`\$\{LIVE_URL\}\/match\/\$\{fixture\.id\}`\}/);
  assert.match(matchPage, /shareLive: "Volg nu live"/);
  assert.match(matchPage, /compact/);
  assert.match(globalsCss, /\.match-share \{/);
  // Wedstrijdverloop compacter: kleiner font + minder regelafstand.
  assert.match(matchPage, /<ul className="grid gap-1\.5">/);
  assert.match(matchPage, /grid-cols-\[2\.3rem_1\.6rem_minmax\(0,1fr\)\] items-start gap-x-2 text-xs/);
});
