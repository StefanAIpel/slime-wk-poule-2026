// Eenmalige backfill: vult matches.external_id en teams.external_id op basis van de
// API-Football WK-fixtures. Draai dit één keer zodra je de API-key hebt; daarna kan
// de sync-worker fixtures eenduidig naar onze match.id / teams.code vertalen.
//
// Mapping-strategie:
//   - matches: op kickoff-tijd (minuut) + genormaliseerde stad (uniek voor alle 104).
//   - teams:   op FIFA-drielettercode, anders op genormaliseerde naam.
// Alles wat niet automatisch matcht wordt gelogd zodat je het handmatig kunt nazien.
//
// Draaien: node --experimental-strip-types scripts/backfill-apifootball.ts
import { createClient } from "@supabase/supabase-js";
import type { ApiFixture } from "../src/lib/apifootball.ts";

const LEAGUE = Number(process.env.API_FOOTBALL_LEAGUE ?? "1");
const SEASON = Number(process.env.API_FOOTBALL_SEASON ?? "2026");

function need(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Ontbrekende env: ${name}`);
    process.exit(1);
  }
  return value;
}

function norm(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}

const apiKey = need("API_FOOTBALL_KEY");
const supabase = createClient(
  need("SUPABASE_URL"),
  need("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } },
);

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`https://v3.football.api-sports.io/${path}`, { headers: { "x-apisports-key": apiKey } });
  if (!res.ok) throw new Error(`API-Football ${path} → ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

// ---- 1. Wedstrijden koppelen op kickoff-minuut + stad -----------------------
const { data: matches, error: matchErr } = await supabase.from("matches").select("id,starts_at,venue");
if (matchErr) throw matchErr;

const matchByKey = new Map<string, number>();
for (const m of matches ?? []) {
  if (!m.starts_at) continue;
  matchByKey.set(`${new Date(m.starts_at).toISOString().slice(0, 16)}|${norm(m.venue)}`, m.id);
}

type FixtureWithVenue = ApiFixture & { fixture: ApiFixture["fixture"] & { venue?: { city?: string } } };
const fixtureJson = await api<{ response: FixtureWithVenue[] }>(`fixtures?league=${LEAGUE}&season=${SEASON}`);
const fixtures = fixtureJson.response ?? [];

const matchUpdates: { id: number; external_id: number }[] = [];
const unmatchedFixtures: number[] = [];
for (const fx of fixtures) {
  const minute = new Date(fx.fixture.date).toISOString().slice(0, 16);
  const city = norm(fx.fixture.venue?.city ?? "");
  const matchId = matchByKey.get(`${minute}|${city}`);
  if (matchId) matchUpdates.push({ id: matchId, external_id: fx.fixture.id });
  else unmatchedFixtures.push(fx.fixture.id);
}

for (const u of matchUpdates) {
  const { error } = await supabase.from("matches").update({ external_id: u.external_id }).eq("id", u.id);
  if (error) throw error;
}
console.log(`[backfill] ${matchUpdates.length}/${fixtures.length} wedstrijden gekoppeld.`);
if (unmatchedFixtures.length) console.warn(`[backfill] niet gematchte fixtures (handmatig nazien): ${unmatchedFixtures.join(", ")}`);

// ---- 2. Landen koppelen op tri-code / naam ----------------------------------
const { data: teams, error: teamErr } = await supabase.from("teams").select("code,name_nl");
if (teamErr) throw teamErr;

const teamByCode = new Map<string, string>();
const teamByName = new Map<string, string>();
for (const t of teams ?? []) {
  teamByCode.set(norm(t.code), t.code);
  teamByName.set(norm(t.name_nl), t.code);
}

const teamJson = await api<{ response: { team: { id: number; name: string; code: string | null } }[] }>(
  `teams?league=${LEAGUE}&season=${SEASON}`,
);
const apiTeams = teamJson.response ?? [];

const teamUpdates: { code: string; external_id: number }[] = [];
const unmatchedTeams: string[] = [];
for (const { team } of apiTeams) {
  const code = (team.code && teamByCode.get(norm(team.code))) || teamByName.get(norm(team.name));
  if (code) teamUpdates.push({ code, external_id: team.id });
  else unmatchedTeams.push(`${team.name} (${team.code ?? "?"}, id ${team.id})`);
}

for (const u of teamUpdates) {
  const { error } = await supabase.from("teams").update({ external_id: u.external_id }).eq("code", u.code);
  if (error) throw error;
}
console.log(`[backfill] ${teamUpdates.length}/${apiTeams.length} landen gekoppeld.`);
if (unmatchedTeams.length) console.warn(`[backfill] niet gematchte landen (handmatig nazien):\n  ${unmatchedTeams.join("\n  ")}`);
