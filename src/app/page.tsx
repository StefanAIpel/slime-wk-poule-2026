import { CalendarDays, ListChecks, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { BrandWordmark } from "@/components/brand-wordmark";
import { InstallAppCard } from "@/components/install-app-card";
import { LoginForm } from "@/components/login-form";
import { ProfileForm } from "@/components/profile-form";
import { ShareRow } from "@/components/share-button";
import { SlimeSoccerBanner } from "@/components/slime-soccer-banner";
import { UpcomingMatches } from "@/components/upcoming-matches";
import { ENTRY_DEADLINE_ISO, SITE_URL } from "@/lib/constants";
import { displayName } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type HomeMembership = {
  role: string;
  pools: { id: string; name: string; code: string } | null;
};

type HomeLeaderboardRow = {
  points: number;
  profiles: { nickname: string | null; team_name: string | null } | null;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string; login?: string; profiel?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const admin = createAdminClient();
    const { data: publicLeaderboard } = await admin
      .from("scores")
      .select("points,profiles(nickname,team_name)")
      .order("points", { ascending: false })
      .limit(3);

    return (
      <PublicHome
        authError={params.auth === "fout"}
        leaderboard={(publicLeaderboard ?? []) as unknown as HomeLeaderboardRow[]}
      />
    );
  }

  const [{ data: profile }, { count: predictionCount }, { data: memberships }, { data: score }] = await Promise.all([
    supabase.from("profiles").select("id,nickname,team_name").eq("id", user.id).single(),
    supabase.from("predictions").select("match_id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("pool_members").select("role,pools(id,name,code)").eq("user_id", user.id).limit(3),
    supabase.from("scores").select("points, exact_scores, correct_results").eq("user_id", user.id).single(),
  ]);

  if (!profile?.nickname || !profile.team_name) {
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

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4 md:max-w-xl">
        <Brand />
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="dark-panel p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">Jouw Slime Score in een helder overzicht.</h1>
              <p className="mt-2 max-w-xl text-base font-medium text-blue-100">
                Vul je scores en rondekeuzes op één plek in. Je kunt alles aanpassen tot de aftrap op{" "}
                {new Intl.DateTimeFormat("nl-NL", {
                  timeZone: "Europe/Amsterdam",
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(new Date(ENTRY_DEADLINE_ISO))}
                .
              </p>
            </div>
            <div className="hidden rounded-lg bg-white/10 p-3 md:block">
              <Trophy aria-hidden="true" className="size-10 text-[#ffd44d]" />
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-[#061b47] p-4">
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
              {72 - (predictionCount ?? 0) > 0
                ? `Nog ${72 - (predictionCount ?? 0)} wedstrijden in te vullen.`
                : "Alle wedstrijden ingevuld — top!"}
            </p>
            <a href="/voorspellingen" className="button-secondary mt-3 w-full">
              Verder invullen
            </a>
          </div>
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
                  <span aria-hidden="true" className="wc-header size-7 flex-none rounded-full" />
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
                <div className="text-sm font-medium text-[#48617f]">Jij: {score?.points ?? 0} pt</div>
              </div>
            </div>
            <span className="font-bold text-[#064ed6]">Bekijk →</span>
          </a>
        </div>
      </section>

      <section className="mt-4">
        <SlimeSoccerBanner />
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#46566f]">
          Gratis · één keer invullen · geen onnodige data · jouw voorspellingen blijven privé.
        </p>
        <form action="/logout" method="post">
          <button className="button-plain" type="submit">
            Uitloggen
          </button>
        </form>
      </div>

      <BottomNav current="/" />
    </main>
  );
}


function PublicHome({ authError, leaderboard }: { authError: boolean; leaderboard: HomeLeaderboardRow[] }) {
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
          <h1 className="mt-2 text-[1.42rem] font-bold leading-[1.15] text-white sm:text-[1.78rem] md:text-[2.25rem]">
            Gratis WK 2026-poule voor vrienden en familie
          </h1>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-blue-50 sm:text-base md:text-lg">
            Voorspel alle WK 2026-wedstrijden, maak je eigen WK-poule en volg live wie er wint.
            Eén keer invullen, geen advertenties, geen cookiegedoe.
          </p>
          <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
            <a href="#login" className="button-primary hero-primary-cta">
              <Trophy aria-hidden="true" className="size-5" />
              Gratis meedoen
            </a>
          </div>
        </div>
        <div className="hero-bottom-links" aria-label="Snelle links">
          <a href="/schema" className="hero-bottom-link">
            <CalendarDays aria-hidden="true" className="size-5" />
            WK-schema
          </a>
          <a href="/regels" className="hero-bottom-link">
            <ListChecks aria-hidden="true" className="size-5" />
            Regels
          </a>
        </div>
      </div>

      <section aria-label="Slime Score links">
        <SlimeSoccerBanner />
      </section>

      <div className="grid gap-5 md:grid-cols-[1fr_minmax(320px,400px)] md:items-start">
        <section className="grid gap-4">
          <UpcomingMatches />

          <div className="dark-panel poule-share-panel grid gap-4 p-5 sm:p-6">
            <div className="grid gap-4">
              <div>
                <h2 className="flex items-start gap-3 text-xl font-bold leading-tight text-white sm:text-2xl">
                  <Users aria-hidden="true" className="mt-0.5 size-6 flex-none text-white" />
                  Samen spelen: maak of join een WK-poule
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-blue-50 sm:text-base">
                  Start je eigen WK-poule voor familie, vrienden of collega&rsquo;s met één deelcode — of sluit aan bij een
                  bestaande WK-poule. Je vult de code in zodra je bent ingelogd.
                </p>
              </div>
              <a href="#login" className="button-primary w-full justify-center text-sm sm:w-auto sm:text-base">Start je WK-poule</a>
            </div>
            <div className="share-panel-strip">
              <p className="text-sm font-bold text-blue-50">Deel Slime Score WK 2026:</p>
              <ShareRow
                url={SITE_URL}
                text="Doe je mee met de gratis Slime Score WK 2026-poule?"
                compact
                onDark
              />
            </div>
          </div>
        </section>

        <section id="login" className="grid gap-4 md:sticky md:top-4">
          {authError ? (
            <div className="panel border-red-200 bg-red-50 p-4 font-bold text-red-800">
              Deze inloglink is verlopen of al gebruikt. Vraag hieronder een nieuwe link aan.
            </div>
          ) : null}
          <div>
            <h2 className="text-2xl font-bold text-[#101a2b]">Aanmelden voor de WK 2026-poule</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-[#475670]">
              Vul je e-mailadres in — nieuw of bestaand account. Je krijgt een eenmalige inloglink. Geen wachtwoord.
            </p>
          </div>
          <LoginForm />
          <InstallAppCard />
        </section>

        <a href="/ranglijst" className="panel public-score-card p-4 no-underline md:col-start-1 md:row-start-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#081634]">Live WK 2026-ranglijst</h2>
            <span className="text-sm font-bold text-[#0866e8]">Bekijk alles</span>
          </div>
          <div className="mt-3 grid gap-2">
            {leaderboard.length ? (
              leaderboard.map((row, index) => (
                <div key={`${index}-${row.points}`} className="flex items-center justify-between gap-3 text-sm text-[#081634]">
                  <span className="truncate font-medium">{index + 1}. {displayName(row.profiles)}</span>
                  <span className="font-bold">{row.points} pt</span>
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-[#48617f]">De stand verschijnt zodra de eerste punten zijn verwerkt.</p>
            )}
          </div>
        </a>
      </div>
    </main>
  );
}
