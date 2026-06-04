"use client";

import { CalendarDays, Crown, MapPin, RotateCcw, Table2, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { TeamFlag } from "@/components/team-flag";
import { formatAmsterdam, venueHourOffset, venueLabel, venueShortLabel } from "@/lib/format";

export type ScheduleMatch = {
  id: number;
  stage: string | null;
  group: string | null;
  homeCode: string | null;
  homeName: string | null;
  homeLabel: string | null;
  awayCode: string | null;
  awayName: string | null;
  awayLabel: string | null;
  startsAt: string | null;
  venue: string | null;
  status: "scheduled" | "live" | "finished";
  homeScore: number | null;
  awayScore: number | null;
  winnerCode: string | null;
};

type StandingRow = {
  code: string;
  name: string;
  group: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

const stageLabels: Record<string, string> = {
  group: "Groepsfase",
  round32: "Laatste 32",
  round16: "Achtste finales",
  quarterfinal: "Kwartfinales",
  semifinal: "Halve finales",
  third_place: "Troostfinale",
  final: "Finale",
  finalists: "Finalisten",
  champion: "Wereldkampioen",
};

const knockoutRoadmap = [
  { label: "Laatste 32", meta: "32 landen · na de groepsfase" },
  { label: "Achtste finales", meta: "16 winnaars blijven over" },
  { label: "Kwartfinales", meta: "8 landen" },
  { label: "Halve finales", meta: "4 landen" },
  { label: "Finale", meta: "2 finalisten · 1 wereldkampioen" },
];

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

function hasScore(match: ScheduleMatch) {
  return match.homeScore !== null && match.awayScore !== null;
}

// Tekst voor een team: echte naam/code als die bekend is, anders het knock-out-slotlabel
// ("Winnaar Groep A", "Winnaar W73"), met een laatste terugval.
function homeText(match: ScheduleMatch, short = false) {
  if (short) return match.homeCode ?? match.homeLabel ?? match.homeName ?? "TBD";
  return match.homeName ?? match.homeLabel ?? match.homeCode ?? "Nog onbekend";
}

function awayText(match: ScheduleMatch, short = false) {
  if (short) return match.awayCode ?? match.awayLabel ?? match.awayName ?? "TBD";
  return match.awayName ?? match.awayLabel ?? match.awayCode ?? "Nog onbekend";
}

function stageLabel(stage: string | null, group: string | null) {
  if (group) return `Groep ${group}`;
  return stageLabels[stage ?? ""] ?? "Knock-out";
}

function createStanding(code: string, name: string, group: string): StandingRow {
  return {
    code,
    name,
    group,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function compareStandingRows(a: StandingRow, b: StandingRow) {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    a.goalsAgainst - b.goalsAgainst ||
    a.name.localeCompare(b.name)
  );
}

function buildGroupStandings(matches: ScheduleMatch[]) {
  const groups = new Map<string, Map<string, StandingRow>>();

  for (const match of matches) {
    if (!match.group) continue;
    const groupRows = groups.get(match.group) ?? new Map<string, StandingRow>();

    if (match.homeCode) {
      groupRows.set(
        match.homeCode,
        groupRows.get(match.homeCode) ?? createStanding(match.homeCode, match.homeName ?? match.homeCode, match.group),
      );
    }
    if (match.awayCode) {
      groupRows.set(
        match.awayCode,
        groupRows.get(match.awayCode) ?? createStanding(match.awayCode, match.awayName ?? match.awayCode, match.group),
      );
    }

    if (match.homeCode && match.awayCode && hasScore(match)) {
      const home = groupRows.get(match.homeCode)!;
      const away = groupRows.get(match.awayCode)!;
      const homeScore = match.homeScore!;
      const awayScore = match.awayScore!;

      home.played += 1;
      away.played += 1;
      home.goalsFor += homeScore;
      home.goalsAgainst += awayScore;
      away.goalsFor += awayScore;
      away.goalsAgainst += homeScore;
      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;

      if (homeScore > awayScore) {
        home.wins += 1;
        away.losses += 1;
        home.points += 3;
      } else if (homeScore < awayScore) {
        away.wins += 1;
        home.losses += 1;
        away.points += 3;
      } else {
        home.draws += 1;
        away.draws += 1;
        home.points += 1;
        away.points += 1;
      }
    }

    groups.set(match.group, groupRows);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, rows]) => ({ group, rows: Array.from(rows.values()).sort(compareStandingRows) }));
}

export function ScheduleExplorer({ matches }: { matches: ScheduleMatch[] }) {
  const [group, setGroup] = useState("all");
  const [team, setTeam] = useState("all");
  const [date, setDate] = useState("all");

  const groups = useMemo(
    () => Array.from(new Set(matches.map((m) => m.group).filter(Boolean) as string[])).sort(),
    [matches],
  );
  const hasKnockout = useMemo(() => matches.some((m) => !m.group || (m.stage && m.stage !== "group")), [matches]);
  const standings = useMemo(() => buildGroupStandings(matches), [matches]);
  const knockoutMatches = useMemo(
    () => matches.filter((m) => !m.group || (m.stage && m.stage !== "group")).sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? "") || a.id - b.id),
    [matches],
  );
  const completedGroupMatches = useMemo(() => matches.filter((m) => m.group && hasScore(m)).length, [matches]);

  // Teamlijst hangt af van de gekozen groep: kies je een groep, dan zie je alleen
  // die teams.
  const teams = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of matches) {
      if (group !== "all" && (group === "ko" ? Boolean(m.group) && (!m.stage || m.stage === "group") : m.group !== group)) continue;
      if (m.homeCode) map.set(m.homeCode, m.homeName ?? m.homeCode);
      if (m.awayCode) map.set(m.awayCode, m.awayName ?? m.awayCode);
    }
    return Array.from(map.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [matches, group]);

  function onGroupChange(value: string) {
    setGroup(value);
    // Reset team als die niet meer in de gekozen groep zit.
    if (value !== "all" && team !== "all") {
      const stillValid = matches.some(
        (m) =>
          (value === "ko" ? !m.group || (m.stage && m.stage !== "group") : m.group === value) && (m.homeCode === team || m.awayCode === team),
      );
      if (!stillValid) setTeam("all");
    }
  }
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
      .filter((m) => (group === "all" ? true : group === "ko" ? !m.group || (m.stage && m.stage !== "group") : m.group === group))
      .filter((m) => team === "all" || m.homeCode === team || m.awayCode === team)
      .filter((m) => date === "all" || dateKey(m.startsAt) === date)
      .sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? "") || a.id - b.id);
  }, [matches, group, team, date]);

  const hasFilter = group !== "all" || team !== "all" || date !== "all";

  return (
    <section className="schedule-explorer grid gap-3">
      <nav className="schedule-tabs" aria-label="Speelschema onderdelen">
        <a className="schedule-tab schedule-tab-active" href="#wedstrijden">
          <CalendarDays aria-hidden="true" className="size-4" />
          Wedstrijden
        </a>
        <a className="schedule-tab" href="#groepsstanden">
          <Table2 aria-hidden="true" className="size-4" />
          Groepsstanden
        </a>
        <a className="schedule-tab" href="#knockout">
          <Trophy aria-hidden="true" className="size-4" />
          Knock-out
        </a>
      </nav>

      <section id="wedstrijden" className="schedule-section-anchor grid gap-3">
        <h2 className="sr-only">Wedstrijden</h2>
        <MatchesPanel
          dates={dates}
          filtered={filtered}
          group={group}
          groups={groups}
          hasFilter={hasFilter}
          hasKnockout={hasKnockout}
          onGroupChange={onGroupChange}
          setDate={setDate}
          setGroup={setGroup}
          setTeam={setTeam}
          team={team}
          teams={teams}
          date={date}
        />
      </section>

      <section id="groepsstanden" className="schedule-section-anchor">
        <StandingsPanel completedGroupMatches={completedGroupMatches} standings={standings} />
      </section>

      <section id="knockout" className="schedule-section-anchor">
        <KnockoutPanel matches={knockoutMatches} />
      </section>
    </section>
  );
}

