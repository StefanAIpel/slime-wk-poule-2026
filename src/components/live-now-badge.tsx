"use client";

import { useEffect, useState } from "react";
import { LIVE_URL } from "@/lib/constants";
import { teamNameForLocale } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

type LiveMatch = {
  id: number;
  home: string;
  away: string;
  homeCode?: string | null;
  awayCode?: string | null;
  homeName?: string | null;
  awayName?: string | null;
  homeScore: number;
  awayScore: number;
  minute: number | null;
};
type NextMatch = { id?: number; home: string; away: string; homeCode?: string | null; awayCode?: string | null; homeName?: string | null; awayName?: string | null; kickoff: string };
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

/** Link naar de specifieke wedstrijd op de live-subsite, of de live-homepage. */
function matchHref(id?: number) {
  return id ? `${LIVE_URL}/live/match/${id}` : LIVE_URL;
}

/**
 * Live-markering. `variant="chip"` (desktop-header) toont een compacte pill;
 * `variant="banner"` (mobiele home) een volle-breedte rode banner met de
 * voluit geschreven landen, die naar de specifieke wedstrijd linkt. Data via
 * /api/live-now (elke 60s, slaat verborgen tabs over).
 */
export function LiveNowBadge({ locale, variant = "chip" }: { locale: Locale; variant?: "chip" | "banner" }) {
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

  const liveAria = locale === "en" ? "A World Cup match is live — open the match on live.slimescore.com in a new tab" : "Er is een WK-wedstrijd bezig — open de wedstrijd op live.slimescore.com in een nieuw tabblad";
  const nextAria = locale === "en" ? "Follow the next World Cup match live — open live.slimescore.com in a new tab" : "Volg de volgende WK-wedstrijd live — open live.slimescore.com in een nieuw tabblad";
  const teamName = (code?: string | null, name?: string | null, fallback?: string) => teamNameForLocale(code ?? fallback ?? "", name ?? fallback ?? "", locale);

  const live = data.matches[0];
  const extra = data.matches.length - 1;

  if (variant === "banner") {
    if (live) {
      return (
        <a href={matchHref(live.id)} target="_blank" rel="noopener noreferrer" className="live-banner is-live" aria-label={liveAria}>
          <span className="live-banner-kicker"><span className="live-banner-dot" aria-hidden="true" />SlimeScore • Live</span>
          <span className="live-banner-match">
            {teamName(live.homeCode, live.homeName, live.home)} {live.homeScore} - {live.awayScore} {teamName(live.awayCode, live.awayName, live.away)}
          </span>
        </a>
      );
    }
    if (data.next) {
      return (
        <a href={matchHref(data.next.id)} target="_blank" rel="noopener noreferrer" className="live-banner is-next" aria-label={nextAria}>
          <span className="live-banner-kicker">SlimeScore • {locale === "en" ? "Up next" : "Volg live"}</span>
          <span className="live-banner-match">
            {teamName(data.next.homeCode, data.next.homeName, data.next.home)} – {teamName(data.next.awayCode, data.next.awayName, data.next.away)}
            <span className="live-banner-time"> · {formatKickoff(data.next.kickoff, locale)}</span>
          </span>
        </a>
      );
    }
    return null;
  }

  if (live) {
    return (
      <a href={matchHref(live.id)} target="_blank" rel="noopener noreferrer" className="site-header-live-badge" aria-label={liveAria}>
        <span className="site-header-live-label">Live</span>
        <span className="site-header-live-match">
          {live.home} {live.homeScore}-{live.awayScore} {live.away}
        </span>
        {extra > 0 ? <span className="site-header-live-more">+{extra}</span> : null}
      </a>
    );
  }

  if (data.next) {
    return (
      <a href={matchHref(data.next.id)} target="_blank" rel="noopener noreferrer" className="site-header-next-badge" aria-label={nextAria}>
        <span className="site-header-next-label">{locale === "en" ? "Follow live:" : "Volg live:"}</span>
        <span className="site-header-next-match">{teamName(data.next.homeCode, data.next.homeName, data.next.home)} – {teamName(data.next.awayCode, data.next.awayName, data.next.away)}</span>
        <span className="site-header-next-time">{formatKickoff(data.next.kickoff, locale)}</span>
      </a>
    );
  }

  return null;
}
