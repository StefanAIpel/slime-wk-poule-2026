// Server-side koppeling met API-Football voor de live-subsite (live.slimescore.com / live.slimescore.app).
// Alleen WK 2026 (league 1). De sleutel blijft server-side (env API_FOOTBALL_KEY).
// Resultaten worden kort gecachet via Next fetch-revalidate, zodat we — ongeacht het
// aantal bezoekers — binnen de Pro-limiet blijven. Ontbreekt de key, dan geeft alles
// netjes null terug en toont de UI een nette placeholder.

import { createOptionalAdminClient } from "@/lib/supabase/admin";

const BASE = "https://v3.football.api-sports.io";
const LEAGUE = Number(process.env.API_FOOTBALL_LEAGUE ?? "1");
const SEASON = Number(process.env.API_FOOTBALL_SEASON ?? "2026");

export type LiveTeam = { id: number; name: string; code: string | null; group: string | null; logo: string; goals: number | null; winner: boolean | null };
export type LiveFixture = {
  id: number;
  date: string;
  statusShort: string;
  statusLong: string;
  elapsed: number | null;
  round: string;
  venue: string | null;
  /** True als de wedstrijd buiten het WK valt (bijv. een oefeninterland die we bewust tonen). */
  friendly: boolean;
  home: LiveTeam;
  away: LiveTeam;
};

