import { saveProfile } from "@/app/actions";

const errors: Record<string, string> = {
  "te-kort": "Vul naam en teamnaam allebei met minstens 2 tekens in.",
  akkoord: "Vink aan dat je akkoord bent met de voorwaarden en het privacybeleid.",
  bezet: "Die naam is al bezet. Kies een andere.",
  gereserveerd: "Kies een echte naam of bijnaam (niet ‘anoniem’).",
  wachtwoord: "Kies een wachtwoord van minstens 8 tekens.",
  "wachtwoord-match": "Vul twee keer hetzelfde wachtwoord in.",
};

export function ProfileForm({ error }: { error?: string }) {
  const message = error ? errors[error] : undefined;

  return (
    <form action={saveProfile} className="panel grid gap-3 p-4">
      <div>
        <div className="mb-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-black text-[#0f7a39]">
          Registratielink geopend
        </div>
        <h2 className="text-2xl font-black text-[#081634]">Maak je account af</h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-[#48617f]">
          Kies je naam voor de ranglijst, je teamnaam en een wachtwoord. Daarna log je voortaan op de
          FrontPage in met mail en wachtwoord.
        </p>
      </div>
      {message ? (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm font-black text-red-800">{message}</p>
      ) : null}
      <label className="grid gap-2 text-sm font-black text-[#081634]">
        Naam of bijnaam
        <input className="field" name="nickname" required minLength={2} maxLength={24} placeholder="Stefan" />
      </label>
      <label className="grid gap-2 text-sm font-black text-[#081634]">
        Teamnaam
        <input className="field" name="team_name" required minLength={2} maxLength={28} placeholder="VARschrikkelijk goed" />
      </label>
      <label className="grid gap-2 text-sm font-black text-[#081634]">
        Wachtwoord
        <input
          className="field"
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Minstens 8 tekens"
        />
      </label>
      <label className="grid gap-2 text-sm font-black text-[#081634]">
        Herhaal wachtwoord
        <input
          className="field"
          type="password"
          name="password_confirm"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Nog een keer hetzelfde wachtwoord"
        />
      </label>
      <label className="flex items-start gap-3 rounded-xl bg-[#f7faff] p-3 text-sm font-bold leading-6 text-[#48617f]">
        <input type="checkbox" name="terms" required className="mt-1 size-4 shrink-0 accent-[#128f47]" />
        <span>
          Ik ga akkoord met de{" "}
          <a className="font-black text-[#064ed6]" href="/voorwaarden">
            voorwaarden
          </a>{" "}
          en het{" "}
          <a className="font-black text-[#064ed6]" href="/privacy">
            privacybeleid
          </a>
          .
        </span>
      </label>
      <button className="button-primary" type="submit">
        Account maken en scorekaart starten
      </button>
    </form>
  );
}
