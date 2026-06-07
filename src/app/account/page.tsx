import { AtSign, Languages, LifeBuoy, ShieldCheck, Trash2, Trophy, UserCog } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { deleteAccount, updateAccount } from "@/app/actions";
import { AvatarPicker } from "@/components/avatar-picker";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { PasswordChangeForm } from "@/components/password-change-form";
import { APP_VERSION, CONTACT_EMAIL } from "@/lib/constants";
import { formatAmsterdam } from "@/lib/format";
import { isSupportedLocale, localizedHref, type Locale } from "@/lib/i18n";
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, TEAM_NAME_MAX_LENGTH, TEAM_NAME_MIN_LENGTH } from "@/lib/limits";
import { getServerLocale } from "@/lib/server-locale";
import { createClient } from "@/lib/supabase/server";

const accountErrors: Record<Locale, Record<string, string>> = {
  nl: {
    "te-kort": "Vul bij naam én teamnaam minstens 4 tekens in.",
    bezet: "Die naam is al bezet. Kies een andere.",
    gereserveerd: "Kies een echte naam of bijnaam.",
    bevestig: "Typ VERWIJDER om je account definitief te verwijderen.",
  },
  en: {
    "te-kort": "Use at least 4 characters for both name and team name.",
    bezet: "That name is already taken. Choose another one.",
    gereserveerd: "Choose a real name or nickname.",
    bevestig: "Type DELETE to permanently delete your account.",
  },
};

