import { saveProfile } from "@/app/actions";

const errors: Record<string, string> = {
  "te-kort": "Vul allebei minstens 4 tekens in.",
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
        <h2 className="text-2xl font-bold text-[#081634]">Maak je scorekaart af</h2>
        <p className="mt-1 text-sm font-medium text-[#48617f]">
          Je naam staat bovenaan in de ranglijst, je teamnaam eronder.
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
      <button className="button-primary" type="submit">
        Start mijn scorekaart
      </button>
    </form>
  );
}
