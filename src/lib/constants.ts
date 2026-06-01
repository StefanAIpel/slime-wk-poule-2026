export const ENTRY_DEADLINE_ISO = "2026-06-11T21:00:00+02:00";
export const POST_GROUP_WINDOW_START_ISO = "2026-06-28T00:00:00+02:00";
export const POST_GROUP_DEADLINE_ISO = "2026-06-28T21:00:00+02:00";

export const ENTRY_DEADLINE = new Date(ENTRY_DEADLINE_ISO);
export const POST_GROUP_WINDOW_START = new Date(POST_GROUP_WINDOW_START_ISO);
export const POST_GROUP_DEADLINE = new Date(POST_GROUP_DEADLINE_ISO);

export const SLIME_GAME_URL = "https://slime-wk2026.netlify.app";

export const scoringRules = [
  { label: "Exacte uitslag", points: 12 },
  { label: "Juiste winnaar of gelijkspel", points: 5 },
  { label: "Juiste doelsaldo", points: 2 },
  { label: "Per juist teamdoelpunt", points: 1 },
  { label: "Land goed in volgende ronde", points: 8 },
  { label: "Land goed in achtste finale", points: 10 },
  { label: "Land goed in kwartfinale", points: 14 },
  { label: "Land goed in halve finale", points: 18 },
  { label: "Finalist goed", points: 24 },
  { label: "Wereldkampioen goed", points: 35 },
  { label: "Topscorer goed", points: 20 },
  { label: "Totaal aantal doelpunten dichtbij", points: 10 },
  { label: "Ironische statistiek goed", points: 8 },
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
