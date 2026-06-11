/**
 * Pure tijdvenster-logica voor de live-subsite (geen server-only/Supabase, dus
 * los te unit-testen). Een wedstrijd promoveert naar "Nu bezig" vanaf 30 minuten
 * vóór de aftrap; een vastgelopen "niet begonnen"-status blijft nog enkele uren
 * ná de geplande aftrap als bezig gelden.
 */

/** Hoe lang vóór de aftrap een wedstrijd al naar "Nu bezig" promoveert. */
export const KICKOFF_SOON_MS = 30 * 60 * 1000;
/** Tegen een vastgelopen NS-status: tot zoveel ná de geplande aftrap nog als "bezig" tonen. */
export const KICKOFF_GRACE_MS = 3 * 60 * 60 * 1000;

/** Staat de aftrap binnen 30 min (of is die net geweest terwijl de status nog "NS" is)? */
export function isKickoffSoon(statusShort: string, dateIso: string, now: number = Date.now()): boolean {
  if (statusShort !== "NS") return false;
  const diff = new Date(dateIso).getTime() - now;
  return diff <= KICKOFF_SOON_MS && diff >= -KICKOFF_GRACE_MS;
}

/**
 * Net afgelopen: blijft nog ±30 min in "Nu bezig" staan voordat hij naar
 * "Laatste uitslagen" verhuist. De eindtijd schatten we vanaf de aftrap:
 * een wedstrijd duurt ±2 uur, dus tot 2,5 uur na de aftrap geldt "net klaar".
 */
export const FINISHED_LINGER_MS = 150 * 60 * 1000;

const FINISHED_SHORTS = new Set(["FT", "AET", "PEN"]);

export function isJustFinished(statusShort: string, dateIso: string, now: number = Date.now()): boolean {
  if (!FINISHED_SHORTS.has(statusShort)) return false;
  const sinceKickoff = now - new Date(dateIso).getTime();
  return sinceKickoff >= 0 && sinceKickoff <= FINISHED_LINGER_MS;
}
