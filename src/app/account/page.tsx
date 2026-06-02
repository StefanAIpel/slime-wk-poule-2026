import { AtSign, ShieldCheck, Trash2, UserCog } from "lucide-react";
import { redirect } from "next/navigation";
import { deleteAccount, updateAccount } from "@/app/actions";
import { AvatarPicker } from "@/components/avatar-picker";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname,team_name,avatar_key")
    .eq("id", user.id)
    .maybeSingle();

  const nickname = profile?.nickname ?? "";
  const teamName = profile?.team_name ?? "";

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero title="Mijn account" subtitle="Beheer je naam, teamnaam, avatar en je account." />
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
        <form action={updateAccount} className="panel grid gap-4 p-5">
          <div className="flex items-center gap-3">
            <UserCog aria-hidden="true" className="size-7 text-[#064ed6]" />
            <h2 className="text-2xl font-bold text-[#081634]">Profiel</h2>
          </div>
          <label className="grid gap-2 text-sm font-bold text-[#081634]">
            Naam of bijnaam
            <input className="field" name="nickname" required minLength={4} maxLength={24} defaultValue={nickname} placeholder="Stefan" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[#081634]">
            Teamnaam
            <input className="field" name="team_name" required minLength={4} maxLength={28} defaultValue={teamName} placeholder="VARschrikkelijk goed" />
          </label>
          <div className="grid gap-2 text-sm font-bold text-[#081634]">
            Avatar
            <AvatarPicker initialKey={profile?.avatar_key} name={nickname || "Speler"} />
          </div>
          <button className="button-primary w-fit" type="submit">
            Opslaan
          </button>
        </form>

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

          <form action={deleteAccount} className="panel grid gap-3 border-red-200 p-5">
            <div className="flex items-center gap-3">
              <Trash2 aria-hidden="true" className="size-7 text-[#b23b46]" />
              <h2 className="text-xl font-bold text-[#081634]">Account verwijderen</h2>
            </div>
            <p className="text-sm font-medium leading-6 text-[#48617f]">
              Dit verwijdert je profiel, voorspellingen, scores en je deelname aan subpoules. Poules waarvan jij beheerder
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
