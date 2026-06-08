import { timingSafeEqual as nodeTimingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getEvents, getWcFixtures, type MatchEvent } from "@/lib/apifootball-live";
import { logError, logInfo } from "@/lib/log";
import { recalculateAllScores } from "@/lib/recalculate";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeTournamentFacts } from "@/lib/tournament-facts";

/** Constant-time vergelijking zodat het secret niet via timing lekt. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && nodeTimingSafeEqual(ab, bb);
}

const FINISHED = (s: string) => ["FT", "AET", "PEN"].includes(s);

/**
 * Leidt bonusvraag-"facts" automatisch af uit API-Football en schrijft ze naar
 * tournament_facts + stage_results, gevolgd door een herberekening. Alleen
 * definitieve (eind)waarden worden geschreven. Beveiligd met RESULT_SYNC_SECRET.
 *
 * Query:
 *  - ?dry=1   alleen berekenen + teruggeven, niets schrijven (preview).
 *  - ?deep=1  ook events per wedstrijd ophalen voor rode kaarten + snelste goal.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-result-sync-secret");
  const expected = process.env.RESULT_SYNC_SECRET;
  if (!expected || !secret || !safeEqual(secret, expected)) {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });
  }

  const url = new URL(request.url);
  const dry = url.searchParams.get("dry") === "1";
  const deep = url.searchParams.get("deep") === "1";

  const fixtures = await getWcFixtures();
  if (!fixtures) {
    return NextResponse.json({ error: "Geen fixtures (API_FOOTBALL_KEY ontbreekt of API-fout)" }, { status: 502 });
  }

  let eventsByFixture: Map<number, MatchEvent[]> | undefined;
  const allFinished = fixtures.length > 0 && fixtures.every((f) => FINISHED(f.statusShort));
  // Events (rode kaarten + snelste goal) zijn pas definitief — en pas nodig — als
  // alles gespeeld is. Zo halen we die zware calls alleen op de slotdag op.
  if (deep && allFinished) {
    const pairs = await Promise.all(fixtures.map(async (f) => [f.id, (await getEvents(f.id)) ?? []] as const));
    eventsByFixture = new Map(pairs);
  }

  const computed = computeTournamentFacts(fixtures, eventsByFixture);

  if (dry) {
    return NextResponse.json({ ok: true, dry: true, ...computed });
  }

  const admin = createAdminClient();

  let wroteFacts = false;
  if (Object.keys(computed.facts).length) {
    const { error } = await admin.from("tournament_facts").upsert({ id: true, ...computed.facts });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    wroteFacts = true;
  }

  if (computed.stageResults.length) {
    const { error } = await admin.from("stage_results").upsert(computed.stageResults);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const recalculation = await recalculateAllScores(admin);
  if ("error" in recalculation) {
    logError("sync-facts.recalculate", recalculation.error);
    return NextResponse.json({ error: recalculation.error }, { status: 500 });
  }

  logInfo("sync-facts.ok", {
    wrote_facts: wroteFacts,
    stage_rows: computed.stageResults.length,
    recalculated_users: recalculation.recalculatedUsers,
  });

  return NextResponse.json({
    ok: true,
    wrote_facts: wroteFacts,
    facts: computed.facts,
    stage_results: computed.stageResults,
    notes: computed.notes,
    recalculated_users: recalculation.recalculatedUsers,
  });
}
