import { LogIn, Users } from "lucide-react";
import { joinPool } from "@/app/actions";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { CopyButton } from "@/components/share-button";
import { SITE_URL } from "@/lib/constants";
import { createOptionalAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type PoolInfo = { name: string; code: string };

function cleanCode(value: string) {
  return value.trim().replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 10);
}

export default async function JoinPoolPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  const code = cleanCode(rawCode);
  const joinUrl = `${SITE_URL}/poules/join/${code}`;
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
      <Brand />
      <section className="hero-band hero-band-visual hero-band-page join-pool-hero">
        <div className="hero-content">
          <div className="world-cup-kicker" aria-label="WK 2026 poule uitnodiging">
            <span>WK 2026</span>
            <span>Poule</span>
            <span>Code {code || "—"}</span>
          </div>
          <h1 className="join-pool-title mt-3 font-black text-white">
            {poolInfo ? `Meedoen met ${poolInfo.name}` : "Meedoen met een WK-poule"}
          </h1>
          <p className="join-pool-copy mt-2 max-w-2xl font-semibold text-blue-50">
            Sluit aan bij deze SlimeScore WK 2026-poule. Eén keer voorspellen, daarna live meekijken wie wint.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_0.9fr] md:items-start">
        <div className="panel grid gap-4 p-5">
          <div className="flex items-center gap-3">
            <Users aria-hidden="true" className="size-7 text-[#25a84a]" />
            <div>
              <h2 className="text-2xl font-bold text-[#081634]">Uitnodiging</h2>
              <p className="text-sm font-semibold text-[#48617f]">Poulecode: <span className="font-black text-[#081634]">{code}</span></p>
            </div>
          </div>
          {poolInfo ? (
            <p className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-bold leading-6 text-green-800">
              Gevonden: {poolInfo.name}. Klik hieronder om mee te doen.
            </p>
          ) : (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900">
              We controleren de code zodra je aansluit. Controleer de uitnodiging als deze code niet klopt.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <CopyButton value={code} label={`Code ${code}`} />
            <CopyButton value={joinUrl} label="Kopieer link" />
          </div>
        </div>

        {user ? (
          <form action={joinPool} className="panel grid gap-3 p-5">
            <input type="hidden" name="code" value={code} />
            <h2 className="text-2xl font-bold text-[#081634]">Je bent ingelogd</h2>
            <p className="text-sm font-semibold leading-6 text-[#48617f]">
              Sluit direct aan. Als je profiel nog niet af is, kun je daarna je naam/teamnaam invullen.
            </p>
            <button className="button-primary" type="submit">
              <Users aria-hidden="true" className="size-5" />
              Meedoen met deze WK-poule
            </button>
          </form>
        ) : (
          <div className="panel grid gap-4 p-5">
            <div className="flex items-start gap-3">
              <span className="public-login-icon" aria-hidden="true">
                <LogIn className="size-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-[#101a2b]">Eerst aanmelden</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#38506d]">
                  Geen wachtwoord. Link klikken en je komt terug bij deze poule.
                </p>
              </div>
            </div>
            <LoginForm surface="inline" next={`/poules/join/${code}`} />
          </div>
        )}
      </section>
    </main>
  );
}
