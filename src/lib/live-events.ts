import type { MatchEvent } from "@/lib/apifootball-live";

type EventMinute = Pick<MatchEvent, "time" | "comments" | "detail">;

function hasExplicitExtraTimeMarker(comments?: string | null) {
  return /\b(extra time|aet|after extra time|verl(enging|\.)?)\b/i.test(comments ?? "");
}

function extractStoppageExtra(event: EventMinute) {
  const commentMinute = event.comments?.match(/\b(45|90)\s*\+\s*(\d{1,2})\b/);
  if (commentMinute) return { base: Number(commentMinute[1]), extra: Number(commentMinute[2]) };

  // API-Football sometimes keeps the stoppage part as a trailing number in detail,
  // e.g. time.elapsed=90 + detail="Penalty 8" for 90+8'. Keep that number for
  // the minute display, while cleanApiDetail strips it from the human event label.
  const detailExtra = event.detail?.match(/\s(\d{1,2})$/);
  if (detailExtra) {
    const elapsed = event.time.elapsed ?? 0;
    if (elapsed === 45 || elapsed === 90) return { base: elapsed, extra: Number(detailExtra[1]) };
  }

  return null;
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

  const stoppage = extractStoppageExtra(event);
  if (stoppage) return `${stoppage.base}+${stoppage.extra}'`;

  // Fallback for feeds that only send the absolute regular-time minute.
  // Do not rewrite if the event explicitly belongs to extra time/overtime.
  if (!hasExplicitExtraTimeMarker(event.comments)) {
    if (elapsed > 45 && elapsed < 60) return `45+${elapsed - 45}'`;
    if (elapsed > 90 && elapsed < 100) return `90+${elapsed - 90}'`;
  }

  return `${elapsed}'`;
}

export type GoalLine = { minute: string; player: string; teamId: number; ownGoal: boolean; penalty: boolean };

/**
 * Doelpuntenmakers uit de eventlijst, voor onder de uitslag op de live-kaart.
 * Gemiste penalty's tellen niet; eigen goals en benutte penalty's krijgen een merkje.
 * Let op: bij een eigen goal telt API-Football het doelpunt bij het profiterende team.
 */
export function goalLines(events: MatchEvent[] | null | undefined): GoalLine[] {
  return (events ?? [])
    .filter((event) => event.type === "Goal" && event.detail !== "Missed Penalty" && event.player?.name)
    .map((event) => ({
      minute: formatEventMinute(event),
      player: event.player.name as string,
      teamId: event.team.id,
      ownGoal: event.detail === "Own Goal",
      penalty: event.detail === "Penalty",
    }));
}
