import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { savePredictions } from "@/app/actions";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { FifaRankingHelp } from "@/components/fifa-ranking-help";
import { GroupPredictionCard } from "@/components/group-prediction-card";
import { KnockoutPredictionPicker } from "@/components/knockout-prediction-picker";
import { PageHero } from "@/components/page-hero";
import { PredictionsComplete } from "@/components/predictions-complete";
import { StatusProgressSync } from "@/components/status-progress-sync";
import { ENTRY_DEADLINE, ENTRY_GRACE_DEADLINE, groupLetters, isMatchLocked, POST_GROUP_DEADLINE } from "@/lib/constants";
import { fifaRankLabel } from "@/lib/fifa-ranking";
import { teamNameForLocale } from "@/lib/format";
import { calculateRound32 } from "@/lib/group-standings";
import { localizedHref } from "@/lib/i18n";
import { oranjeStageLabels, oranjeStageOrder } from "@/lib/scoring";
import { getServerLocale } from "@/lib/server-locale";
import { createClient } from "@/lib/supabase/server";
import type { MatchWithTeams, Team } from "@/lib/types";

const oranjeStageLabelsEn: Record<string, string> = {
  groep: "Group stage (eliminated)",
  laatste32: "Last 32",
  achtste: "Round of 16",
  kwart: "Quarter-final",
  halve: "Semi-final",
  finale: "Final",
  kampioen: "World champion",
};