type RawTeam = { id: number; name: string; logo: string; winner: boolean | null };
type RawFixture = {
  fixture: { id: number; date: string; status: { short: string; long: string; elapsed: number | null }; venue: { name: string | null; city: string | null } };
  league: { id: number; round: string };
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

type TeamRef = { code: string; nameNl: string; group: string | null };

/** Map API-Football team-id → onze landcode + Nederlandse naam + poule (voor vlaggen, 3-letter codes en poule-label). */
async function getTeamMap(): Promise<Map<number, TeamRef>> {
  const admin = createOptionalAdminClient();
  if (!admin) return new Map();
  const { data } = await admin.from("teams").select("code,name_nl,group_letter,external_id");
  const map = new Map<number, TeamRef>();
  for (const team of (data ?? []) as { code: string; name_nl: string; group_letter: string | null; external_id: number | null }[]) {
    if (team.external_id) map.set(Number(team.external_id), { code: team.code, nameNl: team.name_nl, group: team.group_letter });
  }
  return map;
}

function normalize(raw: RawFixture, teamMap: Map<number, TeamRef>): LiveFixture {
  const venue = [raw.fixture.venue?.city, raw.fixture.venue?.name].filter(Boolean).join(" · ") || null;
  const team = (side: RawTeam, goals: number | null): LiveTeam => {
    const ref = teamMap.get(side.id);
    return { id: side.id, name: ref?.nameNl ?? side.name, code: ref?.code ?? null, group: ref?.group ?? null, logo: side.logo, goals, winner: side.winner };
  };
  return {
    id: raw.fixture.id,
    date: raw.fixture.date,
    statusShort: raw.fixture.status.short,
    statusLong: raw.fixture.status.long,
    elapsed: raw.fixture.status.elapsed,
    round: raw.league.round,
    venue,
    friendly: raw.league.id !== LEAGUE,
    home: team(raw.teams.home, raw.goals.home),
    away: team(raw.teams.away, raw.goals.away),
  };
}

// Gespeelde oefenpot blijft minstens 48u zichtbaar; ruim genomen (96u) zodat een
// oefenpot van een paar dagen vóór de WK-start tot de aftrap blijft hangen.
const FRIENDLY_LINGER_MS = 96 * 60 * 60 * 1000;

/**
 * Alle WK-fixtures in één gecachete call; daaruit splitsen we live/recent/aankomend.
 * Optioneel kan via env LIVE_FRIENDLY_TODAY (een team external_id) een oefeninterland
 * van dat team worden bijgemengd — handig om de live-weergave te proefdraaien.
 * Venster: alleen niet-WK-fixtures die live zijn, of waarvan de aftrap vóór de
 * eerste WK-wedstrijd ligt én hoogstens FRIENDLY_LINGER_MS geleden was. Daarmee
 * blijven oude seizoensuitslagen en latere interlands buiten de WK-lijst.
 */


export async function getWcFixtures(): Promise<LiveFixture[] | null> {
  const friendlyTeam = Number(process.env.LIVE_FRIENDLY_TODAY ?? "");
  const wantFriendly = Number.isFinite(friendlyTeam) && friendlyTeam > 0;
  const [raw, extraRaw, teamMap] = await Promise.all([
    apiGet<RawFixture>(`fixtures?league=${LEAGUE}&season=${SEASON}`, 30),
    // team+season is een gegarandeerd geldige combo bij API-Football; we filteren
    // daarna client-side op niet-WK + binnen het venster (zie hierboven), óók live.
    wantFriendly
      ? apiGet<RawFixture>(`fixtures?team=${friendlyTeam}&season=${SEASON}`, 30)
      : Promise.resolve<RawFixture[] | null>([]),
    getTeamMap(),
  ]);
  if (!raw) return null;
  const seen = new Set(raw.map((item) => item.fixture.id));
  let extra: LiveFixture[] = [];
  // Zonder WK-fixtures (transient lege respons) geen referentiepunt: dan ook geen
  // oefenpot bijmengen, anders valt het venster-filter stilletjes weg.
  if (wantFriendly && raw.length) {
    const nowMs = Date.now();
    const firstWcKickoffMs = raw.reduce((min, item) => Math.min(min, new Date(item.fixture.date).getTime()), Number.POSITIVE_INFINITY);
    extra = (extraRaw ?? [])
      .filter((item) => {
        if (item.league.id === LEAGUE || seen.has(item.fixture.id)) return false;
        if (LIVE_STATUSES.has(item.fixture.status.short)) return true;
        const kickoffMs = new Date(item.fixture.date).getTime();
        return kickoffMs < firstWcKickoffMs && kickoffMs + FRIENDLY_LINGER_MS >= nowMs;
      })
      .map((item) => normalize(item, teamMap));
    console.warn(`[live-friendly] team=${friendlyTeam} season=${SEASON} raw=${extraRaw === null ? "null" : extraRaw.length} kept=${extra.length}`);
  }
  return [...raw.map((item) => normalize(item, teamMap)), ...extra];
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
  const [raw, teamMap] = await Promise.all([apiGet<RawFixture>(`fixtures?id=${id}`, 30), getTeamMap()]);
  return raw && raw[0] ? normalize(raw[0], teamMap) : null;
}

/** Onderlinge duels (head-to-head); historisch dus lang gecachet. */
export async function getHeadToHead(homeId: number, awayId: number, last = 5): Promise<LiveFixture[] | null> {
  const [raw, teamMap] = await Promise.all([
    apiGet<RawFixture>(`fixtures/headtohead?h2h=${homeId}-${awayId}&last=${last}`, 3600),
    getTeamMap(),
  ]);
  return raw ? raw.map((item) => normalize(item, teamMap)) : null;
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

export type PlayerLine = {
  player: { id: number; name: string; photo: string };
  statistics: {
    games: { rating: string | null; minutes: number | null; position: string | null; captain: boolean };
    goals: { total: number | null; assists: number | null };
  }[];
};
export type TeamPlayers = {
  team: { id: number; name: string; logo: string };
  players: PlayerLine[];
};

/** Alleen de events van één wedstrijd (voor de facts-automatisering). */
export async function getEvents(id: number): Promise<MatchEvent[] | null> {
  return apiGet<MatchEvent>(`fixtures/events?fixture=${id}`, 300);
}

export async function getFixtureDetail(id: number) {
  const [lineups, statistics, events, players] = await Promise.all([
    apiGet<TeamLineup>(`fixtures/lineups?fixture=${id}`, 30),
    apiGet<TeamStatistics>(`fixtures/statistics?fixture=${id}`, 30),
    apiGet<MatchEvent>(`fixtures/events?fixture=${id}`, 30),
    apiGet<TeamPlayers>(`fixtures/players?fixture=${id}`, 30),
  ]);
  return { lineups, statistics, events, players };
}

/** Hoogst beoordeelde speler over beide teams (man van de wedstrijd). */
export function manOfTheMatch(players: TeamPlayers[] | null) {
  if (!players?.length) return null;
  let best: { name: string; team: string; rating: number; photo: string; goals: number } | null = null;
  for (const team of players) {
    for (const line of team.players) {
      const stat = line.statistics?.[0];
      const rating = stat?.games.rating ? Number(stat.games.rating) : NaN;
      if (!Number.isFinite(rating)) continue;
      if (!best || rating > best.rating) {
        best = { name: line.player.name, team: team.team.name, rating, photo: line.player.photo, goals: stat?.goals.total ?? 0 };
      }
    }
  }
  return best;
}
