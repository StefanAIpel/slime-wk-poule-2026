import { CalendarDays, MapPin } from "lucide-react";
import { TeamFlag } from "@/components/team-flag";
import { formatAmsterdam, venueHourOffset, venueLabel, venueShortLabel } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

type Row = {
  id: number;
  starts_at: string | null;
  group_letter: string | null;
  venue: string | null;
  home_code: string | null;
  away_code: string | null;
  home: { name_nl: string | null } | null;
  away: { name_nl: string | null } | null;
};

/** Compact lijstje met de eerstvolgende wedstrijden — ook nuttig zonder login. */
export async function UpcomingMatches({ limit = 3 }: { limit?: number }) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("matches")
    .select(
      "id,starts_at,group_letter,venue,home_code,away_code,home:teams!matches_home_code_fkey(name_nl),away:teams!matches_away_code_fkey(name_nl)",
    )
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);

  const rows = (data ?? []) as unknown as Row[];
  if (!rows.length) return null;

  return (
    <div className="panel p-3">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-[var(--ink)]">
          <CalendarDays aria-hidden="true" className="size-5 text-[var(--blue)]" />
          Eerstvolgende WK-wedstrijden
        </h2>
        <a href="/schema" className="text-sm font-semibold text-[var(--blue)]">
          Hele schema
        </a>
      </div>
      <div className="divide-y divide-slate-200">
        {rows.map((m) => (
          <div key={m.id} className="flex items-stretch gap-3 py-2">
            <div className="flex items-center">
              <span className="match-group">{m.group_letter ?? "KO"}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="match-meta match-meta-compact">
                <span className="match-time">{formatAmsterdam(m.starts_at)}</span>
                {venueHourOffset(m.starts_at, m.venue) !== null ? (
                  <span className="match-time-offset" title="Tijdverschil met Nederland">
                    ({(() => { const o = venueHourOffset(m.starts_at, m.venue)!; return o === 0 ? "gelijk" : `${o > 0 ? "+" : "−"}${Math.abs(o)}u`; })()})
                  </span>
                ) : null}
                {m.venue ? (
                  <span className="match-location" title={venueLabel(m.venue)}>
                    <MapPin aria-hidden="true" className="size-3.5" />
                    <span className="sm:hidden">{venueShortLabel(m.venue)}</span>
                    <span className="hidden sm:inline">{venueLabel(m.venue)}</span>
                  </span>
                ) : null}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm sm:grid sm:gap-1">
                <div className="flex items-center gap-2">
                  <TeamFlag code={m.home_code} name={m.home?.name_nl} />
                  <span className="font-medium text-[var(--ink)]">
                    <span className="sm:hidden">{m.home_code ?? m.home?.name_nl}</span>
                    <span className="hidden sm:inline">{m.home?.name_nl ?? m.home_code}</span>
                  </span>
                </div>
                <span aria-hidden="true" className="text-sm font-semibold text-[#8a98ac] sm:hidden">
                  ·
                </span>
                <span className="sr-only">tegen</span>
                <div className="flex items-center gap-2">
                  <TeamFlag code={m.away_code} name={m.away?.name_nl} />
                  <span className="font-medium text-[var(--ink)]">
                    <span className="sm:hidden">{m.away_code ?? m.away?.name_nl}</span>
                    <span className="hidden sm:inline">{m.away?.name_nl ?? m.away_code}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
