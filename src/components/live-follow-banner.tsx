/* eslint-disable @next/next/no-img-element */

import { LIVE_URL } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

const copy = {
  nl: {
    kicker: "WK 2026 live",
    title: "Volg live",
    text: "Volg elke WK 2026-wedstrijd live — tussenstanden, opstellingen en statistieken, plus het volledige speelschema.",
    alt: "Volg het WK live op SlimeScore",
  },
  en: {
    kicker: "World Cup 2026 live",
    title: "Follow live",
    text: "Standings, results and fixtures in one place.",
    alt: "Follow the World Cup live on SlimeScore",
  },
} satisfies Record<Locale, { kicker: string; title: string; text: string; alt: string }>;

export function LiveFollowBanner({ locale = "nl" }: { locale?: Locale }) {
  const t = copy[locale];

  return (
    <a href={LIVE_URL} className="live-follow-banner" aria-label={t.alt} target="_blank" rel="noopener noreferrer">
      <span className="live-follow-banner-copy">
        <span className="live-follow-banner-kicker">{t.kicker}</span>
        <span className="live-follow-banner-title">{t.title}</span>
        <span className="live-follow-banner-text">{t.text}</span>
      </span>
      <img
        src="/slimes/uploads/zip-2026-06-03/blije_mascotte_met_wk_bal_FINAL_v5.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
    </a>
  );
}
