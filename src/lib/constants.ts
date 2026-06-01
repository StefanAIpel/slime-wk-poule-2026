import { matchScoring, specialScoring, stageScoring } from "@/lib/scoring";

export const ENTRY_DEADLINE_ISO = "2026-06-11T21:00:00+02:00";
export const POST_GROUP_WINDOW_START_ISO = "2026-06-28T00:00:00+02:00";
export const POST_GROUP_DEADLINE_ISO = "2026-06-28T21:00:00+02:00";

export const ENTRY_DEADLINE = new Date(ENTRY_DEADLINE_ISO);
export const POST_GROUP_WINDOW_START = new Date(POST_GROUP_WINDOW_START_ISO);
export const POST_GROUP_DEADLINE = new Date(POST_GROUP_DEADLINE_ISO);

export const SLIME_GAME_URL = "https://slime-wk2026.netlify.app";

export const scoringRules = [
  { label: "Exacte uitslag", points: matchScoring.exact },
  { label: "Juiste winnaar of gelijkspel", points: matchScoring.outcome },
  { label: "Juiste doelsaldo", points: matchScoring.goalDifference },
  { label: "Per juist teamdoelpunt", points: matchScoring.teamGoal },
  { label: "Land goed in laatste 32", points: stageScoring.round32 },
  { label: "Land goed in achtste finale", points: stageScoring.round16 },
  { label: "Land goed in kwartfinale", points: stageScoring.quarterfinal },
  { label: "Land goed in halve finale", points: stageScoring.semifinal },
  { label: "Finalist goed", points: stageScoring.finalists },
  { label: "Wereldkampioen goed", points: stageScoring.champion },
  { label: "Topscorer goed", points: specialScoring.topScorer },
  { label: "Totaal aantal doelpunten exact", points: specialScoring.totalGoalsExact },
  { label: "Bonusstatistiek exact", points: specialScoring.exactStat },
];

export const stageLabels: Record<string, string> = {
  round32: "Laatste 32",
  round16: "Achtste finale",
  quarterfinal: "Kwartfinale",
  semifinal: "Halve finale",
  finalists: "Finale",
  champion: "Kampioen",
};

export const groupLetters = "ABCDEFGHIJKL".split("");

export const hostCities = [
  "Atlanta",
  "Boston",
  "Dallas",
  "Guadalajara",
  "Houston",
  "Kansas City",
  "Los Angeles",
  "Mexico City",
  "Miami",
  "Monterrey",
  "New York New Jersey",
  "Philadelphia",
  "San Francisco Bay Area",
  "Seattle",
  "Toronto",
  "Vancouver",
];