function MatchesPanel({
  dates,
  filtered,
  group,
  groups,
  hasFilter,
  hasKnockout,
  onGroupChange,
  setDate,
  setGroup,
  setTeam,
  team,
  teams,
  date,
}: {
  dates: { key: string; label: string }[];
  filtered: ScheduleMatch[];
  group: string;
  groups: string[];
  hasFilter: boolean;
  hasKnockout: boolean;
  onGroupChange: (value: string) => void;
  setDate: (value: string) => void;
  setGroup: (value: string) => void;
  setTeam: (value: string) => void;
  team: string;
  teams: { code: string; name: string }[];
  date: string;
}) {
  return (
    <>
      <div className="panel grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-[#0b1f4d]">
          Groep
          <select className="field" value={group} onChange={(e) => onGroupChange(e.target.value)}>
            <option value="all">Alle groepen</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                Groep {g}
              </option>
            ))}
            {hasKnockout ? <option value="ko">Knock-out</option> : null}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-[#0b1f4d]">
          Team
          <select className="field" value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="all">{group === "all" ? "Alle teams" : "Alle teams in groep"}</option>
            {teams.map((t) => (
              <option key={t.code} value={t.code}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="col-span-2 grid gap-1 text-xs font-semibold uppercase tracking-wide text-[#0b1f4d] sm:col-span-1">
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
        <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-3">
          <span className="text-sm font-semibold text-[#0b1f4d]">{filtered.length} wedstrijden</span>
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
          <p className="p-4 text-sm font-semibold text-[#0b1f4d]">Geen wedstrijden voor deze filters.</p>
        )}
      </div>
    </>
  );
}

