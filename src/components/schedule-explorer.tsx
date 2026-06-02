"use client";

import { CalendarDays, MapPin, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { TeamFlag } from "@/components/team-flag";
import { formatAmsterdam } from "@/lib/format";

export type ScheduleMatch = {
  id: number;
  group: string | null;
  homeCode: string | null;
  homeName: string | null;
  awayCode: string | null;
  awayName: string | null;
  startsAt: string | null;
  venue: string | null;
};

function dateKey(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(iso),
  );
}

function dateLabel(iso: string | null) {
  if (!iso) return "Datum volgt";
  return new Intl.DateTimeFormat("nl-NL", { timeZone: "Europe/Amsterdam", weekday: "short", day: "numeric", month: "short" }).format(
    new Date(iso),
  );
}

export function ScheduleExplorer({ matches }: { matches: ScheduleMatch[] }) {
  const [group, setGroup] = useState("all");
  const [team, setTeam] = useState("all");
  const [date, setDate] = useState("all");

  const groups = useMemo(
    () => Array.from(new Set(matches.map((m) => m.group).filter(Boolean) as string[])).sort(),
    [matches],
  );
  const hasKnockout = useMemo(() => matches.some((m) => !m.group), [matches]);
  const teams = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of matches) {
      if (m.homeCode) map.set(m.homeCode, m.homeName ?? m.homeCode);
      if (m.awayCode) map.set(m.awayCode, m.awayName ?? m.awayCode);
    }
    return Array.from(map.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);
  const dates = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of matches) {
      const key = dateKey(m.startsAt);
      if (key && !map.has(key)) map.set(key, m.startsAt as string);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, iso]) => ({ key, label: dateLabel(iso) }));
  }, [matches]);

  const filtered = useMemo(() => {
    return matches
      .filter((m) => (group === "all" ? true : group === "ko" ? !m.group : m.group === group))
      .filter((m) => team === "all" || m.homeCode === team || m.awayCode === team)
      .filter((m) => date === "all" || dateKey(m.startsAt) === date)
      .sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? "") || a.id - b.id);
  }, [matches, group, team, date]);

  const hasFilter = group !== "all" || team !== "all" || date !== "all";

  return (
    <section className="grid gap-3">
      <div className="panel grid gap-2 p-3 sm:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          Groep
          <select className="field" value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">Alle groepen</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                Groep {g}
              </option>
            ))}
            {hasKnockout ? <option value="ko">Knock-out</option> : null}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          Team
          <select className="field" value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="all">Alle teams</option>
            {teams.map((t) => (
              <option key={t.code} value={t.code}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          Datum
          <select className="field" value={date} onChange={(e) => setDate(e.target.value)}>
            <option value="all">Alle datums</option>
            {dates.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center justify-between gap-3 sm:col-span-3">
          <span className="text-sm font-semibold text-[var(--muted)]">{filtered.length} wedstrijden</span>
          {hasFilter ? (
            <button
              type="button"
              className="button-secondary min-h-9 px-3 text-sm"
              onClick={() => {
                setGroup("all");
                setTeam("all");
                setDate("all");
              }}
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Wis filters
            </button>
          ) : null}
        </div>
      </div>

      <div className="panel divide-y divide-slate-200">
        {filtered.length ? (
          filtered.map((match) => <MatchRow key={match.id} match={match} />)
        ) : (
          <p className="p-4 text-sm font-medium text-[var(--muted)]">Geen wedstrijden voor deze filters.</p>
        )}
      </div>
    </section>
  );
}

function MatchRow({ match }: { match: ScheduleMatch }) {
  return (
    <div className="px-3 py-2.5">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
        <span className="grid size-5 place-items-center rounded-full bg-[#e7eef8] text-[10px] font-extrabold text-[var(--blue-2)]">
          {match.group ?? "KO"}
        </span>
        <CalendarDays aria-hidden="true" className="size-3.5" />
        {formatAmsterdam(match.startsAt)}
        {match.venue ? (
          <span className="hidden items-center gap-1 sm:inline-flex">
            <MapPin aria-hidden="true" className="size-3.5" />
            {match.venue}
          </span>
        ) : null}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <TeamFlag code={match.homeCode} name={match.homeName} />
          <span className="truncate text-sm font-semibold text-[var(--ink)] sm:text-base">
            {match.homeName ?? match.homeCode}
          </span>
        </div>
        <span className="px-1 text-sm font-bold text-[var(--muted)]">-</span>
        <div className="flex min-w-0 items-center justify-end gap-2 text-right">
          <span className="truncate text-sm font-semibold text-[var(--ink)] sm:text-base">
            {match.awayName ?? match.awayCode}
          </span>
          <TeamFlag code={match.awayCode} name={match.awayName} />
        </div>
      </div>
    </div>
  );
}
