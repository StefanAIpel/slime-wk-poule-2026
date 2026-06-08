import { ScheduleExplorer } from "@/components/schedule-explorer";
import { getScheduleMatches } from "@/lib/schedule-data";
import { getServerLocale } from "@/lib/server-locale";

export const revalidate = 3600;

export default async function LiveSchemaKnockoutPage() {
  const locale = await getServerLocale();
  const matches = await getScheduleMatches();
  return (
    <div className="grid gap-4">
      <div className="live-schema-head">
        <h1 className="text-2xl font-black text-[#081634]">{locale === "en" ? "Schedule" : "Speelschema"}</h1>
        <a href="/live" className="live-badge-btn">
          <span className="live-badge-dot" aria-hidden="true" />
          LIVE
        </a>
      </div>
      <ScheduleExplorer matches={matches} initialView="knockout" locale={locale} />
    </div>
  );
}
