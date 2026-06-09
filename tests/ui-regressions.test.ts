import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";

async function readOptional(path: string) {
  try {
    return await readFile(new URL(path, import.meta.url), "utf8");
  } catch {
    return "";
  }
}

const loginForm = await readFile(new URL("../src/components/login-form.tsx", import.meta.url), "utf8");
const profileForm = await readFile(new URL("../src/components/profile-form.tsx", import.meta.url), "utf8");
const accountPage = await readFile(new URL("../src/app/account/page.tsx", import.meta.url), "utf8");
const passwordChangeForm = await readFile(new URL("../src/components/password-change-form.tsx", import.meta.url), "utf8");
const avatarPicker = await readFile(new URL("../src/components/avatar-picker.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../src/app/actions.ts", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const liveNav = await readFile(new URL("../src/components/live-subsite-nav.tsx", import.meta.url), "utf8");
const apiMeRoute = await readFile(new URL("../src/app/api/me/route.ts", import.meta.url), "utf8");
const predictionsPage = await readFile(new URL("../src/app/voorspellingen/page.tsx", import.meta.url), "utf8");
const rankingPage = await readFile(new URL("../src/app/ranglijst/page.tsx", import.meta.url), "utf8");
const rankingExplorer = await readFile(new URL("../src/components/ranking-explorer.tsx", import.meta.url), "utf8");
const rulesPage = await readFile(new URL("../src/app/regels/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const manifest = await readFile(new URL("../src/app/manifest.ts", import.meta.url), "utf8");
const constants = await readFile(new URL("../src/lib/constants.ts", import.meta.url), "utf8");
const siteHeader = await readFile(new URL("../src/components/site-header.tsx", import.meta.url), "utf8");
const quickMenu = await readFile(new URL("../src/components/quick-menu.tsx", import.meta.url), "utf8");
const languageSwitcher = await readOptional("../src/components/language-switcher.tsx");
const i18nLib = await readOptional("../src/lib/i18n.ts");
const middleware = await readFile(new URL("../middleware.ts", import.meta.url), "utf8");
const statusBar = await readFile(new URL("../src/components/status-bar.tsx", import.meta.url), "utf8");
const shareButton = await readFile(new URL("../src/components/share-button.tsx", import.meta.url), "utf8");
const brandWordmark = await readFile(new URL("../src/components/brand-wordmark.tsx", import.meta.url), "utf8");
const brand = await readFile(new URL("../src/components/brand.tsx", import.meta.url), "utf8");
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
const poolQr = await readFile(new URL("../src/components/pool-qr.tsx", import.meta.url), "utf8");
const appFirstShareLink = await readFile(new URL("../src/components/app-first-share-link.tsx", import.meta.url), "utf8");
const installAppCard = await readFile(new URL("../src/components/install-app-card.tsx", import.meta.url), "utf8");
const siteFooter = await readFile(new URL("../src/components/site-footer.tsx", import.meta.url), "utf8");
const localePreferenceSync = await readOptional("../src/components/locale-preference-sync.tsx");
const localeApiRoute = await readOptional("../src/app/api/locale/route.ts");
const teamFlag = await readFile(new URL("../src/components/team-flag.tsx", import.meta.url), "utf8");
const knockoutPredictionPicker = await readFile(new URL("../src/components/knockout-prediction-picker.tsx", import.meta.url), "utf8");
const groupPredictionCard = await readFile(new URL("../src/components/group-prediction-card.tsx", import.meta.url), "utf8");
const predictionsComplete = await readFile(new URL("../src/components/predictions-complete.tsx", import.meta.url), "utf8");
const formatLib = await readFile(new URL("../src/lib/format.ts", import.meta.url), "utf8");
const rankingLib = await readFile(new URL("../src/lib/ranking.ts", import.meta.url), "utf8");
const limitsLib = await readFile(new URL("../src/lib/limits.ts", import.meta.url), "utf8");
const lengthMigration = await readFile(new URL("../supabase/migrations/20260605103457_enforce_profile_pool_name_lengths.sql", import.meta.url), "utf8");
const uniqueMigration = await readFile(new URL("../supabase/migrations/20260605132432_enforce_unique_display_names.sql", import.meta.url), "utf8");
const globalsCss = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
const authEmailTemplate = await readFile(new URL("../supabase/templates/slimescore_auth.html", import.meta.url), "utf8");
const recoveryEmailTemplate = await readFile(new URL("../supabase/templates/slimescore_recovery.html", import.meta.url), "utf8");
const englishHomePage = await readOptional("../src/app/en/page.tsx");
const sitemapRoute = await readOptional("../src/app/sitemap.ts");
const robotsRoute = await readOptional("../src/app/robots.ts");
const aanmeldenPage = await readFile(new URL("../src/app/aanmelden/page.tsx", import.meta.url), "utf8");
const privacyPage = await readFile(new URL("../src/app/privacy/page.tsx", import.meta.url), "utf8");
const termsPage = await readFile(new URL("../src/app/voorwaarden/page.tsx", import.meta.url), "utf8");
const migrationFiles = await readdir(new URL("../supabase/migrations/", import.meta.url));
const preferredLocaleMigrations = (await Promise.all(
  migrationFiles
    .filter((file) => file.endsWith(".sql") && file.includes("preferred_locale"))
    .map((file) => readFile(new URL(`../supabase/migrations/${file}`, import.meta.url), "utf8")),
)).join("\n");

test("SEO and indexation expose NL/EN alternates, English keywords, sitemap and robots", () => {
  assert.match(layout, /World Cup 2026 pool/);
  assert.match(layout, /free World Cup pool/);
  assert.match(layout, /USA Canada Mexico 2026/);
  assert.match(layout, /"x-default": `\$\{SITE_URL\}\/en`/);
  assert.match(layout, /"@type": "WebSite"/);
  assert.match(layout, /areaServed: \["NL", "BE", "US", "CA", "MX", "GB", "Global"\]/);
  assert.match(englishHomePage, /keywords: \[/);
  assert.match(englishHomePage, /FIFA World Cup 2026 predictions/);
  assert.match(englishHomePage, /football pool/);
  assert.match(englishHomePage, /"x-default": `\$\{SITE_URL\}\/en`/);
  assert.match(sitemapRoute, /export default function sitemap/);
  assert.match(sitemapRoute, /"\/en"/);
  assert.match(sitemapRoute, /"\/games"/);
  assert.match(robotsRoute, /sitemap\.xml/);
  assert.match(robotsRoute, /export default function robots/);
  assert.match(robotsRoute, /disallow: \["\/admin", "\/api\/", "\/auth\/"\]/);
});

test("English authenticated home reuses the logged-in dashboard instead of the public landing page", () => {
  assert.match(englishHomePage, /HomeContent/);
  assert.match(homePage, /export async function HomeContent/);
  assert.match(homePage, /locale:\s*Locale/);
  assert.match(homePage, /persistSignupProfileFromMetadata/);
  assert.match(homePage, /copy\.dashboardTitle/);
  assert.match(homePage, /<Brand locale=\{locale\}/);
  assert.match(homePage, /<BottomNav current=\"\/\" \/>/);
});

test("account settings save team, avatar and language through Supabase without editing the SlimeScore name", () => {
  assert.doesNotMatch(accountPage, /name=\"nickname\"/);
  assert.match(accountPage, /copy\.playerName/);
  assert.match(accountPage, /name=\"team_name\"/);
  assert.match(accountPage, /defaultValue=\{teamName\}/);
  assert.match(accountPage, /<AvatarPicker initialKey=\{profile\?\.avatar_key\} name=\{nickname \|\| copy\.player\} locale=\{locale\}/);
  assert.match(actions, /const hasNickname = formData\.has\("nickname"\)/);
  assert.match(actions, /const hasTeamName = formData\.has\("team_name"\)/);
  assert.match(actions, /if \(hasTeamName\) \{[\s\S]*payload\.team_name = teamName;[\s\S]*\}/);
  assert.match(actions, /payload:\s*\{[\s\S]*nickname\?: string;[\s\S]*team_name\?: string;[\s\S]*avatar_key\?: string \| null;[\s\S]*preferred_locale\?: \"nl\" \| \"en\"/);
  assert.match(actions, /\.from\(\"profiles\"\)\.upsert\(\{ id: user\.id, \.\.\.payload \}/);
  assert.match(actions, /revalidatePath\(\"\/en\"\)/);
  assert.match(actions, /redirect\(`\$\{localizedHref\(\"\/account\", redirectLocale\)\}\?opgeslagen=\$\{savedKind\}`\)/);
});

test("signup, terms and privacy pages render in the active locale instead of 404 or Dutch-only copy", () => {
  for (const source of [aanmeldenPage, privacyPage, termsPage]) {
    assert.match(source, /getServerLocale/);
    assert.match(source, /const locale = await getServerLocale\(\)/);
    assert.match(source, /<Brand locale=\{locale\}/);
  }
  assert.match(aanmeldenPage, /LoginForm surface=\"inline\" initialMode=\"login\" locale=\{locale\}/);
  assert.match(aanmeldenPage, /Sign up/);
  assert.match(privacyPage, /Privacy policy/);
  assert.match(termsPage, /Terms of use/);
  assert.match(siteFooter, /localizedHref\(\"\/privacy\", locale\)/);
  assert.match(siteFooter, /localizedHref\(\"\/voorwaarden\", locale\)/);
});

test("mobile rankings distinguish individual players from sub-pools", () => {
  assert.match(rankingExplorer, /ranking-row-player/);
  assert.match(rankingExplorer, /ranking-row-pool/);
  assert.match(rankingExplorer, /playerRankLabel/);
  assert.match(rankingExplorer, /poolRankLabel/);
  assert.match(rankingExplorer, /playerTab: "Per speler"/);
  assert.match(rankingExplorer, /playerTab: "Per player"/);
  assert.match(rankingExplorer, /poolTab: "Per poule"/);
  assert.match(rankingExplorer, /poolTab: "Per pool"/);
  assert.match(rankingExplorer, /top 4 total/i);
  assert.match(poolMembers, /poolRankLabel/);
  assert.match(poolMembers, /Pool rank/);
  assert.doesNotMatch(globalsCss, /\.pool-member-world \{\n\s*display: none;\n\s*\}/);
});

test("footer version is bumped for this high-priority deploy", () => {
  assert.match(constants, /APP_VERSION = "0.34"/);
});
test("entry deadline is set to the Netherlands' first match (Sun 14 June 22:00)", () => {
  assert.match(constants, /ENTRY_DEADLINE_ISO = "2026-06-14T22:00:00\+02:00"/);
});

test("desktop UI uses compact page heroes, right-column rules banners and aligned game stage", () => {
  const pageHeroBlock = globalsCss.match(/\.hero-band-page \{[\s\S]*?\}/)?.[0] ?? "";
  const desktopPageHeroBlock = globalsCss.match(/\.hero-band-page\.hero-band-visual \{[\s\S]*?\}/)?.[0] ?? "";
  const pageMascotBlock = globalsCss.match(/\.hero-band-page \.hero-mascot \{[\s\S]*?\}/)?.[0] ?? "";
  const rulesBannerBlock = globalsCss.match(/\.rules-side-banners \.slime-link-banners \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(pageHeroBlock, /min-height: 170px;/);
  assert.match(desktopPageHeroBlock, /min-height: 168px;/);
  assert.match(desktopPageHeroBlock, /align-items: start;/);
  assert.match(pageMascotBlock, /max-height: 78%;/);
  assert.match(pageMascotBlock, /max-width: 34%;/);
  assert.match(rulesBannerBlock, /width: 100%;/);
  assert.match(rulesPage, /FAQ \+ banners/);
  assert.match(rulesPage, /<section className="rules-side-banners"[\s\S]*?<\/div>\n      <\/section>/);
  assert.match(gamesPage, /game-page-heading/);
  assert.match(gameFrames, /game-stage grid gap-3/);
  assert.match(globalsCss, /\.game-page-heading,\n\.game-stage \{\n  width: min\(1120px, 100%\);/);
  assert.match(globalsCss, /\.game-frame \{[\s\S]*width: 100%;/);
});

test("main site language switcher matches the live dropdown pattern", () => {
  assert.match(languageSwitcher, /ChevronDown/);
  assert.match(languageSwitcher, /language-switcher-btn/);
  assert.match(languageSwitcher, /language-switcher-menu/);
  assert.match(languageSwitcher, /role="listbox"/);
  assert.match(languageSwitcher, /role="option"/);
  assert.doesNotMatch(languageSwitcher, /GB<\/span>|NL<\/span>/);
  assert.match(globalsCss, /\.language-switcher-menu \{[\s\S]*position: absolute;[\s\S]*min-width: 168px;/);
});

test("ranking desktop column headers distinguish players and poules", () => {
  assert.match(rankingExplorer, /worldTitle: "Ranking spelers"/);
  assert.match(rankingExplorer, /poolsTitle: "Ranking poules"/);
});

test("live subsite header respects the iOS status bar (safe-area-inset-top)", () => {
  const headerBlock = globalsCss.match(/\.live-subsite-header \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(headerBlock, /padding: calc\(8px \+ env\(safe-area-inset-top\)\) 12px 8px;/);
  assert.match(headerBlock, /z-index: 1000;/);
  assert.match(headerBlock, /isolation: isolate;/);
});

test("live sticky header has visible menu tabs and a high-z-index flag language dropdown", () => {
  const menuBlock = globalsCss.match(/\.live-subsite-menu \{[\s\S]*?\}/)?.[0] ?? "";
  const linkBlock = globalsCss.match(/\.live-subsite-menu-link \{[\s\S]*?\}/)?.[0] ?? "";
  const langButtonBlock = globalsCss.match(/\.live-lang-btn \{[\s\S]*?\}/)?.[0] ?? "";
  const langMenuBlock = globalsCss.match(/\.live-lang-menu \{[\s\S]*?\}/)?.[0] ?? "";
  const mobileLangMenuBlock = globalsCss.match(/@media \(max-width: 759px\) \{[\s\S]*?\.live-lang-menu \{[\s\S]*?\}\n\}/)?.[0] ?? "";
  assert.match(liveNav, /live-subsite-menu/);
  assert.match(liveNav, /liveHref: "\/schema\/knockout"/);
  assert.match(liveNav, /appHref: "\/live\/schema\/knockout"/);
  assert.match(liveNav, /window\.location\.hostname\.startsWith\("live\."\)/);
  assert.match(liveNav, /href === "\/schema" \|\| href === "\/live\/schema"/);
  assert.match(menuBlock, /grid-column: 1 \/ -1;/);
  assert.match(menuBlock, /grid-row: 2;/);
  assert.match(menuBlock, /overflow-x: auto;/);
  assert.match(linkBlock, /font-size: 0\.86rem;/);
  assert.match(langButtonBlock, /font: inherit;/);
  assert.match(langButtonBlock, /min-width: 43px;/);
  assert.match(langMenuBlock, /z-index: 1001;/);
  assert.match(mobileLangMenuBlock, /position: fixed;/);
  assert.match(mobileLangMenuBlock, /top: calc\(101px \+ env\(safe-area-inset-top\)\);/);
  assert.match(globalsCss, /\.live-subsite-main :where\(\.live-hero-band\) \{[\s\S]*position: relative;[\s\S]*z-index: 0;/);
});

test("schema hero has a red Follow live CTA and larger schedule section tabs", () => {
  const scheduleTabBlock = globalsCss.match(/\.schedule-tab \{[\s\S]*?\}/)?.[0] ?? "";
  const liveButtonBlock = globalsCss.match(/\.schema-live-follow-button \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(schemaPage, /import \{ LIVE_URL, SITE_URL \}/);
  assert.match(schemaPage, /href=\{LIVE_URL\}/);
  assert.match(schemaPage, /Volg live/);
  assert.match(schemaPage, /Follow live/);
  assert.match(liveButtonBlock, /#ef4444/);
  assert.match(liveButtonBlock, /#dc2626/);
  assert.match(liveButtonBlock, /#b91c1c/);
  assert.match(scheduleTabBlock, /font-size: 0\.9rem;/);
  assert.match(scheduleTabBlock, /font-weight: 950;/);
});

test("live mobile hero aligns Memphis with the share row and keeps the title block compact", () => {
  const liveHeroBlock = globalsCss.match(/\.live-hero-band \{[\s\S]*?\}/)?.[0] ?? "";
  const mascotBlock = globalsCss.match(/\.live-hero-mascot \{[\s\S]*?\}/)?.[0] ?? "";
  const titleBlock = globalsCss.match(/\.live-hero-title \{[\s\S]*?\}/)?.[0] ?? "";
  const subBlock = globalsCss.match(/\.live-hero-sub \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(liveHeroBlock, /padding-bottom: 22px;/);
  assert.match(mascotBlock, /bottom: 40px;/);
  assert.match(mascotBlock, /height: 160px;/);
  assert.match(titleBlock, /font-size: 1\.22rem;/);
  assert.match(titleBlock, /line-height: 1\.08;/);
  assert.match(subBlock, /font-size: 0\.84rem;/);
  assert.match(subBlock, /line-height: 1\.38;/);
});

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

test("fixed-code login can be opened directly without email from a safe query link", () => {
  assert.match(homePage, /type HomeSearchParams = \{ auth\?: string; login\?: string; profiel\?: string; reset\?: string; next\?: string \}/);
  assert.match(homePage, /initialLoginMode=\{params\.login === "code" \? "code" : "login"\}/);
  assert.match(homePage, /loginNext=\{params\.next\}/);
  assert.match(loginForm, /initialMode\?: Extract<LoginMode, "login" \| "register" \| "code">/);
  assert.match(loginForm, /submitPasswordLogin\(kidEmail\(normalized\), normalized, "code"\)/);
});

test("public FrontPage shows the PWA install instructions card near login", () => {
  assert.match(homePage, /import \{ InstallAppCard \} from "@\/components\/install-app-card"/);
  assert.match(homePage, /<LoginForm surface=\"inline\" initialMode=\{initialLoginMode\} next=\{loginNext\} \/>[\s\S]*<InstallAppCard \/>/);
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

test("pool banner upload helper appears before file input and keeps the original image ratio visible", () => {
  const uploadBlock = poulesPage.match(/<form action=\{uploadPoolImage\}[\s\S]*?<PendingButton/)?.[0] ?? "";
  assert.match(poulesPage, /uploadHint:[\s\S]*Aanbevolen: breed beeld, liefst 1600 × 900 px \(16:9\)\. We slaan uploads op als \.webp en tonen ze in originele verhouding, zonder crop of uitrekken\./);
  assert.match(poulesPage, /uploadHint:[\s\S]*Recommended: a wide image, preferably 1600 × 900 px \(16:9\)\. Uploads are stored as \.webp and shown in their original ratio, without cropping or stretching\./);
  assert.match(uploadBlock, /\{copy\.uploadHint\}[\s\S]*type="file"/);
  assert.match(actions, /const POOL_BANNER_MAX_WIDTH = 1600/);
  assert.match(actions, /const POOL_BANNER_MAX_HEIGHT = 900/);
  assert.match(actions, /resize\(\{[\s\S]*width: POOL_BANNER_MAX_WIDTH,[\s\S]*height: POOL_BANNER_MAX_HEIGHT,[\s\S]*fit: "inside"/);
  assert.doesNotMatch(actions, /fit: "cover"/);
  assert.doesNotMatch(uploadBlock, /1050 × 150|7:1|snijdt/);
});

test("create-pool placeholder uses a neutral local example instead of a personal family name", () => {
  assert.match(homePage, /createPoolPlaceholder: "Bijv\. FC Vathorst"/);
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
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*background-size: cover, contain, auto;/);
});

test("mobile pool navigation uses a dropdown selector instead of wrapping all pool tabs", () => {
  assert.match(poolTabs, /className="pool-selector-mobile"/);
  assert.match(poolTabs, /<select[\s\S]*className="pool-selector-select"[\s\S]*value=\{active\}[\s\S]*onChange=\{\(event\) => setActive\(event\.target\.value\)\}/);
  assert.match(poolTabs, /<option key=\{tab\.id\} value=\{tab\.id\}>[\s\S]*\{tab\.emoji\} \{tab\.label\}/);
  assert.match(globalsCss, /\.pool-selector-mobile \{\n  display: none;\n\}/);
  assert.match(globalsCss, /@media \(max-width: 640px\) \{[\s\S]*\.poules-page-shell \.pool-tabs \{\n    display: none;\n  \}[\s\S]*\.pool-selector-mobile \{\n    display: grid;/);
});

test("pool share text includes the poulecode and account-before-join guidance", () => {
  assert.match(poulesPage, /Doe je mee met onze 100% gratis WK-poule/);
  assert.match(poulesPage, /Poulecode: \$\{poolCode\}/);
  assert.match(poulesPage, /Nog geen account\? Maak eerst gratis een SlimeScore-account aan; daarna kom je via deze link\/code in de poule\./);
  assert.match(poulesPage, /1x ±10 min invullen\. Daarna volg je het speelschema en de uitslagen\./);
  assert.match(poulesPage, /Join our 100% free World Cup pool/);
  assert.match(poulesPage, /Pool code: \$\{poolCode\}/);
  assert.match(poulesPage, /No account yet\? Create a free SlimeScore account first; then this link\/code takes you into the pool\./);
  assert.match(poulesPage, /Fill in once in about 10 minutes\. Then follow the schedule and results\./);
  assert.match(poolQuickShare, /const message = `\$\{inviteText\}\\n\\n\$\{joinUrl\}`\.trim\(\)/);
  assert.match(poolQuickShare, /const groupMessageText = `\$\{poolInviteHeadline\}\\n\$\{poolInviteCode\}\\n\$\{copy\.accountHint\} \$\{poolInviteValue\}`/);
  assert.match(poolQuickShare, /const groupMessage = `\$\{groupMessageText\}\\n\\n\$\{joinUrl\}`/);
  assert.match(poolQuickShare, /code: \(poolCode: string\) => `Poulecode: \$\{poolCode\}`/);
  assert.match(poolQuickShare, /code: \(poolCode: string\) => `Pool code: \$\{poolCode\}`/);
  assert.match(joinPoolPage, /Nog geen account\? Maak eerst gratis een SlimeScore-account aan; daarna kom je terug bij deze poule\./);
  assert.doesNotMatch(joinPoolPage, /Geen wachtwoord\. Link klikken/);
});

test("account page saves profile, avatar, password and language safely", () => {
  assert.match(profileForm, /name=\"nickname\"/);
  assert.match(profileForm, /name=\"team_name\"/);
  assert.match(profileForm, /avatar_key/);
  assert.doesNotMatch(accountPage, /name=\"nickname\"/);
  assert.match(accountPage, /copy\.playerName/);
  assert.match(accountPage, /name=\"team_name\"/);
  assert.doesNotMatch(accountPage, /defaultValue=\{nickname\}/);
  assert.match(accountPage, /defaultValue=\{teamName\}/);
  assert.match(accountPage, /<form action=\{updateAccount\}/);
  assert.match(accountPage, /<AvatarPicker initialKey=\{profile\?\.avatar_key\} name=\{nickname \|\| copy\.player\} locale=\{locale\}/);
  assert.match(accountPage, /Avatar opslaan/);
  assert.match(accountPage, /name=\"preferred_locale\"/);
  assert.match(accountPage, /Account language/);
  assert.match(accountPage, /<PasswordChangeForm locale=\{locale\} \/>/);
  assert.match(accountPage, /<details className=\"panel p-5\">[\s\S]*E-mail/);
  assert.match(accountPage, /deleteTitle: \"Account verwijderen\"/);
  assert.match(accountPage, /deleteTitle: \"Delete account\"/);
  assert.match(accountPage, /<details className=\"panel border-red-200 p-5\">[\s\S]*\{copy\.deleteTitle\}/);
  assert.match(actions, /avatar_key: isAvatarKey\(avatarKey\) \? avatarKey : null/);
  assert.match(actions, /payload\.preferred_locale = preferredLocale/);
  assert.match(actions, /from\(\"profiles\"\)\.upsert\(\{ id: user\.id, \.\.\.payload \}\)/);
  assert.match(avatarPicker, /name=\"avatar_key\"/);
  assert.match(passwordChangeForm, /supabase\.auth\.getSession\(\)/);
  assert.match(passwordChangeForm, /supabase\.auth\.updateUser\(\{ password \}\)/);
});

test("shared SlimeScore links use the app icon instead of the wide banner", () => {
  assert.match(constants, /SITE_NAME = "SlimeScore"/);
  assert.match(manifest, /name: "SlimeScore"/);
  assert.match(manifest, /short_name: "SlimeScore"/);
  assert.match(manifest, /src: "\/icons\/slimescore-app-icon-v4-512\.png"/);
  assert.match(manifest, /purpose: "any"/);
  assert.match(manifest, /purpose: "maskable"/);
  assert.match(layout, /const ogImage = appIcon/);
  assert.match(layout, /slimescore-app-icon-v4-512\.png/);
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

test("share panel keeps the Deel SlimeScore label above a single icon row on every breakpoint", () => {
  assert.match(homePage, /sharePanelLabel: "SlimeScore delen"/);
  assert.match(homePage, /sharePanelTitle: "Deel SlimeScore"/);
  assert.match(homePage, /<div className=\"create-pool-share share-panel-strip\" aria-label=\{copy\.sharePanelLabel\}>[\s\S]*<ShareRow/);
  assert.match(homePage, /<div className=\"dark-panel poule-share-panel[\s\S]*<div className=\"share-panel-strip\">[\s\S]*<ShareRow/);
  assert.match(homePage, /<p className=\"share-panel-title\">\{copy\.sharePanelTitle\}<\/p>[\s\S]*<ShareRow/);
  assert.match(globalsCss, /\.share-panel-strip \{[\s\S]*display: grid;[\s\S]*justify-items: center;/);
  assert.match(globalsCss, /\.share-panel-strip \.share-actions \{[\s\S]*justify-content: center;/);
  assert.match(globalsCss, /\.share-row-compact \.share-actions \{[\s\S]*flex-wrap: nowrap;/);
  assert.doesNotMatch(shareButton, /className=\"share-link share-link-more\"/);
  assert.match(globalsCss, /@media \(min-width: 640px\) \{[\s\S]*\.share-panel-strip \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);[\s\S]*justify-content: center;/);
});

test("prediction saves sync the global status bar progress without requiring reload", () => {
  assert.match(predictionsPage, /StatusProgressSync/);
  assert.match(predictionsPage, /<StatusProgressSync progress=\{groupProgress\} \/>/);
  assert.match(statusBar, /slimescore:me-update/);
  assert.match(statusBar, /setMe\(\(current\)/);
});

test("knockout predictions flow from last 16 to later rounds without scroll boxes", () => {
  assert.match(predictionsPage, /<KnockoutPredictionPicker/);
  assert.match(predictionsPage, /Typ je verwachte uitslag\. Elke wedstrijd sluit 30 min vóór de aftrap/);
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
  assert.match(statusBar, /const predictHref = locale === "en" && !me\?\.loggedIn \? "\/en#login" : localizedHref\("\/voorspellingen", locale\)/);
  assert.match(statusBar, /href=\{predictHref\} className=\"status-chip status-chip-countdown/);
});

test("English locale has a top-menu flag switch and defaults to English outside NL/BE", () => {
  assert.match(i18nLib, /export const LOCALE_COOKIE = "slimescore-locale"/);
  assert.match(i18nLib, /SUPPORTED_LOCALES = \["nl", "en"\]/);
  assert.match(i18nLib, /countryCode === "NL" \|\| countryCode === "BE"/);
  assert.match(i18nLib, /const acceptedLanguages = acceptLanguage \?\? ""/);
  assert.match(i18nLib, /acceptedLanguages\.toLowerCase\(\)\.includes\("nl"\)/);
  assert.match(middleware, /request\.nextUrl\.searchParams\.get\("lang"\)/);
  assert.match(middleware, /request\.headers\.get\("x-vercel-ip-country"\)/);
  assert.match(middleware, /preferredLocaleFromRequest/);
  assert.match(middleware, /url\.pathname = "\/en"/);
  assert.match(middleware, /NextResponse\.redirect\(url\)/);
  assert.match(middleware, /response\.cookies\.set\(LOCALE_COOKIE, locale/);
  assert.match(languageSwitcher, /🇳🇱/);
  assert.match(languageSwitcher, /🇬🇧/);
  assert.match(languageSwitcher, /useActiveLocale\(pathname\)/);
  assert.doesNotMatch(languageSwitcher, /localeFromBrowserPreference\(pathname\)/);
  assert.match(languageSwitcher, /locale === "nl" \? "Nederlands actief" : "Switch to Dutch"/);
  assert.match(languageSwitcher, /aria-label=\{locale === "en" \? "Language switch" : "Taalkeuze \/ language switch"\}/);
  assert.match(languageSwitcher, /locale === "en" \? "English active" : "Switch to English"/);
  assert.match(languageSwitcher, /document\.cookie = `\$\{LOCALE_COOKIE\}=\$\{nextLocale\}/);
  assert.doesNotMatch(languageSwitcher, /next\/link/);
  assert.match(languageSwitcher, /const nlHref = `\$\{localizedHref\(pathname, "nl"\)\}\?lang=nl`/);
  assert.match(languageSwitcher, /const englishHref = `\$\{localizedHref\(pathname, "en"\)\}\?lang=en`/);
  assert.match(languageSwitcher, /const href = option\.code === "nl" \? nlHref : englishHref/);
  assert.match(siteHeader, /import \{ LanguageSwitcher \} from "@\/components\/language-switcher"/);
  assert.match(siteHeader, /<LanguageSwitcher \/>/);
  assert.match(quickMenu, /<LanguageSwitcher className=\"quick-menu-language-switcher\" \/>/);
  assert.match(globalsCss, /\.language-switcher \{/);
  assert.match(globalsCss, /\.language-switcher-option\.is-active/);
});

test("English landing page translates the public signup flow without changing the Dutch home", () => {
  assert.match(englishHomePage, /Free World Cup 2026 pool/);
  assert.match(englishHomePage, /const appIcon = "\/icons\/slimescore-app-icon-v4-512\.png"/);
  assert.match(englishHomePage, /images: \[\{ url: appIcon, width: 512, height: 512, alt: "SlimeScore app icon" \}\]/);
  assert.match(englishHomePage, /twitter: \{[\s\S]*images: \[appIcon\]/);
  assert.match(homePage, /Fill in your predictions for the full World Cup in about ten minutes/);
  assert.match(homePage, /Create your World Cup pool/);
  assert.match(homePage, /Share SlimeScore/);
  assert.match(homePage, /<LoginForm surface=\"inline\" initialMode=\{initialLoginMode\} locale=\"en\" next=\{loginNext\} \/>/);
  assert.match(loginForm, /locale = "nl"/);
  assert.match(loginForm, /const copy = loginCopy\[locale\]/);
  assert.match(loginForm, /Sign in/);
  assert.match(loginForm, /Create account/);
  assert.match(loginForm, /Forgot password\?/);
  assert.match(upcomingMatches, /locale = "nl"/);
  assert.match(upcomingMatches, /locale === "en" \? "Upcoming WC matches" : "Eerstvolgende WK-wedstrijden"/);
  assert.match(homePage, /Gratis WK 2026 Poule/);
  assert.match(homePage, /<LoginForm surface=\"inline\" initialMode=\{initialLoginMode\} next=\{loginNext\} \/>/);
});

test("English preference persists sitewide in browser storage and Supabase account", () => {
  assert.match(i18nLib, /export const LOCALE_STORAGE_KEY = "slimescore-locale"/);
  assert.match(i18nLib, /export function localeFromBrowserPreference/);
  assert.match(i18nLib, /export function localizedHref/);
  assert.match(languageSwitcher, /window\.localStorage\.setItem\(LOCALE_STORAGE_KEY, nextLocale\)/);
  assert.match(languageSwitcher, /fetch\("\/api\/locale"/);
  assert.match(localeApiRoute, /export async function POST/);
  assert.match(localeApiRoute, /response\.cookies\.set\(LOCALE_COOKIE, locale/);
  assert.match(localeApiRoute, /from\("profiles"\)\.update\(\{ preferred_locale: locale \}\)/);
  assert.match(localePreferenceSync, /fetch\("\/api\/me"/);
  assert.match(localePreferenceSync, /preferredLocale/);
  assert.match(localePreferenceSync, /const cookieLocale = localeFromCookieString\(document\.cookie\)/);
  assert.match(localePreferenceSync, /if \(cookieLocale\) return cookieLocale/);
  assert.match(localePreferenceSync, /window\.localStorage\.getItem\(LOCALE_STORAGE_KEY\)/);
  assert.match(localePreferenceSync, /reloadIfRenderedLocaleDiffers\(me\.preferredLocale\)/);
  assert.match(localePreferenceSync, /fetch\("\/api\/me"[\s\S]*fetch\("\/api\/locale"/);
  assert.match(layout, /<LocalePreferenceSync \/>/);
  assert.match(apiMeRoute, /select\("nickname,team_name,preferred_locale"\)/);
  assert.match(apiMeRoute, /preferredLocale: profile\?\.preferred_locale/);
  assert.match(accountPage, /name="preferred_locale"/);
  assert.match(accountPage, /Account language/);
  assert.match(actions, /payload\.preferred_locale = preferredLocale/);
  assert.match(actions, /cookieStore\.set\(LOCALE_COOKIE, preferredLocale/);
  assert.match(preferredLocaleMigrations, /add column if not exists preferred_locale text/);
  assert.match(preferredLocaleMigrations, /check \(preferred_locale in \('nl', 'en'\)\)/);
});

test("English preference keeps schedule and shared navigation in English without returning to Dutch schema copy", () => {
  assert.match(middleware, /if \(requestedLocale === "en" && url\.pathname === "\/"\)/);
  assert.doesNotMatch(middleware, /requestedLocale === "en"\)[\s\S]*new URL\("\/en"/);
  assert.match(siteHeader, /const locale = useActiveLocale\(pathname \|\| "\/"\)/);
  assert.match(siteHeader, /href=\{localizedHref\(link\.href, locale\)\}/);
  assert.match(quickMenu, /const locale = useActiveLocale\(pathname \|\| "\/"\)/);
  assert.match(quickMenu, /href=\{localizedHref\(link\.href, locale\)\}/);
  assert.match(statusBar, /localizedHref\("\/voorspellingen", locale\)/);
  assert.match(upcomingMatches, /href=\{localizedHref\("\/schema", locale\)\}/);
  assert.match(brand, /locale = "nl"/);
  assert.match(brand, /locale === "en" \? "WC pool 2026" : "WK-poule 2026"/);
  assert.match(schemaPage, /const locale = await getServerLocale\(\)/);
  assert.match(schemaPage, /locale === "en" \? "WC 2026 schedule" : "WK 2026 speelschema"/);
  assert.match(schemaPage, /<ScheduleExplorer matches=\{scheduleMatches\} initialView="groups" locale=\{locale\} \/>/);
  assert.match(schemaGroupsPage, /const locale = await getServerLocale\(\)/);
  assert.match(schemaKnockoutPage, /const locale = await getServerLocale\(\)/);
  assert.match(scheduleExplorer, /locale = "nl"/);
  assert.match(scheduleExplorer, /groups: "Groups"/);
  assert.match(scheduleExplorer, /allGroups: "All groups"/);
  assert.match(scheduleExplorer, /noMatches: "No matches for this selection\."/);
  assert.match(scheduleExplorer, /\{scheduleCopy\[locale\]\.noMatches\}/);
  assert.match(scheduleExplorer, /formatAmsterdam\(match\.startsAt, locale === "en" \? "en-GB" : "nl-NL"\)/);
  assert.doesNotMatch(scheduleExplorer, /aria-label="Speelschema onderdelen"/);
});

test("English route translates all visible shared fields and labels", () => {
  assert.match(statusBar, /const locale = useActiveLocale\(pathname \|\| "\/"\)/);
  assert.match(statusBar, /locale === "en" \? `\$\{d\}d \$\{h\}h` : `\$\{d\}d \$\{h\}u`/);
  assert.match(statusBar, /Time left to predict/);
  assert.match(statusBar, /Entries closed/);
  assert.match(statusBar, /Player/);
  assert.match(statusBar, /completed/);
  assert.match(statusBar, /Join for free/);
  assert.match(statusBar, /href=\{locale === "en" \? "\/en#login" : localizedHref\("\/aanmelden", locale\)\}/);
  assert.match(siteHeader, /aria-label=\{locale === "en" \? "Main menu" : "Hoofdmenu"\}/);
  assert.match(quickMenu, /\{locale === "en" \? "Open menu" : "Menu openen"\}/);
  assert.match(quickMenu, /aria-label=\{locale === "en" \? "Quick navigation" : "Snelle navigatie"\}/);
  assert.match(quickMenu, /aria-label=\{locale === "en" \? "Account actions" : "Account acties"\}/);
  assert.match(siteFooter, /locale === "en" \? "Terms" : "Voorwaarden"/);
  assert.match(siteFooter, /locale === "en" \? "beta" : "bèta"/);
  assert.match(layout, /<SiteFooter locale=\{htmlLang\} \/>/);
  assert.match(shareButton, /locale = "nl"/);
  assert.match(shareButton, /const sharePrefix = locale === "en" \? "Share via" : "Delen via"/);
  assert.match(shareButton, /Copied/);
  assert.match(shareButton, /Share via WhatsApp, Facebook, Telegram, Signal, email or Instagram\/native share\./);
  assert.match(homePage, /<ShareRow[\s\S]*locale=\{locale\}/);
  assert.match(teamFlag, /locale = "nl"/);
  assert.match(teamFlag, /locale === "en" \? `Flag of \$\{name\}` : `Vlag van \$\{name\}`/);
  assert.match(upcomingMatches, /<TeamFlag code=\{m\.home_code\} name=\{teamNameForLocale\(m\.home_code, m\.home\?\.name_nl, locale\)\} locale=\{locale\}/);
  assert.match(formatLib, /RSA: "South Africa"/);
  assert.match(formatLib, /BIH: "Bosnia and Herzegovina"/);
  assert.match(upcomingMatches, /locale === "en" \? "Result not known yet" : "Uitslag nog niet bekend"/);
  assert.match(loginForm, /aria-label=\{copy\.containerLabel\}/);
  assert.match(loginForm, /aria-label=\{copy\.codeLoginAria\}/);
  assert.match(loginForm, /aria-label=\{copy\.resetCodeFormAria\}/);
  assert.match(loginForm, /aria-label=\{copy\.signupCodeFormAria\}/);
  assert.match(loginForm, /aria-label=\{copy\.passwordLoginAria\}/);
  assert.match(loginForm, /aria-label=\{copy\.registerAria\}/);
  assert.match(loginForm, /aria-label=\{copy\.emailResetAria\}/);
});

test("mobile poule page prioritizes ranking and keeps share buttons visible next to the pool name", () => {
  assert.match(poulesPage, /<div className=\"pool-card-title-row\">[\s\S]*<PoolQuickShare/);
  assert.doesNotMatch(poulesPage, /isManager=\{isManager\}/);
  assert.match(poulesPage, /<PoolMembers members=\{poolMembersById\.get\(pool\.id\) \?\? \[\]\} locale=\{locale\} \/>[\s\S]*\{copy\.board\}[\s\S]*\{copy\.shareOptions\}[\s\S]*\{copy\.settings\}/);
  assert.match(poolMembers, /title: "Ranglijst & deelnemers"/);
  assert.match(poolMembers, /title: "Ranking & participants"/);
  assert.match(poolMembers, /pool-members-count/);
  assert.match(poolQuickShare, /<div className=\"pool-quick-share\" aria-label=\{copy\.containerLabel\}>/);
  assert.match(poolQuickShare, /label=\{copy\.shareVia\("WhatsApp"\)\}/);
  assert.match(poolQuickShare, /label=\{copy\.shareVia\("Facebook"\)\}/);
  assert.match(poolQuickShare, /label=\{copy\.shareVia\("Telegram"\)\}/);
  assert.match(poolQuickShare, /aria-label=\{nativeCopied === "Signal" \? copy\.copied\("Signal"\) : copy\.shareVia\("Signal"\)\}/);
  assert.match(poolQuickShare, /aria-label=\{copy\.shareVia\("mail"\)\}/);
  assert.match(poolQuickShare, /copy\.shareVia\("Instagram\/native share"\)/);
  assert.doesNotMatch(poolQuickShare, /Kopieer link|Deel via QR-code|aria-label=\"Deel QR-code\"/);
  assert.doesNotMatch(poolQuickShare, /isManager \? \(/);
  assert.match(poolQuickShare, /whatsapp:\/\/send\?text=\$\{encodedMessage\}/);
  assert.match(poolQuickShare, /https:\/\/wa\.me\/\?text=\$\{encodedMessage\}/);
  assert.match(poolQuickShare, /onClick=\{\(\) => nativeShare\(groupMessageText, "Signal"\)\}/);
  assert.doesNotMatch(poolQuickShare, /sgnl:\/\/send\?text=/);
  assert.match(poolQuickShare, /fb:\/\/facewebmodal\/f\?href=\$\{encodeURIComponent\(facebookWebHref\)\}/);
  assert.match(poolQuickShare, /tg:\/\/msg_url\?url=\$\{encodedUrl\}&text=\$\{encodedInvite\}/);
  assert.match(poolQuickShare, /async function nativeShare\(shareText = groupMessageText, channelLabel = "native share"\)/);
  assert.match(poolQuickShare, /navigator\.share\(\{ title: copy\.nativeTitle\(poolName\), text: shareText, url: joinUrl \}\)/);
  assert.match(shareButton, /type ShareChannel = "whatsapp" \| "facebook" \| "telegram" \| "signal" \| "mail" \| "instagram" \| "native"/);
  assert.match(shareButton, /whatsapp:\/\/send\?text=\$\{encodedWhatsApp\}/);
  assert.match(shareButton, /tg:\/\/msg_url\?url=\$\{encodedUrl\}&text=\$\{encodedTelegramText\}/);
  assert.match(shareButton, /action: "signal"/);
  assert.match(shareButton, /onClick=\{\(\) => onNativeShare\(target\.action\)\}/);
  assert.doesNotMatch(shareButton, /sgnl:\/\/send\?text=/);
  assert.match(shareButton, /fb:\/\/facewebmodal\/f\?href=\$\{encodeURIComponent\(facebookWebHref\)\}/);
  assert.match(shareButton, /https:\/\/www\.facebook\.com\/sharer\/sharer\.php\?u=\$\{encodedUrl\}&quote=\$\{encodedFacebookQuote\}/);
  assert.match(appFirstShareLink, /window\.location\.href = appHref/);
  assert.match(appFirstShareLink, /window\.open\(webHref, "_blank", "noopener,noreferrer"\)/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(globalsCss, /\.pool-card-title-row \{[\s\S]*display: flex;[\s\S]*flex-wrap: wrap;[\s\S]*gap: 8px;/);
  assert.match(globalsCss, /\.pool-quick-share \{[\s\S]*display: inline-flex;[\s\S]*align-items: center;/);
  assert.match(globalsCss, /\.pool-share-actions \{[\s\S]*flex-wrap: nowrap;/);
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
  assert.match(upcomingMatches, /<ResultBoxes home=\{m\.home_score\} away=\{m\.away_score\} locale=\{locale\} \/>/);
  assert.match(scheduleExplorer, /<ResultBoxes match=\{match\} locale=\{locale\} \/>/);
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
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /shareTitle: "WK 2026 speelschema"/);
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /shareTitle: "WC 2026 schedule"/);
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /<ShareButton[\s\S]*title=\{[^}]+shareTitle|title=\{scheduleTitle\}[\s\S]*label=\{[^}]+shareLabel|label=\{scheduleCopy\[locale\]\.shareLabel\}[\s\S]*locale=\{locale\}/);
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
  assert.match(globalsCss, /\.hero-band-page \{[\s\S]*max-height: 200px;/);
  assert.match(globalsCss, /\.hero-band-page\.hero-band-visual \{\n    min-height: 168px;[\s\S]*align-items: start;/);
  assert.match(globalsCss, /\.schedule-team-grid \{[\s\S]*grid-template-columns: var\(--match-home-col, minmax\(118px, 160px\)\) 30px minmax\(0, 1fr\) 62px;/);
  assert.match(scheduleExplorer, /schedule-team-separator/);
  assert.match(scheduleExplorer, /schedule-team-cell-away/);
  assert.match(globalsCss, /\.group-phase-body \{[\s\S]*minmax\(0, 1fr\) 320px/);
  assert.match(scheduleExplorer, /teamAbbrev\(row\.code, row\.name\)/);
  assert.doesNotMatch(scheduleExplorer, /dark-panel rounded-2xl/);
});

test("game embed is larger, locale-aware and left-aligned on desktop while mobile defaults to new-tab play", () => {
  assert.match(gameFrames, /open: "Open spel in nieuw tabblad"/);
  assert.match(gameFrames, /open: "Open game in a new tab"/);
  assert.match(gameFrames, /mobileNote: "Mobiel speelt dit het best schermvullend/);
  assert.match(gameFrames, /mobileNote: "On mobile this plays best full-screen/);
  assert.match(gameFrames, /embedNote: "Laadt het spel niet\? Open het in een nieuw tabblad\."/);
  assert.match(gameFrames, /embedNote: "Game not loading\? Open it in a new tab\."/);
  assert.match(gamesPage, /getServerLocale/);
  assert.match(gamesPage, /Slime games/);
  assert.match(gamesPage, /<GameFrames[\s\S]*locale=\{locale\}/);
  assert.doesNotMatch(gameFrames, /game-site moet inbedden toestaan/);
  assert.doesNotMatch(gameFrames, />Nieuw tabblad</);
  assert.match(gamesPage, /page-shell game-page-shell/);
  assert.match(globalsCss, /\.game-page-shell \{\n  width: min\(1420px, 100%\);\n\}/);
  assert.match(gameFrames, /game-stage grid gap-3/);
  assert.match(globalsCss, /\.game-page-heading,\n\.game-stage \{\n  width: min\(1120px, 100%\);[\s\S]*margin-inline: 0 auto;/);
  assert.match(globalsCss, /\.game-frame \{[\s\S]*width: 100%;[\s\S]*aspect-ratio: 16 \/ 9;[\s\S]*margin-inline: 0 auto;/);
  assert.match(globalsCss, /@media \(max-width: 639px\) \{[\s\S]*\.game-frame,\n  \.game-embed-note \{\n    display: none;/);
  assert.match(globalsCss, /\.game-open-link \{[\s\S]*linear-gradient\(135deg, #19b85d, #0e8a49 62%, #0a6b38\)/);
});

test("English mode is wired through rankings, rules, pools and predictions pages", () => {
  assert.match(rankingPage, /getServerLocale/);
  assert.match(rankingPage, /const locale = await getServerLocale\(\)/);
  assert.match(rankingPage, /<Brand locale=\{locale\} \/>/);
  assert.match(rankingPage, /<RankingExplorer players=\{players\} pools=\{poolRankings\} locale=\{locale\} \/>/);
  assert.match(rankingExplorer, /locale = "nl"/);
  assert.match(rankingExplorer, /World rankings/);
  assert.match(rankingExplorer, /Search for a player or team/);

  assert.match(rulesPage, /getServerLocale/);
  assert.match(rulesPage, /rulesCopy\[locale\]/);
  assert.match(rulesPage, /Rules and explanation/);
  assert.match(rulesPage, /World Cup pools/);
  assert.match(rulesPage, /Frequently asked questions/);

  assert.match(poulesPage, /getServerLocale/);
  assert.match(poulesPage, /poolCopy\[locale\]/);
  assert.match(poulesPage, /<PoolTabs tabs=\{tabs\} initialId=\{params\.pool\} locale=\{locale\}>/);
  assert.match(poulesPage, /<PoolQuickShare[\s\S]*locale=\{locale\}/);
  assert.match(poulesPage, /<PoolMembers members=\{poolMembersById\.get\(pool\.id\) \?\? \[\]\} locale=\{locale\} \/>/);
  assert.match(poulesPage, /buildPoolMembers\([\s\S]*locale\)/);
  assert.match(poulesPage, /locale === "en" \? `\$\{SITE_URL\}\/poules\/join\/\$\{pool\.code\}\?lang=en`/);
  assert.match(poolMembers, /locale = "nl"/);
  assert.match(poolQuickShare, /locale = "nl"/);
  assert.match(poolTabs, /locale = "nl"/);
  assert.match(poolQr, /locale = "nl"/);
  assert.match(joinPoolPage, /getServerLocale/);
  assert.match(joinPoolPage, /joinPoolCopy\[locale\]/);
  assert.match(joinPoolPage, /<Brand locale=\{locale\} \/>/);
  assert.match(joinPoolPage, /<LoginForm[\s\S]*locale=\{locale\}/);
  assert.match(joinPoolPage, /copy\.notLoggedInTitle/);
  const englishJoinCopy = joinPoolPage.match(/en: \{[\s\S]*?\n  \},\n\} as const;/)?.[0] ?? "";
  assert.match(englishJoinCopy, /Join this World Cup pool/);
  assert.match(englishJoinCopy, /Copy link/);
  assert.doesNotMatch(englishJoinCopy, /Eerst aanmelden|Uitnodiging|Kopieer link/);

  assert.match(predictionsPage, /getServerLocale/);
  assert.match(predictionsPage, /predictionCopy\[locale\]/);
  assert.match(predictionsPage, /<GroupPredictionCard[\s\S]*locale=\{locale\}/);
  assert.match(predictionsPage, /<KnockoutPredictionPicker[\s\S]*locale=\{locale\}/);
  assert.match(predictionsPage, /<PredictionsComplete locale=\{locale\} \/>/);
  assert.match(groupPredictionCard, /locale = "nl"/);
  assert.match(groupPredictionCard, /teamNameForLocale/);
  assert.match(knockoutPredictionPicker, /stageCopy\[locale\]/);
  assert.match(knockoutPredictionPicker, /teamNameForLocale/);
  assert.match(predictionsComplete, /locale = "nl"/);
});

test("mobile landing hero keeps title and host pills compact on one line", () => {
  assert.match(globalsCss, /@media \(max-width: 420px\) \{[\s\S]*\.hero-home \.world-cup-kicker \{[\s\S]*flex-wrap: nowrap;[\s\S]*font-size: 0\.56rem;/);
  assert.match(globalsCss, /@media \(max-width: 420px\) \{[\s\S]*\.hero-home \.world-cup-kicker span \{[\s\S]*padding: 3px 5px;/);
  assert.match(globalsCss, /@media \(max-width: 420px\) \{[\s\S]*\.hero-home-title-block h1 \{[\s\S]*font-size: clamp\(1\.48rem, 7\.4vw, 1\.68rem\) !important;/);
});
