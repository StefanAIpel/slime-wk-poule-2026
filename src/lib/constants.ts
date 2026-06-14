import { matchScoring, specialScoring, stageScoring } from "@/lib/scoring";
export {
  MATCH_LOCK_MINUTES,
  matchLockTime,
  isMatchLocked,
  NL_TEAM_CODE,
  NL_POINTS_MULTIPLIER,
  isNlMatch,
} from "@/lib/entry-rules";

export const ENTRY_DEADLINE_ISO = "2026-06-11T21:00:00+02:00";
export const ENTRY_GRACE_DEADLINE_ISO = "2026-06-14T21:00:00+02:00";
export const POST_GROUP_WINDOW_START_ISO = "2026-06-28T00:00:00+02:00";
export const POST_GROUP_DEADLINE_ISO = "2026-06-28T21:00:00+02:00";

export const ENTRY_DEADLINE = new Date(ENTRY_DEADLINE_ISO);
export const ENTRY_GRACE_DEADLINE = new Date(ENTRY_GRACE_DEADLINE_ISO);
export const POST_GROUP_WINDOW_START = new Date(POST_GROUP_WINDOW_START_ISO);
export const POST_GROUP_DEADLINE = new Date(POST_GROUP_DEADLINE_ISO);

export const SLIME_GAME_URL = "https://soccer.slimescore.com";
/** Volley-variant van de arcade-game (bevestig/again de juiste URL). */
export const SLIME_VOLLEY_URL = "https://volley.slimescore.com";

/** Officieel domein. Gebruikt voor metadata, manifest en deel-links. */
export const SITE_URL = "https://slimescore.com";
/** Alternatief domein (PWA), wijst naar dezelfde app. */
export const SITE_URL_APP = "https://slimescore.app";
/** Live-subsite (uitslagen + schema), zelfde app via host-rewrite. */
export const LIVE_URL = "https://live.slimescore.com";
export const SITE_NAME = "SlimeScore";

/** Afzender van de inlog-/systeemmails (Cloudflare Email Routing → Resend). */
export const MAIL_FROM = "noreply@slimesports.com";
/** Contactadres voor vragen, privacy en account-verzoeken. */
export const CONTACT_EMAIL = "contact@slimescore.com";
/** Bèta-versie, handmatig ophogen bij releases. */
export const APP_VERSION = "0.85";
/** Maker. */
export const COMPANY_NAME = "Feliro";
export const COMPANY_URL = "https://feliro.nl";

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
  { label: "Team met meeste goals", points: specialScoring.teamMostGoals, note: "Exact het juiste land" },
  { label: "Hoe ver komt Oranje", points: specialScoring.oranjeExact, note: "Dichtbij levert minder op" },
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

/** Tijdzone per speelstad (WK 2026), voor het tonen van het tijdverschil met NL. */
export const cityTimeZone: Record<string, string> = {
  Atlanta: "America/New_York",
  Boston: "America/New_York",
  Dallas: "America/Chicago",
  Guadalajara: "America/Mexico_City",
  Houston: "America/Chicago",
  "Kansas City": "America/Chicago",
  "Los Angeles": "America/Los_Angeles",
  "Mexico City": "America/Mexico_City",
  Miami: "America/New_York",
  Monterrey: "America/Monterrey",
  "New York New Jersey": "America/New_York",
  Philadelphia: "America/New_York",
  "San Francisco Bay Area": "America/Los_Angeles",
  Seattle: "America/Los_Angeles",
  Toronto: "America/Toronto",
  Vancouver: "America/Vancouver",
};

/** Stadion per speelstad (WK 2026). Gebruikt om naast de stad het stadion te tonen. */
export const stadiumByCity: Record<string, string> = {
  Atlanta: "Mercedes-Benz Stadium",
  Boston: "Gillette Stadium",
  Dallas: "AT&T Stadium",
  Guadalajara: "Estadio Akron",
  Houston: "NRG Stadium",
  "Kansas City": "Arrowhead Stadium",
  "Los Angeles": "SoFi Stadium",
  "Mexico City": "Estadio Azteca",
  Miami: "Hard Rock Stadium",
  Monterrey: "Estadio BBVA",
  "New York New Jersey": "MetLife Stadium",
  Philadelphia: "Lincoln Financial Field",
  "San Francisco Bay Area": "Levi's Stadium",
  Seattle: "Lumen Field",
  Toronto: "BMO Field",
  Vancouver: "BC Place",
};
