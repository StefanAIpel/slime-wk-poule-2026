import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { getScheduleMatches } from "@/lib/schedule-data";

export const metadata: Metadata = {
  title: "WK 2026 knock-out — route naar de finale",
  description: "De WK 2026 knock-out rondes met compacte subtabs voor 1/16, 1/8, 1/4, halve finales en finale.",
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
          subtitle="Aparte knock-outpagina met subtabs per ronde en korte slotlabels zoals winnaar X en 2e Y."
          slime="/assets/hd-schema-orange-transparent-640.webp"
          mascotClassName="hero-mascot-field hero-mascot-schema"
        />
      </header>

      <ScheduleExplorer matches={scheduleMatches} initialView="knockout" />

      <BottomNav current="/schema" className="bottom-nav-hide-mobile" />
    </main>
  );
}
