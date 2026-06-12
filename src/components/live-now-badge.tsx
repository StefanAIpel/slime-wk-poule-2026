"use client";

import { useEffect, useState } from "react";
import { LIVE_URL } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

/**
 * Knipperende LIVE-markering in het hoofdmenu, alleen zichtbaar als er nú een
 * WK-wedstrijd bezig is (via /api/live-now, elke 60s ververst). Klik opent
 * live.slimescore.com in een nieuw tabblad.
 */
export function LiveNowBadge({ locale }: { locale: Locale }) {
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function refresh() {
      if (document.hidden) return;
      try {
        const response = await fetch("/api/live-now", { cache: "no-store" });
        const data = (await response.json()) as { liveCount?: number };
        if (mounted) setLiveCount(data.liveCount ?? 0);
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

  if (liveCount < 1) return null;
  return (
    <a
      href={LIVE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="site-header-live-badge"
      aria-label={locale === "en" ? "A World Cup match is live — open live.slimescore.com in a new tab" : "Er is een WK-wedstrijd bezig — open live.slimescore.com in een nieuw tabblad"}
    >
      Live{liveCount > 1 ? ` · ${liveCount}` : ""}
    </a>
  );
}
