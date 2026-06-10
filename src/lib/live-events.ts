import type { MatchEvent } from "@/lib/apifootball-live";

type EventMinute = Pick<MatchEvent, "time" | "comments">;

function hasExplicitExtraTimeMarker(comments?: string | null) {
  return /\b(extra time|aet|after extra time|verl(enging|\.)?)\b/i.test(comments ?? "");
}

/**
 * API-Football usually exposes stoppage as `elapsed=90, extra=6`.
 * Some feeds flatten late regular-time events to elapsed=96 with no `extra`;
 * for the live timeline we still want football notation: 90+6'.
 */
export function formatEventMinute(event: EventMinute) {
  const elapsed = event.time.elapsed ?? 0;
  const extra = event.time.extra;

  if (typeof extra === "number" && extra > 0) return `${elapsed}+${extra}'`;

  // Some providers put the 90+6 notation in comments instead of time.extra; preserve it if present.
  const commentMinute = event.comments?.match(/\b(45|90)\s*\+\s*(\d{1,2})\b/);
  if (commentMinute) return `${commentMinute[1]}+${commentMinute[2]}'`;

  // Fallback for feeds that only send the absolute regular-time minute.
  // Do not rewrite if the event explicitly belongs to extra time/overtime.
  if (!hasExplicitExtraTimeMarker(event.comments)) {
    if (elapsed > 45 && elapsed < 60) return `45+${elapsed - 45}'`;
    if (elapsed > 90 && elapsed < 100) return `90+${elapsed - 90}'`;
  }

  return `${elapsed}'`;
}
