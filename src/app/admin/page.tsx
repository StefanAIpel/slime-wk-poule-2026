import { Activity, ClipboardList, KeyRound, RefreshCw, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { adminRecalculate, adminSetResult, createKidAccount } from "@/app/actions";
import { Brand } from "@/components/brand";
import { PendingButton } from "@/components/pending-button";
import { TeamFlag } from "@/components/team-flag";
import { isAdminEmail } from "@/lib/admin";
import { formatAmsterdam } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type MatchRow = {
  id: number;
  starts_at: string | null;
  group_letter: string | null;
  status: string | null;
  home_score: number | null;
  away_score: number | null;
  home_code: string | null;
  away_code: string | null;
  home: { name_nl: string | null } | null;
  away: { name_nl: string | null } | null;
};

type AuditRow = { id: number; actor_email: string | null; action: string; detail: unknown; created_at: string };

type KidRow = { user_id: string; code: string; nickname: string | null; created_at: string };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ ok?: string; fout?: string; kind?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (!isAdminEmail(user.email)) {
    return (
      <main className="page-shell grid min-h-[60vh] place-items-center">
        <div className="panel grid max-w-md gap-2 p-6 text-center">
          <ShieldAlert aria-hidden="true" className="mx-auto size-8 text-[#b23b46]" />
          <h1 className="text-xl font-bold text-[#081634]">Geen toegang</h1>
          <p className="text-sm font-medium text-[#48617f]">Deze pagina is alleen voor beheerders.</p>
          <Link className="button-secondary mx-auto mt-2" href="/">Naar home</Link>
        </div>
      </main>
    );
  }

  const admin = createAdminClient();
  const [
    { count: userCount },
    { count: predictionCount },
    { count: poolCount },
    { data: lastScore },
    { data: matches },
    { data: audit },
    { data: kids },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("predictions").select("user_id", { count: "exact", head: true }),
    admin.from("pools").select("id", { count: "exact", head: true }),
    admin.from("scores").select("updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    admin
      .from("matches")
      .select("id,starts_at,group_letter,status,home_score,away_score,home_code,away_code,home:teams!matches_home_code_fkey(name_nl),away:teams!matches_away_code_fkey(name_nl)")
      .order("starts_at")
      .limit(120),
    admin.from("admin_audit_log").select("id,actor_email,action,detail,created_at").order("created_at", { ascending: false }).limit(15),
    admin.from("kid_accounts").select("user_id,code,nickname,created_at").order("created_at", { ascending: false }),
  ]);

  const matchRows = (matches ?? []) as unknown as MatchRow[];
  const auditRows = (audit ?? []) as unknown as AuditRow[];
  const kidRows = (kids ?? []) as unknown as KidRow[];
  const lastUpdate = (lastScore as { updated_at: string | null } | null)?.updated_at ?? null;
  const finishedCount = matchRows.filter((m) => m.status === "finished").length;

  return (
    <main className="page-shell">
      <header className="mb-5 grid gap-3">
        <Brand />
        <h1 className="text-2xl font-bold text-[#081634]">Beheer</h1>
        <p className="text-sm font-medium text-[#48617f]">Ingelogd als {user.email}</p>
      </header>

      {params.ok ? <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 font-bold text-green-800">Opgeslagen en herberekend.</div> : null}
      {params.fout ? <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 font-bold text-red-800">Er ging iets mis ({params.fout}).</div> : null}
      {params.kind ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 font-bold text-green-800">
          Kind-account aangemaakt. Inlogcode: <span className="font-mono text-lg">{params.kind}</span> — geef deze aan het kind (login → “Inloggen met code”).
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Users className="size-5" />} label="Spelers" value={userCount ?? 0} />
        <Stat icon={<ClipboardList className="size-5" />} label="Voorspellingen" value={predictionCount ?? 0} />
        <Stat icon={<Users className="size-5" />} label="Subpoules" value={poolCount ?? 0} />
        <Stat icon={<Activity className="size-5" />} label="Afgerond" value={`${finishedCount}/${matchRows.length}`} />
      </section>

      <div className="mt-4 panel flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="text-sm font-medium text-[#48617f]">
          Laatste herberekening: <span className="font-bold text-[#081634]">{lastUpdate ? formatAmsterdam(lastUpdate) : "nog niet"}</span>
        </div>
        <form action={adminRecalculate}>
          <PendingButton className="button-secondary" pendingText="Bezig…">
            <RefreshCw aria-hidden="true" className="size-4" />
            Herbereken nu
          </PendingButton>
        </form>
      </div>

      <section className="mt-4 panel p-4">
        <div className="flex items-center gap-2">
          <KeyRound aria-hidden="true" className="size-5 text-[#064ed6]" />
          <h2 className="text-lg font-bold text-[#081634]">Kind-accounts (inloggen met code, geen e-mail)</h2>
        </div>
        <p className="mt-1 text-sm font-medium text-[#48617f]">
          Maak een account voor een kind zonder e-mail. Het kind logt in met de code via “Inloggen met code”. Houd codes privé.
        </p>
        <form action={createKidAccount} className="mt-3 flex flex-wrap items-end gap-2">
          <label className="grid gap-1 text-xs font-bold text-[#081634]">
            Naam
            <input className="field min-h-10" name="nickname" required minLength={2} maxLength={24} placeholder="Bijv. Tom" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-[#081634]">
            Teamnaam (optioneel)
            <input className="field min-h-10" name="team_name" maxLength={28} placeholder="Bijv. Team Tom" />
          </label>
          <PendingButton className="button-primary min-h-10 px-4" pendingText="Aanmaken…">
            Maak kind-account
          </PendingButton>
        </form>
        {kidRows.length ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
            {kidRows.map((k) => (
              <div key={k.user_id} className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0">
                <span className="font-bold text-[#081634]">{k.nickname ?? "Kind"}</span>
                <span className="font-mono font-bold text-[var(--blue-2)]">{k.code}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm font-medium text-[#48617f]">Nog geen kind-accounts.</p>
        )}
      </section>

      <section className="mt-4 panel overflow-hidden">
        <div className="wc-header p-3 text-white">
          <h2 className="text-lg font-bold">Uitslagen invoeren / corrigeren</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {matchRows.map((m) => (
            <form key={m.id} action={adminSetResult} className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <input type="hidden" name="match_id" value={m.id} />
              <div className="flex items-center gap-2 text-sm">
                <span className="grid size-5 place-items-center rounded-full bg-[#e7eef8] text-[10px] font-bold text-[var(--blue-2)]">{m.group_letter ?? "KO"}</span>
                <TeamFlag code={m.home_code} name={m.home?.name_nl} />
                <span className="font-medium text-[#081634]">{m.home?.name_nl ?? m.home_code}</span>
                <span className="text-[var(--muted)]">–</span>
                <span className="font-medium text-[#081634]">{m.away?.name_nl ?? m.away_code}</span>
                <TeamFlag code={m.away_code} name={m.away?.name_nl} />
                {m.status === "finished" ? <span className="rounded bg-green-100 px-1.5 text-xs font-bold text-green-800">klaar</span> : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input className="score-input" name="home_score" inputMode="numeric" defaultValue={m.home_score ?? ""} aria-label="Thuis" />
                <span className="text-[var(--muted)]">–</span>
                <input className="score-input" name="away_score" inputMode="numeric" defaultValue={m.away_score ?? ""} aria-label="Uit" />
                <label className="flex items-center gap-1 text-xs font-semibold text-[#48617f]">
                  <input type="checkbox" name="finished" defaultChecked={m.status === "finished"} /> klaar
                </label>
                <PendingButton className="button-secondary min-h-10 px-3 text-sm" pendingText="…">Opslaan</PendingButton>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="mt-4 panel p-4">
        <h2 className="text-lg font-bold text-[#081634]">Auditlog (laatste 15)</h2>
        <div className="mt-2 grid gap-1 text-xs">
          {auditRows.length ? (
            auditRows.map((a) => (
              <div key={a.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 py-1">
                <span className="font-mono text-[#081634]">{a.action}</span>
                <span className="text-[#48617f]">{a.actor_email}</span>
                <span className="text-[#7a8aa3]">{formatAmsterdam(a.created_at)}</span>
                <span className="w-full font-mono text-[#7a8aa3]">{JSON.stringify(a.detail)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm font-medium text-[#48617f]">Nog geen acties.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="panel flex items-center gap-3 p-4">
      <span className="grid size-9 place-items-center rounded-lg bg-[#e7eef8] text-[var(--blue-2)]">{icon}</span>
      <div>
        <div className="text-xs font-medium text-[#48617f]">{label}</div>
        <div className="text-lg font-bold text-[#081634]">{value}</div>
      </div>
    </div>
  );
}
