import { timingSafeEqual as nodeTimingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { recalculateAllScores } from "@/lib/recalculate";
import { createAdminClient } from "@/lib/supabase/admin";

type ResultUpdate = {
  id: number;
  home_score: number;
  away_score: number;
  status?: "scheduled" | "live" | "finished";
};

type StageUpdate = {
  stage_key: string;
  team_codes: string[];
};

type FactUpdate = {
  total_goals?: number;
  total_yellow_cards?: number;
  total_red_cards?: number;
  fastest_goal_minute?: number;
  team_most_goals_code?: string;
  oranje_stage?: string;
  finalists?: string[];
  champion_code?: string;
  penalty_shootouts_ko?: number;
  own_goals_ko?: number;
  cards_ko_team_code?: string;
};

type SyncBody = {
  results?: ResultUpdate[];
  stage_results?: StageUpdate[] | Record<string, string[]>;
  facts?: FactUpdate;
};

/** Constant-time vergelijking zodat het secret niet via timing lekt. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && nodeTimingSafeEqual(ab, bb);
}

function asStageRows(stageResults: SyncBody["stage_results"], facts?: FactUpdate) {
  const rows: StageUpdate[] = Array.isArray(stageResults)
    ? stageResults
    : Object.entries(stageResults ?? {}).map(([stage_key, team_codes]) => ({ stage_key, team_codes }));

  if (facts?.finalists?.length) rows.push({ stage_key: "finalists", team_codes: facts.finalists });
  if (facts?.champion_code) rows.push({ stage_key: "champion", team_codes: [facts.champion_code] });

  return rows
    .filter((row) => row.stage_key && Array.isArray(row.team_codes))
    .map((row) => ({
      stage_key: row.stage_key,
      team_codes: row.team_codes.map((teamCode) => teamCode.toUpperCase()),
    }));
}

export async function POST(request: NextRequest) {
  // Alleen via header (niet via querystring) zodat het secret niet in logs/URLs lekt.
  const secret = request.headers.get("x-result-sync-secret");
  const expected = process.env.RESULT_SYNC_SECRET;
  if (!expected || !secret || !safeEqual(secret, expected)) {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });
  }

  const admin = createAdminClient();
  const body = (await request.json().catch(() => ({}))) as SyncBody;
  const results = body.results ?? [];
  const stageRows = asStageRows(body.stage_results, body.facts);

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

  if (stageRows.length) {
    const { error } = await admin.from("stage_results").upsert(stageRows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.facts) {
    const factRow: {
      id: true;
      total_goals?: number;
      total_yellow_cards?: number;
      total_red_cards?: number;
      fastest_goal_minute?: number;
      team_most_goals_code?: string;
      oranje_stage?: string;
      penalty_shootouts_ko?: number;
      own_goals_ko?: number;
      cards_ko_team_code?: string;
    } = { id: true };

    if (body.facts.total_goals !== undefined) factRow.total_goals = body.facts.total_goals;
    if (body.facts.total_yellow_cards !== undefined) factRow.total_yellow_cards = body.facts.total_yellow_cards;
    if (body.facts.total_red_cards !== undefined) factRow.total_red_cards = body.facts.total_red_cards;
    if (body.facts.fastest_goal_minute !== undefined) factRow.fastest_goal_minute = body.facts.fastest_goal_minute;
    if (body.facts.team_most_goals_code !== undefined) factRow.team_most_goals_code = body.facts.team_most_goals_code.toUpperCase();
    if (body.facts.oranje_stage !== undefined) factRow.oranje_stage = body.facts.oranje_stage;
    if (body.facts.penalty_shootouts_ko !== undefined) factRow.penalty_shootouts_ko = body.facts.penalty_shootouts_ko;
    if (body.facts.own_goals_ko !== undefined) factRow.own_goals_ko = body.facts.own_goals_ko;
    if (body.facts.cards_ko_team_code !== undefined) factRow.cards_ko_team_code = body.facts.cards_ko_team_code.toUpperCase();

    const { error } = await admin.from("tournament_facts").upsert(factRow);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const recalculation = await recalculateAllScores(admin);
  if ("error" in recalculation) {
    logError("sync-results.recalculate", recalculation.error);
    return NextResponse.json({ error: recalculation.error }, { status: 500 });
  }

  logInfo("sync-results.ok", {
    updated_matches: results.length,
    updated_stage_results: stageRows.length,
    updated_facts: Boolean(body.facts),
    recalculated_users: recalculation.recalculatedUsers,
  });

  return NextResponse.json({
    ok: true,
    updated_matches: results.length,
    updated_stage_results: stageRows.length,
    updated_facts: Boolean(body.facts),
    recalculated_users: recalculation.recalculatedUsers,
    api_hint:
      "Post uitslagen naar results, ronde-uitkomsten naar stage_results en bonusfeiten naar facts. De route rekent daarna alle ranglijsten opnieuw door.",
  });
}
