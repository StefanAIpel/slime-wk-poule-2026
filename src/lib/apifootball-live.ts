// Server-side koppeling met API-Football voor de live-subsite (live.slimescore.com / live.slimescore.app).
// Alleen WK 2026 (league 1). De sleutel blijft server-side (env API_FOOTBALL_KEY).
// Resultaten worden kort gecachet via Next fetch-revalidate, zodat we — ongeacht het
// aantal bezoekers — binnen de Pro-limiet blijven. Ontbreekt de key, dan geeft alles
// netjes null terug en toont de UI een nette placeholder.

const BASE = "https://v3.football.api-sports.io";
const LEAGUE = Number(process.env.API_FOOTBALL_LEAGUE ?? "1");
const SEASON = Number(process.env.API_FOOTBALL_SEASON ?? "2026");

export type LiveTeam = { id: number; name: string; logo: string; goals: number | null; winner: boolean | null };
export type LiveFixture = {
  id: number;
  date: string;
  statusShort: string;
  statusLong: string;
  elapsed: number | null;
  round: string;
  venue: string | null;
  home: LiveTeam;
  away: LiveTeam;
};

type RawTeam = { id: number; name: string; logo: string; winner: boolean | null };
type RawFixture = {
  fixture: { id: number; date: string; status: { short: string; long: string; elapsed: number | null }; venue: { name: string | null; city: string | null } };
  league: { round: string };
  teams: { home: RawTeam; away: RawTeam };
  goals: { home: number | null; away: number | null };
};

const LIVE_STATUSES = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT", "SUSP"]);
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

export function isLiveStatus(short: string) {
  return LIVE_STATUSES.has(short);
}

async function apiGet<T>(path: string, revalidate: number): Promise<T[] | null> {
  const key = process.env.API_FOOTBALL_KEY?.trim();
  if (!key) return null;
  try {
    const res = await fetch(`${BASE}/${path}`, {
      headers: { "x-apisports-key": key },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { response?: T[] };
    return json.response ?? [];
  } catch {
    return null;
  }
}

function normalize(raw: RawFixture): LiveFixture {
  const venue = [raw.fixture.venue?.city, raw.fixture.venue?.name].filter(Boolean).join(" · ") || null;
  return {
    id: raw.fixture.id,
    date: raw.fixture.date,
    statusShort: raw.fixture.status.short,
    statusLong: raw.fixture.status.long,
    elapsed: raw.fixture.status.elapsed,
    round: raw.league.round,
    venue,
    home: { id: raw.teams.home.id, name: raw.teams.home.name, logo: raw.teams.home.logo, goals: raw.goals.home, winner: raw.teams.home.winner },
    away: { id: raw.teams.away.id, name: raw.teams.away.name, logo: raw.teams.away.logo, goals: raw.goals.away, winner: raw.teams.away.winner },
  };
}

/** Alle WK-fixtures in één gecachete call; daaruit splitsen we live/recent/aankomend. */
export async function getWcFixtures(): Promise<LiveFixture[] | null> {
  const raw = await apiGet<RawFixture>(`fixtures?league=${LEAGUE}&season=${SEASON}`, 30);
  return raw ? raw.map(normalize) : null;
}

export function splitFixtures(all: LiveFixture[]) {
  const byDateAsc = (a: LiveFixture, b: LiveFixture) => a.date.localeCompare(b.date);
  const byDateDesc = (a: LiveFixture, b: LiveFixture) => b.date.localeCompare(a.date);
  return {
    live: all.filter((f) => LIVE_STATUSES.has(f.statusShort)).sort(byDateAsc),
    recent: all.filter((f) => FINISHED_STATUSES.has(f.statusShort)).sort(byDateDesc).slice(0, 3),
    upcoming: all.filter((f) => f.statusShort === "NS").sort(byDateAsc).slice(0, 8),
  };
}

export async function getFixtureById(id: number): Promise<LiveFixture | null> {
  const raw = await apiGet<RawFixture>(`fixtures?id=${id}`, 30);
  return raw && raw[0] ? normalize(raw[0]) : null;
}

export type LineupPlayer = { player: { id: number; name: string; number: number | null; pos: string | null } };
export type TeamLineup = {
  team: { id: number; name: string; logo: string };
  formation: string | null;
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
  coach: { name: string | null };
};
export type TeamStatistics = {
  team: { id: number; name: string; logo: string };
  statistics: { type: string; value: number | string | null }[];
};
export type MatchEvent = {
  time: { elapsed: number | null; extra: number | null };
  team: { id: number; name: string };
  player: { name: string | null };
  assist: { name: string | null };
  type: string;
  detail: string;
};

export async function getFixtureDetail(id: number) {
  const [lineups, statistics, events] = await Promise.all([
    apiGet<TeamLineup>(`fixtures/lineups?fixture=${id}`, 30),
    apiGet<TeamStatistics>(`fixtures/statistics?fixture=${id}`, 30),
    apiGet<MatchEvent>(`fixtures/events?fixture=${id}`, 30),
  ]);
  return { lineups, statistics, events };
}
