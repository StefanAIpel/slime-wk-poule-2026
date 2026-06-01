import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ResultUpdate = {
  id: number;
  home_score: number;
  away_score: number;
  status?: "scheduled" | "live" | "finished";
};

type PredictionWithResult = {
  user_id: string;
  home_score: number;
  away_score: number;
  matches:
    | { home_score: number | null; away_score: number | null }
    | { home_score: number | null; away_score: number | null }[]
    | null;
};

function scorePrediction(prediction: PredictionWithResult) {
  const result = Array.isArray(prediction.matches) ? prediction.matches[0] : prediction.matches;
  if (result?.home_score === null || result?.away_score === null) return { points: 0, exact: 0, correct: 0 };
  if (!result) return { points: 0, exact: 0, correct: 0 };

  const actualHome = result.home_score;
  const actualAway = result.away_score;
  const predictedHome = prediction.home_score;
  const predictedAway = prediction.away_score;
  const actualOutcome = Math.sign(actualHome - actualAway);
  const predictedOutcome = Math.sign(predictedHome - predictedAway);
  const exact = actualHome === predictedHome && actualAway === predictedAway;
  const correct = actualOutcome === predictedOutcome;

  let points = 0;
  if (exact) points += 12;
  else if (correct) points += 5;
  if (actualHome - actualAway === predictedHome - predictedAway) points += 2;
  if (actualHome === predictedHome) points += 1;
  if (actualAway === predictedAway) points += 1;

  return { points, exact: exact ? 1 : 0, correct: correct ? 1 : 0 };
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-result-sync-secret") ?? request.nextUrl.searchParams.get("secret");
  if (!process.env.RESULT_SYNC_SECRET || secret !== process.env.RESULT_SYNC_SECRET) {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });
  }

  const admin = createAdminClient();
  const body = (await request.json().catch(() => ({}))) as { results?: ResultUpdate[] };
  const results = body.results ?? [];

  for (const result of results) {
    await admin
      .from("matches")
      .update({
        home_score: result.home_score,
        away_score: result.away_score,
        status: result.status ?? "finished",
      })
      .eq("id", result.id);
  }

  const { data: predictions, error } = await admin
    .from("predictions")
    .select("user_id, home_score, away_score, matches!inner(home_score, away_score, status)")
    .eq("matches.status", "finished");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const totals = new Map<string, { points: number; exact_scores: number; correct_results: number }>();
  for (const prediction of ((predictions ?? []) as unknown as PredictionWithResult[])) {
    const current = totals.get(prediction.user_id) ?? { points: 0, exact_scores: 0, correct_results: 0 };
    const scored = scorePrediction(prediction);
    current.points += scored.points;
    current.exact_scores += scored.exact;
    current.correct_results += scored.correct;
    totals.set(prediction.user_id, current);
  }

  if (totals.size) {
    const rows = Array.from(totals.entries()).map(([user_id, total]) => ({
      user_id,
      points: total.points,
      exact_scores: total.exact_scores,
      correct_results: total.correct_results,
    }));
    await admin.from("scores").upsert(rows);
  }

  return NextResponse.json({
    ok: true,
    updated_matches: results.length,
    recalculated_users: totals.size,
    api_hint: "Koppel hier een goedkope voetbaldata-provider door resultaten naar { results: [{ id, home_score, away_score }] } te posten.",
  });
}
