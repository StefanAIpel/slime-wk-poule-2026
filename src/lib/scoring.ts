export const matchScoring = {
  exact: 12,
  outcome: 6,
  goalDifference: 3,
  teamGoal: 1,
};

export const stageScoring: Record<string, number> = {
  round32: 5,
  round16: 7,
  quarterfinal: 10,
  semifinal: 14,
  finalists: 20,
  champion: 55,
};

export const specialScoring = {
  topScorer: 25,
  totalGoalsExact: 15,
  totalGoalsClose: 10,
  totalGoalsNear: 5,
  exactStat: 10,
  closeStat: 5,
};

export type MatchPredictionScoreInput = {
  predictedHome: number;
  predictedAway: number;
  actualHome: number | null;
  actualAway: number | null;
};

export function scoreMatchPrediction(input: MatchPredictionScoreInput) {
  if (input.actualHome === null || input.actualAway === null) {
    return { points: 0, exact: 0, correct: 0 };
  }

  const actualOutcome = Math.sign(input.actualHome - input.actualAway);
  const predictedOutcome = Math.sign(input.predictedHome - input.predictedAway);
  const exact = input.actualHome === input.predictedHome && input.actualAway === input.predictedAway;
  const correct = actualOutcome === predictedOutcome;

  let points = 0;
  if (exact) {
    points = matchScoring.exact;
  } else {
    if (correct) points += matchScoring.outcome;
    if (input.actualHome - input.actualAway === input.predictedHome - input.predictedAway) {
      points += matchScoring.goalDifference;
    }
    if (input.actualHome === input.predictedHome) points += matchScoring.teamGoal;
    if (input.actualAway === input.predictedAway) points += matchScoring.teamGoal;
  }

  return { points, exact: exact ? 1 : 0, correct: correct ? 1 : 0 };
}

export function scoreStagePrediction(stageKey: string, predicted: string[] = [], actual: string[] = []) {
  const pointsPerTeam = stageScoring[stageKey] ?? 0;
  if (!pointsPerTeam || !actual.length || !predicted.length) return 0;
  const actualSet = new Set(actual);
  return predicted.filter((teamCode) => actualSet.has(teamCode)).length * pointsPerTeam;
}

export function scoreTextPrediction(predicted: string | null | undefined, actualOptions: string[] = [], points: number) {
  if (!predicted || !actualOptions.length) return 0;
  const normalizedPrediction = normalizeText(predicted);
  return actualOptions.some((actual) => normalizeText(actual) === normalizedPrediction) ? points : 0;
}

export function scoreCloseNumber(
  predicted: number | null | undefined,
  actual: number | null | undefined,
  exactPoints = specialScoring.exactStat,
  closePoints = specialScoring.closeStat,
  closeDistance = 1,
) {
  if (predicted === null || predicted === undefined || actual === null || actual === undefined) return 0;
  const diff = Math.abs(predicted - actual);
  if (diff === 0) return exactPoints;
  if (diff <= closeDistance) return closePoints;
  return 0;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}
