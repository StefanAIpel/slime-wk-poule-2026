"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

/** Resterende tijd als "2d 20h" (of "20h 5m" / "5m") tot de gegeven deadline. */
function formatRemaining(deadlineIso: string, now: number, closedLabel: string) {
  const diff = new Date(deadlineIso).getTime() - now;
  if (diff <= 0) return closedLabel;
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Aftelklok tot de respijt-deadline (zondag 14 juni 21:00). Toont "2d 20h".
 * Werkt elke 30s bij; suppressHydrationWarning omdat server- en clienttijd
 * minimaal kunnen verschillen op een minuutgrens.
 */
export function GraceCountdown({ deadlineIso, label, closedLabel }: { deadlineIso: string; label: string; closedLabel: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  const text = formatRemaining(deadlineIso, now, closedLabel);
  return (
    <span className="grace-countdown" aria-label={`${label}: ${text}`}>
      <Clock aria-hidden="true" className="size-3.5" />
      <span className="grace-countdown-label">{label}</span>
      <span className="grace-countdown-value" suppressHydrationWarning>{text}</span>
    </span>
  );
}
