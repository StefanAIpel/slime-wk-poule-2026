import { CalendarDays, ClipboardList, KeyRound, ListChecks, Mail, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { InstallAppCard } from "@/components/install-app-card";
import { LoginForm } from "@/components/login-form";
import { ProfileForm } from "@/components/profile-form";
import { ShareButton } from "@/components/share-button";
import { SlimeSoccerBanner } from "@/components/slime-soccer-banner";
import { TrustBadges } from "@/components/trust-badges";
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

  const [{ data: profile }, { count: predictionCount }, { data: memberships }, { data: leaderboard }, { data: score }] =
    await Promise.all([
      supabase.from("profiles").select("id,nickname,team_name").eq("id", user.id).single(),
      supabase.from("predictions").select("match_id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("pool_members").select("role,pools(id,name,code)").eq("user_id", user.id).limit(3),
      supabase
        .from("scores")
        .select("points,profiles(nickname,team_name)")
        .order("points", { ascending: false })
        .limit(4),
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
            <h2 className="text-xl font-black text-[#081634]">Na deze stap</h2>
            <div className="mt-3 grid gap-2 text-sm font-bold leading-6 text-[#48617f]">
              <p>1. Vul je groepswedstrijden in.</p>
              <p>2. Kies je landen voor de knock-outfase.</p>
              <p>3. Maak of join een subpoule met een code.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const progress = Math.round(((predictionCount ?? 0) / 72) * 100);
  const homeMemberships = (memberships ?? []) as unknown as HomeMembership[];
  const homeLeaderboard = (leaderboard ?? []) as unknown as HomeLeaderboardRow[];

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4 md:max-w-xl">
        <Brand />
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-[#eaf1ff] text-[#0b1f4d]">
            <CalendarDays aria-hidden="true" className="size-4" />
            Invullen tot 11 juni 21:00
          </span>
          <span className="chip bg-[#128f47] text-white">{displayName(profile)}</span>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="dark-panel p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">Jouw Slime Score in een helder overzicht.</h1>
              <p className="mt-2 max-w-xl text-base font-semibold text-blue-100">
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
                <p className="text-sm font-black uppercase tracking-normal text-blue-100">Voortgang</p>
                <p className="text-4xl font-black">{progress}%</p>
              </div>
              <p className="text-right text-sm font-bold text-blue-100">{predictionCount ?? 0} van 72 uitslagen</p>
            </div>
            <div className="mt-3 h-4 overflow-hidden rounded-full bg-black/32">
              <div className="h-full rounded-full bg-[#25a84a]" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <a href="/voorspellingen" className="button-secondary mt-4 w-full">
              Verder invullen
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <a href="/poules" className="panel grid gap-3 p-4 no-underline">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-[#081634]">Mijn poules</h2>
              <Users aria-hidden="true" className="size-6 text-[#064ed6]" />
            </div>
            {homeMemberships.length ? (
              homeMemberships.map((membership) => membership.pools && (
                <div key={membership.pools.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="font-black text-[#081634]">{membership.pools.name}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-bold text-[#48617f]">
                    Code: <span className="font-black text-[#16863a]">{membership.pools.code}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-[#48617f]">Maak een poule of sluit aan met een code.</p>
            )}
          </a>

          <div className="panel p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-[#081634]">Wereldranglijst</h2>
              <a className="font-black text-[#064ed6]" href="/ranglijst">
                Alles
              </a>
            </div>
            <div className="mt-3 divide-y divide-slate-200">
              {homeLeaderboard.map((row, index) => (
                <div key={`${index}-${row.points}`} className="flex items-center justify-between py-2 text-[#081634]">
                  <span className="font-black">{index + 1}. {displayName(row.profiles)}</span>
                  <span className="font-black">{row.points} pt</span>
                </div>
              ))}
              <div className="flex items-center justify-between bg-green-50 px-2 py-2 text-[#137c35]">
                <span className="font-black">Jij</span>
                <span className="font-black">{score?.points ?? 0} pt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <SlimeSoccerBanner />
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#46566f]">
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

const howItWorks = [
  { icon: Mail, title: "Registreer via mail-link", text: "Eerst veilig je e-mail bevestigen." },
  { icon: KeyRound, title: "Kies naam en wachtwoord", text: "Akkoord met voorwaarden en privacy." },
  { icon: ClipboardList, title: "Daarna direct inloggen", text: "Op de FrontPage met mail en wachtwoord." },
];

function PublicHome({ authError, leaderboard }: { authError: boolean; leaderboard: HomeLeaderboardRow[] }) {
  return (
    <main className="page-shell grid gap-5">
      <Brand />

      <div className="hero-band public-hero-row">
        <div>
          <h1 className="text-3xl font-black leading-tight text-white md:text-4xl">
            De gratis WK 2026-poule voor je vrienden, familie en collega&rsquo;s.
          </h1>
          <p className="mt-2 max-w-xl text-base font-semibold leading-7 text-blue-50 md:text-lg">
            Eén keer invullen, je eigen poule maken en zien wie de beste bondscoach is.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="#login" className="button-primary">
              <Trophy aria-hidden="true" className="size-5" />
              Gratis meedoen
            </a>
            <ShareButton
              url={SITE_URL}
              text="Doe je mee met de gratis Slime Score WK 2026-poule?"
              label="Nodig je groep uit"
              variant="secondary"
            />
          </div>
        </div>
        <Image
          className="public-hero-icon"
          src="/icon.png"
          alt="Slime Score app icon"
          width={512}
          height={512}
          sizes="(min-width: 1024px) 200px, 160px"
          priority
        />
      </div>

      <TrustBadges />

      <div className="grid gap-5 md:grid-cols-[1fr_minmax(320px,400px)] md:items-start">
        <section className="grid gap-4">
          <div className="panel p-4">
            <h2 className="text-lg font-black text-[#081634]">Zo doe je mee</h2>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3">
              {howItWorks.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="rounded-xl border border-slate-200 bg-[#f7faff] p-3">
                    <div className="flex items-center gap-2">
                      <span className="step-pill-num">{index + 1}</span>
                      <Icon aria-hidden="true" className="size-5 text-[#0866e8]" />
                    </div>
                    <div className="mt-2 font-black text-[#081634]">{step.title}</div>
                    <div className="text-sm font-semibold text-[#48617f]">{step.text}</div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="dark-panel grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black text-white">
                <Users aria-hidden="true" className="size-6 text-[#ffd44d]" />
                Daag je groep uit
              </h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-blue-50">
                Maak je eigen poule voor familie, vrienden of collega&rsquo;s met één deelcode. Wie wordt de baas?
              </p>
            </div>
            <a href="#login" className="button-primary md:w-auto">Start je poule</a>
          </div>

          <a href="/ranglijst" className="panel public-score-card p-4 no-underline">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-[#081634]">Live ranglijst</h2>
              <span className="text-sm font-black text-[#0866e8]">Bekijk alles</span>
            </div>
            <div className="mt-3 grid gap-2">
              {leaderboard.length ? (
                leaderboard.map((row, index) => (
                  <div key={`${index}-${row.points}`} className="flex items-center justify-between gap-3 text-sm text-[#081634]">
                    <span className="truncate font-semibold">{index + 1}. {displayName(row.profiles)}</span>
                    <span className="font-black">{row.points} pt</span>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-[#48617f]">De stand verschijnt zodra de eerste punten zijn verwerkt.</p>
              )}
            </div>
          </a>

          <div className="flex flex-wrap gap-3">
            <a href="/schema" className="button-plain">
              <CalendarDays aria-hidden="true" className="size-5" />
              Bekijk schema
            </a>
            <a href="/regels" className="button-plain">
              <ListChecks aria-hidden="true" className="size-5" />
              Spelregels
            </a>
          </div>
        </section>

        <section id="login" className="grid gap-4 md:sticky md:top-4">
          {authError ? (
            <div className="panel border-red-200 bg-red-50 p-4 font-black text-red-800">
              Deze inloglink is verlopen of al gebruikt. Vraag hieronder een nieuwe link aan.
            </div>
          ) : null}
          <div className="hero-score panel grid gap-4 p-5">
            <div className="relative z-[1]">
              <p className="text-2xl font-black leading-tight text-[#081634]">Maak je scorekaart.</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#48617f]">
                Registreren via mail-link, daarna naam en wachtwoord kiezen. Terugkomen doe je hier met mail + wachtwoord.
              </p>
            </div>
            <div className="score-podium relative z-[1]" aria-hidden="true">
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </div>
          </div>
          <LoginForm />
          <InstallAppCard />
          <p className="text-center text-xs font-semibold text-[#46566f]">
            Door mee te doen ga je akkoord met de{" "}
            <a className="font-black text-[#064ed6]" href="/voorwaarden">voorwaarden</a> en het{" "}
            <a className="font-black text-[#064ed6]" href="/privacy">privacybeleid</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
