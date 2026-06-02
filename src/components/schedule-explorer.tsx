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
      <div className="panel grid gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <GroupChip label="Alle" active={group === "all"} onClick={() => setGroup("all")} />
          {groups.map((g) => (
            <GroupChip key={g} label={g} active={group === g} onClick={() => setGroup(g)} />
          ))}
          {matches.some((m) => !m.group) ? (
            <GroupChip label="Knock-out" active={group === "ko"} onClick={() => setGroup("ko")} />
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-[#475670]">
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
          <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-[#475670]">
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
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-[#475670]">{filtered.length} wedstrijden</span>
          {hasFilter ? (
            <button
              type="button"
              className="button-secondary min-h-10 px-3 text-sm"
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
          filtered.map((match) => (
            <div key={match.id} className="grid gap-2 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-base font-black text-[#101a2b]">
                  <TeamFlag code={match.homeCode} name={match.homeName} />
                  <span>{match.homeName ?? match.homeCode}</span>
                  <span className="text-[#475670]">-</span>
                  <TeamFlag code={match.awayCode} name={match.awayName} />
                  <span>{match.awayName ?? match.awayCode}</span>
                  {match.group ? (
                    <span className="chip bg-[#eef3fc] text-[#15375f]">Groep {match.group}</span>
                  ) : (
                    <span className="chip bg-[#eef3fc] text-[#15375f]">Knock-out</span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm font-bold text-[#475670]">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    {formatAmsterdam(match.startsAt)}
                  </span>
                  {match.venue ? (
                    <span className="flex items-center gap-1.5">
                      <MapPin aria-hidden="true" className="size-4" />
                      {match.venue}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm font-semibold text-[#475670]">Geen wedstrijden voor deze filters.</p>
        )}
      </div>
    </section>
  );
}

function GroupChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-9 rounded-full border px-3 text-sm font-black transition ${
        active ? "border-transparent bg-[#15375f] text-white" : "border-slate-200 bg-white text-[#15375f]"
      }`}
    >
      {label}
    </button>
  );
}