const predictionCopy = {
  nl: {
    metaTitle: "Voorspellingen invullen",
    metaDescription: "Vul je SlimeScore WK 2026-voorspellingen in en pas ze aan tot de deadline.",
    heroTitle: "Voorspellingen",
    heroSubtitle: "Vul je voorspellingen in en sla op.",
    motivation: "Veel wedstrijden, maar in 10 minuten kun je klaar zijn voor het hele WK. Vul eerst grof in en sla niets over.",
    saved: "Opgeslagen.",
    groupTitle: "Groepswedstrijden",
    groupOpen: "Geen perfecte glazen bol nodig: vul eerst je gevoel in, verfijn later.",
    groupClosed: "De hoofdvoorspellingen zijn gesloten.",
    progressTitle: "Voortgang groepswedstrijden",
    filled: "ingevuld",
    progressHint: "Bijgewerkt na opslaan. Volledig invullen levert de meeste punten op.",
    jumpLabel: "Spring naar groep",
    jumpText: "Selecteer groep",
    knockoutTitle: "Knock-outrondes",
    knockoutIntro: "De laatste 32 worden uit je groepsstanden berekend. Daarna kies je simpelweg welke landen verder komen. Kom je er niet uit? Laat je AI-agent een voorstel maken en pas zelf de gekke keuzes aan.",
    last32: "Laatste 32: automatisch uitgerekend met nummers 1 en 2 per groep plus de beste acht nummers 3.",
    incomplete: (filled: number, total: number) =>
      `Let op: je hebt ${filled} van ${total} groepswedstrijden ingevuld. Vul ze allemaal in, anders klopt je automatische laatste 32 nog niet en mis je punten.`,
    bonusTitle: "Bonusvragen",
    bonusIntro: "Start leeg: gok slim, gok brutaal, of laat je AI-agent een eerste schatting maken. Lege bonusvelden leveren geen punten op.",
    teamMostGoals: "Team met de meeste doelpunten",
    chooseCountry: "Kies land",
    totalGoals: "Totaal aantal goals",
    redCards: "Rode kaarten totaal",
    fastestGoal: "Snelste goal in minuut",
    examplePrefix: "Bijv.",
    lateTitle: "Wijzigbaar t/m 28 juni 21:00",
    lateIntro: "Deze keuzes (samen met de finalisten hierboven) mag je blijven aanpassen tot en met 28 juni 21:00 Nederlandse tijd.",
    champion: "Wereldkampioen",
    championHelp: "(vrij uit alle landen, ongeacht je bracket)",
    chooseChampion: "Kies kampioen",
    oranje: "Hoe ver komt Oranje?",
    chooseOranje: "Kies hoe ver Nederland komt",
    penalties: "Penaltyseries in knock-outfase",
    save: "Voorspellingen opslaan",
    helper: "Vul in voor punten; leeg bewaren mag om later af te maken.",
    fifaHelpSummary: "Extra hulp: FIFA-ranking",
    fifaIntro: "Vetgedrukte landen doen mee aan het WK.",
    fifaSearch: "Zoek land of afkorting",
    fifaNoResults: "Geen land gevonden.",
    participant: "WK-deelnemer",
    nonParticipant: "Nog niet in WK-veld",
    rank: "FIFA",
    points: "punten",
    squadValue: "Selectiewaarde",
    noSquadValue: "Geen selectiewaarde",
    movementUp: "gestegen",
    movementDown: "gedaald",
    movementSame: "gelijk",
    sourceNote: "Bronnen",
  },
  en: {
    metaTitle: "Fill in predictions",
    metaDescription: "Fill in your SlimeScore World Cup 2026 predictions and edit them until the deadline.",
    heroTitle: "Predictions",
    heroSubtitle: "Fill in your predictions and save.",
    motivation: "Lots of matches, but in 10 minutes you can be ready for the whole World Cup. Fill in a rough first pass and skip nothing.",
    saved: "Saved.",
    groupTitle: "Group matches",
    groupOpen: "No perfect crystal ball needed: start with your gut and tweak later.",
    groupClosed: "The main predictions are closed.",
    progressTitle: "Group match progress",
    filled: "filled in",
    progressHint: "Updated after saving. Completing everything gives you the best chance of points.",
    jumpLabel: "Jump to group",
    jumpText: "Select group",
    knockoutTitle: "Knockout rounds",
    knockoutIntro: "The last 32 are calculated from your group standings. Then simply choose which countries keep going. Stuck? Ask your AI agent for a first draft and tweak the wild picks yourself.",
    last32: "Last 32: automatically calculated with numbers 1 and 2 from each group plus the best eight number 3 teams.",
    incomplete: (filled: number, total: number) =>
      `Heads up: you filled in ${filled} of ${total} group matches. Fill them all in, otherwise your automatic last 32 may be wrong and you can miss points.`,
    bonusTitle: "Bonus questions",
    bonusIntro: "Start empty: guess smart, guess bold, or let your AI agent make a first estimate. Empty bonus fields score no points.",
    teamMostGoals: "Team with most goals",
    chooseCountry: "Choose country",
    totalGoals: "Total number of goals",
    redCards: "Total red cards",
    fastestGoal: "Fastest goal minute",
    examplePrefix: "e.g.",
    lateTitle: "Editable until 28 June 21:00",
    lateIntro: "These choices (together with the finalists above) can still be changed until 28 June 21:00 Amsterdam time.",
    champion: "World champion",
    championHelp: "(choose from all countries, regardless of your bracket)",
    chooseChampion: "Choose champion",
    oranje: "How far will the Netherlands go?",
    chooseOranje: "Choose how far the Netherlands will go",
    penalties: "Penalty shootouts in the knockout phase",
    save: "Save predictions",
    helper: "Fill in for points; leaving it empty is fine if you want to finish later.",
    fifaHelpSummary: "Extra help: FIFA ranking",
    fifaIntro: "Bold countries are World Cup teams.",
    fifaSearch: "Search country or code",
    fifaNoResults: "No country found.",
    participant: "World Cup team",
    nonParticipant: "Not in World Cup field yet",
    rank: "FIFA",
    points: "points",
    squadValue: "Squad value",
    noSquadValue: "No squad value",
    movementUp: "up",
    movementDown: "down",
    movementSame: "same",
    sourceNote: "Sources",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title: predictionCopy[locale].metaTitle,
    description: predictionCopy[locale].metaDescription,
  };
}

