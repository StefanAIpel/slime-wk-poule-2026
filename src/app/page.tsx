import { CalendarDays, KeyRound, ListChecks, LogIn, PlusCircle, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createPool, joinPool } from "@/app/actions";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { BrandWordmark } from "@/components/brand-wordmark";
import { InstallAppCard } from "@/components/install-app-card";
import { LoginForm } from "@/components/login-form";
import { PasswordResetForm } from "@/components/password-reset-form";
import { PredictionsComplete } from "@/components/predictions-complete";
import { ProfileForm } from "@/components/profile-form";
import { ShareRow } from "@/components/share-button";
import { SlimeSoccerBanner } from "@/components/slime-soccer-banner";
import { UpcomingMatches } from "@/components/upcoming-matches";
import { ENTRY_DEADLINE_ISO, SITE_URL } from "@/lib/constants";
import { displayName } from "@/lib/format";
import { localizedHref, type Locale } from "@/lib/i18n";
import { POOL_NAME_MAX_LENGTH, POOL_NAME_MIN_LENGTH } from "@/lib/limits";
import { compareScoresAlphabetical, withPublicRankScores, worldRankForUser, type RankedScore } from "@/lib/ranking";
import { createOptionalAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { persistSignupProfileFromMetadata, type SignupProfileClient } from "@/lib/supabase/signup-profile";

type HomeSearchParams = { auth?: string; login?: string; profiel?: string; reset?: string };

type HomeMembership = {
  role: string;
  pools: { id: string; name: string; code: string; badge_emoji: string | null } | null;
};

type HomeLeaderboardRow = {
  user_id?: string | null;
  points: number;
  profiles: { nickname: string | null; team_name: string | null } | null;
  isDemo?: boolean;
};

const homeCopy = {
  nl: {
    generalShareTitle: "SlimeScore · gratis WK-poule",
    generalShareText: "Maak je eigen 100% gratis vrienden-WK-poule. 1x ±10 min invullen; volg speelschema en uitslagen.",
    generalShareMessages: {
      whatsapp: "100% gratis WK-poule voor vrienden ⚽\nMaak je eigen poule. 1x ±10 min invullen; volg speelschema + uitslagen.",
      facebook: "Maak je eigen 100% gratis vrienden-WK-poule. 1x ±10 min invullen; volg speelschema en uitslagen.",
      telegram: "100% gratis WK-poule voor vrienden. 1x ±10 min invullen; volg speelschema + uitslagen.",
      signal: "100% gratis WK-poule voor vrienden ⚽\nMaak je eigen poule. 1x ±10 min invullen; volg speelschema + uitslagen.",
      mail: "Maak je eigen 100% gratis WK-poule voor vrienden, familie of collega’s. 1x ±10 min invullen; daarna volg je speelschema en uitslagen.",
      instagram: "100% gratis WK-poule voor vrienden. 1x ±10 min invullen. Volg speelschema & uitslagen.",
      native: "Maak je eigen 100% gratis vrienden-WK-poule. 1x ±10 min invullen; volg speelschema en uitslagen.",
    },
    appIconAlt: "Slime Score app icon",
    authExpired: "Deze bevestigingslink is verlopen. Vraag een nieuwe aan.",
    afterProfileTitle: "Na deze stap",
    afterProfileSteps: [
      "1. Vul je groepswedstrijden in.",
      "2. Kies je landen voor de knock-outfase.",
      "3. Maak of join een WK-poule met een code.",
    ],
    dashboardTitle: "Jouw Slime Score, alles op één plek.",
    dashboardIntroBefore: "De voortgang hieronder telt je 72 groepsuitslagen. Knock-outkeuzes en bonusvragen kun je ook invullen tot de deadline op",
    dashboardIntroAfter: " — daarna staat alles vast.",
    progressTitle: "Voortgang",
    progressCount: (filled: number) => `${filled} van 72 uitslagen`,
    remaining: (count: number) => `Nog ${count} wedstrijden in te vullen.`,
    complete: "Alle wedstrijden ingevuld — top!",
    continuePredictions: "Verder invullen",
    viewPredictions: "Voorspellingen bekijken",
    joinPoolTitle: "Meedoen met een WK-poule",
    joinPoolIntro: "Code of uitnodigingslink gekregen? Vul de code in en je zit er meteen bij.",
    joinCodePlaceholder: "POULECODE",
    joinCodeAria: "WK-poulecode",
    joinButton: "Aansluiten",
    createPoolTitle: "Maak je eigen WK-poule",
    createPoolIntro: "Start in 2 minuten één of meerdere gratis poules voor vrienden, familie of collega’s en deel jouw unieke link in de groepsapp.",
    createPoolPlaceholder: "Bijv. FC Vathorst",
    createPoolAria: "Naam van je WK-poule",
    createPoolButton: "Maken",
    sharePanelLabel: "SlimeScore delen",
    sharePanelTitle: "Deel SlimeScore",
    myPoolsTitle: "Mijn WK-poules",
    noPools: "Maak een WK-poule of sluit aan met een code.",
    worldRanking: "Wereldranglijst",
    you: "Jij",
    pointsSuffix: "pt",
    view: "Bekijk →",
    publicKickerAria: "WK 2026 in de Verenigde Staten, Canada en Mexico",
    publicKicker: "WK 2026",
    publicTitle: "Gratis WK 2026 Poule",
    publicIntro: "In tien minuten vul je voorspellingen voor het hele WK. Speel met en tegen je vrienden en familie en maak zoveel subpoules als je wilt. Gratis, en zo gedeeld in je groepsapp. Geen irritante reclames en cookies, alleen een e-mailadres nodig.",
    publicCta: "Gratis meedoen",
    quickLinks: "Snelle links",
    scheduleLink: "WK-speelschema",
    rulesLink: "Regels",
    publicPoolTitle: "Samen spelen: maak je WK-poule",
    publicPoolIntro: "Beleef het WK nóg intenser: maak je eigen poule voor vrienden, familie of collega’s en deel je eigen poule-link.",
    publicPoolNote: "Link gekregen? Aanmelden, 10 minuten invullen, en je doet mee.",
    publicPoolCta: "Start je WK-poule",
    leaderboard: "Ranglijst",
    viewAll: "Bekijk alles",
    signupTitle: "Aanmelden",
  },
  en: {
    generalShareTitle: "SlimeScore · free World Cup pool",
    generalShareText: "Create your own 100% free World Cup pool for friends. Fill in your predictions once in about ten minutes; follow the schedule and results.",
    generalShareMessages: {
      whatsapp: "100% free World Cup pool for friends ⚽\nCreate your own pool. Fill in predictions once in about ten minutes; follow fixtures + results.",
      facebook: "Create your own 100% free World Cup pool for friends. Fill in predictions once in about ten minutes; follow fixtures and results.",
      telegram: "100% free World Cup pool for friends. Fill in predictions once in about ten minutes; follow fixtures + results.",
      signal: "100% free World Cup pool for friends ⚽\nCreate your own pool. Fill in predictions once in about ten minutes; follow fixtures + results.",
      mail: "Create your own 100% free World Cup pool for friends, family or colleagues. Fill in predictions once; then follow fixtures and results.",
      instagram: "100% free World Cup pool for friends. Fill in predictions once. Follow fixtures & results.",
      native: "Create your own 100% free World Cup pool for friends. Fill in predictions once in about ten minutes; follow fixtures and results.",
    },
    appIconAlt: "Slime Score app icon",
    authExpired: "This confirmation link has expired. Request a new one.",
    afterProfileTitle: "After this step",
    afterProfileSteps: [
      "1. Fill in your group-stage predictions.",
      "2. Pick your teams for the knockout stage.",
      "3. Create or join a World Cup pool with a code.",
    ],
    dashboardTitle: "Your Slime Score, all in one place.",
    dashboardIntroBefore: "The progress below counts your 72 group-stage results. Knockout picks and bonus questions can also be filled in until the deadline on",
    dashboardIntroAfter: " — after that everything is locked.",
    progressTitle: "Progress",
    progressCount: (filled: number) => `${filled} of 72 results`,
    remaining: (count: number) => `${count} matches left to predict.`,
    complete: "All matches filled in — nice!",
    continuePredictions: "Continue predicting",
    viewPredictions: "View predictions",
    joinPoolTitle: "Join a World Cup pool",
    joinPoolIntro: "Got a code or invite link? Enter the code and you are in.",
    joinCodePlaceholder: "POOLCODE",
    joinCodeAria: "World Cup pool code",
    joinButton: "Join",
    createPoolTitle: "Create your own World Cup pool",
    createPoolIntro: "Start one or more free pools for friends, family or colleagues in two minutes and share your unique link in the group chat.",
    createPoolPlaceholder: "e.g. FC Vathorst",
    createPoolAria: "Name of your World Cup pool",
    createPoolButton: "Create",
    sharePanelLabel: "Share SlimeScore",
    sharePanelTitle: "Share SlimeScore",
    myPoolsTitle: "My World Cup pools",
    noPools: "Create a World Cup pool or join one with a code.",
    worldRanking: "World rankings",
    you: "You",
    pointsSuffix: "pts",
    view: "View →",
    publicKickerAria: "World Cup 2026 in the United States, Canada and Mexico",
    publicKicker: "World Cup 2026",
    publicTitle: "Free World Cup 2026 pool",
    publicIntro: "Fill in your predictions for the full World Cup in about ten minutes. Play with and against friends and family, create as many sub-pools as you like, and share it in your group chat. Free, no annoying ads or cookies — just an email address.",
    publicCta: "Join for free",
    quickLinks: "Quick links",
    scheduleLink: "Match schedule",
    rulesLink: "Rules",
    publicPoolTitle: "Play together: create your World Cup pool",
    publicPoolIntro: "Make the World Cup more fun: create your own pool for friends, family or colleagues and share your own invite link.",
    publicPoolNote: "Received a link? Sign up, fill in your predictions in ten minutes, and you are in.",
    publicPoolCta: "Create your World Cup pool",
    leaderboard: "Leaderboard",
    viewAll: "View all",
    signupTitle: "Sign up",
  },
} as const;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}) {
  return HomeContent({ searchParams, locale: "nl" });
}

