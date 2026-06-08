import { timingSafeEqual as nodeTimingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getEvents, getWcFixtures, isLiveStatus, type MatchEvent } from "@/lib/apifootball-live";
import { logError, logInfo } from "@/lib/log";
import { recalculateAllScores } from "@/lib/recalculate";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeTournamentFacts } from "@/lib/tournament-facts";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const FINISHED = (status: string) => ["FT", "AET", "PEN"].includes(status);

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && nodeTimingSafeEqual(ab, bb);
}

/** Geautoriseerd via Vercel Cron (Authorization: Bearer CRON_SECRET) of het sync-secret. */
function authorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (cronSecret && auth && safeEqual(auth, `Bearer ${cronSecret}`)) return true;
  const syncSecret = process.env.RESULT_SYNC_SECRET;
  const header = request.headers.get("x-result-sync-secret");
  if (syncSecret && header && safeEqual(header, syncSecret)) return true;
  return false;
}

type MatchRow = {
  id: number;
  external_id: number | null;
  home_code: string | null;
  away_code: string | null;
  starts_at: string | null;
  home_score: number | null;
  away_score: number | null;
  status: string;
};

/**
 * Hands-off live-sync, bedoeld voor een Vercel Cron die elke minuut draait.
 * Werkt alleen binnen het wedstrijd-venster (1u vóór t/m ~1u ná een wedstrijd,
 * bepaald uit onze eigen matches.starts_at — dus zonder API-call buiten het
 * venster). Binnen het venster: uitslagen + bonusvraag-facts bijwerken en de
 * ranglijsten herrekenen. Eén API-Football call (events alleen op de slotdag).
 */
async function run(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("matches")
    .select("id,external_id,home_code,away_code,starts_at,home_score,away_score,status");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const matches = (data ?? []) as MatchRow[];

  const now = Date.now();
  const inWindow = matches.some((m) => {
    if (!m.starts_at) return false;
    const start = new Date(m.starts_at).getTime();
    return now >= start - 60 * 60 * 1000 && now <= start + 3.5 * 60 * 60 * 1000;
  });
  if (!inWindow) return NextResponse.json({ ok: true, skipped: "buiten het wedstrijd-venster" });

  const fixtures = await getWcFixtures();
  if (!fixtures) return NextResponse.json({ error: "geen fixtures (API_FOOTBALL_KEY ontbreekt of API-fout)" }, { status: 502 });
  const byExternalId = new Map(fixtures.map((f) => [f.id, f]));

  // Uitslagen bijwerken (alleen bij wijziging), uitgelijnd op onze home/away.
  let updated = 0;
  for (const m of matches) {
    if (!m.external_id) continue;
    const fx = byExternalId.get(Number(m.external_id));
    if (!fx || !(FINISHED(fx.statusShort) || isLiveStatus(fx.statusShort))) continue;
    const sameOrder = fx.home.code && m.home_code ? fx.home.code === m.home_code : true;
    const home = (sameOrder ? fx.home.goals : fx.away.goals) ?? 0;
    const away = (sameOrder ? fx.away.goals : fx.home.goals) ?? 0;
    const status = FINISHED(fx.statusShort) ? "finished" : "live";
    if (m.home_score === home && m.away_score === away && m.status === status) continue;
    const { error: updErr } = await admin.from("matches").update({ home_score: home, away_score: away, status }).eq("id", m.id);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
    updated++;
  }

  // Bonusvraag-facts (events alleen als het hele toernooi gespeeld is).
  const allFinished = fixtures.length > 0 && fixtures.every((f) => FINISHED(f.statusShort));
  let eventsByFixture: Map<number, MatchEvent[]> | undefined;
  if (allFinished) {
    const pairs = await Promise.all(fixtures.map(async (f) => [f.id, (await getEvents(f.id)) ?? []] as const));
    eventsByFixture = new Map(pairs);
  }
  const computed = computeTournamentFacts(fixtures, eventsByFixture);
  let wroteFacts = false;
  if (Object.keys(computed.facts).length) {
    const { error: factErr } = await admin.from("tournament_facts").upsert({ id: true, ...computed.facts });
    if (factErr) return NextResponse.json({ error: factErr.message }, { status: 500 });
    wroteFacts = true;
  }
  if (computed.stageResults.length) {
    const { error: stageErr } = await admin.from("stage_results").upsert(computed.stageResults);
    if (stageErr) return NextResponse.json({ error: stageErr.message }, { status: 500 });
  }

  // Alleen herrekenen als er iets veranderd is (scheelt werk per minuut).
  if (updated === 0 && !wroteFacts && computed.stageResults.length === 0) {
    return NextResponse.json({ ok: true, updated_matches: 0, recalculated: false });
  }

  const recalculation = await recalculateAllScores(admin);
  if ("error" in recalculation) {
    logError("cron.live-sync.recalculate", recalculation.error);
    return NextResponse.json({ error: recalculation.error }, { status: 500 });
  }

  logInfo("cron.live-sync.ok", { updated_matches: updated, wrote_facts: wroteFacts, recalculated_users: recalculation.recalculatedUsers });
  return NextResponse.json({
    ok: true,
    updated_matches: updated,
    wrote_facts: wroteFacts,
    stage_results: computed.stageResults.length,
    recalculated_users: recalculation.recalculatedUsers,
  });
}

export async function GET(request: NextRequest) {
  return run(request);
}
export async function POST(request: NextRequest) {
  return run(request);
}