export default async function PredictionsPage({
  searchParams,
}: {
  searchParams: Promise<{ opgeslagen?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const locale = await getServerLocale();
  const copy = predictionCopy[locale];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(localizedHref("/", locale));

  // Meedoen vereist een complete scorekaart (naam + teamnaam, min. 4 tekens).
  const { data: ownProfile } = await supabase.from("profiles").select("nickname,team_name").eq("id", user.id).maybeSingle();
  if (!ownProfile?.nickname || !ownProfile.team_name) redirect(localizedHref("/", locale));

  const [{ data: teams }, { data: matches }, { data: predictions }, { data: bracket }, { data: special }] =
    await Promise.all([
      supabase.from("teams").select("*").order("group_letter").order("sort_order"),
      supabase
        .from("matches")
        .select("*,home:teams!matches_home_code_fkey(*),away:teams!matches_away_code_fkey(*)")
        .eq("stage", "group")
        .order("id"),
      supabase.from("predictions").select("*").eq("user_id", user.id),
      supabase.from("bracket_predictions").select("*").eq("user_id", user.id),
      supabase.from("special_predictions").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

  const predictionByMatch = new Map((predictions ?? []).map((prediction) => [prediction.match_id, prediction]));
  const bracketByStage = new Map((bracket ?? []).map((row) => [row.stage_key, new Set(row.team_codes as string[])]));
  const now = new Date();
  const preKickoffBonusOpen = now < ENTRY_DEADLINE;
  const mainOpen = now < ENTRY_GRACE_DEADLINE;
  const lateOpen = now < POST_GROUP_DEADLINE;
  // Wedstrijden die binnen 30 min vóór de aftrap (of al begonnen) zijn: vergrendeld.
  const lockedMatchIds = (matches ?? []).filter((match) => isMatchLocked(match.starts_at, now)).map((match) => match.id);
  const groupMatchTotal = (matches ?? []).length;
  const isMatchFilled = (id: number) => {
    const prediction = predictionByMatch.get(id);
    return Boolean(prediction && prediction.home_score !== null && prediction.away_score !== null);
  };
  const filledGroupMatches = (matches ?? []).filter((match) => isMatchFilled(match.id)).length;
  const groupIncomplete = filledGroupMatches < groupMatchTotal;
  const groupProgress = groupMatchTotal ? Math.round((filledGroupMatches / groupMatchTotal) * 100) : 0;
  const groupedMatches = groupBy(matches as MatchWithTeams[] | null, (match) => match.group_letter ?? "?");
  const groupDone = new Map<string, boolean>();
  for (const group of groupLetters) {
    const groupMatches = groupedMatches.get(group) ?? [];
    groupDone.set(group, groupMatches.length > 0 && groupMatches.every((match) => isMatchFilled(match.id)));
  }
  const typedTeams = (teams ?? []) as Team[];
  const worldCupTeamCodes = new Set(typedTeams.map((team) => team.code));
  // Laatste 32 uit de opgeslagen groepsvoorspellingen — dat is de pool voor de achtste finale.
  const scoreLookup = new Map<number, { home: number; away: number }>();
  for (const prediction of predictions ?? []) {
    if (prediction.home_score !== null && prediction.away_score !== null) {
      scoreLookup.set(prediction.match_id, { home: prediction.home_score, away: prediction.away_score });
    }
  }
  const qualifiedRound16 = calculateRound32(
    (matches ?? []).map((match) => ({
      id: match.id,
      group_letter: match.group_letter,
      home_code: match.home_code,
      away_code: match.away_code,
    })),
    scoreLookup,
  );
  const initialBracketSelections = {
    round16: Array.from(bracketByStage.get("round16") ?? []),
    quarterfinal: Array.from(bracketByStage.get("quarterfinal") ?? []),
    semifinal: Array.from(bracketByStage.get("semifinal") ?? []),
    finalists: (special?.finalists as string[] | undefined) ?? Array.from(bracketByStage.get("finalists") ?? []),
  };
  const initialChampion = special?.champion_code ?? Array.from(bracketByStage.get("champion") ?? [])[0] ?? "";
  const oranjeLabels = locale === "en" ? oranjeStageLabelsEn : oranjeStageLabels;

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand locale={locale} />
        <PageHero
          title={copy.heroTitle}
          subtitle={copy.heroSubtitle}
          slime="/assets/hd-voorspel.webp"
          className="hero-title-mascot-large"
        >
          <p className="hero-inline-note">{copy.motivation}</p>
        </PageHero>
      </header>
      <StatusProgressSync progress={groupProgress} />

      {params.opgeslagen || params.saved ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 font-bold text-green-800">
          {copy.saved}
        </div>
      ) : null}

      <div className="grid gap-5">
        <section className="prediction-title-banner">
          <h2>{copy.groupTitle}</h2>
          {mainOpen && copy.groupOpen ? (
            <p>{copy.groupOpen}</p>
          ) : null}
          {!mainOpen ? <p>{copy.groupClosed}</p> : null}
        </section>

        <div className="panel p-4">
          <div className="flex items-center justify-between text-sm font-bold text-[var(--ink)]">
            <span>{copy.progressTitle}</span>
            <span className="tabular-nums">{filledGroupMatches}/{groupMatchTotal} {copy.filled} · {groupProgress}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-[var(--green)] transition-all" style={{ width: `${groupProgress}%` }} />
          </div>
          <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">{copy.progressHint}</p>
        </div>

        {groupProgress === 100 ? <PredictionsComplete locale={locale} /> : null}

        <FifaRankingHelp
          locale={locale}
          worldCupTeamCodes={Array.from(worldCupTeamCodes)}
          copy={{
            fifaHelpSummary: copy.fifaHelpSummary,
            fifaIntro: copy.fifaIntro,
            fifaSearch: copy.fifaSearch,
            fifaNoResults: copy.fifaNoResults,
            sourceNote: copy.sourceNote,
          }}
        />
      </div>

      <form action={savePredictions} className="grid gap-5">
        <nav className="group-jump" aria-label={copy.jumpLabel}>
          <span className="group-jump-label">{copy.jumpText}</span>
          {groupLetters.map((group) =>
            groupedMatches.get(group)?.length ? (
              <a
                key={group}
                href={`#groep-${group}`}
                style={groupDone.get(group) ? { background: "#dcfce7", borderColor: "#86efac", color: "#137c35" } : undefined}
              >
                {group}
                {groupDone.get(group) ? " ✓" : ""}
              </a>
            ) : null,
          )}
        </nav>

        {groupLetters.map((group) => {
          const groupMatches = groupedMatches.get(group);
          if (!groupMatches?.length) return null;
          return (
            <GroupPredictionCard
              key={group}
              group={group}
              matches={groupMatches}
              disabled={!mainOpen}
              lockedIds={lockedMatchIds}
              locale={locale}
              initialScores={Object.fromEntries(
                groupMatches.map((match) => {
                  const existing = predictionByMatch.get(match.id);
                  return [match.id, { home: existing?.home_score ?? null, away: existing?.away_score ?? null }];
                }),
              )}
            />
          );
        })}

        <section id="knockouts" className="panel overflow-hidden">
          <div className="prediction-title-banner prediction-title-banner-inset">
            <h2>{copy.knockoutTitle}</h2>
            <p>{copy.knockoutIntro}</p>
          </div>
          <div className="p-4 pt-0">
          <div className="mt-4 rounded-lg border border-[#bce8c8] bg-[#f4fbf0] p-3 text-sm font-bold leading-6 text-[#137c35]">
            {copy.last32}
          </div>
          {groupIncomplete ? (
            <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-bold leading-6 text-[#8a5a00]">
              {copy.incomplete(filledGroupMatches, groupMatchTotal)}
            </div>
          ) : null}
          <div className="mt-4 grid gap-4">
            <KnockoutPredictionPicker
              teams={typedTeams}
              initialSelections={initialBracketSelections}
              round16Pool={qualifiedRound16}
              mainDisabled={!mainOpen}
              lateDisabled={!lateOpen}
              locale={locale}
            />
          </div>
          </div>
        </section>

        <section id="bonusvragen" className="panel overflow-hidden">
          <div className="prediction-title-banner prediction-title-banner-inset">
            <h2>{copy.bonusTitle}</h2>
            <p>{copy.bonusIntro}</p>
          </div>
          <div className="p-4 pt-0">
          <fieldset className="mt-4 grid gap-3 md:grid-cols-2" disabled={!preKickoffBonusOpen}>
            <label className="grid gap-2 text-sm font-bold text-[var(--ink)] md:col-span-2">
              {copy.teamMostGoals}
              <select className="field choice-select" name="team_most_goals_code" defaultValue={special?.team_most_goals_code ?? ""}>
                <option value="">{copy.chooseCountry}</option>
                {typedTeams.map((team) => (
                  <option key={team.code} value={team.code}>
                    {teamOptionLabel(team, locale)}
                  </option>
                ))}
              </select>
            </label>
            <NumberField name="total_goals" label={copy.totalGoals} value={special?.total_goals} min={100} max={400} placeholder={`${copy.examplePrefix} 172`} helperText={copy.helper} />
            <NumberField name="total_red_cards" label={copy.redCards} value={special?.total_red_cards} min={0} max={50} placeholder={`${copy.examplePrefix} 8`} helperText={copy.helper} />
            <NumberField name="fastest_goal_minute" label={copy.fastestGoal} value={special?.fastest_goal_minute} min={1} max={120} placeholder={`${copy.examplePrefix} 3`} helperText={copy.helper} />
          </fieldset>
          </div>
        </section>

        <section className="panel p-4">
          <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.lateTitle}</h2>
          <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">{copy.lateIntro}</p>
          <fieldset className="mt-4 grid gap-3 md:grid-cols-2" disabled={!lateOpen}>
            <label className="grid gap-2 text-sm font-bold text-[var(--ink)] md:col-span-2">
              {copy.champion} <span className="font-medium text-[var(--text-muted)]">{copy.championHelp}</span>
              <select className="field choice-select" name="champion_code" defaultValue={initialChampion}>
                <option value="">{copy.chooseChampion}</option>
                {typedTeams.map((team) => (
                  <option key={team.code} value={team.code}>
                    {teamOptionLabel(team, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-[var(--ink)] md:col-span-2">
              {copy.oranje}
              <select className="field choice-select" name="oranje_stage" defaultValue={special?.oranje_stage ?? ""}>
                <option value="">{copy.chooseOranje}</option>
                {oranjeStageOrder.map((stage) => (
                  <option key={stage} value={stage}>
                    {oranjeLabels[stage]}
                  </option>
                ))}
              </select>
            </label>
            <NumberField name="penalty_shootouts_ko" label={copy.penalties} value={special?.penalty_shootouts_ko} min={0} max={20} placeholder={`${copy.examplePrefix} 4`} helperText={copy.helper} />
          </fieldset>
        </section>

        <button className="button-primary sticky bottom-24 z-10 w-full md:static" type="submit">
          {copy.save}
        </button>
      </form>

      <BottomNav current="/voorspellingen" />
    </main>
  );
}

function teamOptionLabel(team: Team, locale: "nl" | "en") {
  const rank = fifaRankLabel(team.code);
  const name = teamNameForLocale(team.code, team.name_nl, locale);
  return rank ? `${name} ${rank}` : name;
}

function groupBy<T>(items: T[] | null, keyFn: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items ?? []) {
    const key = keyFn(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return map;
}

function NumberField({
  name,
  label,
  value,
  min,
  max,
  placeholder,
  helperText,
}: {
  name: string;
  label: string;
  value?: number | null;
  min: number;
  max: number;
  placeholder: string;
  helperText: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[var(--ink)]">
      {label}
      <input
        className="field"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        min={min}
        max={max}
        name={name}
        defaultValue={value ?? ""}
        placeholder={placeholder}
        autoComplete="off"
      />
      <span className="text-xs font-medium text-[var(--text-muted)]">{helperText}</span>
    </label>
  );
}
