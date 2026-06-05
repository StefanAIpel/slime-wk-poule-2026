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
const apiMeRoute = await readFile(new URL("../src/app/api/me/route.ts", import.meta.url), "utf8");
const predictionsPage = await readFile(new URL("../src/app/voorspellingen/page.tsx", import.meta.url), "utf8");
const rankingPage = await readFile(new URL("../src/app/ranglijst/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const manifest = await readFile(new URL("../src/app/manifest.ts", import.meta.url), "utf8");
const constants = await readFile(new URL("../src/lib/constants.ts", import.meta.url), "utf8");
const siteHeader = await readFile(new URL("../src/components/site-header.tsx", import.meta.url), "utf8");
const quickMenu = await readFile(new URL("../src/components/quick-menu.tsx", import.meta.url), "utf8");
const statusBar = await readFile(new URL("../src/components/status-bar.tsx", import.meta.url), "utf8");
const shareButton = await readFile(new URL("../src/components/share-button.tsx", import.meta.url), "utf8");
const brandWordmark = await readFile(new URL("../src/components/brand-wordmark.tsx", import.meta.url), "utf8");
const bottomNav = await readFile(new URL("../src/components/bottom-nav.tsx", import.meta.url), "utf8");
const upcomingMatches = await readFile(new URL("../src/components/upcoming-matches.tsx", import.meta.url), "utf8");
const scheduleExplorer = await readFile(new URL("../src/components/schedule-explorer.tsx", import.meta.url), "utf8");
const gameFrames = await readFile(new URL("../src/components/game-frames.tsx", import.meta.url), "utf8");
const gamesPage = await readFile(new URL("../src/app/games/page.tsx", import.meta.url), "utf8");
const schemaPage = await readFile(new URL("../src/app/schema/page.tsx", import.meta.url), "utf8");
const schemaGroupsPage = await readFile(new URL("../src/app/schema/groepen/page.tsx", import.meta.url), "utf8");
const schemaKnockoutPage = await readFile(new URL("../src/app/schema/knockout/page.tsx", import.meta.url), "utf8");
const poulesPage = await readFile(new URL("../src/app/poules/page.tsx", import.meta.url), "utf8");
const joinPoolPage = await readFile(new URL("../src/app/poules/join/[code]/page.tsx", import.meta.url), "utf8");
const poolMembers = await readFile(new URL("../src/components/pool-members.tsx", import.meta.url), "utf8");
const poolQuickShare = await readFile(new URL("../src/components/pool-quick-share.tsx", import.meta.url), "utf8");
const poolTabs = await readFile(new URL("../src/components/pool-tabs.tsx", import.meta.url), "utf8");
const appFirstShareLink = await readFile(new URL("../src/components/app-first-share-link.tsx", import.meta.url), "utf8");
const installAppCard = await readFile(new URL("../src/components/install-app-card.tsx", import.meta.url), "utf8");
const knockoutPredictionPicker = await readFile(new URL("../src/components/knockout-prediction-picker.tsx", import.meta.url), "utf8");
const groupPredictionCard = await readFile(new URL("../src/components/group-prediction-card.tsx", import.meta.url), "utf8");
const formatLib = await readFile(new URL("../src/lib/format.ts", import.meta.url), "utf8");
const rankingLib = await readFile(new URL("../src/lib/ranking.ts", import.meta.url), "utf8");
const limitsLib = await readFile(new URL("../src/lib/limits.ts", import.meta.url), "utf8");
const lengthMigration = await readFile(new URL("../supabase/migrations/20260605103457_enforce_profile_pool_name_lengths.sql", import.meta.url), "utf8");
const uniqueMigration = await readFile(new URL("../supabase/migrations/20260605132432_enforce_unique_display_names.sql", import.meta.url), "utf8");
const globalsCss = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
const authEmailTemplate = await readFile(new URL("../supabase/templates/slimescore_auth.html", import.meta.url), "utf8");
const recoveryEmailTemplate = await readFile(new URL("../supabase/templates/slimescore_recovery.html", import.meta.url), "utf8");

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
  assert.match(globalsCss, /\.hero-home \.world-cup-kicker \{\n    transform: translateY\(3px\);/);
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
  assert.match(globalsCss, /\.auth-flow-note \{[\s\S]*font-size: 0\.8125rem;[\s\S]*line-height: 1\.35;/);
  assert.match(globalsCss, /\.auth-flow-note span \{\n  min-width: 0;\n\}/);
});

test("public FrontPage shows the PWA install instructions card near login", () => {
  assert.match(homePage, /import \{ InstallAppCard \} from "@\/components\/install-app-card"/);
  assert.match(homePage, /<LoginForm surface=\"inline\" \/>[\s\S]*<InstallAppCard \/>/);
  assert.match(installAppCard, /Voeg toe als app/);
  assert.match(globalsCss, /\.install-card-title \{[\s\S]*font-size: 0\.95rem;[\s\S]*white-space: nowrap;/);
  assert.match(installAppCard, /Zo installeer je|Installeren/);
  assert.match(installAppCard, /iPhone \(Safari\)/);
  assert.match(installAppCard, /Android \(Chrome\)/);
  assert.match(installAppCard, /slime-score-install-card-dismissed-v2/);
});

test("signup sent state keeps compact mobile copy and code form without duplicate helper copy", () => {
  assert.match(loginForm, /Bevestigingsmail verstuurd/);
  assert.match(loginForm, /Registratie bevestigen met mailcode/);
  assert.match(loginForm, /Mail opnieuw sturen/);
  assert.match(loginForm, /auth-sent-banner/);
  assert.match(loginForm, /auth-code-panel/);
  assert.match(globalsCss, /\.login-form-inline \.auth-sent-banner \{\n    padding: 9px 10px;\n    font-size: 0\.88rem;\n    line-height: 1\.22;/);
  assert.match(globalsCss, /\.login-form-inline \.auth-code-panel \{\n    gap: 9px;\n    padding: 10px;/);
  assert.doesNotMatch(loginForm, /Bevestigingsmail verstuurd naar je e-mail/);
  assert.doesNotMatch(loginForm, /Bevestigingsmail opnieuw sturen/);
  assert.doesNotMatch(loginForm, /Mail niet ontvangen\? Check je spambox of probeer opnieuw\./);
  assert.doesNotMatch(loginForm, /De knop in de mail blijft als fallback bestaan/);
  assert.doesNotMatch(loginForm, /Open de inloglink|Registratielink verstuurd/i);
});

test("profile and pool display names are capped for compact mobile UI", () => {
  assert.match(limitsLib, /NICKNAME_MAX_LENGTH = 15/);
  assert.match(limitsLib, /TEAM_NAME_MAX_LENGTH = 25/);
  assert.match(limitsLib, /POOL_NAME_MAX_LENGTH = 25/);
  assert.match(loginForm, /slice\(0, NICKNAME_MAX_LENGTH\)/);
  assert.match(loginForm, /slice\(0, TEAM_NAME_MAX_LENGTH\)/);
  assert.match(loginForm, /maxLength=\{NICKNAME_MAX_LENGTH\}/);
  assert.match(loginForm, /maxLength=\{TEAM_NAME_MAX_LENGTH\}/);
  assert.match(profileForm, /maxLength=\{NICKNAME_MAX_LENGTH\}/);
  assert.match(profileForm, /maxLength=\{TEAM_NAME_MAX_LENGTH\}/);
  assert.match(homePage, /maxLength=\{POOL_NAME_MAX_LENGTH\}/);
  assert.match(actions, /cleanText\(formData\.get\("nickname"\), NICKNAME_MAX_LENGTH\)/);
  assert.match(actions, /cleanText\(formData\.get\("team_name"\), TEAM_NAME_MAX_LENGTH\)/);
  assert.match(actions, /cleanText\(formData\.get\("name"\), POOL_NAME_MAX_LENGTH\)/);
  assert.match(lengthMigration, /char_length\(nickname\) between 2 and 15/);
  assert.match(lengthMigration, /char_length\(team_name\) between 2 and 25/);
  assert.match(lengthMigration, /char_length\(name\) between 2 and 25/);
  assert.match(uniqueMigration, /profiles_nickname_unique_lower/);
  assert.match(uniqueMigration, /lower\(btrim\(nickname\)\)/);
  assert.match(uniqueMigration, /pools_name_unique_lower/);
  assert.match(uniqueMigration, /lower\(btrim\(name\)\)/);
  assert.match(actions, /fout=naam-bezet/);
});

test("create-pool card uses Mexico green contrast styling", () => {
  assert.match(homePage, /create-pool-card/);
  assert.match(homePage, /create-pool-button/);
  assert.match(globalsCss, /\.create-pool-card \{[\s\S]*#006847[\s\S]*#009b3a/);
  assert.match(globalsCss, /\.create-pool-button\.button-primary \{[\s\S]*#ce1126/);
  assert.match(globalsCss, /\.create-pool-title,[\s\S]*\.create-pool-copy \{\n  color: #ffffff;/);
});

test("pool banner upload helper appears before file input and keeps the full image inside a 16:9 banner", () => {
  const uploadBlock = poulesPage.match(/<form action=\{uploadPoolImage\}[\s\S]*?<PendingButton/)?.[0] ?? "";
  assert.match(uploadBlock, /Aanbevolen: 1600 × 900 px \(16:9\)\. We bewaren de hele afbeelding in een 16:9 banner, zonder slimme autocrop\./);
  assert.ok(uploadBlock.indexOf("1600 × 900 px") < uploadBlock.indexOf('type="file"'));
  assert.match(actions, /const POOL_BANNER_WIDTH = 1600/);
  assert.match(actions, /const POOL_BANNER_HEIGHT = 900/);
  assert.match(actions, /resize\(POOL_BANNER_WIDTH, POOL_BANNER_HEIGHT, \{[\s\S]*fit: "contain"/);
  assert.doesNotMatch(uploadBlock, /1050 × 150|7:1|snijdt/);
});

test("create-pool placeholder uses a neutral local example instead of a personal family name", () => {
  assert.match(homePage, /placeholder="Bijv\. FC Vathorst"/);
  assert.doesNotMatch(homePage, /Familie Dijkstra/);
});

test("mobile join-pool invite hero is compact and cannot clip its copy", () => {
  assert.match(joinPoolPage, /className="hero-band hero-band-visual hero-band-page join-pool-hero"/);
  assert.match(joinPoolPage, /className="join-pool-title/);
  assert.match(joinPoolPage, /className="join-pool-copy/);
  assert.doesNotMatch(joinPoolPage, /text-3xl font-black leading-tight text-white md:text-4xl/);
  assert.match(globalsCss, /\.join-pool-hero \{[\s\S]*max-height: none;/);
  assert.match(globalsCss, /\.join-pool-title \{[\s\S]*font-size: clamp\(1\.78rem, 8vw, 2\.55rem\);/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.join-pool-title \{[\s\S]*font-size: clamp\(1\.56rem, 7\.2vw, 2\.05rem\);/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.join-pool-copy \{[\s\S]*font-size: 0\.94rem;/);
});

test("pool banner uploads use versioned storage paths so replacements show immediately", () => {
  assert.match(poulesPage, /function poolBannerUrl\(poolId: string, bannerPath\?: string \| null, version\?: string \| null\)/);
  assert.match(poulesPage, /banner_updated_at/);
  assert.match(poulesPage, /poolBannerUrl\(pool\.id, pool\.bannerPath, pool\.bannerUpdatedAt\)/);
  assert.match(actions, /const bannerVersion = Date\.now\(\)\.toString\(36\)/);
  assert.match(actions, /const bannerPath = `pools\/\$\{poolId\}-\$\{bannerVersion\}\.webp`/);
  assert.match(actions, /\.upload\(bannerPath, webp,/);
  assert.match(actions, /\.update\(\{ banner_path: bannerPath, banner_updated_at:/);
});

test("pool card uses the uploaded banner as the full hero background instead of a separate color strip", () => {
  assert.match(poulesPage, /"--pool-accent": pool\.accentColor/);
  assert.match(poulesPage, /"--pool-banner-image": `url\("\$\{poolBannerUrl\(pool\.id, pool\.bannerPath, pool\.bannerUpdatedAt\)\}"\)`/);
  assert.match(poulesPage, /<div className="pool-card-hero text-white" style=\{poolHeroStyle\}>/);
  assert.doesNotMatch(poulesPage, /<PoolBanner/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*border-top: 4px solid var\(--pool-accent/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*aspect-ratio: 16 \/ 9;/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*var\(--pool-banner-image, none\)[\s\S]*var\(--pool-accent/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*background-size: cover, cover, auto;/);
});

test("mobile pool navigation uses a dropdown selector instead of wrapping all pool tabs", () => {
  assert.match(poolTabs, /className="pool-selector-mobile"/);
  assert.match(poolTabs, /<select[\s\S]*className="pool-selector-select"[\s\S]*value=\{active\}[\s\S]*onChange=\{\(event\) => setActive\(event\.target\.value\)\}/);
  assert.match(poolTabs, /<option key=\{tab\.id\} value=\{tab\.id\}>[\s\S]*\{tab\.emoji\} \{tab\.label\}/);
  assert.match(globalsCss, /\.pool-selector-mobile \{\n  display: none;\n\}/);
  assert.match(globalsCss, /@media \(max-width: 640px\) \{[\s\S]*\.poules-page-shell \.pool-tabs \{\n    display: none;\n  \}[\s\S]*\.pool-selector-mobile \{\n    display: grid;/);
});

test("pool share text includes the poulecode and account-before-join guidance", () => {
  assert.match(poulesPage, /Poulecode: \$\{pool\.code\} 👇/);
  assert.match(poulesPage, /Nog geen account\? Maak eerst gratis een SlimeScore-account aan; daarna kom je via deze link\/code in de poule\./);
  assert.match(poolQuickShare, /const message = `\$\{inviteText\}\\n\\n\$\{joinUrl\}`\.trim\(\)/);
  assert.match(joinPoolPage, /Nog geen account\? Maak eerst gratis een SlimeScore-account aan; daarna kom je terug bij deze poule\./);
  assert.doesNotMatch(joinPoolPage, /Geen wachtwoord\. Link klikken/);
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
  assert.match(constants, /SITE_NAME = "SlimeScore"/);
  assert.match(manifest, /name: "SlimeScore"/);
  assert.match(manifest, /short_name: "SlimeScore"/);
  assert.match(manifest, /src: "\/icons\/slimescore-app-icon-v3-512\.png"/);
  assert.match(manifest, /purpose: "any"/);
  assert.match(manifest, /purpose: "maskable"/);
  assert.match(layout, /const ogImage = appIcon/);
  assert.match(layout, /slimescore-app-icon-v3-512\.png/);
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

test("SlimeScore auth emails use a fixed high-contrast image header", () => {
  const templates = `${authEmailTemplate}\n${recoveryEmailTemplate}`;
  assert.match(templates, /slimescore-mail-header-v3\.png/);
  assert.match(templates, /alt=\"SlimeScore\.com — WK 2026 vriendenpoule\. Voorspel\. Deel\. Win de poule\.\"/);
  assert.match(templates, /width=\"560\" height=\"210\"/);
  assert.match(templates, /background:#061a3c/);
  assert.doesNotMatch(templates, /background-image:linear-gradient\(135deg,#075bbb/);
  assert.doesNotMatch(templates, /<span style=\"color:#60f47c;\">Score<\/span>/);
});

test("logged-in dashboard only shows SlimeSoccer in the right column and no SlimeVolley", () => {
  assert.match(homePage, /lg:grid-cols-\[1\.2fr_0\.8fr\]/);
  assert.match(homePage, /<SlimeSoccerBanner includeVolley=\{false\}/);
  assert.doesNotMatch(homePage, /<SlimeSoccerBanner \/>/);
});

test("dashboard copy matches the 72-group-result progress metric and password flow", () => {
  assert.doesNotMatch(homePage, /Vul je wedstrijden en knock-outkeuzes in/);
  assert.match(homePage, /De voortgang hieronder telt je 72 groepsuitslagen/);
  assert.doesNotMatch(homePage, /geen wachtwoord/);
});

test("share panel keeps the Deel SlimeScore label before icons and stacks it above on mobile", () => {
  assert.match(homePage, /<p className=\"share-panel-title\">Deel SlimeScore<\/p>[\s\S]*<ShareRow/);
  assert.match(globalsCss, /\.share-panel-strip \{[\s\S]*display: grid;[\s\S]*justify-items: center;/);
  assert.match(globalsCss, /\.share-panel-strip \.share-actions \{[\s\S]*justify-content: center;/);
  assert.match(globalsCss, /@media \(min-width: 640px\) \{[\s\S]*\.share-panel-strip \{[\s\S]*grid-template-columns: auto auto;[\s\S]*justify-content: start;/);
});

test("prediction saves sync the global status bar progress without requiring reload", () => {
  assert.match(predictionsPage, /StatusProgressSync/);
  assert.match(predictionsPage, /<StatusProgressSync progress=\{groupProgress\} \/>/);
  assert.match(statusBar, /slimescore:me-update/);
  assert.match(statusBar, /setMe\(\(current\)/);
});

test("knockout predictions flow from last 16 to later rounds without scroll boxes", () => {
  assert.match(predictionsPage, /<KnockoutPredictionPicker/);
  assert.match(predictionsPage, /Typ je verwachte uitslag\. Je kunt tussentijds opslaan en later verdergaan/);
  assert.match(knockoutPredictionPicker, /round16: 16/);
  assert.match(knockoutPredictionPicker, /quarterfinal: 8/);
  assert.match(knockoutPredictionPicker, /Kies precies 16 landen uit jouw berekende laatste 32\./);
  assert.match(knockoutPredictionPicker, /round16: round16Teams/);
  // De achtste-finale pool is de berekende laatste 32 uit de groepsvoorspellingen.
  assert.match(predictionsPage, /calculateRound32/);
  assert.match(predictionsPage, /round16Pool=\{qualifiedRound16\}/);
  assert.match(knockoutPredictionPicker, /quarterfinal: teams\.filter\(\(team\) => state\.round16\.includes\(team\.code\)\)/);
  assert.match(knockoutPredictionPicker, /semifinal: teams\.filter\(\(team\) => state\.quarterfinal\.includes\(team\.code\)\)/);
  assert.match(knockoutPredictionPicker, /finalists: teams\.filter\(\(team\) => state\.semifinal\.includes\(team\.code\)\)/);
  assert.match(knockoutPredictionPicker, /Nog \$\{expected - count\} kiezen/);
  assert.match(knockoutPredictionPicker, /Max \$\{limit\} bereikt/);
  // Wereldkampioen staat los onderaan (vrij uit alle landen), niet meer beperkt in de picker.
  assert.doesNotMatch(knockoutPredictionPicker, /champion/i);
  assert.match(knockoutPredictionPicker, /TeamFlag/);
  assert.match(predictionsPage, /name="champion_code"/);
  assert.match(predictionsPage, /vrij uit alle landen/);
  assert.doesNotMatch(predictionsPage, /cards_ko_team_code/);
  // Compacte landkeuze: vlag + code in 2 kolommen op mobiel, geen scrollbox.
  assert.match(globalsCss, /\.knockout-picker-grid \{\n  display: grid;\n  gap: 8px;\n  grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);\n\}/);
  assert.doesNotMatch(globalsCss, /\.knockout-picker-grid[\s\S]*overflow-y: auto/);
  assert.doesNotMatch(predictionsPage, /max-h-72/);
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
  assert.match(quickMenu, /quick-menu-link-compact/);
  assert.match(quickMenu, /slime-soccer-icon\.webp/);
  assert.doesNotMatch(quickMenu, /slime-soccer-icon\.png/);
  assert.match(globalsCss, /\.quick-menu-logout \{/);
  assert.match(bottomNav, /return null;/);
  assert.doesNotMatch(bottomNav, /bottom-nav-emphasis/);
  assert.match(statusBar, /href=\"\/voorspellingen\" className=\"status-chip status-chip-countdown/);
});

test("mobile poule page prioritizes ranking and keeps share buttons visible next to the pool name", () => {
  assert.match(poulesPage, /<div className=\"pool-card-title-row\">[\s\S]*<PoolQuickShare/);
  assert.match(poulesPage, /isManager=\{isManager\}/);
  assert.match(poulesPage, /<PoolMembers members=\{poolMembersById\.get\(pool\.id\) \?\? \[\]\} \/>[\s\S]*Prikbord[\s\S]*Deelopties &amp; QR[\s\S]*WK-poule-instellingen &amp; opmaak \(beheer\)/);
  assert.match(poolMembers, /Ranglijst &amp; deelnemers/);
  assert.match(poolMembers, /pool-members-count/);
  assert.match(poolQuickShare, /<div className=\"pool-quick-share\" aria-label=\"Poule delen\">/);
  assert.match(poolQuickShare, /pool-share-inline-label/);
  assert.match(poolQuickShare, /label="Deel via WhatsApp"/);
  assert.match(poolQuickShare, /Kopieer link/);
  assert.match(poolQuickShare, /aria-label=\"Deel via mail\"/);
  assert.match(poolQuickShare, /aria-label=\"Deel QR-code\"/);
  assert.match(poolQuickShare, /isManager \? \(/);
  assert.match(poolQuickShare, /label=\"Deel via Facebook\"/);
  assert.match(poolQuickShare, /Deel via Instagram of native deelmenu/);
  assert.match(poolQuickShare, /label=\"Deel via Telegram\"/);
  assert.match(poolQuickShare, /whatsapp:\/\/send\?text=\$\{encodedMessage\}/);
  assert.match(poolQuickShare, /https:\/\/wa\.me\/\?text=\$\{encodedMessage\}/);
  assert.match(shareButton, /whatsapp:\/\/send\?text=\$\{encodedBoth\}/);
  assert.match(shareButton, /fb:\/\/facewebmodal\/f\?href=\$\{encodeURIComponent\(facebookWebHref\)\}/);
  assert.match(shareButton, /https:\/\/www\.facebook\.com\/sharer\/sharer\.php\?u=\$\{encodedUrl\}&quote=\$\{encodedBoth\}/);
  assert.match(appFirstShareLink, /window\.location\.href = appHref/);
  assert.match(appFirstShareLink, /window\.open\(webHref, "_blank", "noopener,noreferrer"\)/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(globalsCss, /\.pool-card-title-row \{[\s\S]*display: flex;[\s\S]*flex-wrap: wrap;[\s\S]*gap: 8px;/);
  assert.match(globalsCss, /\.pool-quick-share \{[\s\S]*display: inline-flex;[\s\S]*align-items: center;/);
  assert.match(globalsCss, /\.pool-quick-share-button \{[\s\S]*width: 31px;[\s\S]*height: 31px;/);
  assert.doesNotMatch(poolQuickShare, /<details className=\"pool-quick-share\">/);
  assert.doesNotMatch(globalsCss, /\.pool-share-menu \{[\s\S]*position: absolute;/);
  assert.match(globalsCss, /\.pool-member-button \{[\s\S]*min-height: 42px;/);
  assert.match(globalsCss, /\.pool-member-team \{\n    display: none;/);
});

test("world rankings are real Supabase scores without demo rows or fake #1 fallback", () => {
  assert.match(rankingLib, /punten dalend, bij gelijke punten alfabetisch/);
  assert.match(rankingLib, /export function compareScoresAlphabetical/);
  assert.match(rankingLib, /b\.points - a\.points/);
  assert.match(rankingLib, /aName\.localeCompare\(bName, "nl-NL"/);
  assert.match(rankingLib, /export function worldRankMap/);
  assert.match(rankingLib, /export function withPublicRankScores/);
  assert.match(rankingLib, /hasPublicProfile/);
  assert.doesNotMatch(rankingLib, /withDemoRankScores|demoRankScores|DEMO_PLAYERS|hasSafePublicProfile/);
  assert.match(rankingPage, /hasPublicProfile\(row\.profiles\)/);
  assert.doesNotMatch(rankingPage, /DEMO_PLAYERS|DEMO_POOLS|demoPlayers|demoPoolRankings|hasSafePublicProfile/);
  assert.match(homePage, /worldRankForUser\(withPublicRankScores\(\(rankScores \?\? \[\]\) as unknown as RankedScore\[\]\), user\.id\)/);
  assert.match(apiMeRoute, /worldRankForUser\(withPublicRankScores\(\(rankScores \?\? \[\]\) as unknown as RankedScore\[\]\), user\.id\)/);
  assert.doesNotMatch(apiMeRoute, /\?\? 1/);
  assert.match(statusBar, /typeof me\.rank === "number"/);
  assert.match(poulesPage, /withPublicRankScores\(\(scoreRows \?\? \[\]\) as unknown as RankedScore\[\]\)\.sort\(compareScoresAlphabetical\)/);
  assert.match(poulesPage, /worldRankMap\(rankedScores\)/);
  assert.doesNotMatch(poulesPage, /withDemoRankScores|gelijke punten = gelijke wereldrang/);
});

test("small team columns use official 3-letter country abbreviations", () => {
  assert.match(formatLib, /teamAbbrev/);
  assert.match(upcomingMatches, /teamAbbrev\(m\.home_code/);
  assert.match(groupPredictionCard, /teamAbbrev\(match\.home_code/);
  // Eerstvolgende wedstrijden: ook op tablet/desktop afgekort in de compacte dashboardkolom.
  assert.doesNotMatch(upcomingMatches, /hidden sm:inline">\{m\.home_label/);
  assert.match(globalsCss, /\.upcoming-team-grid \.schedule-team-cell-home \{[\s\S]*justify-content: flex-start;[\s\S]*text-align: left;/);
});

test("match rows always reserve right-side API score boxes with fixed home-separator-away columns", () => {
  assert.match(upcomingMatches, /<ResultBoxes home=\{m\.home_score\} away=\{m\.away_score\} \/>/);
  assert.match(scheduleExplorer, /<ResultBoxes match=\{match\} \/>/);
  assert.match(globalsCss, /grid-template-columns: var\(--match-home-col, minmax\(118px, 160px\)\) 30px minmax\(0, 1fr\) 62px;/);
  assert.match(globalsCss, /\.schedule-team-grid-knockout \{[\s\S]*--match-home-col: minmax\(160px, 1fr\);/);
  assert.match(globalsCss, /\.schedule-team-cell-home \{[\s\S]*justify-content: flex-start;[\s\S]*text-align: left;/);
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
  assert.match(scheduleExplorer, /schedule-group-grid/);
  assert.match(scheduleExplorer, /Alle datums/);
});

test("schema copy is public-facing and group/date are chosen via pickers", () => {
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /Alle WK-wedstrijden op een rij met datum, tijd en stadion/);
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /Geen account nodig — deel het schema gerust in je groepsapp/);
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /<ShareButton url=\{scheduleShareUrl\} text=\{scheduleIntro\} title="WK 2026 speelschema" label="Deel schema" \/>/);
  assert.doesNotMatch(schemaPage + schemaGroupsPage + schemaKnockoutPage, /AI-score|API-score|feedback|pagina staat/i);
  assert.match(scheduleExplorer, /Nederland - Oranje/);
  assert.match(scheduleExplorer, /schedule-picker-pop/);
  assert.match(scheduleExplorer, /schedule-group-grid/);
  assert.match(scheduleExplorer, /groupFilter/);
  assert.match(scheduleExplorer, /dateFilter/);
});

test("Nederland - Oranje filter supports the app seed code NED as well as external NLD", () => {
  assert.match(scheduleExplorer, /ORANJE_TEAM_CODES = new Set\(\["NED", "NLD"\]\)/);
  assert.match(scheduleExplorer, /ORANJE_TEAM_CODES\.has\(match\.homeCode \?\? ""\)/);
  assert.match(scheduleExplorer, /ORANJE_TEAM_CODES\.has\(match\.awayCode \?\? ""\)/);
  assert.doesNotMatch(scheduleExplorer, /match\.homeCode === "NLD" \|\| match\.awayCode === "NLD"/);
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

test("game embed is larger and left-aligned on desktop while mobile defaults to new-tab play", () => {
  assert.match(gameFrames, /Open spel in nieuw tabblad/);
  assert.match(gameFrames, /Mobiel speelt dit het best schermvullend/);
  assert.match(gameFrames, /Laadt het spel niet\? Open het in een nieuw tabblad\./);
  assert.doesNotMatch(gameFrames, /game-site moet inbedden toestaan/);
  assert.doesNotMatch(gameFrames, />Nieuw tabblad</);
  assert.match(gamesPage, /page-shell game-page-shell/);
  assert.match(globalsCss, /\.game-page-shell \{\n  width: min\(1420px, 100%\);\n\}/);
  assert.match(globalsCss, /\.game-frame \{[\s\S]*width: min\(1120px, 100%\);[\s\S]*aspect-ratio: 16 \/ 9;[\s\S]*margin-inline: 0 auto;/);
  assert.match(globalsCss, /@media \(max-width: 639px\) \{[\s\S]*\.game-frame,\n  \.game-embed-note \{\n    display: none;/);
  assert.match(globalsCss, /\.game-open-link \{[\s\S]*linear-gradient\(135deg, #19b85d, #0e8a49 62%, #0a6b38\)/);
});
