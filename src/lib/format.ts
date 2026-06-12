import { cityTimeZone, stadiumByCity } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

function tzOffsetMinutes(date: Date, timeZone: string): number | null {
  try {
    const name =
      new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
        .formatToParts(date)
        .find((part) => part.type === "timeZoneName")?.value ?? "";
    const match = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!match) return 0;
    const sign = match[1] === "-" ? -1 : 1;
    return sign * (Number(match[2]) * 60 + (match[3] ? Number(match[3]) : 0));
  } catch {
    return null;
  }
}

/** Uurverschil van de speelstad t.o.v. Nederland (bijv. -6) op het moment van de wedstrijd. */
export function venueHourOffset(iso: string | null | undefined, city: string | null | undefined): number | null {
  if (!iso || !city) return null;
  const timeZone = cityTimeZone[city];
  if (!timeZone) return null;
  const date = new Date(iso);
  const venue = tzOffsetMinutes(date, timeZone);
  const nl = tzOffsetMinutes(date, "Europe/Amsterdam");
  if (venue === null || nl === null) return null;
  return Math.round((venue - nl) / 60);
}

export function formatAmsterdam(value: string | Date | null | undefined, locale = "nl-NL") {
  if (!value) return locale.startsWith("en") ? "TBC" : "Nog niet bekend";

  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Amsterdam",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function displayName(profile?: { nickname: string | null; team_name: string | null } | null) {
  const nickname = profile?.nickname?.trim();
  const teamName = profile?.team_name?.trim();
  if (nickname && teamName) return `${nickname} (${teamName})`;
  return nickname || teamName || "Speler";
}

/** "Stad · Stadion" als het stadion bekend is, anders alleen de stad. */
export function venueLabel(city: string | null | undefined) {
  if (!city) return "";
  const stadium = stadiumByCity[city];
  return stadium ? `${city} · ${stadium}` : city;
}

const shortVenueByCity: Record<string, string> = {
  "Mexico City": "Mexico",
  "Los Angeles": "LA",
  "New York New Jersey": "NY/NJ",
  "San Francisco Bay Area": "SF Bay",
  "Kansas City": "KC",
  Philadelphia: "Philly",
};

/** Korte stadnaam voor smalle wedstrijdregels op mobiel. */
export function venueShortLabel(city: string | null | undefined) {
  if (!city) return "";
  return shortVenueByCity[city] ?? city;
}

const englishTeamNameByCode: Record<string, string> = {
  MEX: "Mexico",
  RSA: "South Africa",
  KOR: "South Korea",
  CZE: "Czechia",
  CAN: "Canada",
  BIH: "Bosnia and Herzegovina",
  QAT: "Qatar",
  SUI: "Switzerland",
  BRA: "Brazil",
  MAR: "Morocco",
  HAI: "Haiti",
  SCO: "Scotland",
  USA: "United States",
  PAR: "Paraguay",
  AUS: "Australia",
  TUR: "Türkiye",
  GER: "Germany",
  CUW: "Curaçao",
  CIV: "Ivory Coast",
  ECU: "Ecuador",
  NED: "Netherlands",
  JPN: "Japan",
  SWE: "Sweden",
  TUN: "Tunisia",
  BEL: "Belgium",
  EGY: "Egypt",
  IRN: "Iran",
  NZL: "New Zealand",
  ESP: "Spain",
  CPV: "Cape Verde",
  KSA: "Saudi Arabia",
  URU: "Uruguay",
  FRA: "France",
  SEN: "Senegal",
  IRQ: "Iraq",
  NOR: "Norway",
  ARG: "Argentina",
  ALG: "Algeria",
  AUT: "Austria",
  JOR: "Jordan",
  POR: "Portugal",
  COD: "DR Congo",
  UZB: "Uzbekistan",
  COL: "Colombia",
  ENG: "England",
  CRO: "Croatia",
  GHA: "Ghana",
  PAN: "Panama",
};

const dutchTeamNameByCode: Record<string, string> = {
  MEX: "Mexico",
  RSA: "Zuid-Afrika",
  KOR: "Zuid-Korea",
  CZE: "Tsjechie",
  CAN: "Canada",
  BIH: "Bosnie en Herzegovina",
  QAT: "Qatar",
  SUI: "Zwitserland",
  BRA: "Brazilie",
  MAR: "Marokko",
  HAI: "Haiti",
  SCO: "Schotland",
  USA: "Verenigde Staten",
  PAR: "Paraguay",
  AUS: "Australie",
  TUR: "Turkije",
  GER: "Duitsland",
  CUW: "Curacao",
  CIV: "Ivoorkust",
  ECU: "Ecuador",
  NED: "Nederland",
  JPN: "Japan",
  SWE: "Zweden",
  TUN: "Tunesie",
  BEL: "Belgie",
  EGY: "Egypte",
  IRN: "Iran",
  NZL: "Nieuw-Zeeland",
  ESP: "Spanje",
  CPV: "Kaapverdie",
  KSA: "Saoedi-Arabie",
  URU: "Uruguay",
  FRA: "Frankrijk",
  SEN: "Senegal",
  IRQ: "Irak",
  NOR: "Noorwegen",
  ARG: "Argentinie",
  ALG: "Algerije",
  AUT: "Oostenrijk",
  JOR: "Jordanie",
  POR: "Portugal",
  COD: "Congo DR",
  UZB: "Oezbekistan",
  COL: "Colombia",
  ENG: "Engeland",
  CRO: "Kroatie",
  GHA: "Ghana",
  PAN: "Panama",
};

export function teamNameForLocale(code: string | null | undefined, fallback: string | null | undefined, locale: Locale = "nl") {
  if (locale === "en" && code) return englishTeamNameByCode[code.toUpperCase()] ?? fallback ?? code.toUpperCase();
  if (code) return dutchTeamNameByCode[code.toUpperCase()] ?? fallback ?? code.toUpperCase();
  return fallback ?? "";
}

export function teamAbbrev(code: string | null | undefined, label?: string | null) {
  if (code) return code.toUpperCase();
  const cleaned = (label ?? "TBD").replace(/[^\p{L}\p{N}]/gu, "").toUpperCase();
  return cleaned.slice(0, 3) || "TBD";
}

export function clampInt(value: FormDataEntryValue | null, fallback = 0, min = 0, max = 20) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}
