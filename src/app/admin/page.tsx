import { Activity, ClipboardList, KeyRound, RefreshCw, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { adminRecalculate, adminSetResult, createKidAccount } from "@/app/actions";
import { Brand } from "@/components/brand";
import { PendingButton } from "@/components/pending-button";
import { TeamFlag } from "@/components/team-flag";
import { getAdminDashboard } from "@/lib/admin-data";
import { getAdminUser } from "@/lib/admin-guard";
import { formatAmsterdam } from "@/lib/format";
import { NICKNAME_MAX_LENGTH } from "@/lib/limits";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ ok?: string; fout?: string; kind?: string }> }) {
  const params = await searchParams;
  const { user, isAdmin } = await getAdminUser();

  if (!user) redirect("/");
  if (!isAdmin) {
    return (
      <main className="page-shell grid min-h-[60vh] place-items-center">
        <div className="panel grid max-w-md gap-2 p-6 text-center">
          <ShieldAlert aria-hidden="true" className="mx-auto size-8 text-[#b23b46]" />
          <h1 className="text-xl font-bold text-[var(--ink)]">Geen toegang</h1>
          <p className="text-sm font-medium text-[var(--text-muted)]">Deze pagina is alleen voor beheerders.</p>
          <Link className="button-secondary mx-auto mt-2" href="/">Naar home</Link>
        </div>
      </main>
    );
  }

  const { userCount, predictionCount, poolCount, bracketCount, specialCount, scoreCount, anomalies, lastUpdate, matchRows, auditRows, kidRows, profileRows, poolRows } =
    await getAdminDashboard();
  const finishedCount = matchRows.filter((m) => m.status === "finished").length;
  const anomalyItems = [
    { label: "Spelers zonder score", value: anomalies.profilesWithoutScore },
    { label: "Profielen zonder naam/team", value: anomalies.profilesMissingNames },
    { label: "Gespeeld zonder uitslag", value: anomalies.finishedWithoutResult },
  ];

  return (
    <main className="page-shell">
      <header className="mb-5 grid gap-3">
        <Brand />
        <h1 className="text-2xl font-bold text-[var(--ink)]">Beheer</h1>
        <p className="text-sm font-medium text-[var(--text-muted)]">Ingelogd als {user.email}</p>
      </header>

      {params.ok ? <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 font-bold text-green-800">Opgeslagen en herberekend.</div> : null}
      {params.fout ? <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 font-bold text-red-800">Er ging iets mis ({params.fout}).</div> : null}
      {params.kind ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 font-bold text-green-800">
          Code-account aangemaakt. Vaste inlogcode: <span className="font-mono text-lg">{params.kind}</span> — geef deze code alleen aan deze speler (login → “Vaste code zonder e-mail”).
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Users className="size-5" />} label="Spelers" value={userCount} />
        <Stat icon={<ClipboardList className="size-5" />} label="Voorspellingen" value={predictionCount} />
        <Stat icon={<Users className="size-5" />} label="WK-poules" value={poolCount} />
        <Stat icon={<Activity className="size-5" />} label="Afgerond" value={`${finishedCount}/${matchRows.length}`} />
        <Stat icon={<ClipboardList className="size-5" />} label="Bracket-keuzes" value={bracketCount} />
        <Stat icon={<ClipboardList className="size-5" />} label="Bonusvragen" value={specialCount} />
        <Stat icon={<Activity className="size-5" />} label="Scores" value={scoreCount} />
      </section>

      <section className="mt-4 panel p-4">
        <h2 className="text-lg font-bold text-[var(--ink)]">Datacontrole (alleen-lezen)</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {anomalyItems.map((item) => {
            const flagged = item.value > 0;
            return (
              <div
                key={item.label}
                className={`rounded-lg border p-3 ${flagged ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-slate-50"}`}
              >
                <div className={`text-2xl font-bold tabular-nums ${flagged ? "text-[#8a5a00]" : "text-[var(--ink)]"}`}>{item.value}</div>
                <div className="text-xs font-medium text-[var(--text-muted)]">{item.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-4 panel flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="text-sm font-medium text-[var(--text-muted)]">
          Laatste herberekening: <span className="font-bold text-[var(--ink)]">{lastUpdate ? formatAmsterdam(lastUpdate) : "nog niet"}</span>
        </div>
        <form action={adminRecalculate}>
          <PendingButton
            className="button-secondary"
            confirmText="Alle ranglijsten opnieuw doorrekenen? Dit raakt alle spelers en kan even duren."
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            Herbereken nu
          </PendingButton>
        </form>
      </div>

      <section className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="panel p-4">
          <h2 className="text-lg font-bold text-[var(--ink)]">Nieuwste spelers (20)</h2>
          <div className="mt-2 grid gap-1 text-sm">
            {profileRows.length ? (
              profileRows.map((p) => (
                <div key={p.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 py-1 last:border-b-0">
                  <span className="font-bold text-[var(--ink)]">{p.nickname ?? "(geen naam)"}</span>
                  <span className="text-[var(--text-muted)]">{p.team_name ?? "—"}</span>
                  <span className="text-xs text-[#7a8aa3]">{formatAmsterdam(p.created_at)}</span>
                </div>
              ))
            ) : (
              <p className="font-medium text-[var(--text-muted)]">Nog geen spelers.</p>
            )}
          </div>
        </div>
        <div className="panel p-4">
          <h2 className="text-lg font-bold text-[var(--ink)]">Nieuwste WK-poules (20)</h2>
          <div className="mt-2 grid gap-1 text-sm">
            {poolRows.length ? (
              poolRows.map((p) => (
                <div key={p.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 py-1 last:border-b-0">
                  <span className="font-bold text-[var(--ink)]">{p.name}</span>
                  <span className="text-[var(--text-muted)]">{p.memberCount} leden</span>
                  <span className="text-xs text-[#7a8aa3]">{formatAmsterdam(p.created_at)}</span>
                </div>
              ))
            ) : (
              <p className="font-medium text-[var(--text-muted)]">Nog geen poules.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-4 panel p-4">
        <div className="flex items-center gap-2">
          <KeyRound aria-hidden="true" className="size-5 text-[var(--accent-blue)]" />
          <h2 className="text-lg font-bold text-[var(--ink)]">Vaste inlogcodes zonder e-mail</h2>
        </div>
        <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">
          Maak een account voor iemand zonder e-mail. Diegene logt steeds in met dezelfde vaste code en kiest bij de eerste login zelf naam + teamnaam. Houd codes privé.
        </p>
        <form action={createKidAccount} className="mt-3 flex flex-wrap items-end gap-2">
          <label className="grid gap-1 text-xs font-bold text-[var(--ink)]">
            Naam/speler (voor jouw overzicht)
            <input className="field min-h-10" name="nickname" required minLength={2} maxLength={NICKNAME_MAX_LENGTH} placeholder="Bijv. Fedde" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-[var(--ink)]">
            Vaste code (optioneel, anders willekeurig — min. 8 tekens)
            <input className="field min-h-10" name="code" minLength={8} maxLength={16} placeholder="Bijv. fedde2026" autoComplete="off" />
          </label>
          <PendingButton className="button-primary min-h-10 px-4" pendingText="Aanmaken…">
            Maak code-account
          </PendingButton>
        </form>
        {kidRows.length ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
            {kidRows.map((k) => (
              <div key={k.user_id} className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0">
                <span className="font-bold text-[var(--ink)]">{k.nickname ?? "Kind"}</span>
                <span className="font-mono font-bold text-[var(--blue-2)]">{k.code}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm font-medium text-[var(--text-muted)]">Nog geen kind-accounts.</p>
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
                <span className="font-medium text-[var(--ink)]">{m.home?.name_nl ?? m.home_label ?? m.home_code}</span>
                <span className="text-[var(--muted)]">–</span>
                <span className="font-medium text-[var(--ink)]">{m.away?.name_nl ?? m.away_label ?? m.away_code}</span>
                <TeamFlag code={m.away_code} name={m.away?.name_nl} />
                {m.status === "finished" ? <span className="rounded bg-green-100 px-1.5 text-xs font-bold text-green-800">klaar</span> : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input className="score-input" name="home_score" inputMode="numeric" defaultValue={m.home_score ?? ""} aria-label="Thuis" />
                <span className="text-[var(--muted)]">–</span>
                <input className="score-input" name="away_score" inputMode="numeric" defaultValue={m.away_score ?? ""} aria-label="Uit" />
                <label className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)]">
                  <input type="checkbox" name="finished" defaultChecked={m.status === "finished"} /> klaar
                </label>
                <PendingButton className="button-secondary min-h-10 px-3 text-sm" pendingText="…">Opslaan</PendingButton>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="mt-4 panel p-4">
        <h2 className="text-lg font-bold text-[var(--ink)]">Auditlog (laatste 15)</h2>
        <div className="mt-2 grid gap-1 text-xs">
          {auditRows.length ? (
            auditRows.map((a) => (
              <div key={a.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 py-1">
                <span className="font-mono text-[var(--ink)]">{a.action}</span>
                <span className="text-[var(--text-muted)]">{a.actor_email}</span>
                <span className="text-[#7a8aa3]">{formatAmsterdam(a.created_at)}</span>
                <span className="w-full font-mono text-[#7a8aa3]">{JSON.stringify(a.detail)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm font-medium text-[var(--text-muted)]">Nog geen acties.</p>
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
        <div className="text-xs font-medium text-[var(--text-muted)]">{label}</div>
        <div className="text-lg font-bold text-[var(--ink)]">{value}</div>
      </div>
    </div>
  );
}
