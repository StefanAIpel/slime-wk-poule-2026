import { timingSafeEqual as nodeTimingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createOptionalAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && nodeTimingSafeEqual(ab, bb);
}

/**
 * Read-only ops-health voor monitoring/smoke. Geeft alleen GETALLEN terug
 * (counts + anomalieën), nooit profielen/codes/PII. Beveiligd met
 * RESULT_SYNC_SECRET via de x-result-sync-secret-header (deny-by-default:
 * zonder secret 401). Geen writes.
 */
export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-result-sync-secret");
  const expected = process.env.RESULT_SYNC_SECRET;
  if (!expected || !secret || !safeEqual(secret, expected)) {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });
  }

  const admin = createOptionalAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "admin-client niet geconfigureerd" }, { status: 503 });
  }

  const headCount = (table: string) => admin.from(table).select("id", { count: "exact", head: true });
  const [
    { count: profiles },
    { count: pools },
    { count: predictions },
    { count: scores },
    { count: finishedMatches },
    { count: profilesMissingNames },
    { count: finishedWithoutResult },
  ] = await Promise.all([
    headCount("profiles"),
    headCount("pools"),
    admin.from("predictions").select("user_id", { count: "exact", head: true }),
    admin.from("scores").select("user_id", { count: "exact", head: true }),
    admin.from("matches").select("id", { count: "exact", head: true }).eq("status", "finished"),
    admin.from("profiles").select("id", { count: "exact", head: true }).or("nickname.is.null,team_name.is.null"),
    admin.from("matches").select("id", { count: "exact", head: true }).eq("status", "finished").or("home_score.is.null,away_score.is.null"),
  ]);

  const counts = {
    profiles: profiles ?? 0,
    pools: pools ?? 0,
    predictions: predictions ?? 0,
    scores: scores ?? 0,
    finishedMatches: finishedMatches ?? 0,
  };
  const anomalies = {
    profilesWithoutScore: Math.max(0, (profiles ?? 0) - (scores ?? 0)),
    profilesMissingNames: profilesMissingNames ?? 0,
    finishedWithoutResult: finishedWithoutResult ?? 0,
  };

  return NextResponse.json({ ok: true, ts: new Date().toISOString(), counts, anomalies });
}
