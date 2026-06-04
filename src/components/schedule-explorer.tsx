"use client";

import { CalendarDays, Crown, MapPin, RotateCcw, Table2, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { TeamFlag } from "@/components/team-flag";
import { formatAmsterdam, teamAbbrev, venueHourOffset, venueLabel, venueShortLabel } from "@/lib/format";

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

const knockoutStageTabs: Record<string, string> = {
  round32: "1/16",
  round16: "1/8",
  quarterfinal: "1/4",
  semifinal: "1/2",
  third_place: "3e",
  final: "Finale",
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

function hasScore(match: ScheduleMatch) {
  return match.homeScore !== null && match.awayScore !== null;
}

function stageLabel(stage: string | null, group: string | null) {
  if (group) return `Groep ${group}`;
  return stageLabels[stage ?? ""] ?? "Knock-out";
}

export type ScheduleView = "matches" | "groups" | "knockout";

const viewLinks: { view: ScheduleView; href: string; label: string; icon: "calendar" | "table" | "trophy" }[] = [
  { view: "matches", href: "/schema", label: "Wedstrijden", icon: "calendar" },
  { view: "groups", href: "/schema/groepen", label: "Groepen", icon: "table" },
  { view: "knockout", href: "/schema/knockout", label: "Knock-out", icon: "trophy" },
];

function compactSlotLabel(value: string | null | undefined) {
  const text = value?.trim();
  if (!text) return "TBD";
  return text
    .replace(/Winnaar\s+Groep\s+/gi, "W ")
    .replace(/Tweede\s+Groep\s+/gi, "2e ")
    .replace(/Runner-up\s+Group\s+/gi, "2e ")
    .replace(/Winner\s+Group\s+/gi, "W ")
    .replace(/Winnaar\s+/gi, "W ")
    .replace(/Winner\s+/gi, "W ")
    .replace(/Wedstrijd\s+/gi, "W")
    .replace(/Match\s+/gi, "W")
    .replace(/Groep\s+/gi, "G")
    .replace(/Group\s+/gi, "G")
    .replace(/\s+/g, " ")
    .trim();
}

function teamText(match: ScheduleMatch, side: "home" | "away", short = false) {
  const code = side === "home" ? match.homeCode : match.awayCode;
  const label = side === "home" ? match.homeLabel : match.awayLabel;
  const name = side === "home" ? match.homeName : match.awayName;
  if (short) return code ? teamAbbrev(code, name ?? label) : compactSlotLabel(label ?? name);
  return name ?? label ?? code ?? "Nog onbekend";
}

function ResultBoxes({ match }: { match: ScheduleMatch }) {
  const complete = hasScore(match);
  return (
    <span className="match-score-boxes" aria-label={complete ? `Uitslag ${match.homeScore}-${match.awayScore}` : "Uitslag nog niet bekend"}>
      <span className={complete ? "score-box score-box-filled" : "score-box"}>{match.homeScore ?? ""}</span>
      <span className="score-dash" aria-hidden="true">-</span>
      <span className={complete ? "score-box score-box-filled" : "score-box"}>{match.awayScore ?? ""}</span>
    </span>
  );
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

export function ScheduleExplorer({ matches, initialView = "matches" }: { matches: ScheduleMatch[]; initialView?: ScheduleView }) {
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
        {viewLinks.map((item) => {
          const Icon = item.icon === "calendar" ? CalendarDays : item.icon === "table" ? Table2 : Trophy;
          return (
            <a key={item.view} className={initialView === item.view ? "schedule-tab schedule-tab-active" : "schedule-tab"} href={item.href} aria-current={initialView === item.view ? "page" : undefined}>
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {initialView === "matches" ? (
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
      ) : null}

      {initialView === "groups" ? (
        <section id="groepsstanden" className="schedule-section-anchor">
          <StandingsPanel completedGroupMatches={completedGroupMatches} matches={matches.filter((m) => m.group)} standings={standings} />
        </section>
      ) : null}

      {initialView === "knockout" ? (
        <section id="knockout" className="schedule-section-anchor">
          <KnockoutPanel matches={knockoutMatches} />
        </section>
      ) : null}
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

function StandingTable({ group, rows }: { group: string; rows: StandingRow[] }) {
  return (
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
  );
}

function StandingsPanel({ completedGroupMatches, matches, standings }: { completedGroupMatches: number; matches: ScheduleMatch[]; standings: { group: string; rows: StandingRow[] }[] }) {
  const [display, setDisplay] = useState<"groups" | "dates">("groups");
  const matchesByGroup = useMemo(() => {
    const map = new Map<string, ScheduleMatch[]>();
    for (const match of matches) {
      if (!match.group) continue;
      map.set(match.group, [...(map.get(match.group) ?? []), match]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [matches]);
  const matchesByDate = useMemo(() => {
    const map = new Map<string, ScheduleMatch[]>();
    for (const match of matches) {
      const key = dateKey(match.startsAt) || "unknown";
      map.set(key, [...(map.get(key) ?? []), match]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [matches]);
  const standingsByGroup = new Map(standings.map((item) => [item.group, item.rows]));

  return (
    <div className="grid gap-3">
      <div className="dark-panel rounded-2xl p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-100">Live groepsfase</p>
        <h2 className="mt-1 text-2xl font-black text-white">Groepen</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-blue-100">
          Wissel tussen groepsweergave met alle wedstrijden + stand en datumweergave. Tiebreak: punten, doelsaldo, goals voor, goals tegen en daarna land.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="inline-flex rounded-full bg-white/12 px-3 py-1 text-xs font-black text-white">
            {completedGroupMatches} van 72 groepsduels met score
          </p>
          <div className="schedule-subtabs" role="tablist" aria-label="Groepsfase weergave">
            <button type="button" className={display === "groups" ? "schedule-subtab schedule-subtab-active" : "schedule-subtab"} onClick={() => setDisplay("groups")}>Per groep</button>
            <button type="button" className={display === "dates" ? "schedule-subtab schedule-subtab-active" : "schedule-subtab"} onClick={() => setDisplay("dates")}>Per datum</button>
          </div>
        </div>
      </div>

      {display === "groups" ? (
        <div className="group-phase-grid">
          {matchesByGroup.map(([group, groupMatches]) => (
            <article key={group} className="panel group-phase-card overflow-hidden">
              <header className="standing-card-header">
                <span>Groep {group}</span>
                <span className="text-xs font-bold text-[#48617f]">Wedstrijden + stand</span>
              </header>
              <div className="group-phase-body">
                <div className="divide-y divide-slate-200">
                  {groupMatches.map((match) => <MatchRow key={match.id} match={match} compactMeta />)}
                </div>
                <aside className="group-phase-standing">
                  <StandingTable group={group} rows={standingsByGroup.get(group) ?? []} />
                </aside>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {matchesByDate.map(([key, dateMatches]) => (
            <article key={key} className="panel overflow-hidden">
              <header className="standing-card-header">
                <span>{key === "unknown" ? "Datum volgt" : dateLabel(dateMatches[0]?.startsAt ?? null)}</span>
                <span className="text-xs font-bold text-[#48617f]">{dateMatches.length} wedstrijden</span>
              </header>
              <div className="divide-y divide-slate-200">
                {dateMatches.map((match) => <MatchRow key={match.id} match={match} compactMeta />)}
              </div>
            </article>
          ))}
        </div>
      )}
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
        <nav className="schedule-subtabs knockout-stage-tabs" aria-label="Knock-out rondes">
          {matchesByStage.map(([stage]) => (
            <a key={stage} className="schedule-subtab" href={`#ko-${stage}`}>
              {knockoutStageTabs[stage] ?? stageLabels[stage] ?? "KO"}
            </a>
          ))}
        </nav>
      ) : null}

      {matchesByStage.length ? (
        matchesByStage.map(([stage, stageMatches]) => (
          <article key={stage} id={`ko-${stage}`} className="panel scroll-mt-24 overflow-hidden">
            <header className="standing-card-header knockout-stage-header">
              <span>{knockoutStageTabs[stage] ? `${knockoutStageTabs[stage]} · ${stageLabels[stage] ?? "Knock-out"}` : stageLabels[stage] ?? "Knock-out"}</span>
              <span className="knockout-stage-meta">winnaar X · 2e Y · {stageMatches.length} {stageMatches.length === 1 ? "wedstrijd" : "wedstrijden"}</span>
            </header>
            <div className="divide-y divide-slate-200 knockout-match-list">
              {stageMatches.map((match) => <MatchRow key={match.id} match={match} knockout />)}
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

function MatchRow({ match, compactMeta = false, knockout = false }: { match: ScheduleMatch; compactMeta?: boolean; knockout?: boolean }) {
  const offset = venueHourOffset(match.startsAt, match.venue);
  return (
    <div className={compactMeta ? "schedule-match-row schedule-match-row-compact" : "schedule-match-row"}>
      <div className="flex items-center">
        <span className="match-group">{match.group ?? "KO"}</span>
      </div>
      <div className="match-row-main">
        <div className={compactMeta ? "schedule-match-meta match-meta match-meta-compact" : "schedule-match-meta match-meta"}>
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
        <div className={`schedule-team-grid ${knockout ? "schedule-team-grid-knockout" : ""}`} aria-label={`${teamText(match, "home")} tegen ${teamText(match, "away")}`}>
          <div className={match.winnerCode === match.homeCode ? "schedule-team-cell schedule-team-winner schedule-team-cell-home" : "schedule-team-cell schedule-team-cell-home"} title={teamText(match, "home")}>
            <TeamFlag code={match.homeCode} name={match.homeName ?? match.homeLabel} />
            <span className="schedule-team-name">
              <span className="sm:hidden">{teamText(match, "home", true)}</span>
              <span className="hidden sm:inline">{teamText(match, "home")}</span>
            </span>
          </div>
          <span className="sr-only">tegen</span>
          <div className={match.winnerCode === match.awayCode ? "schedule-team-cell schedule-team-winner" : "schedule-team-cell"} title={teamText(match, "away")}>
            <TeamFlag code={match.awayCode} name={match.awayName ?? match.awayLabel} />
            <span className="schedule-team-name">
              <span className="sm:hidden">{teamText(match, "away", true)}</span>
              <span className="hidden sm:inline">{teamText(match, "away")}</span>
            </span>
          </div>
          <ResultBoxes match={match} />
        </div>
      </div>
    </div>
  );
}
