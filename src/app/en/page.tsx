import type { Metadata } from "next";
import { HomeContent } from "@/app/page";
import { SITE_URL } from "@/lib/constants";

const appIcon = "/icons/slimescore-app-icon-v4-512.png";

export const metadata: Metadata = {
  title: "SlimeScore · Free World Cup 2026 pool",
  description: "Free World Cup 2026 prediction pool for international football fans. Fill in predictions once, create a pool with friends, family or colleagues, and follow live rankings.",
  keywords: [
    "World Cup 2026 pool",
    "free World Cup pool",
    "World Cup prediction game",
    "FIFA World Cup 2026 predictions",
    "football pool",
    "soccer pool",
    "office football pool",
    "World Cup sweepstake",
    "USA Canada Mexico 2026",
    "Netherlands World Cup pool",
    "Belgium World Cup pool",
    "SlimeScore",
  ],
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      nl: SITE_URL,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    locale: "en_GB",
    url: `${SITE_URL}/en`,
    title: "SlimeScore · Free World Cup 2026 pool",
    description: "Create a free World Cup 2026 pool for friends, family or colleagues.",
    images: [{ url: appIcon, width: 512, height: 512, alt: "SlimeScore app icon" }],
  },
  twitter: {
    card: "summary",
    title: "SlimeScore · Free World Cup 2026 pool",
    description: "Create a free World Cup 2026 pool for friends, family or colleagues.",
    images: [appIcon],
  },
};

export default async function EnglishHome({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string; login?: string; profiel?: string; reset?: string }>;
}) {
  return <HomeContent searchParams={searchParams} locale="en" />;
}
