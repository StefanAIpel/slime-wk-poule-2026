import type { Metadata } from "next";
import { HomeContent } from "@/app/page";
import { SITE_URL } from "@/lib/constants";

const appIcon = "/icons/slimescore-app-icon-v4-512.png";

export const metadata: Metadata = {
  title: "SlimeScore · Free World Cup 2026 pool",
  description: "Free World Cup 2026 prediction pool. Fill in your predictions once, create a pool with friends and family, and see who wins.",
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      nl: SITE_URL,
      en: `${SITE_URL}/en`,
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
