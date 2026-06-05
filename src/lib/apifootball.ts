// Pure vertaallaag van API-Football (api-sports.io) fixtures naar de payload die
// POST /api/sync-results verwacht. Bewust géén netwerk hier zodat de logica volledig
// te testen is; de fetch + DB-mapping zit in scripts/sync-apifootball.ts.

export type MatchStatus = "scheduled" | "live" | "finished";

/** Minimale vorm van een API-Football fixture (we lezen maar een paar velden). */
export type ApiFixture = {
  fixture: { id: number; date: string; status: { short: string } };
  teams: {
    home: { id: number; winner: boolean | null } | null;
    away: { id: number; winner: boolean | null } | null;
  };
  goals: { home: number | null; away: number | null };
};

export type ResultUpdate = { id: number; home_score: number; away_score: number; status: MatchStatus };
export type StageUpdate = { stage_key: string; team_codes: string[] };

/** Onze match-metadata per API-Football fixture-id. */
export type MatchMeta = { matchId: number; stage: string };

export type ResolveMaps = {
  /** API-Football fixture-id → onze match (id + stage). */
  matchByFixtureId: Map<number, MatchMeta>;
  /** API-Football team-id → onze teams.code (FIFA-drielettercode). */
  codeByTeamId: Map<number, string>;
};

const LIVE_STATUSES = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT", "SUSP"]);
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN", "AWD", "WO"]);

export function mapStatus(short: string): MatchStatus {
  if (FINISHED_STATUSES.has(short)) return "finished";
  if (LIVE_STATUSES.has(short)) return "live";
  return "scheduled";
}

/** Welke knock-out-stage levert welke stage_result-sleutel (de "bereikte" ronde). */
const STAGE_KEY_BY_MATCH_STAGE: Record<string, string> = {
  round32: "round32",
  round16: "round16",
  quarterfinal: "quarterfinal",
  semifinal: "semifinal",
};

const KO_REACHED_KEYS = ["round32", "round16", "quarterfinal", "semifinal"] as const;

/**
 * Vertaalt een set API-Football fixtures naar { results, stage_results }.
 *
 * - results: alleen afgeronde wedstrijden (anders zou recalculate live scoren).
 * - stage_results: de landen die elke KO-ronde bereiken (zodra de teams bekend zijn),
 *   plus de finalisten en de kampioen (via de winner-vlag, dus ook na penalty's correct).
 *
 * Fixtures zonder mapping (onbekende external_id) worden genegeerd.
 */
export function buildSyncPayload(
  fixtures: ApiFixture[],
  maps: ResolveMaps,
): { results: ResultUpdate[]; stage_results: StageUpdate[] } {
  const results: ResultUpdate[] = [];
  const reached: Record<string, Set<string>> = {
    round32: new Set(),
    round16: new Set(),
    quarterfinal: new Set(),
    semifinal: new Set(),
  };
  const finalists = new Set<string>();
  let champion: string | null = null;

  for (const fixture of fixtures) {
    const meta = maps.matchByFixtureId.get(fixture.fixture.id);
    if (!meta) continue;

    const status = mapStatus(fixture.fixture.status.short);
    const home = fixture.teams.home;
    const away = fixture.teams.away;
    const homeCode = home ? maps.codeByTeamId.get(home.id) ?? null : null;
    const awayCode = away ? maps.codeByTeamId.get(away.id) ?? null : null;
    const { home: homeGoals, away: awayGoals } = fixture.goals;

    if (status === "finished" && homeGoals !== null && awayGoals !== null) {
      results.push({ id: meta.matchId, home_score: homeGoals, away_score: awayGoals, status });
    }

    const stageKey = STAGE_KEY_BY_MATCH_STAGE[meta.stage];
    if (stageKey) {
      if (homeCode) reached[stageKey].add(homeCode);
      if (awayCode) reached[stageKey].add(awayCode);
    }

    if (meta.stage === "final") {
      if (homeCode) finalists.add(homeCode);
      if (awayCode) finalists.add(awayCode);
      if (status === "finished") {
        if (home?.winner && homeCode) champion = homeCode;
        else if (away?.winner && awayCode) champion = awayCode;
      }
    }
  }

  const stage_results: StageUpdate[] = [];
  for (const key of KO_REACHED_KEYS) {
    if (reached[key].size) stage_results.push({ stage_key: key, team_codes: [...reached[key]] });
  }
  if (finalists.size) stage_results.push({ stage_key: "finalists", team_codes: [...finalists] });
  if (champion) stage_results.push({ stage_key: "champion", team_codes: [champion] });

  return { results, stage_results };
}
