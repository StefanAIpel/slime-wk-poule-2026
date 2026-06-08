// Pure regels rond invullen/scoren — bewust zonder imports, zodat dit zowel in
// de Next-build als in de losse testrunner (node --experimental-strip-types) werkt.

/** Elke wedstrijd sluit voor voorspellen dit aantal minuten vóór de aftrap. */
export const MATCH_LOCK_MINUTES = 30;

/** Het moment waarop een wedstrijd voor voorspellen sluit (aftrap − MATCH_LOCK_MINUTES). */
export function matchLockTime(startsAt: string | Date): Date {
  const start = startsAt instanceof Date ? startsAt : new Date(startsAt);
  return new Date(start.getTime() - MATCH_LOCK_MINUTES * 60_000);
}

/** True als een wedstrijd niet meer voorspeld/gewijzigd mag worden (binnen 30 min vóór aftrap of al begonnen). */
export function isMatchLocked(startsAt: string | Date | null | undefined, now: Date = new Date()): boolean {
  if (!startsAt) return false;
  return now.getTime() >= matchLockTime(startsAt).getTime();
}

/** Oranje: wedstrijden van dit land leveren dubbele wedstrijdpunten op. */
export const NL_TEAM_CODE = "NED";
export const NL_POINTS_MULTIPLIER = 2;
export function isNlMatch(homeCode?: string | null, awayCode?: string | null): boolean {
  return homeCode === NL_TEAM_CODE || awayCode === NL_TEAM_CODE;
}
