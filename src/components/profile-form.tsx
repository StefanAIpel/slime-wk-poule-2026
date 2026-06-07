import { saveProfile } from "@/app/actions";
import type { Locale } from "@/lib/i18n";
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, TEAM_NAME_MAX_LENGTH, TEAM_NAME_MIN_LENGTH } from "@/lib/limits";

const errors: Record<Locale, Record<string, string>> = {
  nl: {
    "te-kort": "Vul naam en teamnaam allebei met minstens 4 tekens in.",
    akkoord: "Vink aan dat je akkoord gaat met de voorwaarden en het privacybeleid.",
    bezet: "Die naam is al bezet. Kies een andere.",
    gereserveerd: "Kies een echte naam of bijnaam (niet ‘anoniem’).",
  },
  en: {
    "te-kort": "Use at least 4 characters for both name and team name.",
    akkoord: "Tick that you agree to the terms and privacy policy.",
    bezet: "That name is already taken. Choose another one.",
    gereserveerd: "Choose a real name or nickname (not ‘anonymous’).",
  },
};

const profileCopy = {
  nl: {
    confirmed: "E-mail bevestigd",
    title: "Maak je WK-scorekaart af",
    intro: "Kies je naam en teamnaam voor de WK 2026-ranglijst. Bij normale registratie is dit al ingevuld; dit scherm is vooral voor vaste codes of als je gekozen naam al bezet was.",
    nickname: "Naam of bijnaam",
    nicknamePlaceholder: "Stefan",
    teamName: "Teamnaam",
    teamPlaceholder: "VARschrikkelijk",
    agreeBefore: "Ik ga akkoord met de",
    terms: "voorwaarden",
    andThe: "en het",
    privacy: "privacybeleid",
    agreeAfter: "voor deelname aan de WK 2026-poule.",
    submit: "Aanmelden",
  },
  en: {
    confirmed: "Email confirmed",
    title: "Complete your World Cup scorecard",
    intro: "Choose your name and team name for the World Cup 2026 ranking. With normal signup this is already filled in; this screen is mainly for fixed codes or if your chosen name was already taken.",
    nickname: "Name or nickname",
    nicknamePlaceholder: "Alex",
    teamName: "Team name",
    teamPlaceholder: "VAR legends",
    agreeBefore: "I agree to the",
    terms: "terms",
    andThe: "and the",
    privacy: "privacy policy",
    agreeAfter: "for participation in the World Cup 2026 pool.",
    submit: "Sign up",
  },
} satisfies Record<Locale, Record<string, string>>;

export function ProfileForm({ error, locale = "nl" }: { error?: string; locale?: Locale }) {
  const copy = profileCopy[locale];
  const message = error ? errors[locale][error] : undefined;

  return (
    <form action={saveProfile} className="panel grid gap-3 p-4">
      <div>
        <div className="mb-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-[#0f7a39]">
          {copy.confirmed}
        </div>
        <h2 className="text-2xl font-bold text-[#081634]">{copy.title}</h2>
        <p className="mt-1 text-sm font-medium leading-6 text-[#48617f]">
          {copy.intro}
        </p>
      </div>
      {message ? (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-800">{message}</p>
      ) : null}
      <label className="grid gap-2 text-sm font-bold text-[#081634]">
        {copy.nickname}
        <input className="field" name="nickname" required minLength={NICKNAME_MIN_LENGTH} maxLength={NICKNAME_MAX_LENGTH} placeholder={copy.nicknamePlaceholder} />
      </label>
      <label className="grid gap-2 text-sm font-bold text-[#081634]">
        {copy.teamName}
        <input className="field" name="team_name" required minLength={TEAM_NAME_MIN_LENGTH} maxLength={TEAM_NAME_MAX_LENGTH} placeholder={copy.teamPlaceholder} />
      </label>
      <input type="hidden" name="avatar_key" value="" />
      <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#f7faff] p-3 text-sm font-semibold leading-5 text-[#48617f]">
        <input className="mt-1 size-4 accent-[#0e7a44]" type="checkbox" name="terms_accepted" value="yes" required />
        <span>
          {copy.agreeBefore}{" "}
          <a className="font-bold text-[#064ed6]" href="/voorwaarden" target="_blank" rel="noopener noreferrer">{copy.terms}</a>{" "}
          {copy.andThe}{" "}
          <a className="font-bold text-[#064ed6]" href="/privacy" target="_blank" rel="noopener noreferrer">{copy.privacy}</a>{" "}
          {copy.agreeAfter}
        </span>
      </label>
      <button className="button-primary" type="submit">
        {copy.submit}
      </button>
    </form>
  );
}
