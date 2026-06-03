import type { SupabaseClient } from "@supabase/supabase-js";
import {
  scoreCloseNumber,
  scoreMatchPrediction,
  scoreOranjeStage,
  scoreStagePrediction,
  scoreTextPrediction,
  specialScoring,
} from "@/lib/scoring";

type PredictionWithResult = {
  user_id: string;
  home_score: number;
  away_score: number;
  matches:
    | { home_score: number | null; away_score: number | null }
    | { home_score: number | null; away_score: number | null }[]
    | null;
};

type BracketPrediction = { user_id: string; stage_key: string; team_codes: string[] };

type SpecialPrediction = {
  user_id: string;
  total_goals: number | null;
  total_red_cards: number | null;
  fastest_goal_minute: number | null;
  team_most_goals_code: string | null;
  oranje_stage: string | null;
  penalty_shootouts_ko: number | null;
  own_goals_ko: number | null;
  cards_ko_team_code: string | null;
};

type TournamentFacts = Omit<SpecialPrediction, "user_id">;

type ScoreTotal = { points: number; exact_scores: number; correct_results: number; bonus_points: number };

function emptyTotal(): ScoreTotal {
  return { points: 0, exact_scores: 0, correct_results: 0, bonus_points: 0 };
}

function addBonus(total: ScoreTotal, points: number) {
  total.points += points;
  total.bonus_points += points;
}

function resultFromJoin(prediction: PredictionWithResult) {
  return Array.isArray(prediction.matches) ? prediction.matches[0] : prediction.matches;
}

/**
 * Herberekent alle ranglijsten: wedstrijdpunten + rondekeuzes + bonusvragen.
 * Gebruik de admin/service-role-client. Geeft het aantal bijgewerkte spelers terug
 * of een foutmelding.
 */
export async function recalculateAllScores(admin: SupabaseClient): Promise<{ recalculatedUsers: number } | { error: string }> {
  const totals = new Map<string, ScoreTotal>();

  const { data: existingScores, error: scoreError } = await admin.from("scores").select("user_id");
  if (scoreError) return { error: scoreError.message };
  for (const score of existingScores ?? []) totals.set(score.user_id, emptyTotal());

  const { data: predictions, error: predictionError } = await admin
    .from("predictions")
    .select("user_id, home_score, away_score, matches!inner(home_score, away_score, status)")
    .eq("matches.status", "finished");
  if (predictionError) return { error: predictionError.message };

  for (const prediction of (predictions ?? []) as unknown as PredictionWithResult[]) {
    const result = resultFromJoin(prediction);
    const current = totals.get(prediction.user_id) ?? emptyTotal();
    const scored = scoreMatchPrediction({
      predictedHome: prediction.home_score,
      predictedAway: prediction.away_score,
      actualHome: result?.home_score ?? null,
      actualAway: result?.away_score ?? null,
    });
    current.points += scored.points;
    current.exact_scores += scored.exact;
    current.correct_results += scored.correct;
    totals.set(prediction.user_id, current);
  }

  const [{ data: bracketPredictions }, { data: stageResults }, { data: specialPredictions }, { data: facts }] =
    await Promise.all([
      admin.from("bracket_predictions").select("user_id,stage_key,team_codes"),
      admin.from("stage_results").select("stage_key,team_codes"),
      admin
        .from("special_predictions")
        .select("user_id,total_goals,total_red_cards,fastest_goal_minute,team_most_goals_code,oranje_stage,penalty_shootouts_ko,own_goals_ko,cards_ko_team_code"),
      admin.from("tournament_facts").select("*").eq("id", true).maybeSingle(),
    ]);

  const actualByStage = new Map((stageResults ?? []).map((stage) => [stage.stage_key, stage.team_codes as string[]]));
  for (const prediction of (bracketPredictions ?? []) as unknown as BracketPrediction[]) {
    const current = totals.get(prediction.user_id) ?? emptyTotal();
    addBonus(current, scoreStagePrediction(prediction.stage_key, prediction.team_codes, actualByStage.get(prediction.stage_key)));
    totals.set(prediction.user_id, current);
  }

  if (facts) {
    const actualFacts = facts as TournamentFacts;
    for (const prediction of (specialPredictions ?? []) as SpecialPrediction[]) {
      const current = totals.get(prediction.user_id) ?? emptyTotal();
      addBonus(
        current,
        scoreCloseNumber(prediction.total_goals, actualFacts.total_goals, specialScoring.totalGoalsExact, specialScoring.totalGoalsClose, 5) ||
          scoreCloseNumber(prediction.total_goals, actualFacts.total_goals, specialScoring.totalGoalsNear, 0, 10),
      );
      addBonus(current, scoreCloseNumber(prediction.total_red_cards, actualFacts.total_red_cards));
      addBonus(current, scoreCloseNumber(prediction.fastest_goal_minute, actualFacts.fastest_goal_minute, specialScoring.exactStat, specialScoring.closeStat, 2));
      addBonus(current, scoreTextPrediction(prediction.team_most_goals_code, actualFacts.team_most_goals_code ? [actualFacts.team_most_goals_code] : [], specialScoring.teamMostGoals));
      addBonus(current, scoreOranjeStage(prediction.oranje_stage, actualFacts.oranje_stage));
      addBonus(current, scoreCloseNumber(prediction.penalty_shootouts_ko, actualFacts.penalty_shootouts_ko));
      addBonus(current, scoreCloseNumber(prediction.own_goals_ko, actualFacts.own_goals_ko));
      addBonus(current, scoreTextPrediction(prediction.cards_ko_team_code, actualFacts.cards_ko_team_code ? [actualFacts.cards_ko_team_code] : [], specialScoring.exactStat));
      totals.set(prediction.user_id, current);
    }
  }

  const rows = Array.from(totals.entries()).map(([user_id, total]) => ({ user_id, ...total }));
  if (rows.length) {
    const { error } = await admin.from("scores").upsert(rows);
    if (error) return { error: error.message };
  }

  return { recalculatedUsers: rows.length };
}