const accountCopy = {
  nl: {
    title: "Mijn account",
    subtitle: "Beheer je profiel, avatar, wachtwoord, taal en account.",
    saved: "Opgeslagen.",
    fallbackError: "Er ging iets mis. Probeer het opnieuw.",
    profile: "Profiel",
    fixedProfile: "Werk je naam, teamnaam, slime-avatar en taalvoorkeur bij. Deze waarden komen uit je Supabase-profiel en worden overal in SlimeScore gebruikt.",
    name: "Naam of bijnaam",
    teamName: "Teamnaam",
    player: "Speler",
    avatar: "Avatar aanpassen",
    saveAvatar: "Avatar opslaan",
    languageTitle: "Taal instellen",
    languageIntro: "Kies de taal voor je hele SlimeScore-bezoek. We bewaren dit in je account en browser.",
    accountLanguage: "Accounttaal",
    dutch: "Nederlands",
    english: "Engels",
    saveLanguage: "Taal opslaan",
    emailPrivate: "Je e-mail is privé en alleen voor inloggen. Andere spelers zien dit niet.",
    deleteTitle: "Account verwijderen",
    deleteCopy:
      "Dit verwijdert je profiel, voorspellingen, scores en je deelname aan WK-poules. WK-poules waarvan jij beheerder bent worden ook verwijderd. Dit kan niet ongedaan worden gemaakt.",
    deleteConfirm: "Typ",
    deleteConfirmSuffix: "om te bevestigen",
    deleteButton: "Verwijder mijn account",
    pointsTitle: "Mijn punten",
    total: "Totaal",
    progress: "Voortgang",
    filled: "ingevuld",
    exactScores: "Exacte uitslagen",
    correctResults: "Juiste uitslagen",
    bonusPoints: "Bonuspunten",
    lastCalculated: "Laatst berekend",
    notYet: "nog niet",
    scoreExplanation: "Transparant: je totaal is de som van wedstrijdpunten, rondekeuzes en bonusvragen. Zie",
    scoringLink: "de puntentelling",
    supportTitle: "Support-info",
    supportIntro: "Handig als je ons iets vraagt: deel deze gegevens via",
    userId: "Gebruikers-id",
    predictions: "Voorspellingen",
    lastScoreUpdate: "Laatste score-update",
    appVersion: "App-versie",
    beta: "bèta",
  },
  en: {
    title: "My account",
    subtitle: "Manage your profile, avatar, password, language and account.",
    saved: "Saved.",
    fallbackError: "Something went wrong. Please try again.",
    profile: "Profile",
    fixedProfile: "Update your name, team name, slime avatar and language preference. These values come from your Supabase profile and are used across SlimeScore.",
    name: "Name or nickname",
    teamName: "Team name",
    player: "Player",
    avatar: "Change avatar",
    saveAvatar: "Save avatar",
    languageTitle: "Language settings",
    languageIntro: "Choose the language for your full SlimeScore visit. We store it in your account and browser.",
    accountLanguage: "Account language",
    dutch: "Dutch",
    english: "English",
    saveLanguage: "Save language",
    emailPrivate: "Your email is private and only used for signing in. Other players cannot see it.",
    deleteTitle: "Delete account",
    deleteCopy:
      "This deletes your profile, predictions, scores and WC pool memberships. WC pools where you are the manager will also be deleted. This cannot be undone.",
    deleteConfirm: "Type",
    deleteConfirmSuffix: "to confirm",
    deleteButton: "Delete my account",
    pointsTitle: "My points",
    total: "Total",
    progress: "Progress",
    filled: "filled in",
    exactScores: "Exact scores",
    correctResults: "Correct results",
    bonusPoints: "Bonus points",
    lastCalculated: "Last calculated",
    notYet: "not yet",
    scoreExplanation: "Transparent: your total is the sum of match points, round picks and bonus questions. See",
    scoringLink: "the scoring rules",
    supportTitle: "Support info",
    supportIntro: "Useful when you ask us something: share these details via",
    userId: "User ID",
    predictions: "Predictions",
    lastScoreUpdate: "Last score update",
    appVersion: "App version",
    beta: "beta",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title: locale === "en" ? "My account" : "Mijn account",
    description:
      locale === "en"
        ? "Manage your SlimeScore profile, avatar, password and language."
        : "Beheer je SlimeScore-profiel, avatar, wachtwoord en taal.",
  };
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ opgeslagen?: string; fout?: string }>;
}) {
  const params = await searchParams;
  const requestLocale = await getServerLocale();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const [{ data: profile }, { data: score }, { count: predictionCount }] = await Promise.all([
    supabase.from("profiles").select("nickname,team_name,avatar_key,preferred_locale").eq("id", user.id).maybeSingle(),
    supabase.from("scores").select("points,exact_scores,correct_results,bonus_points,updated_at").eq("user_id", user.id).maybeSingle(),
    supabase.from("predictions").select("match_id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const locale: Locale = requestLocale;
  const copy = accountCopy[locale];
  const preferredLocale: Locale = isSupportedLocale(profile?.preferred_locale) ? profile.preferred_locale : locale;
  const nickname = profile?.nickname ?? "";
  const teamName = profile?.team_name ?? "";
  const filled = predictionCount ?? 0;

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand locale={locale} />
        <PageHero title={copy.title} subtitle={copy.subtitle} slime="/assets/hd-account.webp" />
      </header>

      {params.opgeslagen ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 font-bold text-green-800">
          {copy.saved}
        </div>
      ) : null}
      {params.fout ? (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 font-bold text-red-800">
          {accountErrors[locale][params.fout] ?? copy.fallbackError}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div className="grid gap-4">
          <div className="panel grid gap-4 p-5">
            <div className="flex items-center gap-3">
              <UserCog aria-hidden="true" className="size-7 text-[#064ed6]" />
              <h2 className="text-2xl font-bold text-[#081634]">{copy.profile}</h2>
            </div>
            <p className="text-sm font-medium leading-6 text-[#48617f]">{copy.fixedProfile}</p>
            <form action={updateAccount} className="grid gap-3 rounded-xl border border-slate-200 bg-[#f7faff] p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-[#081634]">
                  {copy.name}
                  <input
                    className="field"
                    name="nickname"
                    required
                    minLength={NICKNAME_MIN_LENGTH}
                    maxLength={NICKNAME_MAX_LENGTH}
                    defaultValue={nickname}
                    placeholder={copy.player}
                    autoComplete="nickname"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#081634]">
                  {copy.teamName}
                  <input
                    className="field"
                    name="team_name"
                    required
                    minLength={TEAM_NAME_MIN_LENGTH}
                    maxLength={TEAM_NAME_MAX_LENGTH}
                    defaultValue={teamName}
                    placeholder={copy.teamName}
                    autoComplete="organization-title"
                  />
                </label>
              </div>
              <div className="text-sm font-bold text-[#081634]">{copy.avatar}</div>
              <AvatarPicker initialKey={profile?.avatar_key} name={nickname || copy.player} locale={locale} />
              <button className="button-secondary w-fit" type="submit">
                {copy.saveAvatar}
              </button>
            </form>
          </div>

          <form action={updateAccount} className="panel grid gap-3 p-5">
            <div className="flex items-center gap-3">
              <Languages aria-hidden="true" className="size-7 text-[#0e8a49]" />
              <h2 className="text-xl font-bold text-[#081634]">{copy.languageTitle}</h2>
            </div>
            <p className="text-sm font-medium leading-6 text-[#48617f]">{copy.languageIntro}</p>
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              {copy.accountLanguage}
              <select className="field" name="preferred_locale" defaultValue={preferredLocale}>
                <option value="nl">🇳🇱 {copy.dutch}</option>
                <option value="en">🇬🇧 {copy.english}</option>
              </select>
            </label>
            <button className="button-secondary w-fit" type="submit">
              {copy.saveLanguage}
            </button>
          </form>

          <details className="panel p-5">
            <summary className="flex cursor-pointer items-center gap-3">
              <AtSign aria-hidden="true" className="size-6 text-[#25a84a]" />
              <span className="text-lg font-bold text-[#081634]">E-mail</span>
            </summary>
            <p className="mt-3 break-all rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-[#081634]">
              {user.email}
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-[#48617f]">
              <ShieldCheck aria-hidden="true" className="size-4 text-[#25a84a]" />
              {copy.emailPrivate}
            </p>
          </details>

          <details className="panel border-red-200 p-5">
            <summary className="flex cursor-pointer items-center gap-3">
              <Trash2 aria-hidden="true" className="size-6 text-[#b23b46]" />
              <span className="text-lg font-bold text-[#081634]">{copy.deleteTitle}</span>
            </summary>
            <form action={deleteAccount} className="mt-3 grid gap-3">
              <p className="text-sm font-medium leading-6 text-[#48617f]">{copy.deleteCopy}</p>
              <label className="grid gap-2 text-sm font-bold text-[#081634]">
                {copy.deleteConfirm} <span className="text-[#b23b46]">VERWIJDER</span> {copy.deleteConfirmSuffix}
                <input className="field" name="confirm" placeholder="VERWIJDER" autoComplete="off" />
              </label>
              <button className="button-secondary w-fit text-[#b23b46]" type="submit">
                <Trash2 aria-hidden="true" className="size-4" />
                {copy.deleteButton}
              </button>
            </form>
          </details>
        </div>

        <div className="grid gap-4">
          <PasswordChangeForm locale={locale} />

          <div className="panel grid gap-3 p-5">
            <div className="flex items-center gap-3">
              <Trophy aria-hidden="true" className="size-7 text-[#e1a93a]" />
              <h2 className="text-xl font-bold text-[#081634]">{copy.pointsTitle}</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <ScoreStat label={copy.total} value={`${score?.points ?? 0} pt`} highlight />
              <ScoreStat label={copy.progress} value={`${filled}/72 ${copy.filled}`} />
              <ScoreStat label={copy.exactScores} value={String(score?.exact_scores ?? 0)} />
              <ScoreStat label={copy.correctResults} value={String(score?.correct_results ?? 0)} />
              <ScoreStat label={copy.bonusPoints} value={String(score?.bonus_points ?? 0)} />
              <ScoreStat label={copy.lastCalculated} value={score?.updated_at ? formatAmsterdam(score.updated_at, locale === "en" ? "en-GB" : "nl-NL") : copy.notYet} />
            </div>
            <p className="text-xs font-medium leading-5 text-[#48617f]">
              {copy.scoreExplanation}{" "}
              <a className="font-bold text-[#0e7a44]" href={localizedHref("/regels", locale)}>{copy.scoringLink}</a>.
            </p>
          </div>

          <details className="panel p-5">
            <summary className="flex cursor-pointer items-center gap-3">
              <LifeBuoy aria-hidden="true" className="size-6 text-[#064ed6]" />
              <span className="text-lg font-bold text-[#081634]">{copy.supportTitle}</span>
            </summary>
            <p className="mt-2 text-xs font-medium leading-5 text-[#48617f]">
              {copy.supportIntro}{" "}
              <a className="font-bold text-[#0e7a44]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
            <dl className="mt-3 grid gap-1 text-xs text-[#48617f]">
              <div className="flex justify-between gap-3"><dt>{copy.userId}</dt><dd className="font-mono text-[#081634]">{user.id.slice(0, 8)}…</dd></div>
              <div className="flex justify-between gap-3"><dt>{copy.predictions}</dt><dd className="text-[#081634]">{filled}/72</dd></div>
              <div className="flex justify-between gap-3"><dt>{copy.lastScoreUpdate}</dt><dd className="text-[#081634]">{score?.updated_at ? formatAmsterdam(score.updated_at, locale === "en" ? "en-GB" : "nl-NL") : "—"}</dd></div>
              <div className="flex justify-between gap-3"><dt>{copy.appVersion}</dt><dd className="text-[#081634]">{copy.beta} {APP_VERSION}</dd></div>
            </dl>
          </details>
        </div>
      </section>

      <BottomNav current="/account" />
    </main>
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
