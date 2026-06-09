import { LogIn, Users } from "lucide-react";
import { joinPool } from "@/app/actions";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { CopyButton } from "@/components/share-button";
import { SITE_URL } from "@/lib/constants";
import { getServerLocale } from "@/lib/server-locale";
import { createOptionalAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type PoolInfo = { name: string; code: string };

const joinPoolCopy = {
  nl: {
    metaTitle: "Meedoen met WK-poule",
    kickerAria: "WK 2026 poule uitnodiging",
    worldCup: "WK 2026",
    pool: "Poule",
    fallbackTitle: "Meedoen met een WK-poule",
    title: (poolName: string) => `Meedoen met ${poolName}`,
    intro: "Sluit aan bij deze SlimeScore WK 2026-poule. Eén keer voorspellen, daarna live meekijken wie wint.",
    invitationTitle: "Uitnodiging",
    poolCode: "Poulecode",
    found: (poolName: string) => `Gevonden: ${poolName}. Klik hieronder om mee te doen.`,
    verifyCode: "We controleren de code zodra je aansluit. Controleer de uitnodiging als deze code niet klopt.",
    copyLink: "Kopieer link",
    copied: "Gekopieerd",
    loggedInTitle: "Je bent ingelogd",
    loggedInCopy: "Sluit direct aan. Als je profiel nog niet af is, kun je daarna je naam/teamnaam invullen.",
    joinButton: "Meedoen met deze WK-poule",
    notLoggedInTitle: "Eerst aanmelden",
    notLoggedInCopy: "Nog geen account? Maak eerst gratis een SlimeScore-account aan; daarna kom je terug bij deze poule.",
  },
  en: {
    metaTitle: "Join World Cup pool",
    kickerAria: "World Cup 2026 pool invitation",
    worldCup: "World Cup 2026",
    pool: "Pool",
    fallbackTitle: "Join a World Cup pool",
    title: (poolName: string) => `Join ${poolName}`,
    intro: "Join this SlimeScore World Cup 2026 pool. Fill in your predictions once, then follow the live standings.",
    invitationTitle: "Invitation",
    poolCode: "Pool code",
    found: (poolName: string) => `Found: ${poolName}. Click below to join.`,
    verifyCode: "We will check the code when you join. Check the invitation if this code does not look right.",
    copyLink: "Copy link",
    copied: "Copied",
    loggedInTitle: "You are signed in",
    loggedInCopy: "Join directly. If your profile is not complete yet, you can fill in your name and team name afterwards.",
    joinButton: "Join this World Cup pool",
    notLoggedInTitle: "Sign in first",
    notLoggedInCopy: "No account yet? Create a free SlimeScore account first; afterwards you will return to this pool.",
  },
} as const;

function cleanCode(value: string) {
  return value.trim().replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 10);
}

export async function generateMetadata() {
  const locale = await getServerLocale();
  return { title: joinPoolCopy[locale].metaTitle };
}

export default async function JoinPoolPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  const locale = await getServerLocale();
  const copy = joinPoolCopy[locale];
  const code = cleanCode(rawCode);
  const joinUrl = locale === "en" ? `${SITE_URL}/poules/join/${code}?lang=en` : `${SITE_URL}/poules/join/${code}`;
  const nextPath = locale === "en" ? `/poules/join/${code}?lang=en` : `/poules/join/${code}`;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createOptionalAdminClient();
  const { data: pool } = admin && code
    ? await admin.from("pools").select("name,code").eq("code", code).maybeSingle()
    : { data: null };
  const poolInfo = pool as PoolInfo | null;

  return (
    <main className="page-shell grid min-h-screen content-center gap-5">
      <Brand locale={locale} />
      <section className="hero-band hero-band-visual hero-band-page join-pool-hero">
        <div className="hero-content">
          <div className="world-cup-kicker" aria-label={copy.kickerAria}>
            <span>{copy.worldCup}</span>
            <span>{copy.pool}</span>
            <span>Code {code || "—"}</span>
          </div>
          <h1 className="join-pool-title mt-3 font-black text-white">
            {poolInfo ? copy.title(poolInfo.name) : copy.fallbackTitle}
          </h1>
          <p className="join-pool-copy mt-2 max-w-2xl font-semibold text-blue-50">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_0.9fr] md:items-start">
        <div className="panel grid gap-4 p-5">
          <div className="flex items-center gap-3">
            <Users aria-hidden="true" className="size-7 text-[#25a84a]" />
            <div>
              <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.invitationTitle}</h2>
              <p className="text-sm font-semibold text-[var(--text-muted)]">{copy.poolCode}: <span className="font-black text-[var(--ink)]">{code}</span></p>
            </div>
          </div>
          {poolInfo ? (
            <p className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-bold leading-6 text-green-800">
              {copy.found(poolInfo.name)}
            </p>
          ) : (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900">
              {copy.verifyCode}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <CopyButton value={code} label={`Code ${code}`} copiedLabel={copy.copied} />
            <CopyButton value={joinUrl} label={copy.copyLink} copiedLabel={copy.copied} />
          </div>
        </div>

        {user ? (
          <form action={joinPool} className="panel grid gap-3 p-5">
            <input type="hidden" name="code" value={code} />
            <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.loggedInTitle}</h2>
            <p className="text-sm font-semibold leading-6 text-[var(--text-muted)]">
              {copy.loggedInCopy}
            </p>
            <button className="button-primary" type="submit">
              <Users aria-hidden="true" className="size-5" />
              {copy.joinButton}
            </button>
          </form>
        ) : (
          <div className="panel grid gap-4 p-5">
            <div className="flex items-start gap-3">
              <span className="public-login-icon" aria-hidden="true">
                <LogIn className="size-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-[#101a2b]">{copy.notLoggedInTitle}</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#38506d]">
                  {copy.notLoggedInCopy}
                </p>
              </div>
            </div>
            <LoginForm surface="inline" next={nextPath} locale={locale} />
          </div>
        )}
      </section>
    </main>
  );
}
