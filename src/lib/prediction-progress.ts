/**
 * Gedeelde definities voor "hoeveel heeft een speler ingevuld". Eén bron zodat
 * het spelersdashboard (home) en het admin-overzicht exact hetzelfde tellen.
 * Pure constants + math (geen secrets), dus geen `server-only`.
 */

/** Aantal groepswedstrijden in het WK-schema. */
export const GROUP_MATCH_TOTAL = 72;

/** Hoeveel landen elke knock-outvraag verwacht. */
export const KNOCKOUT_TARGETS = {
  round16: 16,
  quarterfinal: 8,
  semifinal: 4,
  finalists: 2,
  champion: 1,
} as const;

export const KNOCKOUT_TOTAL = Object.values(KNOCKOUT_TARGETS).reduce((sum, value) => sum + value, 0);

/** Bonusvragen die meetellen voor de voortgang. */
export const BONUS_FIELD_KEYS = [
  "team_most_goals_code",
  "total_goals",
  "total_red_cards",
  "fastest_goal_minute",
  "oranje_stage",
  "penalty_shootouts_ko",
] as const;

export const BONUS_TOTAL = BONUS_FIELD_KEYS.length;

export type PredictionCompletion = {
  groupFilled: number;
  groupPct: number;
  knockoutFilled: number;
  knockoutPct: number;
  bonusFilled: number;
  bonusPct: number;
  overallPct: number;
};

function pct(filled: number, total: number) {
  return total > 0 ? Math.round((filled / total) * 100) : 0;
}

/** Zet ruwe (geclampte) tellingen om naar percentages + totaalpercentage. */
export function predictionCompletion(input: { groupFilled: number; knockoutFilled: number; bonusFilled: number }): PredictionCompletion {
  const groupFilled = Math.min(Math.max(input.groupFilled, 0), GROUP_MATCH_TOTAL);
  const knockoutFilled = Math.min(Math.max(input.knockoutFilled, 0), KNOCKOUT_TOTAL);
  const bonusFilled = Math.min(Math.max(input.bonusFilled, 0), BONUS_TOTAL);
  const overallTotal = GROUP_MATCH_TOTAL + KNOCKOUT_TOTAL + BONUS_TOTAL;
  return {
    groupFilled,
    groupPct: pct(groupFilled, GROUP_MATCH_TOTAL),
    knockoutFilled,
    knockoutPct: pct(knockoutFilled, KNOCKOUT_TOTAL),
    bonusFilled,
    bonusPct: pct(bonusFilled, BONUS_TOTAL),
    overallPct: pct(groupFilled + knockoutFilled + bonusFilled, overallTotal),
  };
}
