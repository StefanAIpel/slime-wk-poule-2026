import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const loginForm = await readFile(new URL("../src/components/login-form.tsx", import.meta.url), "utf8");
const profileForm = await readFile(new URL("../src/components/profile-form.tsx", import.meta.url), "utf8");
const accountPage = await readFile(new URL("../src/app/account/page.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../src/app/actions.ts", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const siteHeader = await readFile(new URL("../src/components/site-header.tsx", import.meta.url), "utf8");
const quickMenu = await readFile(new URL("../src/components/quick-menu.tsx", import.meta.url), "utf8");
const statusBar = await readFile(new URL("../src/components/status-bar.tsx", import.meta.url), "utf8");
const bottomNav = await readFile(new URL("../src/components/bottom-nav.tsx", import.meta.url), "utf8");
const upcomingMatches = await readFile(new URL("../src/components/upcoming-matches.tsx", import.meta.url), "utf8");
const scheduleExplorer = await readFile(new URL("../src/components/schedule-explorer.tsx", import.meta.url), "utf8");
const schemaGroupsPage = await readFile(new URL("../src/app/schema/groepen/page.tsx", import.meta.url), "utf8");
const schemaKnockoutPage = await readFile(new URL("../src/app/schema/knockout/page.tsx", import.meta.url), "utf8");
const groupPredictionCard = await readFile(new URL("../src/components/group-prediction-card.tsx", import.meta.url), "utf8");
const formatLib = await readFile(new URL("../src/lib/format.ts", import.meta.url), "utf8");
const globalsCss = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("hero primary Gratis meedoen button is compact on mobile with a light emphasis border", () => {
  const heroPrimaryBlock = globalsCss.match(/\.button-primary\.hero-primary-cta \{[\s\S]*?\}/)?.[0] ?? "";
  const mobileHeroBlock = globalsCss.match(/@media \(max-width: 759px\) \{[\s\S]*?\.button-primary\.hero-primary-cta \{[\s\S]*?\}\n\}/)?.[0] ?? "";
  assert.match(heroPrimaryBlock, /width: min\(100%, 260px\);/);
  assert.match(heroPrimaryBlock, /justify-content: center;/);
  assert.match(heroPrimaryBlock, /border-color: rgba\(255, 255, 255, 0\.62\);/);
  assert.match(mobileHeroBlock, /width: min\(100%, 180px\);/);
  assert.match(mobileHeroBlock, /min-height: 44px;/);
  assert.doesNotMatch(heroPrimaryBlock, /width: auto;/);
});

test("mobile landing hero offsets title block up and world-cup pills down", () => {
  assert.match(homePage, /className=\"hero-home-title-block\"/);
  assert.match(globalsCss, /\.hero-home \.world-cup-kicker \{\n    transform: translateY\(20px\);/);
  assert.match(globalsCss, /\.hero-home-title-block \{\n    transform: translateY\(-20px\);/);
});

test("hero quick-link buttons stay compact but responsive", () => {
  assert.match(globalsCss, /\.hero-bottom-links \{/);
  assert.match(globalsCss, /width: min\(calc\(100% - 40px\), 370px\);/);
  assert.match(globalsCss, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
});

test("public login panel is compact on mobile", () => {
  assert.match(homePage, /public-login-panel grid gap-3 p-3 sm:gap-4 sm:p-5/);
  assert.match(loginForm, /login-form-inline grid gap-3/);
  assert.match(globalsCss, /\.public-login-title \{\n    font-size: 1\.36rem;\n    line-height: 1\.12;/);
  assert.match(globalsCss, /\.login-form-inline label \{\n    gap: 6px;\n    font-size: 0\.86rem;\n    line-height: 1\.18;/);
  assert.match(globalsCss, /\.login-form-inline \.field \{\n    min-height: 44px;/);
});

test("signup sent state has one clear success headline plus normal-weight next steps and spam hint", () => {
  assert.match(loginForm, /Bevestigingsmail verstuurd naar je e-mail/);
  assert.match(loginForm, /Kopieer de bevestigingscode uit de mail en plak die hieronder/);
  assert.match(loginForm, /Registratie bevestigen met mailcode/);
  assert.match(loginForm, /Mail niet ontvangen\? Check je spambox of probeer opnieuw\./);
  assert.doesNotMatch(loginForm, /Open de inloglink|Registratielink verstuurd/i);
});

test("profile can only be set at onboarding; account page cannot edit name/team/avatar afterwards", () => {
  assert.match(profileForm, /name=\"nickname\"/);
  assert.match(profileForm, /name=\"team_name\"/);
  assert.doesNotMatch(profileForm, /AvatarPicker/);
  assert.match(profileForm, /avatar_key/);
  assert.doesNotMatch(accountPage, /name=\"nickname\"|name=\"team_name\"|AvatarPicker|Opslaan/);
  assert.doesNotMatch(actions, /update\(\{ nickname, team_name: teamName, avatar_key: avatarKey \}\)/);
});

test("shared SlimeScore links use the app icon instead of the wide banner", () => {
  assert.match(layout, /const ogImage = appIcon/);
  assert.match(layout, /width: 512, height: 512/);
  assert.doesNotMatch(layout, /og-slimescore-wk2026-v2\.png/);
});

test("logged-in dashboard only shows SlimeSoccer in the right column and no SlimeVolley", () => {
  assert.match(homePage, /lg:grid-cols-\[1\.2fr_0\.8fr\]/);
  assert.match(homePage, /<SlimeSoccerBanner includeVolley=\{false\}/);
  assert.doesNotMatch(homePage, /<SlimeSoccerBanner \/>/);
});

test("logged-in navigation emphasizes Voorspel, keeps compact account/logout actions, and uses no mobile tabbar", () => {
  assert.match(siteHeader, /emphasis: true/);
  assert.match(siteHeader, /site-header-link-emphasis/);
  assert.match(siteHeader, /site-header-mini-action/);
  assert.match(siteHeader, /Uitloggen/);
  assert.match(quickMenu, /label: \"Voorspellen\"/);
  assert.doesNotMatch(quickMenu, /WK-poule invullen \/ wijzigen/);
  assert.match(quickMenu, /\[publicLinks\[0\], privateLinks\[0\], \.\.\.publicLinks\.slice\(1\), \.\.\.privateLinks\.slice\(1\)\]/);
  assert.match(quickMenu, /<form className=\"quick-menu-form\" action=\"\/logout\" method=\"post\">/);
  assert.match(quickMenu, /<span>Uitloggen<\/span>/);
  assert.match(globalsCss, /\.quick-menu-logout \{/);
  assert.match(bottomNav, /return null;/);
  assert.doesNotMatch(bottomNav, /bottom-nav-emphasis/);
  assert.match(statusBar, /href=\"\/voorspellingen\" className=\"status-chip status-chip-countdown/);
});

test("small team columns use official 3-letter country abbreviations", () => {
  assert.match(formatLib, /teamAbbrev/);
  assert.match(upcomingMatches, /teamAbbrev\(m\.home_code/);
  assert.match(groupPredictionCard, /teamAbbrev\(match\.home_code/);
  // Eerstvolgende wedstrijden: afgekort op mobiel, volledige landnaam op desktop.
  assert.match(upcomingMatches, /sm:hidden">\{teamAbbrev\(m\.home_code/);
  assert.match(upcomingMatches, /hidden sm:inline">\{m\.home_label \?\? m\.home\?\.name_nl/);
});

test("match rows always reserve right-side API score boxes", () => {
  assert.match(upcomingMatches, /<ResultBoxes home=\{m\.home_score\} away=\{m\.away_score\} \/>/);
  assert.match(scheduleExplorer, /<ResultBoxes match=\{match\} \/>/);
  assert.match(globalsCss, /grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1fr\) 62px;/);
  assert.match(globalsCss, /\.score-box \{/);
  assert.doesNotMatch(scheduleExplorer, /schedule-team-grid-has-score/);
});

test("schema has separate groups and knockout pages with compact subtabs", () => {
  assert.match(schemaGroupsPage, /initialView=\"groups\"/);
  assert.match(schemaKnockoutPage, /initialView=\"knockout\"/);
  assert.match(scheduleExplorer, /href: \"\/schema\/groepen\"/);
  assert.match(scheduleExplorer, /href: \"\/schema\/knockout\"/);
  assert.match(scheduleExplorer, /knockoutStageTabs/);
  assert.match(scheduleExplorer, /Per groep/);
  assert.match(scheduleExplorer, /Per datum/);
});
