"use client";

import { useEffect, useState } from "react";
import { LIVE_URL } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

type LiveMatch = { id: number; home: string; away: string; homeScore: number; awayScore: number; minute: number | null };
type NextMatch = { home: string; away: string; kickoff: string };
type LiveNow = { matches: LiveMatch[]; next: NextMatch | null };

/** Aftrap compact in NL-tijd: vandaag "04:00", anders "12-6 04:00". */
function formatKickoff(iso: string, locale: Locale) {
  const date = new Date(iso);
  const intlLocale = locale === "en" ? "en-GB" : "nl-NL";
  const dayKey = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const time = new Intl.DateTimeFormat(intlLocale, { timeZone: "Europe/Amsterdam", hour: "2-digit", minute: "2-digit" }).format(date);
  if (dayKey(date) === dayKey(new Date())) return time;
  const day = new Intl.DateTimeFormat(intlLocale, { timeZone: "Europe/Amsterdam", day: "numeric", month: "numeric" }).format(date);
  return `${day} ${time}`;
}

/**
 * Markering in het hoofdmenu. Is er nú een WK-wedstrijd bezig, dan een
 * knipperende rode LIVE-pill met de stand (MEX 2-0 RSA). Anders een ingetogen
 * chip met de eerstvolgende aftrap. Beide openen live.slimescore.com in een
 * nieuw tabblad. Data via /api/live-now (elke 60s, slaat verborgen tabs over).
 */
export function LiveNowBadge({ locale }: { locale: Locale }) {
  const [data, setData] = useState<LiveNow>({ matches: [], next: null });

  useEffect(() => {
    let mounted = true;

    async function refresh() {
      if (document.hidden) return;
      try {
        const response = await fetch("/api/live-now", { cache: "no-store" });
        const json = (await response.json()) as Partial<LiveNow>;
        if (mounted) setData({ matches: Array.isArray(json.matches) ? json.matches : [], next: json.next ?? null });
      } catch {
        // Tijdelijke netwerkfout: laat de huidige status staan.
      }
    }

    void refresh();
    const id = window.setInterval(refresh, 60000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  const liveAria = locale === "en" ? "A World Cup match is live — open live.slimescore.com in a new tab" : "Er is een WK-wedstrijd bezig — open live.slimescore.com in een nieuw tabblad";
  const nextAria = locale === "en" ? "Next World Cup match — open live.slimescore.com in a new tab" : "Volgende WK-wedstrijd — open live.slimescore.com in een nieuw tabblad";

  if (data.matches.length > 0) {
    const first = data.matches[0];
    const extra = data.matches.length - 1;
    return (
      <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" className="site-header-live-badge" aria-label={liveAria}>
        <span className="site-header-live-label">Live</span>
        <span className="site-header-live-match">
          {first.home} {first.homeScore}-{first.awayScore} {first.away}
        </span>
        {extra > 0 ? <span className="site-header-live-more">+{extra}</span> : null}
      </a>
    );
  }

  if (data.next) {
    return (
      <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" className="site-header-next-badge" aria-label={nextAria}>
        <span className="site-header-next-label">{locale === "en" ? "Next" : "Volgende"}</span>
        <span className="site-header-next-match">{data.next.home} – {data.next.away}</span>
        <span className="site-header-next-time">{formatKickoff(data.next.kickoff, locale)}</span>
      </a>
    );
  }

  return null;
}
