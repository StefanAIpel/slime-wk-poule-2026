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
    shareText: "Alle WK-wedstrijden op een rij met datum, tijd en stadion. Geen account nodig — deel het schema gerust in je groepsapp.",
    metaTitle: "WK 2026 knock-out — route naar de finale",
    description: "Alle knock-outwedstrijden van het WK 2026, van de laatste 32 tot en met de finale, met datum, tijd en stadion.",
    title: "Knock-out",
    subtitle: "De hele knock-outfase per ronde, van de laatste 32 tot de finale, met datum, tijd en stadion.",
    shareTitle: "WK 2026 speelschema",
    shareLabel: "Deel schema",
  },
  en: {
    shareText: "All WC matches in one place with date, time and stadium. No account needed — feel free to share the schedule in your group chat.",
    metaTitle: "WC 2026 knockout — road to the final",
    description: "All WC 2026 knockout matches, from the round of 32 through the final, with date, time and stadium.",
    title: "Knockout",
    subtitle: "The full knockout phase by round, from the round of 32 through the final, with date, time and stadium.",
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
    alternates: { canonical: "/schema/knockout" },
  };
}

export const revalidate = 3600;

export default async function ScheduleKnockoutPage() {
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

      <ScheduleExplorer matches={scheduleMatches} initialView="knockout" locale={locale} />

      <BottomNav current="/schema" className="bottom-nav-hide-mobile" />
    </main>
  );
}
