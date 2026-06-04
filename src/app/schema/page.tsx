import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { getScheduleMatches } from "@/lib/schedule-data";

export const metadata: Metadata = {
  title: "WK 2026 speelschema — alle wedstrijden met Nederlandse tijden",
  description:
    "Compleet WK 2026 speelschema: alle wedstrijden, groepsstanden en de knock-out route t/m de finale op 19 juli — met de aftrap omgerekend naar Nederlandse tijd. Filter op groep, team of datum.",
  alternates: { canonical: "/schema" },
};

export const revalidate = 3600;

export default async function SchedulePage() {
  const scheduleMatches = await getScheduleMatches();

  return (
    <main className="page-shell">
      <header className="mb-5 grid gap-4">
        <Brand />
        <PageHero
          title="Speelschema"
          subtitle="Alle WK-wedstrijden op een rij met datum, tijd en stadion. Geen account nodig — deel het schema gerust in je groepsapp."
          slime="/assets/hd-schema-orange-transparent-640.webp"
          mascotClassName="hero-mascot-field hero-mascot-schema"
        />
      </header>

      <ScheduleExplorer matches={scheduleMatches} initialView="matches" />

      <BottomNav current="/schema" className="bottom-nav-hide-mobile" />
    </main>
  );
}
