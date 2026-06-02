import { matchScoring, specialScoring, stageScoring } from "@/lib/scoring";

export const ENTRY_DEADLINE_ISO = "2026-06-11T21:00:00+02:00";
export const POST_GROUP_WINDOW_START_ISO = "2026-06-28T00:00:00+02:00";
export const POST_GROUP_DEADLINE_ISO = "2026-06-28T21:00:00+02:00";

export const ENTRY_DEADLINE = new Date(ENTRY_DEADLINE_ISO);
export const POST_GROUP_WINDOW_START = new Date(POST_GROUP_WINDOW_START_ISO);
export const POST_GROUP_DEADLINE = new Date(POST_GROUP_DEADLINE_ISO);

export const SLIME_GAME_URL = "https://slime-wk2026.netlify.app";

/** Officieel domein. Gebruikt voor metadata, manifest en deel-links. */
export const SITE_URL = "https://slimescore.nl";
export const SITE_NAME = "Slime Score";

export const scoringRules = [
  { label: "Exacte uitslag", points: matchScoring.exact, note: "Max per wedstrijd" },
  { label: "Juiste winnaar/gelijkspel", points: matchScoring.outcome, note: "Als het niet exact is" },
  { label: "Juiste doelsaldo", points: matchScoring.goalDifference, note: "Als het niet exact is" },
  { label: "Per juist teamdoelpunt", points: matchScoring.teamGoal, note: "Bijv. Nederland precies 2" },
  { label: "Land in laatste 32", points: stageScoring.round32, note: "Automatisch uit jouw groepsstand" },
  { label: "Land in achtste finale", points: stageScoring.round16, note: "Max 16 landen" },
  { label: "Land in kwartfinale", points: stageScoring.quarterfinal, note: "Max 8 landen" },
  { label: "Land in halve finale", points: stageScoring.semifinal, note: "Max 4 landen" },
  { label: "Finalist goed", points: stageScoring.finalists, note: "Max 2 landen" },
  { label: "Wereldkampioen goed", points: stageScoring.champion, note: "Grote inhaalbonus" },
  { label: "Topscorer goed", points: specialScoring.topScorer, note: "Gedeeld telt ook" },
  { label: "Totaal goals exact", points: specialScoring.totalGoalsExact, note: "Dichtbij levert minder op" },
  { label: "Bonusstat exact", points: specialScoring.exactStat, note: "Dichtbij levert minder op" },
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