export async function HomeContent({ searchParams, locale }: { searchParams: Promise<HomeSearchParams>; locale: Locale }) {
  const params = await searchParams;
  const copy = homeCopy[locale];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const admin = createOptionalAdminClient();
    const { data: publicLeaderboard } = admin
      ? await admin
          .from("scores")
          .select("user_id,points,profiles(nickname,team_name)")
          .order("points", { ascending: false })
          .limit(20)
      : { data: [] };

    return (
      <PublicHome
        authError={params.auth === "fout"}
        leaderboard={(publicLeaderboard ?? []) as unknown as HomeLeaderboardRow[]}
        locale={locale}
      />
    );
  }

  if (params.reset === "wachtwoord") {
    return (
      <main className="page-shell grid min-h-[70vh] gap-5 md:max-w-xl md:content-center">
        <Brand locale={locale} />
        <PasswordResetForm locale={locale} />
      </main>
    );
  }

  const [{ data: profile }, { count: predictionCount }, { data: memberships }, { data: score }] = await Promise.all([
    supabase.from("profiles").select("id,nickname,team_name").eq("id", user.id).single(),
    supabase.from("predictions").select("match_id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("pool_members").select("role,pools(id,name,code,badge_emoji)").eq("user_id", user.id).limit(3),
    supabase.from("scores").select("points, exact_scores, correct_results").eq("user_id", user.id).single(),
  ]);

  if (!profile?.nickname || !profile.team_name) {
    const admin = createOptionalAdminClient();
    let profileError = params.profiel;
    if (admin) {
      const signupProfile = await persistSignupProfileFromMetadata(admin as unknown as SignupProfileClient, user);
      if (signupProfile.ok) redirect(localizedHref("/", locale));
      if (signupProfile.reason === "nickname-taken") profileError = "bezet";
    }

    return (
      <main className="page-shell grid min-h-screen gap-6 md:grid-cols-[0.85fr_1fr] md:content-center md:items-center">
        <section className="grid gap-5">
          <Brand locale={locale} />
          <Image
            className="w-full max-w-[360px] rounded-3xl shadow-2xl shadow-black/30"
            src="/icon.png"
            alt={copy.appIconAlt}
            width={512}
            height={512}
            priority
          />
        </section>
        <section className="grid gap-4">
          <ProfileForm error={profileError} locale={locale} />
          <div className="panel p-4">
            <h2 className="text-xl font-bold text-[#081634]">{copy.afterProfileTitle}</h2>
            <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-[#48617f]">
              {copy.afterProfileSteps.map((step) => <p key={step}>{step}</p>)}
            </div>
          </div>
        </section>
      </main>
    );
  }

  const progress = Math.round(((predictionCount ?? 0) / 72) * 100);
  const homeMemberships = (memberships ?? []) as unknown as HomeMembership[];
  const myPoints = score?.points ?? 0;
  const remaining = 72 - (predictionCount ?? 0);
  const deadlineLabel = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(ENTRY_DEADLINE_ISO));

  // Jouw plek op de wereldranglijst: punten dalend, bij gelijke punten alfabetisch.
  const admin = createOptionalAdminClient();
  let myRank: number | null = null;
  if (admin) {
    const { data: rankScores } = await admin
      .from("scores")
      .select("user_id,points,profiles(nickname,team_name)");
    myRank = worldRankForUser(withPublicRankScores((rankScores ?? []) as unknown as RankedScore[]), user.id);
  }

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4 md:max-w-xl">
        <Brand locale={locale} />
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="grid gap-4">
          <div className="dark-panel p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold leading-tight md:text-4xl">{copy.dashboardTitle}</h1>
                <p className="mt-2 max-w-xl text-base font-medium text-blue-100">
                  {copy.dashboardIntroBefore}{" "}
                  <strong className="font-bold text-white">{deadlineLabel}</strong>
                  {copy.dashboardIntroAfter}
                </p>
              </div>
              <div className="hidden rounded-lg bg-white/10 p-3 md:block">
                <Trophy aria-hidden="true" className="size-10 text-[#ffd44d]" />
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-[#061b47] p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-normal text-blue-100">{copy.progressTitle}</p>
                  <p className="text-4xl font-bold">{progress}%</p>
                </div>
                <p className="text-right text-sm font-semibold text-blue-100">{copy.progressCount(predictionCount ?? 0)}</p>
              </div>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-black/32">
                <div className="h-full rounded-full bg-[#25a84a]" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold text-blue-100">
                {remaining > 0 ? copy.remaining(remaining) : copy.complete}
              </p>
              <a href={localizedHref("/voorspellingen", locale)} className="button-primary mt-3 w-full justify-center">
                {remaining > 0 ? copy.continuePredictions : copy.viewPredictions}
              </a>
            </div>
          </div>

          {remaining === 0 ? <PredictionsComplete locale={locale} /> : null}

          <form action={joinPool} className="panel grid gap-3 p-5">
            <div className="flex items-center gap-2">
              <KeyRound aria-hidden="true" className="size-5 flex-none text-[#064ed6]" />
              <h2 className="text-lg font-bold text-[#081634]">{copy.joinPoolTitle}</h2>
            </div>
            <p className="text-sm font-medium leading-6 text-[#48617f]">
              {copy.joinPoolIntro}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                name="code"
                required
                maxLength={10}
                placeholder={copy.joinCodePlaceholder}
                autoComplete="off"
                autoCapitalize="characters"
                className="field flex-1 uppercase tracking-wide"
                aria-label={copy.joinCodeAria}
              />
              <button type="submit" className="button-primary justify-center px-5">{copy.joinButton}</button>
            </div>
          </form>

          <form action={createPool} className="panel create-pool-card grid gap-3 p-5">
            <div className="flex items-center gap-2">
              <PlusCircle aria-hidden="true" className="create-pool-icon size-5 flex-none" />
              <h2 className="create-pool-title text-lg font-bold">{copy.createPoolTitle}</h2>
            </div>
            <p className="create-pool-copy text-sm font-medium leading-6">
              {copy.createPoolIntro}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                name="name"
                required
                minLength={POOL_NAME_MIN_LENGTH}
                maxLength={POOL_NAME_MAX_LENGTH}
                placeholder={copy.createPoolPlaceholder}
                className="field create-pool-field flex-1"
                aria-label={copy.createPoolAria}
              />
              <button type="submit" className="button-primary create-pool-button justify-center px-5">{copy.createPoolButton}</button>
            </div>
            <div className="create-pool-share share-panel-strip" aria-label={copy.sharePanelLabel}>
              <p className="share-panel-title">{copy.sharePanelTitle}</p>
              <ShareRow
                url={locale === "en" ? `${SITE_URL}/en` : SITE_URL}
                text={copy.generalShareText}
                title={copy.generalShareTitle}
                messages={copy.generalShareMessages}
                locale={locale}
                compact
                onDark
              />
            </div>
          </form>
        </div>

        <div className="grid gap-4">
          <UpcomingMatches locale={locale} />
          <a href={localizedHref("/poules", locale)} className="panel grid gap-2 p-4 no-underline">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#081634]">{copy.myPoolsTitle}</h2>
              <Users aria-hidden="true" className="size-5 text-[#064ed6]" />
            </div>
            {homeMemberships.length ? (
              homeMemberships.map((membership) => membership.pools && (
                <div key={membership.pools.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-[#f7faff] px-3 py-2">
                  <span aria-hidden="true" className="grid size-7 flex-none place-items-center rounded-full bg-[#eef3fc] text-base leading-none">
                    {membership.pools.badge_emoji ?? "🏆"}
                  </span>
                  <span className="truncate font-bold text-[#081634]">{membership.pools.name}</span>
                  <span className="ml-auto rounded-full bg-[#e7eef8] px-2 py-0.5 text-xs font-bold tracking-wide text-[var(--blue-2)]">
                    {membership.pools.code}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-[#48617f]">{copy.noPools}</p>
            )}
          </a>

          <a href={localizedHref("/ranglijst", locale)} className="panel flex items-center justify-between gap-3 p-4 no-underline">
            <div className="flex items-center gap-3">
              <Trophy aria-hidden="true" className="size-6 text-[var(--blue)]" />
              <div>
                <div className="font-bold text-[#081634]">{copy.worldRanking}</div>
                <div className="text-sm font-medium text-[#48617f]">
                  {myRank ? (
                    <>
                      {copy.you}: <strong className="text-[#081634]">#{myRank}</strong> · {myPoints} {copy.pointsSuffix}
                    </>
                  ) : (
                    <>{copy.you}: {myPoints} {copy.pointsSuffix}</>
                  )}
                </div>
              </div>
            </div>
            <span className="font-bold text-[#064ed6]">{copy.view}</span>
          </a>

          <SlimeSoccerBanner includeVolley={false} locale={locale} />
        </div>
      </section>

      <BottomNav current="/" />
    </main>
  );
}


function PublicHome({ authError, leaderboard, locale }: { authError: boolean; leaderboard: HomeLeaderboardRow[]; locale: Locale }) {
  const copy = homeCopy[locale];
  const displayRows = withPublicRankScores(leaderboard as unknown as RankedScore[])
    .sort(compareScoresAlphabetical)
    .slice(0, 3) as HomeLeaderboardRow[];
  const signupHref = localizedHref("/aanmelden", locale);

  return (
    <main className="page-shell shell-top-tight grid gap-5">
      <div className="hero-band hero-band-visual hero-home hero-band-topbar">
        <div className="hero-topbar md:hidden">
          <BrandWordmark onDark />
        </div>
        <div className="hero-content">
          <div className="world-cup-kicker" aria-label={copy.publicKickerAria}>
            <span>{copy.publicKicker}</span>
            <span>USA</span>
            <span>Canada</span>
            <span>Mexico</span>
          </div>
          <div className="hero-home-title-block">
            <h1 className="mt-4 text-[1.6rem] font-bold leading-[1.12] text-white sm:whitespace-nowrap sm:text-[2rem] md:text-[2.4rem]">
              {copy.publicTitle}
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-blue-50 sm:text-[0.95rem] md:text-base">
              {copy.publicIntro}
            </p>
            <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
              <a href={signupHref} className="button-primary hero-primary-cta">
                <Trophy aria-hidden="true" className="size-5" />
                {copy.publicCta}
              </a>
            </div>
          </div>
        </div>
        <div className="hero-bottom-links" aria-label={copy.quickLinks}>
          <a href={localizedHref("/schema", locale)} className="hero-bottom-link">
            <CalendarDays aria-hidden="true" className="size-4" />
            {copy.scheduleLink}
          </a>
          <a href={localizedHref("/regels", locale)} className="hero-bottom-link">
            <ListChecks aria-hidden="true" className="size-4" />
            {copy.rulesLink}
          </a>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_340px] md:items-start">
        <section className="grid gap-4">
          <UpcomingMatches locale={locale} />

          <div className="dark-panel poule-share-panel grid gap-4 p-5 sm:p-6">
            <div className="grid gap-4 poule-share-copy">
              <div>
                <h2 className="flex items-start gap-3 text-xl font-bold leading-tight text-white sm:text-2xl">
                  <Users aria-hidden="true" className="mt-0.5 size-6 flex-none text-white" />
                  {copy.publicPoolTitle}
                </h2>
                <p className="poule-share-copy-text mt-3 text-sm font-semibold leading-6 text-blue-50 sm:text-base">
                  {copy.publicPoolIntro}
                </p>
              </div>
              <p className="poule-share-copy-text text-sm font-bold leading-6 text-blue-50">
                {copy.publicPoolNote}
              </p>
              <a href={signupHref} className="button-primary poule-primary-cta">{copy.publicPoolCta}</a>
            </div>
            <div className="share-panel-strip">
              <p className="share-panel-title">{copy.sharePanelTitle}</p>
              <ShareRow
                url={locale === "en" ? `${SITE_URL}/en` : SITE_URL}
                text={copy.generalShareText}
                title={copy.generalShareTitle}
                messages={copy.generalShareMessages}
                locale={locale}
                compact
                onDark
              />
            </div>
          </div>

          <a href={localizedHref("/ranglijst", locale)} className="panel public-score-card p-4 no-underline">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Trophy aria-hidden="true" className="size-5 flex-none text-[#efa820]" />
                <h2 className="text-base font-bold text-[#081634]">{copy.leaderboard}</h2>
              </div>
              <span className="text-sm font-bold text-[#0866e8]">{copy.viewAll}</span>
            </div>
            <div className="mt-3 grid gap-1.5">
              {displayRows.map((row, index) => (
                <div key={`${index}-${displayName(row.profiles)}`} className="flex items-center justify-between gap-3 text-sm text-[#081634]">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-4 flex-none text-right font-bold tabular-nums text-[#475670]">{index + 1}</span>
                    <span className="truncate font-medium">{displayName(row.profiles)}</span>
                  </span>
                  <span className="flex-none font-bold tabular-nums">{row.points} {copy.pointsSuffix}</span>
                </div>
              ))}
            </div>
          </a>
          <SlimeSoccerBanner includeVolley={false} fullWidth locale={locale} />
        </section>

        <aside className="public-login-stack md:sticky md:top-4">
          <section id="login" className="public-login-panel grid gap-3 p-3 sm:gap-4 sm:p-5">
            {authError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-800">
                {copy.authExpired}
              </div>
            ) : null}
            <div className="flex items-center gap-3">
              <span className="public-login-icon" aria-hidden="true">
                <LogIn className="size-6" />
              </span>
              <div>
                <h2 className="public-login-title text-2xl font-black text-[#101a2b]">{copy.signupTitle}</h2>
              </div>
            </div>
            {locale === "en" ? <LoginForm surface="inline" locale="en" /> : <LoginForm surface="inline" />}
          </section>
          {locale === "en" ? <InstallAppCard locale="en" /> : <InstallAppCard />}
        </aside>
      </div>

    </main>
  );
}
