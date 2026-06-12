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
const avatarsLib = await readFile(new URL("../src/lib/avatars.ts", import.meta.url), "utf8");
const actions = await readFile(new URL("../src/app/actions.ts", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const livePage = await readFile(new URL("../src/app/live/page.tsx", import.meta.url), "utf8");
const liveLayout = await readFile(new URL("../src/app/live/layout.tsx", import.meta.url), "utf8");
const liveNav = await readFile(new URL("../src/components/live-subsite-nav.tsx", import.meta.url), "utf8");
const liveFollowBanner = await readFile(new URL("../src/components/live-follow-banner.tsx", import.meta.url), "utf8");
const slimeSoccerBanner = await readFile(new URL("../src/components/slime-soccer-banner.tsx", import.meta.url), "utf8");
const apiMeRoute = await readFile(new URL("../src/app/api/me/route.ts", import.meta.url), "utf8");
const predictionsPage = await readFile(new URL("../src/app/voorspellingen/page.tsx", import.meta.url), "utf8");
const fifaRankingHelp = await readFile(new URL("../src/components/fifa-ranking-help.tsx", import.meta.url), "utf8");
const autosaveExtrasComponent = await readFile(new URL("../src/components/autosave-extras.tsx", import.meta.url), "utf8");
const fifaRankingData = await readFile(new URL("../src/lib/fifa-ranking.ts", import.meta.url), "utf8");
const rankingPage = await readFile(new URL("../src/app/ranglijst/page.tsx", import.meta.url), "utf8");
const rankingExplorer = await readFile(new URL("../src/components/ranking-explorer.tsx", import.meta.url), "utf8");
const rulesPage = await readFile(new URL("../src/app/regels/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const manifest = await readFile(new URL("../src/app/manifest.ts", import.meta.url), "utf8");
const constants = await readFile(new URL("../src/lib/constants.ts", import.meta.url), "utf8");
const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
const prodBuildGuard = await readFile(new URL("../scripts/assert-git-production-build.mjs", import.meta.url), "utf8");
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
const poolBoardComposer = await readFile(new URL("../src/components/pool-board-composer.tsx", import.meta.url), "utf8");
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
const recalculateLib = await readFile(new URL("../src/lib/recalculate.ts", import.meta.url), "utf8");
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

test("desktop header renders the WK slime logo larger and sharper", () => {
  assert.match(siteHeader, /wk_slime_700_transparant\.webp/);
  assert.doesNotMatch(siteHeader, /header-slime-memphis-v2\.webp/);
  assert.match(siteHeader, /sizes=\"60px\"/);
  assert.match(globalsCss, /\.site-header-logo img\.site-header-avatar \{[\s\S]*width: 60px;[\s\S]*height: 60px;[\s\S]*transform: none;/);
});

test("logged-in status header uses the user's avatar instead of the trophy icon", () => {
  assert.match(apiMeRoute, /select\("nickname,team_name,avatar_key,preferred_locale"\)/);
  assert.match(apiMeRoute, /avatarKey: profile\?\.avatar_key \?\? null/);
  assert.match(statusBar, /import \{ Avatar \} from "@\/components\/avatar";/);
  assert.match(statusBar, /type Me = \{ loggedIn: boolean; nickname\?: string \| null; avatarKey\?: string \| null; rank\?: number \| null; progress\?: number \}/);
  assert.match(statusBar, /<Avatar name=\{me\.nickname \?\? \(locale === "en" \? "Player" : "Speler"\)\} avatarKey=\{me\.avatarKey\} size=\{18\} \/>/);
  assert.doesNotMatch(statusBar, /<Trophy aria-hidden="true"/);
  assert.match(globalsCss, /\.status-chip-account \.avatar-img \{[\s\S]*width: 18px;[\s\S]*height: 18px;[\s\S]*background: rgba\(255, 255, 255, 0\.22\);/);
});

test("special bonus facts do not score before the champion is known", () => {
  assert.match(recalculateLib, /if \(facts && actualByStage\.has\("champion"\)\)/);
});

test("footer version is bumped for this high-priority deploy", () => {
  assert.match(constants, /APP_VERSION = "0.77"/);
});


test("mobile status bar background bleeds to viewport edges", () => {
  assert.match(globalsCss, /\.status-bar::before \{[\s\S]*right: calc\(50% - 50vw\);[\s\S]*left: calc\(50% - 50vw\);[\s\S]*background: inherit;/);
});

test("production builds are technically blocked outside Vercel Git main", () => {
  assert.match(packageJson, /"build": "node scripts\/assert-git-production-build\.mjs && next build"/);
  assert.match(prodBuildGuard, /VERCEL_ENV === "production"/);
  assert.match(prodBuildGuard, /VERCEL_GIT_COMMIT_SHA/);
  assert.match(prodBuildGuard, /VERCEL_GIT_COMMIT_REF/);
  assert.match(prodBuildGuard, /gitRef !== "main"/);
});

test("entry deadline is extended until the first World Cup match", () => {
  assert.match(constants, /ENTRY_DEADLINE_ISO = "2026-06-11T21:00:00\+02:00"/);
  assert.match(constants, /ENTRY_GRACE_DEADLINE_ISO = "2026-06-14T21:00:00\+02:00"/);
  assert.match(homePage, /Deadline: 11 juni 21:00\. Respijt t\/m zondag 14 juni voor niet-gespeelde wedstrijden/);
  assert.match(statusBar, /tot WK/);
  assert.match(rulesPage, /Respijtperiode: niet-gespeelde groepswedstrijden/);
  assert.match(rulesPage, /ENTRY_GRACE_DEADLINE_ISO/);
  assert.match(rulesPage, /zondag 14 juni 21:00/);
});

test("status bar counts down through the grace window instead of saying 'closed'", () => {
  // Drie fasen: vóór WK → respijt (wijzigen kan) → dicht. Telt af tot de grace-deadline.
  assert.match(statusBar, /ENTRY_GRACE_DEADLINE_ISO/);
  assert.match(statusBar, /phase: "grace"/);
  assert.match(statusBar, /Nog te wijzigen <strong>\{status\.left\}<\/strong>/);
  assert.match(statusBar, /Editable <strong>\{status\.left\}<\/strong>/);
  // "Invullen gesloten" alleen ná de respijt-deadline (closed-fase).
  assert.match(statusBar, /status\.phase === "closed"[\s\S]*?Invullen gesloten|Invullen gesloten/);
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

test("mobile tab page heroes use larger bottom-right mascots behind the title copy", () => {
  assert.match(predictionsPage, /className="hero-title-mascot-large"/);
  assert.match(rulesPage, /className="hero-title-mascot-large"/);
  assert.match(rankingPage, /className="hero-title-mascot-large"/);
  assert.match(accountPage, /className="hero-title-mascot-large"/);
  assert.match(globalsCss, /\.hero-band-page \.hero-content \{\n    max-width: 86%;\n  \}/);
  assert.match(globalsCss, /\.hero-band-page\.hero-title-mascot-large\.hero-band-visual \.hero-mascot \{[\s\S]*right: -8px;[\s\S]*bottom: -7px;[\s\S]*max-height: 73%;[\s\S]*max-width: 38%;/);
  assert.match(accountPage, /slime="\/avatars\/messi-slime\.webp"/);
  assert.match(globalsCss, /\.hero-mascot-account-messi \{[\s\S]*max-height: 76%;[\s\S]*max-width: 39%;/);
  assert.match(globalsCss, /\.hero-band-page\.hero-title-mascot-large\.hero-band-visual \.hero-mascot-regels \{[\s\S]*max-height: 53%;[\s\S]*max-width: 43%;/);
  assert.match(globalsCss, /\.hero-title-mascot-large \.hero-content \{[\s\S]*text-shadow: 0 2px 10px/);
});

test("main mobile header and hamburger stay sticky and quick menu has a Schema/Live half-row", () => {
  const heroTopbarBlock = globalsCss.match(/\.hero-topbar \{[\s\S]*?\}/)?.[0] ?? "";
  const heroBandTopbarBlock = globalsCss.match(/\.hero-band-topbar \{[\s\S]*?\}/)?.[0] ?? "";
  const hamburgerBlock = globalsCss.match(/\.quick-menu-button \{[\s\S]*?\}/)?.[0] ?? "";
  const quickMenuHomeRowBlock = globalsCss.match(/\.quick-menu-home-row \{[\s\S]*?\}/)?.[0] ?? "";
  const splitRowBlock = globalsCss.match(/\.quick-menu-split-row \{[\s\S]*?\}/)?.[0] ?? "";
  const halfLinkBlock = globalsCss.match(/\.quick-menu-link-half \{[\s\S]*?\}/)?.[0] ?? "";
  const liveLinkBlock = globalsCss.match(/\.quick-menu-live-link \{[\s\S]*?\}/)?.[0] ?? "";
  const pairConfig = quickMenu.slice(quickMenu.indexOf("const menuPairLinks"), quickMenu.indexOf("const privateLinks"));
  assert.match(heroTopbarBlock, /position: fixed;/);
  assert.match(heroTopbarBlock, /z-index: 45;/);
  assert.doesNotMatch(heroTopbarBlock, /backdrop-filter|blur\(/);
  assert.match(heroBandTopbarBlock, /padding-top: 16px;/);
  assert.match(hamburgerBlock, /position: fixed;/);
  assert.match(hamburgerBlock, /top: calc\(60px \+ env\(safe-area-inset-top\)\);/);
  assert.match(hamburgerBlock, /z-index: 50;/);
  assert.match(quickMenu, /menuPairLinks/);
  assert.match(quickMenu, /LIVE_URL/);
  assert.match(quickMenu, /quick-menu-split-row/);
  assert.match(pairConfig, /href: "\/schema"[\s\S]*href: LIVE_URL/);
  assert.match(quickMenu, /quick-menu-brand-name/);
  assert.match(quickMenu, /quick-menu-brand-slime/);
  assert.match(quickMenu, /quick-menu-home-row/);
  assert.match(quickMenuHomeRowBlock, /grid-template-columns: minmax\(0, 1fr\) auto;/);
  assert.doesNotMatch(quickMenu, /text-xl font-bold text-\[#081634\]">\{locale === "en" \? "Menu" : "Menu"\}/);
  assert.match(splitRowBlock, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(halfLinkBlock, /justify-content: flex-start;/);
  assert.match(liveLinkBlock, /rgba\(242, 106, 27, 0\.28\)/);
});

test("ranking card and Slime Soccer banner stay in the public mobile bottom stack", () => {
  const publicMobileStack = homePage.match(/<PublicPromoStack[\s\S]*className=\"public-mobile-bottom-stack\"[\s\S]*\/>/)?.[0] ?? "";
  const promoStackComponent = homePage.match(/function PublicPromoStack[\s\S]*$/)?.[0] ?? "";
  const bottomStackBlock = globalsCss.match(/\.public-mobile-bottom-stack \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(publicMobileStack, /className=\"public-mobile-bottom-stack\"/);
  assert.match(promoStackComponent, /public-score-card/);
  assert.match(promoStackComponent, /<LiveFollowBanner locale=\{locale\} \/>[\s\S]*<SlimeSoccerBanner includeVolley=\{false\} fullWidth locale=\{locale\} \/>/);
  assert.match(bottomStackBlock, /display: grid;/);
  assert.match(globalsCss, /@media \(min-width: 768px\) \{[\s\S]*\.public-mobile-bottom-stack \{[\s\S]*display: none;/);
});

test("main site language switcher matches the live dropdown pattern", () => {
  assert.match(languageSwitcher, /ChevronDown/);
  assert.match(languageSwitcher, /language-switcher-btn/);
  assert.match(languageSwitcher, /language-switcher-menu/);
  assert.match(languageSwitcher, /role="listbox"/);
  assert.match(languageSwitcher, /role="option"/);
  assert.doesNotMatch(languageSwitcher, /GB<\/span>|NL<\/span>/);
  assert.match(globalsCss, /\.language-switcher-menu \{[\s\S]*position: absolute;[\s\S]*z-index: 120;[\s\S]*min-width: 150px;/);
  assert.match(globalsCss, /\.language-switcher-option \{[\s\S]*font-size: 0\.78rem;[\s\S]*font-weight: 600;/);
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

test("live sticky header has visible menu tabs, predict CTA, hamburger and high-z-index flag dropdown", () => {
  const headerInnerBlock = globalsCss.match(/\.live-subsite-header-inner \{[\s\S]*?\}/)?.[0] ?? "";
  const menuBlock = globalsCss.match(/\.live-subsite-menu \{[\s\S]*?\}/)?.[0] ?? "";
  const linkBlock = globalsCss.match(/\.live-subsite-menu-link \{[\s\S]*?\}/)?.[0] ?? "";
  const predictLinkBlock = globalsCss.match(/\.live-subsite-menu-link-predict \{[\s\S]*?\}/)?.[0] ?? "";
  const hamburgerBlock = globalsCss.match(/\.live-menu-button \{[\s\S]*?\}/)?.[0] ?? "";
  const backdropBlock = globalsCss.match(/\.live-menu-backdrop \{[\s\S]*?\}/)?.[0] ?? "";
  const langButtonBlock = globalsCss.match(/\.live-lang-btn \{[\s\S]*?\}/)?.[0] ?? "";
  const langMenuBlock = globalsCss.match(/\.live-lang-menu \{[\s\S]*?\}/)?.[0] ?? "";
  const mobileLangMenuBlock = globalsCss.match(/@media \(max-width: 759px\) \{[\s\S]*?\.live-lang-menu \{[\s\S]*?\}\n\}/)?.[0] ?? "";
  assert.match(liveNav, /live-subsite-menu/);
  assert.match(liveNav, /WK voorspellen/);
  assert.match(liveNav, /href: SITE_URL/);
  assert.match(liveNav, /target=\{external \? "_blank" : undefined\}/);
  assert.match(liveNav, /rel=\{external \? "noopener noreferrer" : undefined\}/);
  assert.match(liveLayout, /className=\"live-pool-banner\"[\s\S]*target=\"_blank\"[\s\S]*rel=\"noopener noreferrer\"/);
  assert.match(liveNav, /live-menu-button/);
  assert.match(liveNav, /live-menu-panel/);
  assert.match(liveNav, /window\.location\.hostname\.startsWith\("live\."\)/);
  assert.match(headerInnerBlock, /width: min\(1050px, 100%\);/);
  assert.match(headerInnerBlock, /padding-inline: 16px;/);
  const topNavConfig = liveNav.slice(liveNav.indexOf("const navCopy"), liveNav.indexOf("const drawerLinks"));
  assert.doesNotMatch(topNavConfig, /Finales|Finals|schema\/knockout/);
  assert.match(liveNav, /href === "\/schema" \|\| href === "\/live\/schema"/);
  assert.match(menuBlock, /grid-column: 1 \/ -1;/);
  assert.match(menuBlock, /grid-row: 2;/);
  assert.match(menuBlock, /overflow-x: auto;/);
  assert.match(linkBlock, /font-size: 0\.86rem;/);
  assert.match(predictLinkBlock, /width: 138px;/);
  assert.match(predictLinkBlock, /margin-left: 8px;/);
  assert.match(predictLinkBlock, /background: rgba\(255, 255, 255, 0\.12\);/);
  assert.match(hamburgerBlock, /linear-gradient\(135deg, #ff9800, #f26a1b\)/);
  assert.match(globalsCss, /\.live-menu-button \{\n    position: fixed;\n    top: calc\(112px \+ env\(safe-area-inset-top\)\);/);
  assert.match(backdropBlock, /justify-content: flex-start;/);
  assert.match(globalsCss, /@media \(min-width: 760px\) \{[\s\S]*\.live-menu-button \{[\s\S]*display: none;/);
  assert.match(langButtonBlock, /font: inherit;/);
  assert.match(langButtonBlock, /min-width: 43px;/);
  assert.match(langMenuBlock, /z-index: 1001;/);
  assert.match(mobileLangMenuBlock, /position: fixed;/);
  assert.match(mobileLangMenuBlock, /top: calc\(101px \+ env\(safe-area-inset-top\)\);/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.live-subsite-header \{[\s\S]*padding: calc\(8px \+ env\(safe-area-inset-top\)\) 8px 8px;/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.live-subsite-header-inner \{[\s\S]*padding-inline: 0;/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.live-subsite-menu \{[\s\S]*grid-template-columns: minmax\(76px, 0\.78fr\) minmax\(88px, 0\.92fr\) minmax\(126px, 1\.3fr\);[\s\S]*gap: 5px;[\s\S]*overflow: visible;/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.live-subsite-menu-link,[\s\S]*\.live-subsite-menu-link-predict \{[\s\S]*min-height: 32px;[\s\S]*font-size: 0\.8rem;/);
  assert.match(globalsCss, /@media \(min-width: 760px\) \{[\s\S]*\.live-subsite-menu \{[\s\S]*flex: 1 1 auto;[\s\S]*justify-content: flex-start;[\s\S]*gap: 14px;/);
  assert.match(globalsCss, /@media \(min-width: 760px\) \{[\s\S]*\.live-subsite-menu-link-predict \{[\s\S]*width: 166px;[\s\S]*margin-left: auto;/);
  assert.match(globalsCss, /\.live-subsite-main :where\(\.live-hero-band\) \{[\s\S]*position: relative;[\s\S]*z-index: 0;/);
});

test("schema hero uses compact live/share actions and smaller schedule tabs", () => {
  assert.match(schemaPage, /import \{ LIVE_URL, SITE_URL \}/);
  assert.match(schemaPage, /SchemaHeroActions/);
  assert.match(schemaPage, /liveUrl=\{LIVE_URL\}/);
  assert.match(schemaPage, /Volg live/);
  assert.match(schemaPage, /Follow live/);
  assert.match(globalsCss, /\.schema-live-follow-button,[\s\S]*\.schema-share-trigger \{[\s\S]*#ef4444/);
  assert.match(globalsCss, /\.schema-live-follow-button,[\s\S]*\.schema-share-trigger \{[\s\S]*#dc2626/);
  assert.match(globalsCss, /\.schema-live-follow-button,[\s\S]*\.schema-share-trigger \{[\s\S]*#b91c1c/);
  assert.match(globalsCss, /\.schema-share-popover \{[\s\S]*position: absolute;/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.schema-live-follow-button,[\s\S]*\.schema-share-trigger \{[\s\S]*width: 42px;/);
  assert.match(globalsCss, /\.schedule-tab \{[\s\S]*min-height: 40px;[\s\S]*font-size: 0\.8rem;[\s\S]*font-weight: 950;/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.schedule-tab \{[\s\S]*min-height: 36px;[\s\S]*font-size: 0\.72rem;/);
});

test("live mobile hero moves host pills up, splits the title and keeps the schema CTA half-width", () => {
  const liveHeroContentBlock = globalsCss.match(/\.live-hero-band \.hero-content \{[\s\S]*?\}/)?.[0] ?? "";
  const liveHeroBlock = globalsCss.match(/\.live-hero-band \{[\s\S]*?\}/)?.[0] ?? "";
  const liveHeroKickerBlock = globalsCss.match(/\.live-hero-band \.world-cup-kicker \{[\s\S]*?\}/)?.[0] ?? "";
  const mascotBlock = globalsCss.match(/\.live-hero-mascot \{[\s\S]*?\}/)?.[0] ?? "";
  const titleBlock = globalsCss.match(/\.live-hero-title \{[\s\S]*?\}/)?.[0] ?? "";
  const titleSublineBlock = globalsCss.match(/\.live-hero-title-subline \{[\s\S]*?\}/)?.[0] ?? "";
  const ctaBlock = globalsCss.match(/\.live-hero-cta \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(livePage, /heroTitle: "WK 2026 Live:"/);
  assert.match(livePage, /heroTitleSub: "uitslagen, standen & schema"/);
  assert.match(livePage, /live-hero-title-subline/);
  assert.doesNotMatch(livePage, /live-hero-brandline/);
  assert.doesNotMatch(livePage, /BrandWordmark onDark/);
  assert.doesNotMatch(livePage, /Gratis, zonder gedoe|Free, no fuss/);
  assert.match(liveHeroBlock, /padding: 14px 16px 10px;/);
  assert.match(liveHeroContentBlock, /padding-top: 0;/);
  assert.match(liveHeroKickerBlock, /margin-bottom: 12px;/);
  assert.match(mascotBlock, /bottom: 16px;/);
  assert.match(mascotBlock, /height: 132px;/);
  assert.match(titleBlock, /margin-top: 0;/);
  assert.match(titleBlock, /font-size: clamp\(1\.55rem, 7vw, 2\.05rem\);/);
  assert.match(titleBlock, /font-weight: 950;/);
  assert.match(titleSublineBlock, /font-size: clamp\(1\.06rem, 5vw, 1\.5rem\);/);
  assert.match(ctaBlock, /flex: 0 1 min\(50%, 182px\);/);
  assert.match(ctaBlock, /font-size: 0\.78rem;/);
});

test("schedule filters fit one row with a compact Dutch flag chip", () => {
  const controlsBlock = globalsCss.match(/\.schedule-groups-controls \{[\s\S]*?\}/)?.[0] ?? "";
  const pickerButtonBlock = globalsCss.match(/\.schedule-picker-button \{[\s\S]*?\}/)?.[0] ?? "";
  const nlChipBlock = globalsCss.match(/\.schedule-nl-chip \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(scheduleExplorer, /className=\{nlOnly \? "schedule-orange-chip schedule-nl-chip schedule-orange-chip-active"/);
  assert.match(scheduleExplorer, /aria-label=\{scheduleCopy\[locale\]\.netherlandsFilter\}/);
  assert.match(scheduleExplorer, /<span aria-hidden="true">🇳🇱<\/span>/);
  assert.match(controlsBlock, /flex-wrap: nowrap;/);
  assert.match(controlsBlock, /overflow: visible;/);
  assert.doesNotMatch(controlsBlock, /overflow-x: auto;/);
  assert.match(pickerButtonBlock, /font-size: 0\.76rem;/);
  assert.match(pickerButtonBlock, /white-space: nowrap;/);
  assert.match(nlChipBlock, /min-width: 36px;/);
  assert.doesNotMatch(scheduleExplorer, />\s*\{scheduleCopy\[locale\]\.netherlandsFilter\}\s*<\/button>/);
});

test("logged-in homepage shows the green edit-deadline copy (countdown lives in the status bar)", () => {
  assert.match(homePage, /dashboardTitle: "Voorspel je WK 2026"/);
  assert.match(homePage, /dashboardStarted: "WK begonnen! 🎉"/);
  assert.match(homePage, /dashboardGraceLead: "Tot zondag 14 juni 21:00"/);
  assert.match(homePage, /dashboardAfterGrace: "Na 14 juni kun je alleen nog de 3 bonusvragen wijzigen\. Deadline: 28 juni\."/);
  assert.match(homePage, /dashboardAfterGrace: "After 14 June you can only change the 3 bonus questions\. Deadline: 28 June\."/);
  assert.match(homePage, /<strong className="dashboard-grace-lead">\{copy\.dashboardGraceLead\}<\/strong>/);
  assert.match(globalsCss, /\.dashboard-grace-lead \{\n  color: #4ade80;/);
  // De aftelklok hoort in de bovenbalk, niet in het dashboard-blok.
  assert.doesNotMatch(homePage, /GraceCountdown/);
  assert.match(homePage, /dark-panel p-4 text-white sm:p-5/);
  assert.match(homePage, /max-w-\[34rem\] text-\[0\.82rem\] font-medium leading-\[1\.5\]/);
  assert.match(homePage, /dashboard-progress-card mt-3 rounded-lg bg-\[#061b47\] p-2\.5 sm:p-3/);
  assert.match(homePage, /dashboard-progress-bar mt-2 h-2\.5/);
  assert.match(homePage, /dashboard-extra-progress-bar mt-2 h-2/);
  assert.match(homePage, /<p className="text-2xl font-bold sm:text-3xl">\{progress\}%<\/p>/);
  assert.match(homePage, /<p className="text-xl font-bold tabular-nums sm:text-2xl">\{extraProgress\}%<\/p>/);
  assert.match(homePage, /<Avatar name=\{nickname \|\| copy\.you\} avatarKey=\{profile\?\.avatar_key\} size=\{78\} \/>/);
  assert.match(homePage, /<Brand hideIcon locale=\{locale\} \/>/);
  assert.match(globalsCss, /\.home-mobile-user-avatar \{[\s\S]*display: inline-flex;/);
  assert.match(globalsCss, /\.home-mobile-user-avatar \.avatar-img \{[\s\S]*width: 84px;[\s\S]*height: 84px;/);
  assert.match(globalsCss, /\.home-mobile-user-avatar \.avatar-img \{[\s\S]*border: 2px solid rgba\(242, 106, 27, 0\.92\);[\s\S]*background: transparent;/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.home-mobile-user-avatar \.avatar-img \{[\s\S]*width: 78px;[\s\S]*height: 78px;/);
});

test("prediction edits and bonus fields stay open through the 14 June grace window while every match keeps the 30-minute lock", () => {
  assert.match(constants, /ENTRY_GRACE_DEADLINE_ISO = "2026-06-14T21:00:00\+02:00"/);
  assert.match(actions, /const canEditBonus = now < ENTRY_GRACE_DEADLINE;/);
  assert.match(actions, /const canEditMain = now < ENTRY_GRACE_DEADLINE;/);
  assert.match(actions, /const canEditLate = now < ENTRY_GRACE_DEADLINE;/);
  assert.doesNotMatch(actions, /canEditPreKickoffBonus/);
  assert.doesNotMatch(actions, /POST_GROUP_DEADLINE/);
  assert.doesNotMatch(actions, /POST_GROUP_WINDOW_START/);
  assert.match(actions, /if \(isMatchLocked\(match\.starts_at, now\)\) continue;/);
  assert.match(actions, /if \(isMatchLocked\(match\.starts_at, now\)\) return \{ ok: false, error: "vergrendeld" \};/);
  assert.match(predictionsPage, /const bonusOpen = mainOpen;/);
  assert.match(predictionsPage, /const lateOpen = mainOpen;/);
  assert.match(predictionsPage, /disabled=\{!bonusOpen\}/);
  assert.match(predictionsPage, /disabled=\{!mainOpen\}/);
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
  assert.match(homePage, /<h1 className=\"mt-3 /);
  assert.match(globalsCss, /\.hero-home \.world-cup-kicker \{\n    margin-bottom: 12px;\n    transform: none;/);
  assert.match(globalsCss, /\.hero-home-title-block \{\n    max-width: min\(100%, 305px\);\n    transform: none;/);
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

test("create-pool card uses Mexico green contrast styling and restored mobile typography", () => {
  assert.match(homePage, /create-pool-card/);
  assert.match(homePage, /create-pool-button/);
  assert.match(homePage, /create-pool-title text-lg font-bold/);
  assert.match(homePage, /create-pool-copy text-sm font-medium leading-6/);
  assert.doesNotMatch(homePage, /create-pool-title text-base font-bold sm:text-lg/);
  assert.doesNotMatch(homePage, /create-pool-copy text-xs font-medium leading-5/);
  assert.match(globalsCss, /\.create-pool-card \{[\s\S]*#006847[\s\S]*#009b3a/);
  assert.match(globalsCss, /\.create-pool-button\.button-primary \{[\s\S]*#ce1126/);
  assert.match(globalsCss, /\.create-pool-title,[\s\S]*\.create-pool-copy \{\n  color: #ffffff;/);
});

test("pool banner upload helper appears before file input and describes the compact 5:1 UI slot", () => {
  const uploadBlock = poulesPage.match(/<form action=\{uploadPoolImage\}[\s\S]*?<PendingButton/)?.[0] ?? "";
  assert.match(poulesPage, /uploadHint:[\s\S]*Aanbevolen: brede banner, liefst 1050 × 210 px \(5:1\)\. We slaan uploads op als \.webp en tonen de banner over de volle breedte van de poulekaart\./);
  assert.match(poulesPage, /uploadHint:[\s\S]*Recommended: a wide banner, preferably 1050 × 210 px \(5:1\)\. Uploads are stored as \.webp and shown across the full width of the pool card\./);
  assert.match(uploadBlock, /\{copy\.uploadHint\}[\s\S]*type="file"/);
  assert.match(actions, /const POOL_BANNER_MAX_WIDTH = 1600/);
  assert.match(actions, /const POOL_BANNER_MAX_HEIGHT = 900/);
  assert.match(actions, /resize\(\{[\s\S]*width: POOL_BANNER_MAX_WIDTH,[\s\S]*height: POOL_BANNER_MAX_HEIGHT,[\s\S]*fit: "inside"/);
  assert.doesNotMatch(actions, /fit: "cover"/);
  assert.doesNotMatch(uploadBlock, /1600 × 900|16:9|originele verhouding|without cropping|7:1/);
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

test("pool card uses the uploaded banner as a full-width compact 5:1 hero", () => {
  assert.match(poulesPage, /"--pool-accent": pool\.accentColor/);
  assert.match(poulesPage, /"--pool-banner-image": `url\("\$\{poolBannerUrl\(pool\.id, pool\.bannerPath, pool\.bannerUpdatedAt\)\}"\)`/);
  assert.match(poulesPage, /<div className="pool-card-hero text-white" style=\{poolHeroStyle\}>/);
  assert.doesNotMatch(poulesPage, /<PoolBanner/);
  assert.match(globalsCss, /\.poules-page-shell \{\n  \/\* 1098 border-box - 24px desktop padding links\/rechts = ±1050px bannerbreedte\. \*\/\n  width: min\(1098px, 100%\);\n\}/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*border-top: 4px solid var\(--pool-accent/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*aspect-ratio: 5 \/ 1;/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*max-height: 210px;/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*var\(--pool-banner-image, none\)[\s\S]*var\(--pool-accent/);
  assert.match(globalsCss, /\.pool-card-hero \{[\s\S]*background-size: cover, cover, auto;/);
  assert.doesNotMatch(globalsCss, /\.pool-card-hero \{[\s\S]*aspect-ratio: 16 \/ 9;/);
});

test("pool ranking rows are compact and keep player metadata on one line", () => {
  assert.match(poolMembers, /className="pool-member-world ml-1 inline-flex/);
  assert.doesNotMatch(poolMembers, /pool-member-world mt-0\.5 flex/);
  assert.match(globalsCss, /\.pool-members-section \{[\s\S]*padding: 12px;/);
  assert.match(globalsCss, /\.pool-member-button \{[\s\S]*min-height: 40px;[\s\S]*padding: 6px 9px;/);
  assert.match(globalsCss, /\.pool-member-rank \{[\s\S]*width: 24px;[\s\S]*height: 24px;/);
  assert.match(globalsCss, /\.pool-member-main \{[\s\S]*display: block;[\s\S]*white-space: nowrap;/);
  assert.match(globalsCss, /\.pool-member-world \{[\s\S]*vertical-align: baseline;/);
});

test("pool ranking enlarges a player's avatar when the row is opened", () => {
  assert.match(poolMembers, /<Avatar name=\{member\.name\} avatarKey=\{member\.avatarKey\} size=\{open \? 34 : 22\} \/>/);
  assert.doesNotMatch(poolMembers, /<Avatar name=\{member\.name\} avatarKey=\{member\.avatarKey\} size=\{22\} \/>/);
  assert.match(globalsCss, /\.pool-member-button \.avatar-img \{[\s\S]*transition: width 160ms ease, height 160ms ease, transform 160ms ease;/);
  assert.match(globalsCss, /\.pool-member-button\[aria-expanded="true"\] \.avatar-img \{[\s\S]*transform: scale\(1\.03\);/);
});

test("pool message board has a green title bar and light-green messages", () => {
  assert.match(poulesPage, /<h3 className="pool-board-titlebar">\{copy\.board\}<\/h3>/);
  assert.match(globalsCss, /\.pool-board-section \{[\s\S]*background: #f2fbf5;/);
  assert.match(globalsCss, /\.pool-board-titlebar \{[\s\S]*background: linear-gradient\(90deg, #0e7a44, #15a35b\);[\s\S]*color: #ffffff;/);
  assert.match(globalsCss, /\.pool-board-message \{[\s\S]*border-color: #bce7c7;[\s\S]*background: #f3fcf6;/);
  assert.doesNotMatch(poulesPage, /<h3 className="text-lg font-bold text-\[#101a2b\]">\{copy\.board\}<\/h3>/);
});

test("mobile pool navigation uses a dropdown selector instead of wrapping all pool tabs", () => {
  assert.match(poolTabs, /className="pool-selector-mobile"/);
  assert.match(poolTabs, /<select[\s\S]*className="pool-selector-select"[\s\S]*value=\{active\}[\s\S]*onChange=\{\(event\) => selectPool\(event\.target\.value\)\}/);
  assert.match(poolTabs, /<option key=\{tab\.id\} value=\{tab\.id\}>[\s\S]*\{tab\.emoji\} \{tab\.label\}/);
  // Onthoudt de laatst-actieve poule (localStorage) + houdt de URL in sync.
  assert.match(poolTabs, /localStorage\.setItem\(POOL_STORAGE_KEY/);
  assert.match(poolTabs, /searchParams\.set\("pool", id\)/);
  assert.match(poolTabs, /className="pool-tabs-root grid gap-4"/);
  assert.match(poolTabs, /className="pool-tab-panel"/);
  assert.match(globalsCss, /\.pool-tabs-root,\n\.pool-tab-panel \{\n  min-width: 0;/);
  assert.match(globalsCss, /\.pool-selector-mobile \{\n  display: none;\n\}/);
  assert.match(globalsCss, /@media \(max-width: 640px\) \{[\s\S]*\.poules-page-shell \{\n    padding: 12px 16px calc\(22px \+ env\(safe-area-inset-bottom\)\);\n  \}/);
  assert.match(globalsCss, /\.poules-page-shell > section,\n  \.pool-selector-mobile,\n  \.pool-card \{\n    width: 100%;\n    max-width: 100%;/);
  assert.match(globalsCss, /@media \(max-width: 640px\) \{[\s\S]*\.poules-page-shell \.pool-tabs \{\n    display: none;\n  \}[\s\S]*\.pool-selector-mobile \{\n    display: grid;/);
});

test("pool board has a WhatsApp-style emoji popover and a 2-column message grid on desktop", () => {
  assert.match(poolBoardComposer, /"use client"/);
  assert.match(poolBoardComposer, /const WK_EMOJIS = \[/);
  assert.match(poolBoardComposer, /useState\(false\)/);
  assert.match(poolBoardComposer, /className="pool-emoji-trigger"/);
  assert.match(poolBoardComposer, /className="pool-emoji-popover"/);
  assert.match(poolBoardComposer, /className="pool-emoji-grid"/);
  assert.match(poolBoardComposer, /aria-expanded=\{open\}/);
  assert.match(poolBoardComposer, /name="body"/);
  assert.match(poolBoardComposer, /setSelectionRange\(caret, caret\)/);
  assert.match(poulesPage, /<PoolBoardComposer placeholder=\{copy\.boardPlaceholder\} addLabel=\{copy\.addEmoji\} \/>/);
  assert.match(poulesPage, /addEmoji: "Emoji toevoegen"/);
  assert.match(poulesPage, /className="mt-3 grid gap-2 pool-board-messages"/);
  assert.match(globalsCss, /@media \(min-width: 768px\) \{[\s\S]*\.pool-board-messages \{[\s\S]*grid-template-columns: 1fr 1fr;/);
  assert.match(globalsCss, /\.pool-emoji-popover \{[\s\S]*width: min\(100%, 390px\);/);
  assert.match(globalsCss, /\.pool-emoji-grid \{[\s\S]*grid-template-columns: repeat\(8, minmax\(0, 1fr\)\);/);
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

test("profile shows the selected slime preview twice as large as the automatic preview", () => {
  assert.match(avatarPicker, /const previewSize = selected \? 112 : 56/);
  assert.match(avatarPicker, /width=\{previewSize\}/);
  assert.match(avatarPicker, /height=\{previewSize\}/);
  assert.match(avatarPicker, /style=\{\{ width: previewSize, height: previewSize \}\}/);
});

test("avatar picker adds the latest slime pack options without the visual duplicate picks", async () => {
  const avatarFiles = await readdir(new URL("../public/avatars/", import.meta.url));
  for (const key of ["koe-slime", "scheidsrechter-slime", "portugal-slime", "seychellen-slime", "fc-den-bosch-slime", "ajax-slime", "ueda-slime"]) {
    assert.match(avatarsLib, new RegExp(`key: "${key}"`));
    assert.match(avatarsLib, new RegExp(`"${key}"`));
    assert.ok(avatarFiles.includes(`${key}.webp`), `${key}.webp is present in public avatars`);
  }
  assert.doesNotMatch(avatarsLib, /key: "messi-slime"/);
  assert.doesNotMatch(avatarsLib, /key: "wk-slime"/);
  assert.match(avatarsLib, /legacyAvatarKeys = \["messi-slime", "wk-slime"\]/);
  assert.match(avatarPicker, /"koe-slime": "Cow"/);
  assert.match(avatarPicker, /"scheidsrechter-slime": "Referee"/);
  assert.match(avatarPicker, /"seychellen-slime": "Seychelles"/);
  assert.match(avatarPicker, /"fc-den-bosch-slime": "FC Den Bosch"/);
  assert.match(avatarPicker, /"ajax-slime": "Ajax"/);
  assert.match(avatarPicker, /"ueda-slime": "Ueda"/);
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

test("SlimeScore brand wordmarks stay connected and use blue/green on light backgrounds", () => {
  assert.match(brandWordmark, /memphis_wkbal_700_transparant\.webp/);
  assert.match(siteHeader, /wk_slime_700_transparant\.webp/);
  assert.doesNotMatch(`${brandWordmark}\n${siteHeader}`, /trump_slime_700_transparant\.webp/);
  assert.match(brand, /<span className="brand-lockup-slime">Slime<\/span><span className="brand-lockup-score">Score<\/span>/);
  assert.doesNotMatch(`${brand}\n${siteHeader}\n${brandWordmark}\n${quickMenu}`, /Slime Score/);
  assert.match(globalsCss, /\.brand-lockup-slime,[\s\S]*\.brand-wordmark-slime \{\n  color: #0b1f4d;[\s\S]*text-shadow: none;/);
  assert.match(globalsCss, /\.brand-lockup-score,[\s\S]*\.brand-wordmark-score \{\n  color: #128f47;[\s\S]*text-shadow: none;/);
  assert.match(globalsCss, /\.brand-wordmark-dark \.brand-wordmark-slime,[\s\S]*color: #ffffff;/);
  assert.match(globalsCss, /\.brand-lockup-sub \{[\s\S]*line-height: 1\.22;/);
  assert.match(globalsCss, /\.quick-menu-brand-slime \{\n  color: #0b1f4d;[\s\S]*text-shadow: none;[\s\S]*-webkit-text-stroke: 0;/);
  assert.match(globalsCss, /\.quick-menu-brand-sub \{[\s\S]*line-height: 1\.18;/);
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

test("homepage promo/ranking stacks keep desktop ranking tight below the pool block and mobile stack low", () => {
  const loggedInRightColumn = homePage.match(/<div className=\"grid gap-4\">\n\s*<UpcomingMatches[\s\S]*?<SlimeSoccerBanner includeVolley=\{false\} locale=\{locale\} \/>/)?.[0] ?? "";
  const publicRightColumn = homePage.match(/<aside className=\"public-login-stack[\s\S]*?<\/aside>/)?.[0] ?? "";
  const publicDesktopStack = homePage.match(new RegExp('<PublicPromoStack[\\s\\S]*className=\\"public-desktop-bottom-stack\\"[\\s\\S]*\\/>\\n\\s*<\\/section>'))?.[0] ?? "";
  const publicMobileStack = homePage.match(/<PublicPromoStack[\s\S]*className=\"public-mobile-bottom-stack\"[\s\S]*\/>/)?.[0] ?? "";
  const liveBannerBlock = globalsCss.match(/\.live-follow-banner \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(homePage, /import \{ LiveFollowBanner \}/);
  assert.match(liveFollowBanner, /LIVE_URL/);
  assert.match(liveFollowBanner, /href=\{LIVE_URL\}/);
  assert.match(liveFollowBanner, /target=\"_blank\"/);
  assert.match(liveFollowBanner, /rel=\"noopener noreferrer\"/);
  assert.match(liveFollowBanner, /Volg elke WK 2026-wedstrijd live — tussenstanden, opstellingen en statistieken, plus het volledige speelschema\./);
  assert.doesNotMatch(liveFollowBanner, /Stand, uitslagen en speelschema zonder gedoe\./);
  assert.match(liveFollowBanner, /blije_mascotte_met_wk_bal_FINAL_v5\.webp/);
  assert.ok(slimeSoccerBanner.includes('externalTile = tile.href.startsWith("https://")'));
  assert.match(slimeSoccerBanner, /target=\{externalTile \? "_blank" : undefined\}/);
  assert.match(loggedInRightColumn, /<LiveFollowBanner locale=\{locale\} \/>[\s\S]*<SlimeSoccerBanner includeVolley=\{false\} locale=\{locale\} \/>/);
  const promoStackComponent = homePage.match(/function PublicPromoStack[\s\S]*$/)?.[0] ?? "";
  assert.match(publicDesktopStack, /className=\"public-desktop-bottom-stack\"/);
  assert.match(publicMobileStack, /className=\"public-mobile-bottom-stack\"/);
  assert.match(promoStackComponent, /public-score-card[\s\S]*<LiveFollowBanner locale=\{locale\} \/>[\s\S]*<SlimeSoccerBanner includeVolley=\{false\} fullWidth locale=\{locale\} \/>/);
  assert.match(globalsCss, /\.public-desktop-bottom-stack \{\n  display: none;/);
  assert.match(globalsCss, /@media \(min-width: 768px\) \{[\s\S]*\.public-desktop-bottom-stack \{[\s\S]*display: grid;[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(250px, 0\.78fr\);/);
  assert.match(globalsCss, /\.public-desktop-bottom-stack \.slime-link-banners \{[\s\S]*grid-column: 1 \/ -1;/);
  assert.match(globalsCss, /@media \(min-width: 768px\) \{[\s\S]*\.public-mobile-bottom-stack \{[\s\S]*display: none;/);
  assert.doesNotMatch(publicRightColumn, /<LiveFollowBanner locale=\{locale\} \/>/);
  assert.match(liveBannerBlock, /url\("\/assets\/stadion-4to1\.webp"\)/);
  assert.match(liveBannerBlock, /min-height: 112px;/);
  assert.match(liveBannerBlock, /padding: 14px 112px 14px 14px;/);
  assert.match(globalsCss, /\.live-follow-banner-text \{[\s\S]*font-weight: 520;/);
  assert.match(globalsCss, /\.live-follow-banner img \{[\s\S]*width: 136px;[\s\S]*max-height: 132px;/);
});

test("dashboard copy matches the current prediction deadline and password flow", () => {
  assert.doesNotMatch(homePage, /Vul je wedstrijden en knock-outkeuzes in/);
  assert.match(homePage, /Voorspel je WK 2026/);
  assert.match(homePage, /dashboardIntroBefore: "Deadline:"/);
  assert.match(homePage, /dashboardGraceNotice: "Niet-gespeelde wedstrijden, knock-outs en bonusvragen kun je wijzigen tot 14 juni 2026 om 21:00\."/);
  assert.match(homePage, /dashboardGraceNotice: "Unplayed matches, knockouts and bonus questions can be changed until 14 June 2026 at 21:00\."/);
  assert.doesNotMatch(homePage, /Respijt tot Oranje begint/);
  assert.match(homePage, /max-w-\[34rem\] text-\[0\.82rem\] font-medium leading-\[1\.5\]/);
  assert.match(homePage, /text-base font-bold text-\[var\(--ink\)\] sm:text-lg/);
  assert.match(homePage, /create-pool-title text-lg font-bold/);
  assert.doesNotMatch(homePage, /geen wachtwoord/);
});

test("home dashboard warns when knockout picks or bonus questions are still open", () => {
  assert.match(homePage, /KNOCKOUT_TARGETS/);
  assert.match(homePage, /EXTRA_PROGRESS_TOTAL/);
  assert.match(homePage, /bracket_predictions[\s\S]*select\("stage_key,team_codes"\)/);
  assert.match(homePage, /special_predictions[\s\S]*team_most_goals_code,total_goals,total_red_cards,fastest_goal_minute,champion_code,oranje_stage,penalty_shootouts_ko,finalists/);
  assert.match(homePage, /extraProgressTitle: "Knock-outs \+ bonus"/);
  assert.match(homePage, /extraProgressOpen: \(knockout: number, bonus: number\)/);
  assert.match(homePage, /extraProgress = Math\.round\(\(extraFilled \/ EXTRA_PROGRESS_TOTAL\) \* 100\)/);
  assert.match(homePage, /extraRemaining > 0/);
  assert.match(homePage, /remaining === 0 && extraRemaining === 0 \? <PredictionsComplete/);
});

test("empty prediction select placeholders are highlighted as pending choices", () => {
  assert.match(predictionsPage, /className="field choice-select"/);
  assert.match(predictionsPage, /name="team_most_goals_code"[\s\S]*<option value="">\{copy\.chooseCountry\}<\/option>/);
  assert.match(predictionsPage, /name="champion_code"[\s\S]*<option value="">\{copy\.chooseChampion\}<\/option>/);
  assert.match(predictionsPage, /name="oranje_stage"[\s\S]*<option value="">\{copy\.chooseOranje\}<\/option>/);
  assert.match(globalsCss, /\.choice-select:has\(option\[value=""\]:checked\)/);
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

test("prediction page shows a short orange grace notice without long scoring explanation", () => {
  assert.match(predictionsPage, /heroSubtitle: "Vul je voorspellingen in en sla op\."/);
  assert.match(predictionsPage, /heroSubtitle: "Fill in your predictions and save\."/);
  assert.match(predictionsPage, /Veel wedstrijden, maar in 10 minuten kun je klaar zijn voor het hele WK/);
  assert.match(predictionsPage, /hero-inline-note/);
  assert.doesNotMatch(predictionsPage, /prediction-helper-panel/);
  assert.match(predictionsPage, /groupOpen: "Geen perfecte glazen bol nodig: vul eerst je gevoel in, verfijn later\."/);
  assert.match(predictionsPage, /graceNotice: "Nog niet gespeelde wedstrijden, knock-outs en bonusvragen kun je nog wijzigen tot zondag 14 juni 21\.00 uur!"/);
  assert.match(predictionsPage, /graceNotice: "Unplayed matches, knockouts and bonus questions can still be changed until Sunday 14 June, 21:00!"/);
  assert.match(predictionsPage, /className="prediction-grace-notice"/);
  assert.match(globalsCss, /\.prediction-grace-notice \{[\s\S]*color: #f26a1b;[\s\S]*font-weight: 900;/);
  assert.match(predictionsPage, /prediction-title-banner/);
  assert.doesNotMatch(predictionsPage, /Deadlines en puntentelling staan bij Regels/);
  assert.doesNotMatch(predictionsPage, /Details and deadlines are in Rules/);
  assert.doesNotMatch(predictionsPage, /T\/m 14 juni 21:00: niet-gestarte wedstrijden invullen en opslaan\./);
  assert.doesNotMatch(predictionsPage, /Until 14 June 21:00: fill in unstarted matches and save\./);
  assert.doesNotMatch(predictionsPage, /Vul snel in en schaaf bij t\/m donderdag 11 juni 21:00/);
  assert.doesNotMatch(predictionsPage, /Na de groepsfase is er nog een kleine herziening/);
  assert.doesNotMatch(predictionsPage, /Elke wedstrijd sluit 30 min vóór de aftrap; daarna kun je 'm niet meer wijzigen/);
});

test("knockout predictions flow from last 16 to later rounds without scroll boxes", () => {
  assert.match(predictionsPage, /<KnockoutPredictionPicker/);
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
  assert.match(globalsCss, /\.site-header \{[\s\S]*position: sticky;[\s\S]*top: 0;[\s\S]*z-index: 90;/);
  assert.match(quickMenu, /label: "Voorspellen"/);
  assert.doesNotMatch(quickMenu, /WK-poule invullen \/ wijzigen/);
  assert.match(quickMenu, /joinPoolLink = \{ href: "\/#meedoen"/);
  assert.match(quickMenu, /aria-label=\{locale === "en" \? "Pools and joining" : "WK-poules en meedoen"\}/);
  assert.match(quickMenu, /\[privateLinks\[1\], joinPoolLink\]\.map/);
  assert.match(quickMenu, /<form className=\"quick-menu-form\" action=\"\/logout\" method=\"post\">/);
  assert.match(quickMenu, /quick-menu-link-compact/);
  assert.match(quickMenu, /slime-soccer-icon\.webp/);
  assert.match(quickMenu, /target=\{link\.external \? "_blank" : undefined\}/);
  assert.match(quickMenu, /rel=\{link\.external \? "noopener noreferrer" : undefined\}/);
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
  assert.match(apiMeRoute, /select\("nickname,team_name,avatar_key,preferred_locale"\)/);
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
  assert.match(statusBar, /until WC/);
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
  assert.match(scheduleExplorer, /schedule-tabs-knockout/);
  assert.match(globalsCss, /@media \(max-width: 759px\) \{[\s\S]*\.schedule-tabs-knockout \{\n    display: none;/);
  assert.doesNotMatch(scheduleExplorer, /knockout-stage-meta/);
  assert.doesNotMatch(globalsCss, /\.knockout-stage-meta/);
  assert.match(globalsCss, /\.ko-view-btn\.is-active \{[\s\S]*background: #1e73b8;/);
  assert.match(globalsCss, /\.knockout-stage-tabs \.schedule-subtab:first-child \{[\s\S]*background: #ff8a00;/);
  assert.match(scheduleExplorer, /schedule-group-grid/);
  assert.match(scheduleExplorer, /Alle datums/);
});

test("schema copy is public-facing and group/date are chosen via pickers", () => {
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /Alle WK-wedstrijden op een rij met datum, tijd en stadion/);
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /Deel het schema gerust in je groepsapp/);
  assert.doesNotMatch(schemaPage + schemaGroupsPage + schemaKnockoutPage, /Geen account nodig/);
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /shareTitle: "WK 2026 speelschema"/);
  assert.match(schemaPage + schemaGroupsPage + schemaKnockoutPage, /shareTitle: "WC 2026 schedule"/);
  assert.match(schemaPage, /<SchemaHeroActions[\s\S]*shareTitle=\{scheduleTitle\}[\s\S]*shareLabel=\{scheduleCopy\[locale\]\.shareLabel\}[\s\S]*locale=\{locale\}/);
  assert.match(schemaGroupsPage + schemaKnockoutPage, /<ShareButton[\s\S]*title=\{[^}]+shareTitle[\s\S]*label=\{[^}]+shareLabel[\s\S]*locale=\{locale\}/);
  assert.doesNotMatch(schemaPage + schemaGroupsPage + schemaKnockoutPage, /AI-score|API-score|feedback|pagina staat/i);
  assert.match(scheduleExplorer, /Nederland - Oranje/);
  assert.match(scheduleExplorer, /schedule-picker-pop/);
  assert.match(scheduleExplorer, /schedule-group-grid/);
  assert.match(scheduleExplorer, /groupFilter/);
  assert.match(scheduleExplorer, /dateFilter/);
  assert.match(globalsCss, /\.group-phase-card \.standing-card-header \{[\s\S]*linear-gradient\(100deg, #1e73b8 0%, #0e7a44 100%\)/);
  assert.doesNotMatch(globalsCss, /\.group-phase-card \.standing-card-header \{[\s\S]*#ffb000[\s\S]*#e1262f/);
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

test("prediction page has FIFA ranking help with compact rank badges in prediction choices", () => {
  assert.match(predictionsPage, /fifaHelpSummary: "Extra hulp: FIFA-ranking"/);
  assert.match(predictionsPage, /fifaHelpSummary: "Extra help: FIFA ranking"/);
  assert.match(predictionsPage, /<FifaRankingHelp/);
  assert.match(predictionsPage, /worldCupTeamCodes=\{Array\.from\(worldCupTeamCodes\)\}/);
  // FIFA-paneel is een client-component met live filteren tijdens typen (NL + EN).
  assert.match(fifaRankingHelp, /"use client"/);
  assert.match(fifaRankingHelp, /value=\{query\}/);
  assert.match(fifaRankingHelp, /onChange=\{\(event\) => setQuery\(event\.target\.value\)\}/);
  assert.match(fifaRankingHelp, /\[row\.code, row\.name, row\.nameNl\]\.some/);
  assert.match(fifaRankingHelp, /formatMarketValue\(row\.marketValueMillions, locale\)/);
  // Bedragen uniform in miljoen met één decimaal (bijv. "€ 1.520,0 mln").
  assert.match(fifaRankingHelp, /minimumFractionDigits: 1/);
  assert.match(fifaRankingHelp, /`€ \$\{formatted\} mln`/);
  // Geen sources-tekst meer in het paneel; wel een datum in de titelbalk.
  assert.doesNotMatch(fifaRankingHelp, /fifaRankingSource|squadValueSource|sourceNote/);
  assert.match(predictionsPage, /fifaHelpDate: "per 10-06-2026"/);
  assert.match(fifaRankingHelp, /fifa-help-date/);
  // Geen redundante "FIFA-ranking:"-titel meer onder de oranje balk.
  assert.doesNotMatch(predictionsPage, /fifaTitle/);
  assert.doesNotMatch(fifaRankingHelp, /<h2>/);
  assert.match(globalsCss, /\.fifa-ranking-row \{/);
  assert.match(globalsCss, /grid-template-columns: 30px minmax\(0, 1fr\) 104px;/);
  // Selectiewaarde-kolom links uitgelijnd.
  assert.match(globalsCss, /\.fifa-ranking-value \{[\s\S]*justify-self: start;/);
  // Sticky, compacte hulpbalk (±top 10 zichtbaar).
  assert.match(globalsCss, /\.fifa-help-details \{[\s\S]*position: sticky;/);
  assert.match(globalsCss, /\.fifa-ranking-list \{[\s\S]*max-height: min\(44vh, 320px\);[\s\S]*overflow-y: auto;/);
  // Kolomkoppen Rang/Land/Selectiewaarde + geen "vetgedrukte landen"-tekst meer.
  assert.match(fifaRankingHelp, /fifa-ranking-head/);
  assert.match(fifaRankingHelp, /\{copy\.colValue\}/);
  assert.doesNotMatch(fifaRankingHelp, /fifa-help-intro|fifaIntro/);
  assert.match(predictionsPage, /fifaColValue: "Selectiewaarde"/);
  assert.match(globalsCss, /\.fifa-ranking-head \{/);
  // Mobiel: geen interne scroll, standaard alleen de top 8.
  assert.match(globalsCss, /\.fifa-ranking-list:not\(\.is-searching\) \.fifa-ranking-row:nth-child\(n \+ 9\) \{/);
  assert.match(predictionsPage, /teamOptionLabel\(team, locale\)/);
  assert.match(groupPredictionCard, /fifaRankLabel\(match\.home_code\)/);
  // Autosave per wedstrijd: gedebouncede opslag + status-indicator, en server-action.
  assert.match(groupPredictionCard, /import \{ autosavePrediction \} from "@\/app\/actions"/);
  assert.match(groupPredictionCard, /scheduleAutosave\(matchId, updated\)/);
  assert.match(groupPredictionCard, /autosavePrediction\(\{ matchId, home, away \}\)/);
  assert.match(groupPredictionCard, /prediction-save-status/);
  assert.match(actions, /export async function autosavePrediction\(/);
  assert.match(actions, /if \(now >= ENTRY_GRACE_DEADLINE\) return \{ ok: false, error: "gesloten" \}/);
  assert.match(actions, /isMatchLocked\(match\.starts_at, now\)/);
  assert.match(actions, /\.from\("predictions"\)\s*\.upsert\(\{ user_id: user\.id, match_id: matchId/);
  assert.match(actions, /async function syncRound32\(/);
  assert.match(globalsCss, /\.prediction-save-status \{/);
  // Autosave voor knock-outs + bonusvragen via een wrapper rond die secties.
  assert.match(actions, /export async function autosaveExtras\(formData: FormData\)/);
  assert.match(autosaveExtrasComponent, /autosaveExtras\(new FormData\(form\)\)/);
  assert.match(predictionsPage, /import \{ AutosaveExtras \} from "@\/components\/autosave-extras"/);
  assert.match(predictionsPage, /<AutosaveExtras locale=\{locale\}>/);
  // Opslaan-knop niet meer permanent sticky in beeld; alleen onderaan als afronding.
  assert.doesNotMatch(predictionsPage, /button-primary sticky bottom-24/);
  // Mobiel: vlag + afkorting altijd zichtbaar, rangchip eronder gestapeld.
  assert.match(groupPredictionCard, /className="prediction-team-label prediction-team-label--home"/);
  assert.match(groupPredictionCard, /className="prediction-team-label prediction-team-label--away"/);
  assert.match(globalsCss, /\.prediction-team-label \{[\s\S]*flex-direction: column;/);
  assert.match(globalsCss, /@media \(min-width: 640px\) \{[\s\S]*\.prediction-team-label \{[\s\S]*flex-direction: row;/);
  assert.match(knockoutPredictionPicker, /fifaRankLabel\(team\.code\)/);
  assert.match(knockoutPredictionPicker, /className="fifa-rank-chip"/);
  assert.match(globalsCss, /@media \(max-width: 559px\) \{[\s\S]*\.knockout-picker-name \{\n    font-size: 0\.72rem;\n  \}/);

  assert.match(fifaRankingData, /fifaRankingPublishedAt = "2026-04-01"/);
  assert.match(fifaRankingData, /FIFA men's world ranking, fetched 2026-06-10/);
  assert.match(fifaRankingData, /Transfermarkt most valuable national teams and team profiles, fetched 2026-06-10/);
  assert.match(fifaRankingData, /code: "FRA"[\s\S]*marketValue: "€1\.52bn"/);
  assert.match(fifaRankingData, /code: "NED"[\s\S]*marketValue: "€754\.20m"/);
  assert.match(fifaRankingData, /code: "CUW"[\s\S]*marketValue: "€25\.78m"/);
  assert.match(fifaRankingData, /code: "QAT"[\s\S]*marketValue: "€19\.93m"/);
});

test("mobile landing hero keeps title and host pills compact on one line", () => {
  assert.match(globalsCss, /@media \(max-width: 420px\) \{[\s\S]*\.hero-home \.world-cup-kicker \{[\s\S]*flex-wrap: nowrap;[\s\S]*font-size: 0\.56rem;/);
  assert.match(globalsCss, /@media \(max-width: 420px\) \{[\s\S]*\.hero-home \.world-cup-kicker span \{[\s\S]*padding: 3px 5px;/);
  assert.match(globalsCss, /@media \(max-width: 420px\) \{[\s\S]*\.hero-home-title-block h1 \{[\s\S]*font-size: clamp\(1\.48rem, 7\.4vw, 1\.68rem\) !important;/);
});

test("pool quick-share icons use a thin 70%-transparent white rim, not a solid white disc", () => {
  const block = globalsCss.match(/\.pool-quick-share-button \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(block, /border: 1px solid rgba\(255, 255, 255, 0\.5\);/);
  assert.match(block, /background: rgba\(255, 255, 255, 0\.3\);/);
  assert.doesNotMatch(block, /rgba\(248, 251, 255, 0\.98\)/);
});

test("pool predictions are fetched paginated so the PostgREST cap can't hide members", () => {
  assert.match(poulesPage, /async function fetchAllRows</);
  assert.match(poulesPage, /fetchAllRows<PredictionRow>\(\(from, to\) =>/);
  assert.match(poulesPage, /\.range\(from, to\)/);
  // De voorspellingen-fetch mag niet terug naar één ongepagineerde query.
  assert.doesNotMatch(poulesPage, /admin\.from\("predictions"\)\.select\("user_id,match_id,home_score,away_score"\)\.in\("user_id", memberIds\),/);
});

test("header shows a blinking LIVE badge when a match is on, opening live site in a new tab", async () => {
  const siteHeader = await readFile(new URL("../src/components/site-header.tsx", import.meta.url), "utf8");
  const badge = await readFile(new URL("../src/components/live-now-badge.tsx", import.meta.url), "utf8");
  const route = await readFile(new URL("../src/app/api/live-now/route.ts", import.meta.url), "utf8");
  assert.match(siteHeader, /<LiveNowBadge locale=\{locale\} \/>/);
  // Live: knipperende pill met de stand (MEX 2-0 RSA); opent in een apart tabblad.
  assert.match(badge, /if \(data\.matches\.length > 0\)/);
  assert.match(badge, /\{first\.home\} \{first\.homeScore\}-\{first\.awayScore\} \{first\.away\}/);
  assert.match(badge, /target="_blank"/);
  assert.match(badge, /rel="noopener noreferrer"/);
  assert.match(badge, /href=\{LIVE_URL\}/);
  assert.match(route, /!fixture\.friendly/);
  // "Live" geldt ook 30 min vóór aftrap (zelfde promotie als de live-pagina).
  assert.match(route, /isLiveStatus\(fixture\.statusShort\) \|\| isStartingSoon\(fixture, now\)/);
  // Niets live → ingetogen chip met de eerstvolgende aftrap (niet de bijna-live).
  assert.match(route, /statusShort === "NS" && !isStartingSoon\(fixture, now\)/);
  assert.match(route, /next: NextMatch \| null/);
  assert.match(badge, /if \(data\.next\)/);
  assert.match(badge, /formatKickoff\(data\.next\.kickoff, locale\)/);
  assert.match(globalsCss, /\.site-header-next-badge \{/);
  // Knipperende dot met reduced-motion uitzondering.
  assert.match(globalsCss, /\.site-header-live-badge::before \{[\s\S]*?animation: live-blink/);
  assert.match(globalsCss, /prefers-reduced-motion: reduce[\s\S]*?\.site-header-live-badge::before \{\n      animation: none;/);
});
