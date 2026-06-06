import type { Metadata } from "next";
import { CalendarDays, ListChecks, LogIn, Trophy, Users } from "lucide-react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { InstallAppCard } from "@/components/install-app-card";
import { LoginForm } from "@/components/login-form";
import { ShareRow } from "@/components/share-button";
import { SlimeSoccerBanner } from "@/components/slime-soccer-banner";
import { UpcomingMatches } from "@/components/upcoming-matches";
import { SITE_URL } from "@/lib/constants";
import { displayName } from "@/lib/format";
import { compareScoresAlphabetical, withPublicRankScores, type RankedScore } from "@/lib/ranking";
import { createOptionalAdminClient } from "@/lib/supabase/admin";

type HomeLeaderboardRow = {
  user_id?: string | null;
  points: number;
  profiles: { nickname: string | null; team_name: string | null } | null;
  isDemo?: boolean;
};

const generalShareTitle = "SlimeScore · free World Cup pool";
const generalShareText = "Create your own 100% free World Cup pool for friends. Fill in your predictions once in about ten minutes; follow the schedule and results.";
const appIcon = "/icons/slimescore-app-icon-v4-512.png";
const generalShareMessages = {
  whatsapp: "100% free World Cup pool for friends ⚽\nCreate your own pool. Fill in predictions once in about ten minutes; follow fixtures + results.",
  facebook: "Create your own 100% free World Cup pool for friends. Fill in predictions once in about ten minutes; follow fixtures and results.",
  telegram: "100% free World Cup pool for friends. Fill in predictions once in about ten minutes; follow fixtures + results.",
  signal: "100% free World Cup pool for friends ⚽\nCreate your own pool. Fill in predictions once in about ten minutes; follow fixtures + results.",
  mail: "Create your own 100% free World Cup pool for friends, family or colleagues. Fill in predictions once; then follow fixtures and results.",
  instagram: "100% free World Cup pool for friends. Fill in predictions once. Follow fixtures & results.",
  native: "Create your own 100% free World Cup pool for friends. Fill in predictions once in about ten minutes; follow fixtures and results.",
};

export const metadata: Metadata = {
  title: "SlimeScore · Free World Cup 2026 pool",
  description: "Free World Cup 2026 prediction pool. Fill in your predictions once, create a pool with friends and family, and see who wins.",
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      nl: SITE_URL,
      en: `${SITE_URL}/en`,
    },
  },
  openGraph: {
    locale: "en_GB",
    url: `${SITE_URL}/en`,
    title: "SlimeScore · Free World Cup 2026 pool",
    description: "Create a free World Cup 2026 pool for friends, family or colleagues.",
    images: [{ url: appIcon, width: 512, height: 512, alt: "SlimeScore app icon" }],
  },
  twitter: {
    card: "summary",
    title: "SlimeScore · Free World Cup 2026 pool",
    description: "Create a free World Cup 2026 pool for friends, family or colleagues.",
    images: [appIcon],
  },
};

export default async function EnglishHome({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string }>;
}) {
  const params = await searchParams;
  const admin = createOptionalAdminClient();
  const { data: publicLeaderboard } = admin
    ? await admin
        .from("scores")
        .select("user_id,points,profiles(nickname,team_name)")
        .order("points", { ascending: false })
        .limit(20)
    : { data: [] };
  const displayRows = withPublicRankScores((publicLeaderboard ?? []) as unknown as RankedScore[])
    .sort(compareScoresAlphabetical)
    .slice(0, 3) as HomeLeaderboardRow[];

  return (
    <main className="page-shell shell-top-tight grid gap-5">
      <div className="hero-band hero-band-visual hero-home hero-band-topbar">
        <div className="hero-topbar md:hidden">
          <BrandWordmark onDark />
        </div>
        <div className="hero-content">
          <div className="world-cup-kicker" aria-label="World Cup 2026 in the United States, Canada and Mexico">
            <span>World Cup 2026</span>
            <span>USA</span>
            <span>Canada</span>
            <span>Mexico</span>
          </div>
          <div className="hero-home-title-block">
            <h1 className="mt-4 text-[1.6rem] font-bold leading-[1.12] text-white sm:whitespace-nowrap sm:text-[2rem] md:text-[2.4rem]">
              Free World Cup 2026 pool
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-blue-50 sm:text-[0.95rem] md:text-base">
              Fill in your predictions for the full World Cup in about ten minutes. Play with and against friends and family,
              create as many sub-pools as you like, and share it in your group chat. Free, no annoying ads or cookies — just an email address.
            </p>
            <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
              <a href="#login" className="button-primary hero-primary-cta">
                <Trophy aria-hidden="true" className="size-5" />
                Join for free
              </a>
            </div>
          </div>
        </div>
        <div className="hero-bottom-links" aria-label="Quick links">
          <a href="/schema" className="hero-bottom-link">
            <CalendarDays aria-hidden="true" className="size-4" />
            Match schedule
          </a>
          <a href="/regels" className="hero-bottom-link">
            <ListChecks aria-hidden="true" className="size-4" />
            Rules
          </a>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_340px] md:items-start">
        <section className="grid gap-4">
          <UpcomingMatches locale="en" />

          <div className="dark-panel poule-share-panel grid gap-4 p-5 sm:p-6">
            <div className="grid gap-4 poule-share-copy">
              <div>
                <h2 className="flex items-start gap-3 text-xl font-bold leading-tight text-white sm:text-2xl">
                  <Users aria-hidden="true" className="mt-0.5 size-6 flex-none text-white" />
                  Play together: create your World Cup pool
                </h2>
                <p className="poule-share-copy-text mt-3 text-sm font-semibold leading-6 text-blue-50 sm:text-base">
                  Make the World Cup more fun: create your own pool for friends, family or colleagues and share your own invite link.
                </p>
              </div>
              <p className="poule-share-copy-text text-sm font-bold leading-6 text-blue-50">
                Received a link? Sign up, fill in your predictions in ten minutes, and you are in.
              </p>
              <a href="#login" className="button-primary poule-primary-cta">Create your World Cup pool</a>
            </div>
            <div className="share-panel-strip">
              <p className="share-panel-title">Share SlimeScore</p>
              <ShareRow
                url={`${SITE_URL}/en`}
                text={generalShareText}
                title={generalShareTitle}
                messages={generalShareMessages}
                locale="en"
                compact
                onDark
              />
            </div>
          </div>

          <a href="/ranglijst" className="panel public-score-card p-4 no-underline">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Trophy aria-hidden="true" className="size-5 flex-none text-[#efa820]" />
                <h2 className="text-base font-bold text-[#081634]">Leaderboard</h2>
              </div>
              <span className="text-sm font-bold text-[#0866e8]">View all</span>
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
          <SlimeSoccerBanner includeVolley={false} fullWidth />
        </section>

        <aside className="public-login-stack md:sticky md:top-4">
          <section id="login" className="public-login-panel grid gap-3 p-3 sm:gap-4 sm:p-5">
            {params.auth === "fout" ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-800">
                This confirmation link has expired. Request a new one.
              </div>
            ) : null}
            <div className="flex items-center gap-3">
              <span className="public-login-icon" aria-hidden="true">
                <LogIn className="size-6" />
              </span>
              <div>
                <h2 className="public-login-title text-2xl font-black text-[#101a2b]">Sign up</h2>
              </div>
            </div>
            <LoginForm surface="inline" locale="en" />
          </section>
          <InstallAppCard locale="en" />
        </aside>
      </div>
    </main>
  );
}
