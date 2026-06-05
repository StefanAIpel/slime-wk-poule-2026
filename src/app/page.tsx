import { CalendarDays, KeyRound, ListChecks, LogIn, PlusCircle, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createPool, joinPool } from "@/app/actions";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { BrandWordmark } from "@/components/brand-wordmark";
import { LoginForm } from "@/components/login-form";
import { PasswordResetForm } from "@/components/password-reset-form";
import { PredictionsComplete } from "@/components/predictions-complete";
import { ProfileForm } from "@/components/profile-form";
import { ShareRow } from "@/components/share-button";
import { SlimeSoccerBanner } from "@/components/slime-soccer-banner";
import { UpcomingMatches } from "@/components/upcoming-matches";
import { ENTRY_DEADLINE_ISO, SITE_URL } from "@/lib/constants";
import { DEMO_PLAYERS, hasSafePublicProfile } from "@/lib/demo-leaderboard";
import { displayName } from "@/lib/format";
import { createOptionalAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { persistSignupProfileFromMetadata, type SignupProfileClient } from "@/lib/supabase/signup-profile";

type HomeMembership = {
  role: string;
  pools: { id: string; name: string; code: string; badge_emoji: string | null } | null;
};

type HomeLeaderboardRow = {
  points: number;
  profiles: { nickname: string | null; team_name: string | null } | null;
  isDemo?: boolean;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string; login?: string; profiel?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const admin = createOptionalAdminClient();
    const { data: publicLeaderboard } = admin
      ? await admin
          .from("scores")
          .select("points,profiles(nickname,team_name)")
          .order("points", { ascending: false })
          .limit(3)
      : { data: [] };

    return (
      <PublicHome
        authError={params.auth === "fout"}
        leaderboard={(publicLeaderboard ?? []) as unknown as HomeLeaderboardRow[]}
      />
    );
  }

  if (params.reset === "wachtwoord") {
    return (
      <main className="page-shell grid min-h-[70vh] gap-5 md:max-w-xl md:content-center">
        <Brand />
        <PasswordResetForm />
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
    if (admin) {
      const signupProfile = await persistSignupProfileFromMetadata(admin as unknown as SignupProfileClient, user);
      if (signupProfile.ok) redirect("/");
    }

    return (
      <main className="page-shell grid min-h-screen gap-6 md:grid-cols-[0.85fr_1fr] md:content-center md:items-center">
        <section className="grid gap-5">
          <Brand />
          <Image
            className="w-full max-w-[360px] rounded-3xl shadow-2xl shadow-black/30"
            src="/icon.png"
            alt="Slime Score app icon"
            width={512}
            height={512}
            priority
          />
        </section>
        <section className="grid gap-4">
          <ProfileForm error={params.profiel} />
          <div className="panel p-4">
            <h2 className="text-xl font-bold text-[#081634]">Na deze stap</h2>
            <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-[#48617f]">
              <p>1. Vul je groepswedstrijden in.</p>
              <p>2. Kies je landen voor de knock-outfase.</p>
              <p>3. Maak of join een WK-poule met een code.</p>
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
  const deadlineLabel = new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(ENTRY_DEADLINE_ISO));

  // Jouw plek op de wereldranglijst (aantal spelers met meer punten + 1).
  const admin = createOptionalAdminClient();
  let myRank: number | null = null;
  if (admin) {
    const { count } = await admin.from("scores").select("user_id", { count: "exact", head: true }).gt("points", myPoints);
    myRank = (count ?? 0) + 1;
  }

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4 md:max-w-xl">
        <Brand />
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="grid gap-4">
          <div className="dark-panel p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold leading-tight md:text-4xl">Jouw Slime Score, alles op één plek.</h1>
                <p className="mt-2 max-w-xl text-base font-medium text-blue-100">
                  De voortgang hieronder telt je 72 groepsuitslagen. Knock-outkeuzes en bonusvragen kun je ook invullen tot de deadline op{" "}
                  <strong className="font-bold text-white">{deadlineLabel}</strong> — daarna staat alles vast.
                </p>
              </div>
              <div className="hidden rounded-lg bg-white/10 p-3 md:block">
                <Trophy aria-hidden="true" className="size-10 text-[#ffd44d]" />
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-[#061b47] p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-normal text-blue-100">Voortgang</p>
                  <p className="text-4xl font-bold">{progress}%</p>
                </div>
                <p className="text-right text-sm font-semibold text-blue-100">{predictionCount ?? 0} van 72 uitslagen</p>
              </div>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-black/32">
                <div className="h-full rounded-full bg-[#25a84a]" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold text-blue-100">
                {remaining > 0 ? `Nog ${remaining} wedstrijden in te vullen.` : "Alle wedstrijden ingevuld — top!"}
              </p>
              <a href="/voorspellingen" className="button-primary mt-3 w-full justify-center">
                {remaining > 0 ? "Verder invullen" : "Voorspellingen bekijken"}
              </a>
            </div>
          </div>

          {remaining === 0 ? <PredictionsComplete /> : null}

          <form action={joinPool} className="panel grid gap-3 p-5">
            <div className="flex items-center gap-2">
              <KeyRound aria-hidden="true" className="size-5 flex-none text-[#064ed6]" />
              <h2 className="text-lg font-bold text-[#081634]">Meedoen met een WK-poule</h2>
            </div>
            <p className="text-sm font-medium leading-6 text-[#48617f]">
              Code of uitnodigingslink gekregen? Vul de code in en je zit er meteen bij.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                name="code"
                required
                maxLength={10}
                placeholder="POULECODE"
                autoComplete="off"
                autoCapitalize="characters"
                className="field flex-1 uppercase tracking-wide"
                aria-label="WK-poulecode"
              />
              <button type="submit" className="button-primary justify-center px-5">Aansluiten</button>
            </div>
          </form>

          <form action={createPool} className="panel grid gap-3 p-5">
            <div className="flex items-center gap-2">
              <PlusCircle aria-hidden="true" className="size-5 flex-none text-[#15a35b]" />
              <h2 className="text-lg font-bold text-[#081634]">Maak je eigen WK-poule</h2>
            </div>
            <p className="text-sm font-medium leading-6 text-[#48617f]">
              Start in 2 minuten één of meerdere gratis poules voor vrienden, familie of collega&rsquo;s en deel jouw unieke link in de groepsapp.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                name="name"
                required
                minLength={2}
                maxLength={50}
                placeholder="Bijv. Familie Dijkstra"
                className="field flex-1"
                aria-label="Naam van je WK-poule"
              />
              <button type="submit" className="button-primary justify-center px-5">Maken</button>
            </div>
          </form>
        </div>

        <div className="grid gap-4">
          <UpcomingMatches />
          <a href="/poules" className="panel grid gap-2 p-4 no-underline">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#081634]">Mijn WK-poules</h2>
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
              <p className="text-sm font-medium text-[#48617f]">Maak een WK-poule of sluit aan met een code.</p>
            )}
          </a>

          <a href="/ranglijst" className="panel flex items-center justify-between gap-3 p-4 no-underline">
            <div className="flex items-center gap-3">
              <Trophy aria-hidden="true" className="size-6 text-[var(--blue)]" />
              <div>
                <div className="font-bold text-[#081634]">Wereldranglijst</div>
                <div className="text-sm font-medium text-[#48617f]">
                  {myRank ? (
                    <>
                      Jij: <strong className="text-[#081634]">#{myRank}</strong> · {myPoints} pt
                    </>
                  ) : (
                    <>Jij: {myPoints} pt</>
                  )}
                </div>
              </div>
            </div>
            <span className="font-bold text-[#064ed6]">Bekijk →</span>
          </a>

          <SlimeSoccerBanner includeVolley={false} />
        </div>
      </section>


      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#46566f]">
          Gratis · 1× invullen, telt in al je groepen · e-mail + wachtwoord · privé
        </p>
      </div>

      <BottomNav current="/" />
    </main>
  );
}


function PublicHome({ authError, leaderboard }: { authError: boolean; leaderboard: HomeLeaderboardRow[] }) {
  const realRows = leaderboard.filter((row) => hasSafePublicProfile(row.profiles));
  const displayRows: HomeLeaderboardRow[] = [
    ...realRows,
    ...DEMO_PLAYERS.map((player) => ({
      points: 0,
      isDemo: true,
      profiles: { nickname: player.nickname, team_name: player.teamName },
    })),
  ].slice(0, 3);

  return (
    <main className="page-shell shell-top-tight grid gap-5">
      <div className="hero-band hero-band-visual hero-home hero-band-topbar">
        <div className="hero-topbar md:hidden">
          <BrandWordmark onDark />
        </div>
        <div className="hero-content">
          <div className="world-cup-kicker" aria-label="WK 2026 in de Verenigde Staten, Canada en Mexico">
            <span>WK 2026</span>
            <span>USA</span>
            <span>Canada</span>
            <span>Mexico</span>
          </div>
          <div className="hero-home-title-block">
            <h1 className="mt-4 text-[1.6rem] font-bold leading-[1.12] text-white sm:whitespace-nowrap sm:text-[2rem] md:text-[2.4rem]">
              Gratis WK Poule
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-blue-50 sm:text-[0.95rem] md:text-base">
              In tien minuten vul je voorspellingen voor het hele WK. Speel met en tegen je vrienden en familie en maak
              zoveel subpoules als je wilt. Gratis, en zo gedeeld in je groepsapp. Geen irritante reclames en cookies,
              alleen een e-mailadres nodig.
            </p>
            <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
              <a href="/aanmelden" className="button-primary hero-primary-cta">
                <Trophy aria-hidden="true" className="size-5" />
                Gratis meedoen
              </a>
            </div>
          </div>
        </div>
        <div className="hero-bottom-links" aria-label="Snelle links">
          <a href="/schema" className="hero-bottom-link">
            <CalendarDays aria-hidden="true" className="size-4" />
            WK-speelschema
          </a>
          <a href="/regels" className="hero-bottom-link">
            <ListChecks aria-hidden="true" className="size-4" />
            Regels
          </a>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_340px] md:items-start">
        <section className="grid gap-4">
          <UpcomingMatches />

          <div className="dark-panel poule-share-panel grid gap-4 p-5 sm:p-6">
            <div className="grid gap-4 poule-share-copy">
              <div>
                <h2 className="flex items-start gap-3 text-xl font-bold leading-tight text-white sm:text-2xl">
                  <Users aria-hidden="true" className="mt-0.5 size-6 flex-none text-white" />
                  Samen spelen: maak je WK-poule
                </h2>
                <p className="poule-share-copy-text mt-3 text-sm font-semibold leading-6 text-blue-50 sm:text-base">
                  Beleef het WK nóg intenser: maak je eigen poule voor vrienden, familie of collega&rsquo;s en deel je
                  eigen poule-link.
                </p>
              </div>
              <p className="poule-share-copy-text text-sm font-bold leading-6 text-blue-50">
                Link gekregen? Aanmelden, 10 minuten invullen, en je doet mee.
              </p>
              <a href="/aanmelden" className="button-primary poule-primary-cta">Start je WK-poule</a>
            </div>
            <div className="share-panel-strip">
              <p className="share-panel-title">Deel SlimeScore</p>
              <ShareRow
                url={SITE_URL}
                text="Doe je mee met de gratis Slime Score WK 2026-poule?"
                compact
                onDark
              />
            </div>
          </div>
        </section>

        <aside className="public-login-stack md:sticky md:top-4">
          <section id="login" className="public-login-panel grid gap-3 p-3 sm:gap-4 sm:p-5">
            {authError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-800">
                Deze bevestigingslink is verlopen. Vraag een nieuwe aan.
              </div>
            ) : null}
            <div className="flex items-center gap-3">
              <span className="public-login-icon" aria-hidden="true">
                <LogIn className="size-6" />
              </span>
              <div>
                <h2 className="public-login-title text-2xl font-black text-[#101a2b]">Aanmelden</h2>
              </div>
            </div>
            <LoginForm surface="inline" />
          </section>
          <div className="public-login-ad" aria-label="Speel Slime Soccer">
            <SlimeSoccerBanner includeVolley={false} />
          </div>
        </aside>

        <a href="/ranglijst" className="panel public-score-card p-4 no-underline md:col-start-1 md:row-start-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy aria-hidden="true" className="size-5 flex-none text-[#efa820]" />
              <h2 className="text-base font-bold text-[#081634]">Ranglijst</h2>
            </div>
            <span className="text-sm font-bold text-[#0866e8]">Bekijk alles</span>
          </div>
          <div className="mt-3 grid gap-1.5">
            {displayRows.map((row, index) => (
              <div key={`${index}-${displayName(row.profiles)}`} className="flex items-center justify-between gap-3 text-sm text-[#081634]">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="w-4 flex-none text-right font-bold tabular-nums text-[#475670]">{index + 1}</span>
                  <span className="truncate font-medium">{displayName(row.profiles)}</span>
                </span>
                <span className="flex-none font-bold tabular-nums">{row.points} pt</span>
              </div>
            ))}
          </div>
        </a>
      </div>

    </main>
  );
}
