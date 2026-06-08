import type { Metadata } from "next";
import { LiveSubsiteNav } from "@/components/live-subsite-nav";
import { SlimeSoccerBanner } from "@/components/slime-soccer-banner";
import { APP_VERSION, LIVE_URL, SITE_URL } from "@/lib/constants";
import { getServerLocale } from "@/lib/server-locale";

export const metadata: Metadata = {
  metadataBase: new URL(LIVE_URL),
  title: "WK 2026 live — uitslagen, stand & speelschema | SlimeScore",
  description:
    "Volg het WK 2026 live: tussenstanden, uitslagen, opstellingen, statistieken en het volledige speelschema. Gratis en zonder gedoe.",
  keywords: [
    "WK 2026 live",
    "WK 2026 uitslagen",
    "WK 2026 live scores",
    "WK 2026 stand",
    "WK 2026 speelschema",
    "World Cup 2026 live",
    "World Cup 2026 scores",
    "live voetbal WK",
    "WK 2026 wedstrijden",
  ],
  alternates: { canonical: LIVE_URL },
  manifest: "/live.webmanifest",
  icons: {
    icon: [
      { url: "/icons/slimescore-live-app-icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/slimescore-live-app-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/slimescore-live-apple-touch-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: LIVE_URL,
    siteName: "SlimeScore",
    title: "WK 2026 live — uitslagen, stand & speelschema",
    description: "Volg het WK 2026 live: uitslagen, stand, opstellingen en het volledige speelschema.",
  },
};

const footerCopy = {
  nl: {
    poolTitle: "Samen spelen: maak je WK-poule",
    poolIntro: "Voorspel het hele WK met vrienden, familie of collega's. Gratis, in tien minuten.",
    poolCta: "Start je WK-poule",
    more: "Ook leuk",
  },
  en: {
    poolTitle: "Play together: create your World Cup pool",
    poolIntro: "Predict the whole World Cup with friends, family or colleagues. Free, in ten minutes.",
    poolCta: "Start your World Cup pool",
    more: "Also fun",
  },
} as const;

export default async function LiveLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();
  const f = footerCopy[locale];
  return (
    <div className="live-subsite">
      <LiveSubsiteNav />
      <main className="page-shell live-subsite-main">{children}</main>
      <footer className="live-subsite-footer">
        <div className="live-footer-grid">
          <a href={SITE_URL} className="live-pool-banner" aria-label={f.poolTitle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/slimes/slimescore-wk2026-friend-poule-banner.webp" alt={f.poolTitle} loading="lazy" />
          </a>
          <div className="live-footer-side">
            <p className="live-footer-side-title">{f.more}</p>
            <SlimeSoccerBanner includeWk={false} includeVolley locale={locale} />
          </div>
        </div>
        <p className="live-footer-version">SlimeScore · {locale === "en" ? "beta" : "bèta"} {APP_VERSION}</p>
      </footer>
    </div>
  );
}
