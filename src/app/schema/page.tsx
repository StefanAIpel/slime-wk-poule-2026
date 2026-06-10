import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { SchemaHeroActions } from "@/components/schema-hero-actions";
import { LIVE_URL, SITE_URL } from "@/lib/constants";
import { getScheduleMatches } from "@/lib/schedule-data";
import { getServerLocale } from "@/lib/server-locale";

const scheduleCopy = {
  nl: {
    intro: "Alle WK-wedstrijden op een rij met datum, tijd en stadion. Deel het schema gerust in je groepsapp.",
    title: "Speelschema",
    metaTitle: "WK 2026 speelschema — groepen en knock-out",
    shareTitle: "WK 2026 speelschema",
    shareLabel: "Deel schema",
    liveLabel: "Volg live",
  },
  en: {
    intro: "All WC matches in one place with date, time and stadium. Feel free to share the schedule in your group chat.",
    title: "Schedule",
    metaTitle: "WC 2026 schedule — groups and knockout",
    shareTitle: "WC 2026 schedule",
    shareLabel: "Share schedule",
    liveLabel: "Follow live",
  },
} as const;

const scheduleShareUrl = `${SITE_URL}/schema`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const copy = scheduleCopy[locale];
  return {
    title: copy.metaTitle,
    description: copy.intro,
    alternates: { canonical: "/schema" },
  };
}

export const revalidate = 3600;

export default async function SchedulePage() {
  const locale = await getServerLocale();
  const scheduleMatches = await getScheduleMatches();
  const scheduleIntro = scheduleCopy[locale].intro;
  const scheduleTitle = locale === "en" ? "WC 2026 schedule" : "WK 2026 speelschema";

  return (
    <main className="page-shell">
      <header className="mb-5 grid gap-4">
        <Brand locale={locale} />
        <PageHero
          title={locale === "en" ? "Schedule" : "Speelschema"}
          subtitle={scheduleIntro}
          slime="/assets/hd-schema-orange-transparent-640.webp"
          mascotClassName="hero-mascot-field hero-mascot-schema"
        >
          <SchemaHeroActions
            liveUrl={LIVE_URL}
            shareUrl={scheduleShareUrl}
            shareText={scheduleIntro}
            shareTitle={scheduleTitle}
            liveLabel={scheduleCopy[locale].liveLabel}
            shareLabel={scheduleCopy[locale].shareLabel}
            locale={locale}
          />
        </PageHero>
      </header>

      <ScheduleExplorer matches={scheduleMatches} initialView="groups" locale={locale} />

      <BottomNav current="/schema" className="bottom-nav-hide-mobile" />
    </main>
  );
}
