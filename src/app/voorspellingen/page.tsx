import { redirect } from "next/navigation";
import { savePredictions } from "@/app/actions";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { ENTRY_DEADLINE, hostCities, POST_GROUP_DEADLINE, POST_GROUP_WINDOW_START } from "@/lib/constants";
import { formatAmsterdam } from "@/lib/format";
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
  const postGroupOpen = now >= POST_GROUP_WINDOW_START && now < POST_GROUP_DEADLINE;
  const groupedMatches = groupBy(matches as MatchWithTeams[] | null, (match) => match.group_letter ?? "?");
  const typedTeams = (teams ?? []) as Team[];

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4 md:max-w-2xl">
        <Brand />
        <div>
          <h1 className="text-4xl font-black leading-none text-white">Voorspellingen</h1>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-blue-100">
            Snel invullen, later nog bijschaven tot 11 juni 21:00 Nederlandse tijd. Na de groepsfase is er een kleine
            optionele herziening tot 28 juni 21:00.
          </p>
        </div>
      </header>

      {params.opgeslagen ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 font-black text-green-800">
          Opgeslagen.
        </div>
      ) : null}

      <form action={savePredictions} className="grid gap-5">
        <section className="dark-panel p-4 text-white">
          <h2 className="text-2xl font-black">Groepswedstrijden</h2>
          <p className="mt-1 text-sm font-semibold text-blue-100">
            {mainOpen ? "Alle scores zijn nu nog aanpasbaar." : "De hoofdvoorspellingen zijn gesloten."}
          </p>
        </section>

        {Array.from(groupedMatches.entries()).map(([group, groupMatches]) => (
          <section key={group} className="panel overflow-hidden">
            <div className="bg-[#064ed6] px-4 py-3 text-white">
              <h2 className="text-xl font-black">Groep {group}</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {groupMatches.map((match) => {
                const existing = predictionByMatch.get(match.id);
                return (
                  <div key={match.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <div className="text-xs font-black uppercase tracking-normal text-[#48617f]">
                        Wedstrijd {match.id} - {formatAmsterdam(match.starts_at)} - {match.venue}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-lg font-black text-[#081634]">
                        <span>{match.home?.name_nl ?? match.home_code}</span>
                        <span className="text-[#48617f]">tegen</span>
                        <span>{match.away?.name_nl ?? match.away_code}</span>
                      </div>
                    </div>
                    <fieldset className="flex items-center gap-2" disabled={!mainOpen}>
                      <legend className="sr-only">Voorspel score wedstrijd {match.id}</legend>
                      <input
                        className="score-input"
                        name={`match_${match.id}_home`}
                        type="number"
                        min={0}
                        max={20}
                        defaultValue={existing?.home_score ?? 1}
                        aria-label={`${match.home?.name_nl ?? match.home_code} goals`}
                      />
                      <span className="font-black text-[#48617f]">-</span>
                      <input
                        className="score-input"
                        name={`match_${match.id}_away`}
                        type="number"
                        min={0}
                        max={20}
                        defaultValue={existing?.away_score ?? 1}
                        aria-label={`${match.away?.name_nl ?? match.away_code} goals`}
                      />
                    </fieldset>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className="panel p-4">
          <h2 className="text-2xl font-black text-[#081634]">Rondes en eindwinnaar</h2>
          <p className="mt-1 text-sm font-semibold text-[#48617f]">
            Je hoeft geen hele bracket te tekenen. Kies simpelweg welke landen ver komen.
          </p>
          <div className="mt-4 grid gap-4">
            <TeamChecklist
              name="round32"
              title="Laatste 32"
              hint="Kies de landen die volgens jou de groepsfase overleven."
              teams={typedTeams}
              selected={bracketByStage.get("round32")}
              disabled={!mainOpen}
            />
            <TeamChecklist
              name="round16"
              title="Achtste finale"
              hint="Welke landen winnen hun eerste knock-outwedstrijd?"
              teams={typedTeams}
              selected={bracketByStage.get("round16")}
              disabled={!mainOpen}
            />
            <TeamChecklist
              name="quarterfinal"
              title="Kwartfinale"
              hint="Kies je laatste acht."
              teams={typedTeams}
              selected={bracketByStage.get("quarterfinal")}
              disabled={!mainOpen}
            />
            <TeamChecklist
              name="semifinal"
              title="Halve finale"
              hint="Vier landen die echt mogen dromen."
              teams={typedTeams}
              selected={bracketByStage.get("semifinal")}
              disabled={!mainOpen}
            />
            <TeamChecklist
              name="finalists"
              title="Finale"
              hint="Twee finalisten. Deze mag na de groepsfase nog een keer aangepast worden."
              teams={typedTeams}
              selected={new Set((special?.finalists as string[] | undefined) ?? Array.from(bracketByStage.get("finalists") ?? []))}
              disabled={!mainOpen && !postGroupOpen}
            />
            <label className="grid gap-2 text-sm font-black text-[#081634]">
              Wereldkampioen
              <select
                className="field"
                name="champion_code"
                defaultValue={special?.champion_code ?? Array.from(bracketByStage.get("champion") ?? [])[0] ?? ""}
                disabled={!mainOpen && !postGroupOpen}
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
          <h2 className="text-2xl font-black text-[#081634]">Bonus en licht ironische statistieken</h2>
          <p className="mt-1 text-sm font-semibold text-[#48617f]">
            Deze leveren minder op dan de scores. Leuk voor onderscheid, niet bepalend genoeg om de poule te kapen.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-[#081634]">
              Topscorer
              <input className="field" name="top_scorer" defaultValue={special?.top_scorer ?? ""} placeholder="Bijv. Mbappe" />
            </label>
            <NumberField name="total_goals" label="Totaal aantal goals" value={special?.total_goals ?? 172} min={100} max={400} />
            <NumberField name="group_zero_zero_count" label="Aantal 0-0's in de groepsfase" value={special?.group_zero_zero_count ?? 4} min={0} max={30} />
            <NumberField name="total_red_cards" label="Totaal rode kaarten" value={special?.total_red_cards ?? 8} min={0} max={50} />
            <label className="grid gap-2 text-sm font-black text-[#081634] md:col-span-2">
              Speelstad met de meeste doelpunten
              <select className="field" name="host_city_most_goals" defaultValue={special?.host_city_most_goals ?? ""}>
                <option value="">Kies speelstad</option>
                {hostCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="panel p-4">
          <h2 className="text-2xl font-black text-[#081634]">Optionele update na de groepsfase</h2>
          <p className="mt-1 text-sm font-semibold text-[#48617f]">
            Open van 28 juni 00:00 tot 28 juni 21:00 Nederlandse tijd. Vooraf invullen mag nu al.
          </p>
          <fieldset className="mt-4 grid gap-3 md:grid-cols-3" disabled={!mainOpen && !postGroupOpen}>
            <NumberField name="penalty_shootouts_ko" label="Penaltyseries in knock-outfase" value={special?.penalty_shootouts_ko ?? 4} min={0} max={20} />
            <NumberField name="own_goals_ko" label="Eigen goals in knock-outfase" value={special?.own_goals_ko ?? 2} min={0} max={20} />
            <label className="grid gap-2 text-sm font-black text-[#081634]">
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
  teams,
  selected,
  disabled,
}: {
  name: string;
  title: string;
  hint: string;
  teams: Team[];
  selected?: Set<string>;
  disabled?: boolean;
}) {
  return (
    <fieldset className="rounded-lg border border-slate-200 p-3" disabled={disabled}>
      <legend className="px-1 text-lg font-black text-[#081634]">{title}</legend>
      <p className="mb-3 text-sm font-semibold text-[#48617f]">{hint}</p>
      <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <label key={`${name}-${team.code}`} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 text-sm font-bold text-[#081634]">
            <input name={name} type="checkbox" value={team.code} defaultChecked={selected?.has(team.code)} />
            <span className="font-black text-[#064ed6]">{team.code}</span>
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
    <label className="grid gap-2 text-sm font-black text-[#081634]">
      {label}
      <input className="field" type="number" min={min} max={max} name={name} defaultValue={value} />
    </label>
  );
}
