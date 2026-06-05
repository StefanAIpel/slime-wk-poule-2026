"use client";

import { CalendarDays, Crown, MapPin, Search, Table2, Trophy } from "lucide-react";
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

function normalizeSearch(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchSearchHaystack(match: ScheduleMatch) {
  return normalizeSearch(
    [
      match.group ? `groep ${match.group}` : "",
      match.homeCode,
      match.homeName,
      match.homeLabel,
      match.awayCode,
      match.awayName,
      match.awayLabel,
      dateKey(match.startsAt),
      dateLabel(match.startsAt),
      formatAmsterdam(match.startsAt),
      match.venue,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function normalizeScheduleQuery(value: string) {
  const normalized = normalizeSearch(value).trim();
  return normalized === "oranje" ? "nederland" : normalized;
}

function hasScore(match: ScheduleMatch) {
  return match.homeScore !== null && match.awayScore !== null;
}

function stageLabel(stage: string | null, group: string | null) {
  if (group) return `Groep ${group}`;
  return stageLabels[stage ?? ""] ?? "Knock-out";
}

export type ScheduleView = "groups" | "knockout";

const viewLinks: { view: ScheduleView; href: string; label: string; icon: "table" | "trophy" }[] = [
  { view: "groups", href: "/schema", label: "Groepen", icon: "table" },
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

export function ScheduleExplorer({ matches, initialView = "groups" }: { matches: ScheduleMatch[]; initialView?: ScheduleView }) {
  const standings = useMemo(() => buildGroupStandings(matches), [matches]);
  const knockoutMatches = useMemo(
    () => matches.filter((m) => !m.group || (m.stage && m.stage !== "group")).sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? "") || a.id - b.id),
    [matches],
  );
  const completedGroupMatches = useMemo(() => matches.filter((m) => m.group && hasScore(m)).length, [matches]);

  return (
    <section className="schedule-explorer grid gap-3">
      <nav className="schedule-tabs" aria-label="Speelschema onderdelen">
        {viewLinks.map((item) => {
          const Icon = item.icon === "table" ? Table2 : Trophy;
          return (
            <a key={item.view} className={initialView === item.view ? "schedule-tab schedule-tab-active" : "schedule-tab"} href={item.href} aria-current={initialView === item.view ? "page" : undefined}>
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {initialView === "groups" ? (
        <section id="groepen" className="schedule-section-anchor">
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
            <span>{teamAbbrev(row.code, row.name)}</span>
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
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeScheduleQuery(query);
  const isNetherlandsQuery = normalizedQuery === "nederland";
  const matchesByGroup = useMemo(() => {
    const map = new Map<string, ScheduleMatch[]>();
    for (const match of matches) {
      if (!match.group) continue;
      map.set(match.group, [...(map.get(match.group) ?? []), match]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [matches]);
  const filteredMatchesByGroup = useMemo(() => {
    if (!normalizedQuery) return matchesByGroup;
    return matchesByGroup.filter(([group, groupMatches]) => {
      const groupLabel = normalizeSearch(`groep ${group} group ${group}`);
      return groupLabel.includes(normalizedQuery) || groupMatches.some((match) => matchSearchHaystack(match).includes(normalizedQuery));
    });
  }, [matchesByGroup, normalizedQuery]);
  const matchesByDate = useMemo(() => {
    const map = new Map<string, ScheduleMatch[]>();
    for (const match of matches) {
      if (normalizedQuery && !matchSearchHaystack(match).includes(normalizedQuery)) continue;
      const key = dateKey(match.startsAt) || "unknown";
      map.set(key, [...(map.get(key) ?? []), match]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [matches, normalizedQuery]);
  const standingsByGroup = new Map(standings.map((item) => [item.group, item.rows]));
  const visibleMatchCount = display === "groups" ? filteredMatchesByGroup.reduce((total, [, groupMatches]) => total + groupMatches.length, 0) : matchesByDate.reduce((total, [, dateMatches]) => total + dateMatches.length, 0);

  return (
    <div className="grid gap-3">
      <div className="schedule-section-tools">
        <div className="schedule-section-titlebar">
          <div>
            <p className="schedule-section-kicker">Live groepsfase</p>
            <h2>Groepen</h2>
          </div>
          <p className="schedule-count-pill">{completedGroupMatches} van 72 groepsduels met score</p>
        </div>
        <div className="schedule-groups-controls">
          <label className="schedule-search-field">
            <Search aria-hidden="true" className="size-4" />
            <span className="sr-only">Zoek op groep, land of datum</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek groep, land of datum" />
          </label>
          <button type="button" className={isNetherlandsQuery ? "schedule-orange-chip schedule-orange-chip-active" : "schedule-orange-chip"} onClick={() => setQuery("Nederland")}>
            Nederland - Oranje
          </button>
          <div className="schedule-subtabs schedule-subtabs-light" role="tablist" aria-label="Groepsfase weergave">
            <button type="button" className={display === "groups" ? "schedule-subtab schedule-subtab-active" : "schedule-subtab"} onClick={() => setDisplay("groups")}>Per groep</button>
            <button type="button" className={display === "dates" ? "schedule-subtab schedule-subtab-active" : "schedule-subtab"} onClick={() => setDisplay("dates")}>Per datum</button>
          </div>
        </div>
        <p className="schedule-filter-help">Zoek bijvoorbeeld op “Nederland - Oranje”, “Duitsland”, “Groep A” of “11 juni”. Je krijgt dan direct de bijbehorende poule of speeldag.</p>
      </div>

      {display === "groups" ? (
        <div className="group-phase-grid">
          {filteredMatchesByGroup.length ? filteredMatchesByGroup.map(([group, groupMatches]) => (
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
          )) : (
            <p className="panel p-4 text-sm font-bold text-[#48617f]">Geen groep gevonden voor “{query}”.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {matchesByDate.length ? matchesByDate.map(([key, dateMatches]) => (
            <article key={key} className="panel overflow-hidden">
              <header className="standing-card-header">
                <span>{key === "unknown" ? "Datum volgt" : dateLabel(dateMatches[0]?.startsAt ?? null)}</span>
                <span className="text-xs font-bold text-[#48617f]">{dateMatches.length} wedstrijden</span>
              </header>
              <div className="divide-y divide-slate-200">
                {dateMatches.map((match) => <MatchRow key={match.id} match={match} compactMeta />)}
              </div>
            </article>
          )) : (
            <p className="panel p-4 text-sm font-bold text-[#48617f]">Geen wedstrijden gevonden voor “{query}”.</p>
          )}
        </div>
      )}
      <p className="schedule-result-count">{visibleMatchCount} wedstrijden in beeld.</p>
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
      <div className="schedule-section-tools">
        <div className="schedule-section-titlebar">
          <div>
            <p className="schedule-section-kicker">Route naar de beker</p>
            <h2 className="inline-flex items-center gap-2">
              <Crown aria-hidden="true" className="size-5 text-[#d98600]" />
              Knock-outfase
            </h2>
          </div>
          <p className="schedule-count-pill">Laatste 32 tot finale</p>
        </div>
        <p className="schedule-filter-help">Datum, tijd en stadion staan al vast; de landen verschijnen zodra de groepsfase en knock-outduels gespeeld zijn.</p>
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
          <span className="schedule-team-separator" aria-hidden="true">•</span>
          <span className="sr-only">tegen</span>
          <div className={match.winnerCode === match.awayCode ? "schedule-team-cell schedule-team-cell-away schedule-team-winner" : "schedule-team-cell schedule-team-cell-away"} title={teamText(match, "away")}>
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
