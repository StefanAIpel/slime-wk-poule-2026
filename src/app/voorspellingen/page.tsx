import { redirect } from "next/navigation";
import { savePredictions } from "@/app/actions";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { GroupPredictionCard } from "@/components/group-prediction-card";
import { PageHero } from "@/components/page-hero";
import { PredictionsComplete } from "@/components/predictions-complete";
import { StatusProgressSync } from "@/components/status-progress-sync";
import { ENTRY_DEADLINE, groupLetters, POST_GROUP_DEADLINE } from "@/lib/constants";
import { oranjeStageLabels, oranjeStageOrder } from "@/lib/scoring";
import { createClient } from "@/lib/supabase/server";
import type { MatchWithTeams, Team } from "@/lib/types";

export default async function PredictionsPage({
  searchParams,
}: {
  searchParams: Promise<{ opgeslagen?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // Meedoen vereist een complete scorekaart (naam + teamnaam, min. 4 tekens).
  const { data: ownProfile } = await supabase.from("profiles").select("nickname,team_name").eq("id", user.id).maybeSingle();
  if (!ownProfile?.nickname || !ownProfile.team_name) redirect("/");

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
  const mainOpen = now < ENTRY_DEADLINE;
  const lateOpen = now < POST_GROUP_DEADLINE;
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

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero
          title="Voorspellingen"
          subtitle="Snel invullen, later nog bijschaven tot 11 juni 21:00 Nederlandse tijd. Na de groepsfase is er een kleine optionele herziening tot 28 juni 21:00."
          slime="/assets/hd-voorspel.webp"
        />
      </header>
      <StatusProgressSync progress={groupProgress} />

      {params.opgeslagen ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 font-bold text-green-800">
          Opgeslagen.
        </div>
      ) : null}

      <form action={savePredictions} className="grid gap-5">
        <section className="dark-panel p-4 text-white">
          <h2 className="text-2xl font-bold">Groepswedstrijden</h2>
          <p className="mt-1 text-sm font-medium text-blue-100">
            {mainOpen
              ? "Typ je verwachte uitslag. Leeg laten mag; alles is aanpasbaar tot de aftrap."
              : "De hoofdvoorspellingen zijn gesloten."}
          </p>
        </section>

        <div className="panel p-4">
          <div className="flex items-center justify-between text-sm font-bold text-[#081634]">
            <span>Voortgang groepswedstrijden</span>
            <span className="tabular-nums">{filledGroupMatches}/{groupMatchTotal} ingevuld · {groupProgress}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-[var(--green)] transition-all" style={{ width: `${groupProgress}%` }} />
          </div>
          <p className="mt-1 text-xs font-medium text-[#48617f]">
            Bijgewerkt na opslaan. Volledig invullen levert de meeste punten op.
          </p>
        </div>

        {groupProgress === 100 ? <PredictionsComplete /> : null}

        <nav className="group-jump" aria-label="Spring naar groep">
          <span className="group-jump-label">Selecteer groep</span>
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
              initialScores={Object.fromEntries(
                groupMatches.map((match) => {
                  const existing = predictionByMatch.get(match.id);
                  return [match.id, { home: existing?.home_score ?? null, away: existing?.away_score ?? null }];
                }),
              )}
            />
          );
        })}

        <section className="panel p-4">
          <h2 className="text-2xl font-bold text-[#081634]">Rondes en eindwinnaar</h2>
          <p className="mt-1 text-sm font-medium text-[#48617f]">
            De laatste 32 worden uit je groepsstanden berekend. Daarna kies je simpelweg welke landen verder komen.
          </p>
          <div className="mt-4 rounded-lg border border-[#bce8c8] bg-[#f4fbf0] p-3 text-sm font-bold leading-6 text-[#137c35]">
            Laatste 32: automatisch uitgerekend met nummers 1 en 2 per groep plus de beste acht nummers 3.
          </div>
          {groupIncomplete ? (
            <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-bold leading-6 text-[#8a5a00]">
              Let op: je hebt {filledGroupMatches} van {groupMatchTotal} groepswedstrijden ingevuld. Vul ze allemaal in,
              anders klopt je automatische laatste 32 nog niet en mis je punten.
            </div>
          ) : null}
          <div className="mt-4 grid gap-4">
            <TeamChecklist
              name="round16"
              title="Achtste finale"
              hint="Welke landen winnen hun eerste knock-outwedstrijd?"
              maxCount={16}
              teams={typedTeams}
              selected={bracketByStage.get("round16")}
              disabled={!mainOpen}
            />
            <TeamChecklist
              name="quarterfinal"
              title="Kwartfinale"
              hint="Kies je laatste acht."
              maxCount={8}
              teams={typedTeams}
              selected={bracketByStage.get("quarterfinal")}
              disabled={!mainOpen}
            />
            <TeamChecklist
              name="semifinal"
              title="Halve finale"
              hint="Vier landen die echt mogen dromen."
              maxCount={4}
              teams={typedTeams}
              selected={bracketByStage.get("semifinal")}
              disabled={!mainOpen}
            />
            <TeamChecklist
              name="finalists"
              title="Finale"
              hint="Twee finalisten. Wijzigbaar t/m 28 juni 21:00."
              maxCount={2}
              teams={typedTeams}
              selected={new Set((special?.finalists as string[] | undefined) ?? Array.from(bracketByStage.get("finalists") ?? []))}
              disabled={!lateOpen}
            />
            <label className="grid gap-2 text-sm font-bold text-[#081634]">
              Wereldkampioen <span className="font-medium text-[#48617f]">(wijzigbaar t/m 28 juni 21:00)</span>
              <select
                className="field"
                name="champion_code"
                defaultValue={special?.champion_code ?? Array.from(bracketByStage.get("champion") ?? [])[0] ?? ""}
                disabled={!lateOpen}
              >
                <option value="">Kies kampioen</option>
                {typedTeams.map((team) => (
                  <option key={team.code} value={team.code}>
                    {team.name_nl}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="panel p-4">
          <h2 className="text-2xl font-bold text-[#081634]">Bonusvragen</h2>
          <p className="mt-1 text-sm font-medium text-[#48617f]">Vul deze in vóór de aftrap (11 juni 21:00).</p>
          <fieldset className="mt-4 grid gap-3 md:grid-cols-2" disabled={!mainOpen}>
            <label className="grid gap-2 text-sm font-bold text-[#081634] md:col-span-2">
              Team met de meeste doelpunten
              <select className="field" name="team_most_goals_code" defaultValue={special?.team_most_goals_code ?? ""}>
                <option value="">Kies land</option>
                {typedTeams.map((team) => (
                  <option key={team.code} value={team.code}>
                    {team.name_nl}
                  </option>
                ))}
              </select>
            </label>
            <NumberField name="total_goals" label="Totaal aantal goals" value={special?.total_goals ?? 172} min={100} max={400} />
            <NumberField name="total_red_cards" label="Rode kaarten totaal" value={special?.total_red_cards ?? 8} min={0} max={50} />
            <NumberField name="fastest_goal_minute" label="Snelste goal in minuut" value={special?.fastest_goal_minute ?? 3} min={1} max={120} />
          </fieldset>
        </section>

        <section className="panel p-4">
          <h2 className="text-2xl font-bold text-[#081634]">Wijzigbaar t/m 28 juni 21:00</h2>
          <p className="mt-1 text-sm font-medium text-[#48617f]">
            Deze keuzes (samen met wereldkampioen en finalisten hierboven) mag je blijven aanpassen tot en met 28 juni 21:00 Nederlandse tijd.
          </p>
          <fieldset className="mt-4 grid gap-3 md:grid-cols-2" disabled={!lateOpen}>
            <label className="grid gap-2 text-sm font-bold text-[#081634] md:col-span-2">
              Hoe ver komt Oranje?
              <select className="field" name="oranje_stage" defaultValue={special?.oranje_stage ?? ""}>
                <option value="">Kies hoe ver Nederland komt</option>
                {oranjeStageOrder.map((stage) => (
                  <option key={stage} value={stage}>
                    {oranjeStageLabels[stage]}
                  </option>
                ))}
              </select>
            </label>
            <NumberField name="penalty_shootouts_ko" label="Penaltyseries in knock-outfase" value={special?.penalty_shootouts_ko ?? 4} min={0} max={20} />
            <NumberField name="own_goals_ko" label="Eigen goals in knock-outfase" value={special?.own_goals_ko ?? 2} min={0} max={20} />
            <label className="grid gap-2 text-sm font-bold text-[#081634] md:col-span-2">
              Meeste kaarten in knock-outs
              <select className="field" name="cards_ko_team_code" defaultValue={special?.cards_ko_team_code ?? ""}>
                <option value="">Kies land</option>
                {typedTeams.map((team) => (
                  <option key={team.code} value={team.code}>
                    {team.name_nl}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>
        </section>

        <button className="button-primary sticky bottom-24 z-10 w-full md:static" type="submit">
          Voorspellingen opslaan
        </button>
      </form>

      <BottomNav current="/voorspellingen" />
    </main>
  );
}

function groupBy<T>(items: T[] | null, keyFn: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items ?? []) {
    const key = keyFn(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return map;
}

function TeamChecklist({
  name,
  title,
  hint,
  maxCount,
  teams,
  selected,
  disabled,
}: {
  name: string;
  title: string;
  hint: string;
  maxCount: number;
  teams: Team[];
  selected?: Set<string>;
  disabled?: boolean;
}) {
  return (
    <fieldset className="rounded-lg border border-slate-200 p-3" disabled={disabled}>
      <legend className="px-1 text-lg font-bold text-[#081634]">{title}</legend>
      <p className="mb-3 text-sm font-medium text-[#48617f]">
        {hint} Kies maximaal {maxCount}; extra keuzes tellen niet mee.
      </p>
      <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <label key={`${name}-${team.code}`} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-[#081634]">
            <input name={name} type="checkbox" value={team.code} defaultChecked={selected?.has(team.code)} />
            <span className="font-bold text-[#064ed6]">{team.code}</span>
            <span>{team.name_nl}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function NumberField({
  name,
  label,
  value,
  min,
  max,
}: {
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#081634]">
      {label}
      <input className="field" type="number" min={min} max={max} name={name} defaultValue={value} />
    </label>
  );
}
