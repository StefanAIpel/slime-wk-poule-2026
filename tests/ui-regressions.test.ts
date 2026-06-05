import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const loginForm = await readFile(new URL("../src/components/login-form.tsx", import.meta.url), "utf8");
const profileForm = await readFile(new URL("../src/components/profile-form.tsx", import.meta.url), "utf8");
const accountPage = await readFile(new URL("../src/app/account/page.tsx", import.meta.url), "utf8");
const passwordChangeForm = await readFile(new URL("../src/components/password-change-form.tsx", import.meta.url), "utf8");
const avatarPicker = await readFile(new URL("../src/components/avatar-picker.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../src/app/actions.ts", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const predictionsPage = await readFile(new URL("../src/app/voorspellingen/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const siteHeader = await readFile(new URL("../src/components/site-header.tsx", import.meta.url), "utf8");
const quickMenu = await readFile(new URL("../src/components/quick-menu.tsx", import.meta.url), "utf8");
const statusBar = await readFile(new URL("../src/components/status-bar.tsx", import.meta.url), "utf8");
const shareButton = await readFile(new URL("../src/components/share-button.tsx", import.meta.url), "utf8");
const brandWordmark = await readFile(new URL("../src/components/brand-wordmark.tsx", import.meta.url), "utf8");
const bottomNav = await readFile(new URL("../src/components/bottom-nav.tsx", import.meta.url), "utf8");
const upcomingMatches = await readFile(new URL("../src/components/upcoming-matches.tsx", import.meta.url), "utf8");
const scheduleExplorer = await readFile(new URL("../src/components/schedule-explorer.tsx", import.meta.url), "utf8");
const gameFrames = await readFile(new URL("../src/components/game-frames.tsx", import.meta.url), "utf8");
const schemaPage = await readFile(new URL("../src/app/schema/page.tsx", import.meta.url), "utf8");
const schemaGroupsPage = await readFile(new URL("../src/app/schema/groepen/page.tsx", import.meta.url), "utf8");
const schemaKnockoutPage = await readFile(new URL("../src/app/schema/knockout/page.tsx", import.meta.url), "utf8");
const poulesPage = await readFile(new URL("../src/app/poules/page.tsx", import.meta.url), "utf8");
const poolMembers = await readFile(new URL("../src/components/pool-members.tsx", import.meta.url), "utf8");
const poolQuickShare = await readFile(new URL("../src/components/pool-quick-share.tsx", import.meta.url), "utf8");
const appFirstShareLink = await readFile(new URL("../src/components/app-first-share-link.tsx", import.meta.url), "utf8");
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

test("mobile landing hero keeps the WK pills and title separated", () => {
  assert.match(homePage, /className=\"hero-home-title-block\"/);
  assert.match(globalsCss, /\.hero-home \.world-cup-kicker \{\n    transform: translateY\(8px\);/);
  assert.match(globalsCss, /\.hero-home-title-block \{\n    max-width: min\(100%, 305px\);\n    transform: translateY\(-4px\);/);
});

test("hero quick-link buttons stay inside the mobile hero card and align right on desktop", () => {
  assert.match(globalsCss, /\.hero-bottom-links \{/);
  assert.match(globalsCss, /left: 20px;/);
  assert.match(globalsCss, /right: 20px;/);
  assert.match(globalsCss, /width: auto;/);
  assert.match(globalsCss, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(globalsCss, /@media \(min-width: 760px\) \{[\s\S]*\.hero-bottom-links \{[\s\S]*left: auto;[\s\S]*width: min\(38vw, 360px\);[\s\S]*justify-self: end;/);
  assert.match(globalsCss, /@media \(min-width: 760px\) \{[\s\S]*\.hero-bottom-link \{[\s\S]*min-height: 50px;[\s\S]*font-size: 0\.9rem;/);
});

test("mobile app starts with a 10px gap below browser chrome before the sticky status bar", () => {
  assert.match(globalsCss, /--mobile-browser-chrome-gap: 10px;/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.status-bar \{[\s\S]*top: var\(--mobile-browser-chrome-gap\);[\s\S]*margin-top: var\(--mobile-browser-chrome-gap\);/);
});

test("public login panel is compact on mobile", () => {
  assert.match(homePage, /public-login-panel grid gap-3 p-3 sm:gap-4 sm:p-5/);
  assert.match(loginForm, /login-form-inline grid gap-3/);
  assert.match(globalsCss, /\.public-login-title \{\n    font-size: 1\.36rem;\n    line-height: 1\.12;/);
  assert.match(globalsCss, /\.login-form-inline label \{\n    gap: 6px;\n    font-size: 0\.86rem;\n    line-height: 1\.18;/);
  assert.match(globalsCss, /\.login-form-inline \.field \{\n    min-height: 44px;/);
});

test("signup sent state keeps only the success headline and code form without duplicate helper copy", () => {
  assert.match(loginForm, /Bevestigingsmail verstuurd naar je e-mail/);
  assert.match(loginForm, /Registratie bevestigen met mailcode/);
  assert.match(loginForm, /Bevestigingsmail opnieuw sturen/);
  assert.doesNotMatch(loginForm, /Mail niet ontvangen\? Check je spambox of probeer opnieuw\./);
  assert.doesNotMatch(loginForm, /De knop in de mail blijft als fallback bestaan/);
  assert.doesNotMatch(loginForm, /Open de inloglink|Registratielink verstuurd/i);
});

test("account page keeps name/team fixed but lets players change avatar and password safely", () => {
  assert.match(profileForm, /name=\"nickname\"/);
  assert.match(profileForm, /name=\"team_name\"/);
  assert.match(profileForm, /avatar_key/);
  assert.doesNotMatch(accountPage, /name=\"nickname\"|name=\"team_name\"/);
  assert.match(accountPage, /<form action=\{updateAccount\}/);
  assert.match(accountPage, /<AvatarPicker initialKey=\{profile\?\.avatar_key\} name=\{nickname \|\| \"Speler\"\}/);
  assert.match(accountPage, /Avatar opslaan/);
  assert.match(accountPage, /<PasswordChangeForm \/>/);
  assert.match(accountPage, /<details className=\"panel p-5\">[\s\S]*E-mail/);
  assert.match(accountPage, /<details className=\"panel border-red-200 p-5\">[\s\S]*Account verwijderen/);
  assert.match(actions, /avatar_key: isAvatarKey\(avatarKey\) \? avatarKey : null/);
  assert.match(actions, /from\(\"profiles\"\)\.update\(avatarPayload\)\.eq\(\"id\", user\.id\)/);
  assert.match(avatarPicker, /name=\"avatar_key\"/);
  assert.match(passwordChangeForm, /supabase\.auth\.getSession\(\)/);
  assert.match(passwordChangeForm, /supabase\.auth\.updateUser\(\{ password \}\)/);
  assert.match(passwordChangeForm, /autoComplete=\"new-password\"/);
});

test("shared SlimeScore links use the app icon instead of the wide banner", () => {
  assert.match(layout, /const ogImage = appIcon/);
  assert.match(layout, /width: 512, height: 512/);
  assert.doesNotMatch(layout, /og-slimescore-wk2026-v2\.png/);
});

test("SlimeScore brand wordmark uses the neutral WK slime and a richer pill lockup", () => {
  assert.match(brandWordmark, /wk_slime_700_transparant\.webp/);
  assert.match(siteHeader, /wk_slime_700_transparant\.webp/);
  assert.doesNotMatch(`${brandWordmark}\n${siteHeader}`, /trump_slime_700_transparant\.webp/);
  assert.match(globalsCss, /\.brand-wordmark-text \{[\s\S]*border-radius: 999px;[\s\S]*linear-gradient\(135deg, #061a3c/);
  assert.match(globalsCss, /\.brand-wordmark-score \{\n  color: #60f47c;/);
});

test("logged-in dashboard only shows SlimeSoccer in the right column and no SlimeVolley", () => {
  assert.match(homePage, /lg:grid-cols-\[1\.2fr_0\.8fr\]/);
  assert.match(homePage, /<SlimeSoccerBanner includeVolley=\{false\}/);
  assert.doesNotMatch(homePage, /<SlimeSoccerBanner \/>/);
});

test("dashboard copy matches the 72-group-result progress metric and password flow", () => {
  assert.doesNotMatch(homePage, /Vul je wedstrijden en knock-outkeuzes in/);
  assert.match(homePage, /De voortgang hieronder telt je 72 groepsuitslagen/);
  assert.match(homePage, /e-mail \+ wachtwoord/);
  assert.doesNotMatch(homePage, /geen wachtwoord/);
});

test("share panel keeps the Deel SlimeScore label before icons and stacks it above on mobile", () => {
  assert.match(homePage, /<p className=\"share-panel-title\">Deel SlimeScore<\/p>[\s\S]*<ShareRow/);
  assert.match(globalsCss, /\.share-panel-strip \{[\s\S]*display: grid;[\s\S]*justify-items: center;/);
  assert.match(globalsCss, /\.share-panel-strip \.share-actions \{[\s\S]*justify-content: center;/);
  assert.match(globalsCss, /@media \(min-width: 640px\) \{[\s\S]*\.share-panel-strip \{[\s\S]*grid-template-columns: auto minmax\(0, 1fr\);/);
});

test("prediction saves sync the global status bar progress without requiring reload", () => {
  assert.match(predictionsPage, /StatusProgressSync/);
  assert.match(predictionsPage, /<StatusProgressSync progress=\{groupProgress\} \/>/);
  assert.match(statusBar, /slimescore:me-update/);
  assert.match(statusBar, /setMe\(\(current\)/);
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

test("mobile poule page prioritizes ranking and hides bulky share/admin controls", () => {
  assert.match(poulesPage, /<PoolQuickShare joinUrl=\{joinAssets\.joinUrl\} qrDataUrl=\{joinAssets\.qrDataUrl\}/);
  assert.match(poulesPage, /<PoolMembers members=\{poolMembersById\.get\(pool\.id\) \?\? \[\]\} \/>[\s\S]*Prikbord[\s\S]*Deelopties &amp; QR[\s\S]*WK-poule-instellingen &amp; opmaak \(beheer\)/);
  assert.match(poolMembers, /Ranglijst &amp; deelnemers/);
  assert.match(poolMembers, /pool-members-count/);
  assert.match(poolQuickShare, /label="Deel via WhatsApp"/);
  assert.match(poolQuickShare, /Kopieer link/);
  assert.match(poolQuickShare, /aria-label=\"Deel via mail\"/);
  assert.match(poolQuickShare, /aria-label=\"Deel QR-code\"/);
  assert.match(poolQuickShare, /whatsapp:\/\/send\?text=\$\{encodedMessage\}/);
  assert.match(poolQuickShare, /https:\/\/wa\.me\/\?text=\$\{encodedMessage\}/);
  assert.match(shareButton, /whatsapp:\/\/send\?text=\$\{encodedBoth\}/);
  assert.match(shareButton, /fb:\/\/facewebmodal\/f\?href=\$\{encodeURIComponent\(facebookWebHref\)\}/);
  assert.match(shareButton, /https:\/\/www\.facebook\.com\/sharer\/sharer\.php\?u=\$\{encodedUrl\}&quote=\$\{encodedBoth\}/);
  assert.match(appFirstShareLink, /window\.location\.href = appHref/);
  assert.match(appFirstShareLink, /window\.open\(webHref, "_blank", "noopener,noreferrer"\)/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*grid-template-columns: minmax\(0, 1fr\) auto;/);
  assert.match(globalsCss, /@media \(max-width: 640px\) \{[\s\S]*\.pool-card-hero \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(globalsCss, /\.pool-member-button \{[\s\S]*min-height: 42px;/);
  assert.match(globalsCss, /\.pool-member-team \{\n    display: none;/);
});

test("small team columns use official 3-letter country abbreviations", () => {
  assert.match(formatLib, /teamAbbrev/);
  assert.match(upcomingMatches, /teamAbbrev\(m\.home_code/);
  assert.match(groupPredictionCard, /teamAbbrev\(match\.home_code/);
  // Eerstvolgende wedstrijden: afgekort op mobiel, volledige landnaam op desktop.
  assert.match(upcomingMatches, /sm:hidden">\{teamAbbrev\(m\.home_code/);
  assert.match(upcomingMatches, /hidden sm:inline">\{m\.home_label \?\? m\.home\?\.name_nl/);
});

test("match rows always reserve right-side API score boxes with fixed home-separator-away columns", () => {
  assert.match(upcomingMatches, /<ResultBoxes home=\{m\.home_score\} away=\{m\.away_score\} \/>/);
  assert.match(scheduleExplorer, /<ResultBoxes match=\{match\} \/>/);
  assert.match(globalsCss, /grid-template-columns: var\(--match-home-col, minmax\(118px, 160px\)\) 30px minmax\(0, 1fr\) 62px;/);
  assert.match(globalsCss, /\.schedule-team-grid-knockout \{[\s\S]*--match-home-col: minmax\(160px, 1fr\);/);
  assert.match(globalsCss, /\.schedule-team-cell-home \{[\s\S]*justify-content: flex-end;[\s\S]*text-align: right;/);
  assert.match(globalsCss, /\.schedule-team-cell-away \{[\s\S]*justify-content: flex-start;/);
  assert.doesNotMatch(globalsCss, /grid-template-columns: minmax\(0, auto\) auto minmax\(0, 1fr\) (?:58|70)px;/);
  assert.match(globalsCss, /\.score-box \{/);
  assert.doesNotMatch(scheduleExplorer, /schedule-team-grid-has-score/);
});

test("schema defaults to groups, keeps knockout separate, and removes the all-matches tab", () => {
  assert.match(schemaPage, /initialView="groups"/);
  assert.match(schemaGroupsPage, /initialView="groups"/);
  assert.match(schemaKnockoutPage, /initialView="knockout"/);
  assert.match(scheduleExplorer, /href: "\/schema"/);
  assert.match(scheduleExplorer, /href: "\/schema\/knockout"/);
  assert.doesNotMatch(scheduleExplorer, /view: "matches"/);
  assert.doesNotMatch(scheduleExplorer, /label: "Wedstrijden"/);
  assert.match(scheduleExplorer, /knockoutStageTabs/);
  assert.match(scheduleExplorer, /Per groep/);
  assert.match(scheduleExplorer, /Per datum/);
});

test("schema copy is public-facing and group filters can search team, group, or date", () => {
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /Alle WK-wedstrijden op een rij met datum, tijd en stadion/);
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /Geen account nodig — deel het schema gerust in je groepsapp/);
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /<ShareButton url=\{scheduleShareUrl\} text=\{scheduleIntro\} title="WK 2026 speelschema" label="Deel schema" \/>/);
  assert.doesNotMatch(schemaPage + schemaGroupsPage + schemaKnockoutPage, /AI-score|API-score|feedback|pagina staat/i);
  assert.match(scheduleExplorer, /Zoek groep, land of datum/);
  assert.match(scheduleExplorer, /Nederland - Oranje/);
  assert.match(scheduleExplorer, /normalizeScheduleQuery/);
  assert.match(scheduleExplorer, /query/);
  assert.match(scheduleExplorer, /filteredMatchesByGroup/);
});

test("desktop schedule cards are compact and match rows use a visible aligned team separator", () => {
  assert.match(globalsCss, /\.hero-band-page \{[\s\S]*max-height: 220px;/);
  assert.match(globalsCss, /\.hero-band-page\.hero-band-visual \{\n    min-height: 200px;\n  \}/);
  assert.match(globalsCss, /\.schedule-team-grid \{[\s\S]*grid-template-columns: var\(--match-home-col, minmax\(118px, 160px\)\) 30px minmax\(0, 1fr\) 62px;/);
  assert.match(scheduleExplorer, /schedule-team-separator/);
  assert.match(scheduleExplorer, /schedule-team-cell-away/);
  assert.match(globalsCss, /\.group-phase-body \{[\s\S]*minmax\(0, 1fr\) 320px/);
  assert.match(scheduleExplorer, /teamAbbrev\(row\.code, row\.name\)/);
  assert.doesNotMatch(scheduleExplorer, /dark-panel rounded-2xl/);
});

test("game embed is smaller on desktop and mobile defaults to new-tab play", () => {
  assert.match(gameFrames, /Open spel in nieuw tabblad/);
  assert.match(gameFrames, /Mobiel speelt dit het best schermvullend/);
  assert.doesNotMatch(gameFrames, />Nieuw tabblad</);
  assert.match(globalsCss, /\.game-frame \{[\s\S]*max-width: 560px;[\s\S]*aspect-ratio: 16 \/ 9;[\s\S]*max-height: min\(42vh, 360px\);/);
  assert.match(globalsCss, /@media \(max-width: 639px\) \{[\s\S]*\.game-frame,\n  \.game-embed-note \{\n    display: none;/);
  assert.match(globalsCss, /\.game-open-link \{[\s\S]*linear-gradient\(135deg, #19b85d, #0e8a49 62%, #0a6b38\)/);
});
