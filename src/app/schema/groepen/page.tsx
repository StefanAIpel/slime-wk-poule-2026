import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { ShareButton } from "@/components/share-button";
import { SITE_URL } from "@/lib/constants";
import { getScheduleMatches } from "@/lib/schedule-data";

const scheduleShareText =
  "Alle WK-wedstrijden op een rij met datum, tijd en stadion. Geen account nodig — deel het schema gerust in je groepsapp.";

const scheduleShareUrl = `${SITE_URL}/schema`;

export const metadata: Metadata = {
  title: "WK 2026 groepen — wedstrijden en groepsstanden",
  description: "Alle WK 2026 groepswedstrijden, per groep of per datum, met de groepsstanden erbij. Zoek op Nederland - Oranje, groep, land of datum.",
  alternates: { canonical: "/schema/groepen" },
};

export const revalidate = 3600;

export default async function ScheduleGroupsPage() {
  const scheduleMatches = await getScheduleMatches();

  return (
    <main className="page-shell">
      <header className="mb-5 grid gap-4">
        <Brand />
        <PageHero
          title="Groepen"
          subtitle="Alle groepswedstrijden per groep met de stand erbij, of overzichtelijk per speeldag."
          slime="/assets/hd-schema-orange-transparent-640.webp"
          mascotClassName="hero-mascot-field hero-mascot-schema"
        >
          <ShareButton url={scheduleShareUrl} text={scheduleShareText} title="WK 2026 speelschema" label="Deel schema" />
        </PageHero>
      </header>

      <ScheduleExplorer matches={scheduleMatches} initialView="groups" />

      <BottomNav current="/schema" className="bottom-nav-hide-mobile" />
    </main>
  );
}
