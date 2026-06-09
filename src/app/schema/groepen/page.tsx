import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { ShareButton } from "@/components/share-button";
import { SITE_URL } from "@/lib/constants";
import { getScheduleMatches } from "@/lib/schedule-data";
import { getServerLocale } from "@/lib/server-locale";

const copy = {
  nl: {
    shareText: "Alle WK-wedstrijden op een rij met datum, tijd en stadion. Deel het schema gerust in je groepsapp.",
    metaTitle: "WK 2026 groepen — wedstrijden en groepsstanden",
    description: "Alle WK 2026 groepswedstrijden, per groep of per datum, met de groepsstanden erbij. Zoek op Nederland - Oranje, groep, land of datum.",
    title: "Groepen",
    subtitle: "Alle groepswedstrijden per groep met de stand erbij, of overzichtelijk per speeldag.",
    shareTitle: "WK 2026 speelschema",
    shareLabel: "Deel schema",
  },
  en: {
    shareText: "All WC matches in one place with date, time and stadium. Feel free to share the schedule in your group chat.",
    metaTitle: "WC 2026 groups — matches and standings",
    description: "All WC 2026 group matches, by group or date, with standings included. Filter by the Netherlands, group, country or date.",
    title: "Groups",
    subtitle: "All group matches per group with standings included, or neatly grouped by matchday.",
    shareTitle: "WC 2026 schedule",
    shareLabel: "Share schedule",
  },
} as const;

const scheduleShareUrl = `${SITE_URL}/schema`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title: copy[locale].metaTitle,
    description: copy[locale].description,
    alternates: { canonical: "/schema/groepen" },
  };
}

export const revalidate = 3600;

export default async function ScheduleGroupsPage() {
  const locale = await getServerLocale();
  const scheduleMatches = await getScheduleMatches();

  return (
    <main className="page-shell">
      <header className="mb-5 grid gap-4">
        <Brand locale={locale} />
        <PageHero
          title={copy[locale].title}
          subtitle={copy[locale].subtitle}
          slime="/assets/hd-schema-orange-transparent-640.webp"
          mascotClassName="hero-mascot-field hero-mascot-schema"
        >
          <ShareButton url={scheduleShareUrl} text={copy[locale].shareText} title={copy[locale].shareTitle} label={copy[locale].shareLabel} locale={locale} />
        </PageHero>
      </header>

      <ScheduleExplorer matches={scheduleMatches} initialView="groups" locale={locale} />

      <BottomNav current="/schema" className="bottom-nav-hide-mobile" />
    </main>
  );
}
