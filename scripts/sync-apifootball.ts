// Sync-worker: haalt WK-fixtures bij API-Football op, vertaalt ze met buildSyncPayload
// en POST't ze naar /api/sync-results. Draait via .github/workflows/sync-results.yml.
//
// "Achter een vlag": ontbreken de secrets, dan stopt het script netjes (exit 0) zodat
// geplande runs groen blijven tot jij de koppeling configureert. Buiten het toernooi-
// venster doet het ook niets, om API-credits te sparen.
//
// Draaien: node --experimental-strip-types scripts/sync-apifootball.ts
import { createClient } from "@supabase/supabase-js";
import { buildSyncPayload, type ApiFixture, type MatchMeta } from "../src/lib/apifootball.ts";

const TOURNAMENT_START = process.env.API_FOOTBALL_WINDOW_START ?? "2026-06-11";
const TOURNAMENT_END = process.env.API_FOOTBALL_WINDOW_END ?? "2026-07-20";
const LEAGUE = Number(process.env.API_FOOTBALL_LEAGUE ?? "1"); // 1 = FIFA World Cup
const SEASON = Number(process.env.API_FOOTBALL_SEASON ?? "2026");

function optional(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

function skip(reason: string): never {
  console.log(`[sync] overgeslagen: ${reason}`);
  process.exit(0);
}

const apiKey = optional("API_FOOTBALL_KEY");
const syncUrl = optional("SYNC_RESULTS_URL");
const syncSecret = optional("RESULT_SYNC_SECRET");
const supabaseUrl = optional("SUPABASE_URL") ?? optional("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = optional("SUPABASE_SERVICE_ROLE_KEY");

if (!apiKey || !syncUrl || !syncSecret || !supabaseUrl || !serviceKey) {
  skip("koppeling nog niet geconfigureerd (een of meer secrets ontbreken)");
}

const today = new Date().toISOString().slice(0, 10);
if (today < TOURNAMENT_START || today > TOURNAMENT_END) {
  skip(`buiten het toernooivenster (${TOURNAMENT_START}..${TOURNAMENT_END})`);
}

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

const [{ data: matches, error: matchErr }, { data: teams, error: teamErr }] = await Promise.all([
  supabase.from("matches").select("id,stage,external_id").not("external_id", "is", null),
  supabase.from("teams").select("code,external_id").not("external_id", "is", null),
]);
if (matchErr) throw matchErr;
if (teamErr) throw teamErr;
if (!matches?.length) skip("geen gekoppelde wedstrijden (draai eerst scripts/backfill-apifootball.ts)");

const matchByFixtureId = new Map<number, MatchMeta>();
for (const m of matches) matchByFixtureId.set(Number(m.external_id), { matchId: m.id, stage: m.stage });
const codeByTeamId = new Map<number, string>();
for (const t of teams ?? []) codeByTeamId.set(Number(t.external_id), t.code);

const apiResponse = await fetch(`https://v3.football.api-sports.io/fixtures?league=${LEAGUE}&season=${SEASON}`, {
  headers: { "x-apisports-key": apiKey },
});
if (!apiResponse.ok) {
  console.error(`[sync] API-Football gaf ${apiResponse.status}: ${await apiResponse.text()}`);
  process.exit(1);
}
const apiJson = (await apiResponse.json()) as { response?: ApiFixture[]; errors?: unknown };
const fixtures = apiJson.response ?? [];
console.log(`[sync] ${fixtures.length} fixtures opgehaald, ${matchByFixtureId.size} gekoppeld.`);

const payload = buildSyncPayload(fixtures, { matchByFixtureId, codeByTeamId });
if (!payload.results.length && !payload.stage_results.length) {
  skip("niets nieuws om te syncen");
}

const post = await fetch(syncUrl, {
  method: "POST",
  headers: { "content-type": "application/json", "x-result-sync-secret": syncSecret },
  body: JSON.stringify(payload),
});
const body = await post.text();
console.log(`[sync] sync-results → ${post.status}: ${body}`);
if (!post.ok) process.exit(1);
