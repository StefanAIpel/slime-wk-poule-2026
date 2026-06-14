export const matchScoring = {
  exact: 12,
  outcome: 6,
  goalDifference: 2,
  teamGoal: 2,
};

export const stageScoring: Record<string, number> = {
  round32: 4,
  round16: 8,
  quarterfinal: 14,
  semifinal: 30,
  finalists: 45,
  champion: 90,
};

export const specialScoring = {
  topScorer: 35,
  totalGoalsExact: 20,
  totalGoalsClose: 12,
  totalGoalsNear: 6,
  exactStat: 12,
  closeStat: 6,
  teamMostGoals: 20,
  oranjeExact: 20,
  oranjeClose: 8,
};

/** Volgorde van hoe ver Oranje komt; gebruikt om "dichtbij" te belonen. */
export const oranjeStageOrder = [
  "groep",
  "laatste32",
  "achtste",
  "kwart",
  "halve",
  "finale",
  "kampioen",
] as const;

export const oranjeStageLabels: Record<string, string> = {
  groep: "Groepsfase (uitgeschakeld)",
  laatste32: "Laatste 32",
  achtste: "Achtste finale",
  kwart: "Kwartfinale",
  halve: "Halve finale",
  finale: "Finale",
  kampioen: "Wereldkampioen",
};

export function scoreOranjeStage(
  predicted: string | null | undefined,
  actual: string | null | undefined,
  exactPoints = specialScoring.oranjeExact,
  closePoints = specialScoring.oranjeClose,
) {
  if (!predicted || !actual) return 0;
  const predictedIndex = oranjeStageOrder.indexOf(predicted as (typeof oranjeStageOrder)[number]);
  const actualIndex = oranjeStageOrder.indexOf(actual as (typeof oranjeStageOrder)[number]);
  if (predictedIndex < 0 || actualIndex < 0) return 0;
  const diff = Math.abs(predictedIndex - actualIndex);
  if (diff === 0) return exactPoints;
  if (diff === 1) return closePoints;
  return 0;
}

export type MatchPredictionScoreInput = {
  predictedHome: number;
  predictedAway: number;
  actualHome: number | null;
  actualAway: number | null;
};

/**
 * Scoort één wedstrijdvoorspelling. `multiplier` verdubbelt (of vermenigvuldigt)
 * de punten — gebruikt voor Oranje-wedstrijden die dubbel tellen. De tellers
 * `exact`/`correct` blijven 1/0 (dat zijn aantallen, geen punten).
 */
export function scoreMatchPrediction(input: MatchPredictionScoreInput, multiplier = 1) {
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

  return { points: points * multiplier, exact: exact ? 1 : 0, correct: correct ? 1 : 0 };
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

export function scoreTotalGoalsPrediction(predicted: number | null | undefined, actual: number | null | undefined) {
  if (predicted === null || predicted === undefined || actual === null || actual === undefined) return 0;
  const diff = Math.abs(predicted - actual);
  if (diff === 0) return specialScoring.totalGoalsExact;
  if (diff <= 5) return specialScoring.totalGoalsClose;
  if (diff <= 10) return specialScoring.totalGoalsNear;
  return 0;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}