function StandingsPanel({ completedGroupMatches, standings }: { completedGroupMatches: number; standings: { group: string; rows: StandingRow[] }[] }) {
  return (
    <div className="grid gap-3">
      <div className="dark-panel rounded-2xl p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-100">Live groepsfase</p>
        <h2 className="mt-1 text-2xl font-black text-white">Groepsstanden</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-blue-100">
          Gebaseerd op ingevulde uitslagen. Tiebreak: punten, doelsaldo, goals voor, goals tegen en daarna land.
        </p>
        <p className="mt-3 inline-flex rounded-full bg-white/12 px-3 py-1 text-xs font-black text-white">
          {completedGroupMatches} van 72 groepsduels met score
        </p>
      </div>

      <div className="schedule-standings-grid">
        {standings.map(({ group, rows }) => (
          <article key={group} className="panel overflow-hidden">
            <header className="standing-card-header">
              <span>Groep {group}</span>
              <span className="text-xs font-bold text-[#48617f]">Top 2 + beste nummers 3 door</span>
            </header>
            <div className="standing-table" role="table" aria-label={`Groepsstand groep ${group}`}>
              <div className="standing-row standing-row-head" role="row">
                <span>#</span>
                <span>Land</span>
                <span>W</span>
                <span>P</span>
                <span>DS</span>
              </div>
              {rows.map((row, index) => (
                <div key={row.code} className={index < 2 ? "standing-row standing-row-direct" : index === 2 ? "standing-row standing-row-third" : "standing-row"} role="row">
                  <span>{index + 1}</span>
                  <span className="standing-team">
                    <TeamFlag code={row.code} name={row.name} size="sm" />
                    <span className="hidden min-w-0 truncate sm:inline">{row.name}</span>
                    <span className="sm:hidden">{row.code}</span>
                  </span>
                  <span>{row.played}</span>
                  <span>{row.points}</span>
                  <span>{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function KnockoutPanel({ matches }: { matches: ScheduleMatch[] }) {
  const matchesByStage = useMemo(() => {
    const map = new Map<string, ScheduleMatch[]>();
    for (const match of matches) {
      const key = match.stage ?? "knockout";
      map.set(key, [...(map.get(key) ?? []), match]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => Object.keys(stageLabels).indexOf(a) - Object.keys(stageLabels).indexOf(b));
  }, [matches]);

  return (
    <div className="grid gap-3">
      <div className="dark-panel rounded-2xl p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-100">Route naar de beker</p>
        <h2 className="mt-1 flex items-center gap-2 text-2xl font-black text-white">
          <Crown aria-hidden="true" className="size-6 text-[#ffd44d]" />
          Knock-outfase
        </h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-blue-100">
          Datum, tijd en stadion staan al vast; de landen verschijnen zodra de groepsfase en knock-outduels gespeeld zijn.
        </p>
      </div>

      {matchesByStage.length ? (
        matchesByStage.map(([stage, stageMatches]) => (
          <article key={stage} className="panel overflow-hidden">
            <header className="standing-card-header">
              <span>{stageLabels[stage] ?? "Knock-out"}</span>
              <span className="text-xs font-bold text-[#48617f]">{stageMatches.length} wedstrijden</span>
            </header>
            <div className="divide-y divide-slate-200">
              {stageMatches.map((match) => <MatchRow key={match.id} match={match} />)}
            </div>
          </article>
        ))
      ) : (
        <div className="knockout-roadmap">
          {knockoutRoadmap.map((item, index) => (
            <article key={item.label} className="panel knockout-roadmap-card p-4">
              <span className="knockout-step">{index + 1}</span>
              <div>
                <h3 className="text-base font-black text-[#081634]">{item.label}</h3>
                <p className="mt-1 text-sm font-semibold text-[#48617f]">{item.meta}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchRow({ match }: { match: ScheduleMatch }) {
  const offset = venueHourOffset(match.startsAt, match.venue);
  return (
    <div className="schedule-match-row">
      <div className="flex items-center">
        <span className="match-group">{match.group ?? "KO"}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="schedule-match-meta match-meta">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          <span className="match-time">{formatAmsterdam(match.startsAt)}</span>
          <span className={match.status === "live" ? "match-status match-status-live" : "match-status"}>
            {match.status === "finished" ? "Afgelopen" : match.status === "live" ? "Live" : stageLabel(match.stage, match.group)}
          </span>
          {offset !== null ? (
            <span className="match-time-offset" title="Tijdverschil met Nederland">
              ({offset === 0 ? "gelijk" : `${offset > 0 ? "+" : "−"}${Math.abs(offset)}u`})
            </span>
          ) : null}
          {match.venue ? (
            <span className="match-location" title={venueLabel(match.venue)}>
              <MapPin aria-hidden="true" className="size-3.5" />
              <span className="sm:hidden">{venueShortLabel(match.venue)}</span>
              <span className="hidden sm:inline">{venueLabel(match.venue)}</span>
            </span>
          ) : null}
        </div>
        <div className="schedule-team-grid" aria-label={`${homeText(match)} tegen ${awayText(match)}`}>
          <div className={match.winnerCode === match.homeCode ? "schedule-team-cell schedule-team-winner" : "schedule-team-cell"}>
            <TeamFlag code={match.homeCode} name={match.homeName} />
            <span className="schedule-team-name">
              <span className="sm:hidden">{homeText(match, true)}</span>
              <span className="hidden sm:inline">{homeText(match)}</span>
            </span>
          </div>
          {hasScore(match) ? (
            <span className="schedule-score" aria-label={`Uitslag ${match.homeScore}-${match.awayScore}`}>
              {match.homeScore}-{match.awayScore}
            </span>
          ) : (
            <span className="schedule-team-separator" aria-hidden="true">—</span>
          )}
          <div className={match.winnerCode === match.awayCode ? "schedule-team-cell schedule-team-winner" : "schedule-team-cell"}>
            <TeamFlag code={match.awayCode} name={match.awayName} />
            <span className="schedule-team-name">
              <span className="sm:hidden">{awayText(match, true)}</span>
              <span className="hidden sm:inline">{awayText(match)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
