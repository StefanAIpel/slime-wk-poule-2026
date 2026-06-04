import { AtSign, LifeBuoy, ShieldCheck, Trash2, Trophy, UserCog } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { deleteAccount } from "@/app/actions";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { PasswordChangeForm } from "@/components/password-change-form";
import { resolveAvatarSrc } from "@/lib/avatars";
import { APP_VERSION, CONTACT_EMAIL } from "@/lib/constants";
import { formatAmsterdam } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

const accountErrors: Record<string, string> = {
  "te-kort": "Vul bij naam én teamnaam minstens 4 tekens in.",
  bezet: "Die naam is al bezet. Kies een andere.",
  gereserveerd: "Kies een echte naam of bijnaam.",
  bevestig: "Typ VERWIJDER om je account definitief te verwijderen.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ opgeslagen?: string; fout?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const [{ data: profile }, { data: score }, { count: predictionCount }] = await Promise.all([
    supabase.from("profiles").select("nickname,team_name,avatar_key").eq("id", user.id).maybeSingle(),
    supabase.from("scores").select("points,exact_scores,correct_results,bonus_points,updated_at").eq("user_id", user.id).maybeSingle(),
    supabase.from("predictions").select("match_id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const nickname = profile?.nickname ?? "";
  const teamName = profile?.team_name ?? "";
  const filled = predictionCount ?? 0;

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero title="Mijn account" subtitle="Beheer je naam, teamnaam, avatar en je account." slime="/assets/hd-account.webp" />
      </header>

      {params.opgeslagen ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 font-bold text-green-800">
          Opgeslagen.
        </div>
      ) : null}
      {params.fout ? (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 font-bold text-red-800">
          {accountErrors[params.fout] ?? "Er ging iets mis. Probeer het opnieuw."}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div className="panel grid gap-4 p-5">
          <div className="flex items-center gap-3">
            <UserCog aria-hidden="true" className="size-7 text-[#064ed6]" />
            <h2 className="text-2xl font-bold text-[#081634]">Profiel</h2>
          </div>
          <p className="text-sm font-medium leading-6 text-[#48617f]">
            Je naam en teamnaam staan vast na aanmelding. Zo blijft de ranglijst herkenbaar en voorkom je chaos in poules.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ReadOnlyProfileField label="Naam of bijnaam" value={nickname || "Speler"} />
            <ReadOnlyProfileField label="Teamnaam" value={teamName || "—"} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-[#f7faff] p-3">
            <div className="mb-2 text-sm font-bold text-[#081634]">Avatar</div>
            <div className="flex items-center gap-3">
              <Image
                className="avatar-img"
                src={resolveAvatarSrc(nickname || "Speler")}
                alt=""
                aria-hidden="true"
                width={56}
                height={56}
              />
              <p className="text-sm font-medium text-[#48617f]">Automatisch gekozen op basis van je naam.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="panel grid gap-3 p-5">
            <div className="flex items-center gap-3">
              <AtSign aria-hidden="true" className="size-7 text-[#25a84a]" />
              <h2 className="text-xl font-bold text-[#081634]">E-mail</h2>
            </div>
            <p className="break-all rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-[#081634]">
              {user.email}
            </p>
            <p className="flex items-center gap-2 text-xs font-medium text-[#48617f]">
              <ShieldCheck aria-hidden="true" className="size-4 text-[#25a84a]" />
              Je e-mail is privé en alleen voor inloggen. Andere spelers zien dit niet.
            </p>
          </div>

          <PasswordChangeForm />

          <div className="panel grid gap-3 p-5">
            <div className="flex items-center gap-3">
              <Trophy aria-hidden="true" className="size-7 text-[#e1a93a]" />
              <h2 className="text-xl font-bold text-[#081634]">Mijn punten</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <ScoreStat label="Totaal" value={`${score?.points ?? 0} pt`} highlight />
              <ScoreStat label="Voortgang" value={`${filled}/72 ingevuld`} />
              <ScoreStat label="Exacte uitslagen" value={String(score?.exact_scores ?? 0)} />
              <ScoreStat label="Juiste uitslagen" value={String(score?.correct_results ?? 0)} />
              <ScoreStat label="Bonuspunten" value={String(score?.bonus_points ?? 0)} />
              <ScoreStat label="Laatst berekend" value={score?.updated_at ? formatAmsterdam(score.updated_at) : "nog niet"} />
            </div>
            <p className="text-xs font-medium leading-5 text-[#48617f]">
              Transparant: je totaal is de som van wedstrijdpunten, rondekeuzes en bonusvragen. Zie{" "}
              <a className="font-bold text-[#0e7a44]" href="/regels">de puntentelling</a>.
            </p>
          </div>

          <details className="panel p-5">
            <summary className="flex cursor-pointer items-center gap-3">
              <LifeBuoy aria-hidden="true" className="size-6 text-[#064ed6]" />
              <span className="text-lg font-bold text-[#081634]">Support-info</span>
            </summary>
            <p className="mt-2 text-xs font-medium leading-5 text-[#48617f]">
              Handig als je ons iets vraagt: deel deze gegevens via{" "}
              <a className="font-bold text-[#0e7a44]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
            <dl className="mt-3 grid gap-1 text-xs text-[#48617f]">
              <div className="flex justify-between gap-3"><dt>Gebruikers-id</dt><dd className="font-mono text-[#081634]">{user.id.slice(0, 8)}…</dd></div>
              <div className="flex justify-between gap-3"><dt>Voorspellingen</dt><dd className="text-[#081634]">{filled}/72</dd></div>
              <div className="flex justify-between gap-3"><dt>Laatste score-update</dt><dd className="text-[#081634]">{score?.updated_at ? formatAmsterdam(score.updated_at) : "—"}</dd></div>
              <div className="flex justify-between gap-3"><dt>App-versie</dt><dd className="text-[#081634]">bèta {APP_VERSION}</dd></div>
            </dl>
          </details>

          <form action={deleteAccount} className="panel grid gap-3 border-red-200 p-5">
            <div className="flex items-center gap-3">
              <Trash2 aria-hidden="true" className="size-7 text-[#b23b46]" />
              <h2 className="text-xl font-bold text-[#081634]">Account verwijderen</h2>
            </div>
            <p className="text-sm font-medium leading-6 text-[#48617f]">
              Dit verwijdert je profiel, voorspellingen, scores en je deelname aan WK-poules. WK-poules waarvan jij beheerder
              bent worden ook verwijderd. Dit kan niet ongedaan worden gemaakt.
            </p>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              Typ <span className="text-[#b23b46]">VERWIJDER</span> om te bevestigen
              <input className="field" name="confirm" placeholder="VERWIJDER" autoComplete="off" />
            </label>
            <button className="button-secondary w-fit text-[#b23b46]" type="submit">
              <Trash2 aria-hidden="true" className="size-4" />
              Verwijder mijn account
            </button>
          </form>
        </div>
      </section>

      <BottomNav current="/account" />
    </main>
  );
}

function ReadOnlyProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-bold uppercase tracking-wide text-[#48617f]">{label}</div>
      <div className="mt-1 break-words text-base font-bold text-[#081634]">{value}</div>
    </div>
  );
}

function ScoreStat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border border-slate-200 p-3 ${highlight ? "bg-[#fff7e8]" : "bg-white"}`}>
      <div className="text-xs font-medium text-[#48617f]">{label}</div>
      <div className={`font-bold ${highlight ? "text-lg text-[#b25a00]" : "text-[#081634]"}`}>{value}</div>
    </div>
  );
}
