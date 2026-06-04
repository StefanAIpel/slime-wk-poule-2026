import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { getScheduleMatches } from "@/lib/schedule-data";

export const metadata: Metadata = {
  title: "WK 2026 knock-out — route naar de finale",
  description: "Alle knock-outwedstrijden van het WK 2026, van de laatste 32 tot en met de finale, met datum, tijd en stadion.",
  alternates: { canonical: "/schema/knockout" },
};

export const revalidate = 3600;

export default async function ScheduleKnockoutPage() {
  const scheduleMatches = await getScheduleMatches();

  return (
    <main className="page-shell">
      <header className="mb-5 grid gap-4">
        <Brand />
        <PageHero
          title="Knock-out"
          subtitle="De hele knock-outfase per ronde, van de laatste 32 tot de finale, met datum, tijd en stadion."
          slime="/assets/hd-schema-orange-transparent-640.webp"
          mascotClassName="hero-mascot-field hero-mascot-schema"
        />
      </header>

      <ScheduleExplorer matches={scheduleMatches} initialView="knockout" />

      <BottomNav current="/schema" className="bottom-nav-hide-mobile" />
    </main>
  );
}
