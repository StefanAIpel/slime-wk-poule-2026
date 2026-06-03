import { CalendarDays, MapPin } from "lucide-react";
import { TeamFlag } from "@/components/team-flag";
import { formatAmsterdam, venueLabel } from "@/lib/format";
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
          Eerstvolgende wedstrijden
        </h2>
        <a href="/schema" className="text-sm font-semibold text-[var(--blue)]">
          Hele schema
        </a>
      </div>
      <div className="divide-y divide-slate-200">
        {rows.map((m) => (
          <div key={m.id} className="py-2">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
              <span className="grid size-5 place-items-center rounded-full bg-[#e7eef8] text-[10px] font-bold text-[var(--blue-2)]">
                {m.group_letter ?? "KO"}
              </span>
              {formatAmsterdam(m.starts_at)}
              {m.venue ? (
                <span className="inline-flex items-center gap-1 text-[var(--muted)]">
                  <MapPin aria-hidden="true" className="size-3.5" />
                  <span className="sm:hidden">{m.venue}</span>
                  <span className="hidden sm:inline">{venueLabel(m.venue)}</span>
                </span>
              ) : null}
            </div>
            <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <TeamFlag code={m.home_code} name={m.home?.name_nl} />
                <span className="truncate font-medium text-[var(--ink)]">
                  <span className="sm:hidden">{m.home_code ?? m.home?.name_nl}</span>
                  <span className="hidden sm:inline">{m.home?.name_nl ?? m.home_code}</span>
                </span>
              </div>
              <span className="px-1 font-semibold text-[var(--muted)]">-</span>
              <div className="flex min-w-0 items-center justify-end gap-2 text-right">
                <span className="truncate font-medium text-[var(--ink)]">
                  <span className="sm:hidden">{m.away_code ?? m.away?.name_nl}</span>
                  <span className="hidden sm:inline">{m.away?.name_nl ?? m.away_code}</span>
                </span>
                <TeamFlag code={m.away_code} name={m.away?.name_nl} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
