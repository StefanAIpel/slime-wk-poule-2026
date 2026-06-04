import { saveProfile } from "@/app/actions";
import { AvatarPicker } from "@/components/avatar-picker";

const errors: Record<string, string> = {
  "te-kort": "Vul allebei minstens 4 tekens in.",
  akkoord: "Vink aan dat je akkoord gaat met de voorwaarden en het privacybeleid.",
  bezet: "Die naam is al bezet. Kies een andere.",
  gereserveerd: "Kies een echte naam of bijnaam (niet ‘anoniem’).",
};

export function ProfileForm({ error }: { error?: string }) {
  const message = error ? errors[error] : undefined;

  return (
    <form action={saveProfile} className="panel grid gap-3 p-4">
      <div>
        <div className="mb-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-[#0f7a39]">
          Inloggen gelukt
        </div>
        <h2 className="text-2xl font-bold text-[#081634]">Maak je WK-scorekaart af</h2>
        <p className="mt-1 text-sm font-medium text-[#48617f]">
          Je naam staat bovenaan in de WK 2026-ranglijst, je teamnaam eronder.
        </p>
      </div>
      {message ? (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-800">{message}</p>
      ) : null}
      <label className="grid gap-2 text-sm font-bold text-[#081634]">
        Naam of bijnaam
        <input className="field" name="nickname" required minLength={4} maxLength={24} placeholder="Stefan" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-[#081634]">
        Teamnaam
        <input className="field" name="team_name" required minLength={4} maxLength={28} placeholder="VARschrikkelijk goed" />
      </label>
      <div className="grid gap-2 text-sm font-bold text-[#081634]">
        Kies je Slime
        <AvatarPicker name="Speler" />
      </div>
      <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#f7faff] p-3 text-sm font-semibold leading-5 text-[#48617f]">
        <input className="mt-1 size-4 accent-[#0e7a44]" type="checkbox" name="terms_accepted" value="yes" required />
        <span>
          Ik ga akkoord met de{" "}
          <a className="font-bold text-[#064ed6]" href="/voorwaarden" target="_blank" rel="noopener noreferrer">voorwaarden</a>{" "}
          en het{" "}
          <a className="font-bold text-[#064ed6]" href="/privacy" target="_blank" rel="noopener noreferrer">privacybeleid</a>{" "}
          voor deelname aan de WK 2026-poule.
        </span>
      </label>
      <button className="button-primary" type="submit">
        Start mijn WK-poule
      </button>
    </form>
  );
}
