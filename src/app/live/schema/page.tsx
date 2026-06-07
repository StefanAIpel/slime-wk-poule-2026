import { ScheduleExplorer } from "@/components/schedule-explorer";
import { getScheduleMatches } from "@/lib/schedule-data";
import { getServerLocale } from "@/lib/server-locale";

export const revalidate = 3600;

export default async function LiveSchemaPage() {
  const locale = await getServerLocale();
  const matches = await getScheduleMatches();
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-black text-[#081634]">Speelschema</h1>
      <ScheduleExplorer matches={matches} initialView="groups" locale={locale} />
    </div>
  );
}
