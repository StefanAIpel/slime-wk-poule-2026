"use client";

import { CalendarDays, ChevronDown, Crown, MapPin, Table2, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { TeamFlag } from "@/components/team-flag";
import { formatAmsterdam, teamAbbrev, teamNameForLocale, venueHourOffset, venueLabel, venueShortLabel } from "@/lib/format";
import { localizedHref, type Locale } from "@/lib/i18n";

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

const stageLabels: Record<Locale, Record<string, string>> = {
  nl: {
    group: "Groepsfase",
    round32: "Laatste 32",
    round16: "Achtste finales",
    quarterfinal: "Kwartfinales",
    semifinal: "Halve finales",
    third_place: "Troostfinale",
    final: "Finale",
    finalists: "Finalisten",
    champion: "Wereldkampioen",
  },
  en: {
    group: "Group stage",
    round32: "Round of 32",
    round16: "Round of 16",
    quarterfinal: "Quarter-finals",
    semifinal: "Semi-finals",
    third_place: "Third-place match",
    final: "Final",
    finalists: "Finalists",
    champion: "World champion",
  },
};

const knockoutRoadmap: Record<Locale, { label: string; meta: string }[]> = {
  nl: [
    { label: "Laatste 32", meta: "32 landen · na de groepsfase" },
    { label: "Achtste finales", meta: "16 winnaars blijven over" },
    { label: "Kwartfinales", meta: "8 landen" },
    { label: "Halve finales", meta: "4 landen" },
    { label: "Finale", meta: "2 finalisten · 1 wereldkampioen" },
  ],
  en: [
    { label: "Round of 32", meta: "32 countries · after the group stage" },
    { label: "Round of 16", meta: "16 winners remain" },
    { label: "Quarter-finals", meta: "8 countries" },
    { label: "Semi-finals", meta: "4 countries" },
    { label: "Final", meta: "2 finalists · 1 world champion" },
  ],
};

const knockoutStageTabs: Record<string, string> = {
  round32: "1/16",
  round16: "1/8",
  quarterfinal: "1/4",
  semifinal: "1/2",
  third_place: "3e",
  final: "Finale",
};

const scheduleCopy = {
  nl: {
    partsLabel: "Speelschema onderdelen",
    groups: "Groepen",
    knockout: "Knock-out",
    close: "Sluiten",
    liveGroups: "Live groepsfase",
    allGroups: "Alle groepen",
    group: "Groep",
    allDates: "Alle datums",
    date: "Datum",
    dateTbd: "Datum volgt",
    netherlandsFilter: "Nederland - Oranje",
    country: "Land",
    matchesAndStanding: "Wedstrijden + stand",
    noMatches: "Geen wedstrijden voor deze selectie.",
    matchesVisible: "wedstrijden in beeld.",
    routeToCup: "Route naar de beker",
    knockoutPhase: "Knock-outfase",
    roundRange: "Laatste 32 tot finale",
    fixedInfo: "Datum, tijd en stadion staan al vast; de landen verschijnen zodra de groepsfase en knock-outduels gespeeld zijn.",
    knockoutRounds: "Knock-out rondes",
    match: "wedstrijd",
    matches: "wedstrijden",
    winner: "winnaar X · 2e Y",
    result: "Uitslag",
    resultUnknown: "Uitslag nog niet bekend",
    finished: "Afgelopen",
    live: "Live",
    timeDiff: "Tijdverschil met Nederland",
    sameTime: "gelijk",
    versus: "tegen",
    unknownTeam: "Nog onbekend",
  },
  en: {
    partsLabel: "Schedule sections",
    groups: "Groups",
    knockout: "Knockout",
    close: "Close",
    liveGroups: "Live group stage",
    allGroups: "All groups",
    group: "Group",
    allDates: "All dates",
    date: "Date",
    dateTbd: "Date TBC",
    netherlandsFilter: "Netherlands - Oranje",
    country: "Country",
    matchesAndStanding: "Matches + standings",
    noMatches: "No matches for this selection.",
    matchesVisible: "matches shown.",
    routeToCup: "Road to the trophy",
    knockoutPhase: "Knockout phase",
    roundRange: "Round of 32 to final",
    fixedInfo: "Date, time and stadium are already fixed; countries appear once the group stage and knockout matches have been played.",
    knockoutRounds: "Knockout rounds",
    match: "match",
    matches: "matches",
    winner: "winner X · runner-up Y",
    result: "Result",
    resultUnknown: "Result not known yet",
    finished: "Finished",
    live: "Live",
    timeDiff: "Time difference with the Netherlands",
    sameTime: "same",
    versus: "versus",
    unknownTeam: "TBD",
  },
} as const;

// De FIFA/seed-data gebruikt de ISO-3 code NED. Sommige externe feeds gebruiken
// NLD; ondersteun beide zodat de Oranje-filter nooit leegvalt door een codevariant.
const ORANJE_TEAM_CODES = new Set(["NED", "NLD"]);

function dateKey(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(iso),
  );
}

function dateLabel(iso: string | null, locale: Locale) {
  if (!iso) return locale === "en" ? "Date TBC" : "Datum volgt";
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", { timeZone: "Europe/Amsterdam", weekday: "short", day: "numeric", month: "short" }).format(
    new Date(iso),
  );
}

function hasScore(match: ScheduleMatch) {
  return match.homeScore !== null && match.awayScore !== null;
}

function stageLabel(stage: string | null, group: string | null, locale: Locale) {
  if (group) return `${scheduleCopy[locale].group} ${group}`;
  return stageLabels[locale][stage ?? ""] ?? (locale === "en" ? "Knockout" : "Knock-out");
}

export type ScheduleView = "groups" | "knockout";

const viewLinks: { view: ScheduleView; href: string; label: string; labelEn: string; icon: "table" | "trophy" }[] = [
  { view: "groups", href: "/schema", label: "Groepen", labelEn: "Groups", icon: "table" },
  { view: "knockout", href: "/schema/knockout", label: "Knock-out", labelEn: "Knockout", icon: "trophy" },
];

function localizedSlotLabel(value: string | null | undefined, locale: Locale) {
  const text = value?.trim();
  if (!text) return scheduleCopy[locale].unknownTeam;
  if (locale === "nl") return text;
  return text
    .replace(/Winnaar\s+Groep\s+/gi, "Winner Group ")
    .replace(/Tweede\s+Groep\s+/gi, "Runner-up Group ")
    .replace(/Winnaar\s+/gi, "Winner ")
    .replace(/Wedstrijd\s+/gi, "Match ")
    .replace(/Groep\s+/gi, "Group ")
    .replace(/Nog onbekend/gi, "TBD")
    .replace(/\s+/g, " ")
    .trim();
}

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

function teamText(match: ScheduleMatch, side: "home" | "away", locale: Locale, short = false) {
  const code = side === "home" ? match.homeCode : match.awayCode;
  const label = side === "home" ? match.homeLabel : match.awayLabel;
  const name = side === "home" ? match.homeName : match.awayName;
  if (short) return code ? teamAbbrev(code, name ?? label) : compactSlotLabel(label ?? name);
  if (code) return teamNameForLocale(code, name ?? label, locale);
  return localizedSlotLabel(label ?? name, locale);
}

function ResultBoxes({ match, locale }: { match: ScheduleMatch; locale: Locale }) {
  const complete = hasScore(match);
  return (
    <span className="match-score-boxes" aria-label={complete ? `${scheduleCopy[locale].result} ${match.homeScore}-${match.awayScore}` : scheduleCopy[locale].resultUnknown}>
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

function buildGroupStandings(matches: ScheduleMatch[], locale: Locale) {
  const groups = new Map<string, Map<string, StandingRow>>();

  for (const match of matches) {
    if (!match.group) continue;
    const groupRows = groups.get(match.group) ?? new Map<string, StandingRow>();

    if (match.homeCode) {
      groupRows.set(
        match.homeCode,
        groupRows.get(match.homeCode) ?? createStanding(match.homeCode, teamNameForLocale(match.homeCode, match.homeName ?? match.homeLabel, locale), match.group),
      );
    }
    if (match.awayCode) {
      groupRows.set(
        match.awayCode,
        groupRows.get(match.awayCode) ?? createStanding(match.awayCode, teamNameForLocale(match.awayCode, match.awayName ?? match.awayLabel, locale), match.group),
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

export function ScheduleExplorer({ matches, initialView = "groups", locale = "nl" }: { matches: ScheduleMatch[]; initialView?: ScheduleView; locale?: Locale }) {
  const standings = useMemo(() => buildGroupStandings(matches, locale), [matches, locale]);
  const knockoutMatches = useMemo(
    () => matches.filter((m) => !m.group || (m.stage && m.stage !== "group")).sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? "") || a.id - b.id),
    [matches],
  );

  return (
    <section className="schedule-explorer grid gap-3">
      <nav className="schedule-tabs" aria-label={scheduleCopy[locale].partsLabel}>
        {viewLinks.map((item) => {
          const Icon = item.icon === "table" ? Table2 : Trophy;
          return (
            <a key={item.view} className={initialView === item.view ? "schedule-tab schedule-tab-active" : "schedule-tab"} href={localizedHref(item.href, locale)} aria-current={initialView === item.view ? "page" : undefined}>
              <Icon aria-hidden="true" className="size-4" />
              {locale === "en" ? item.labelEn : item.label}
            </a>
          );
        })}
      </nav>

      {initialView === "groups" ? (
        <section id="groepen" className="schedule-section-anchor">
          <StandingsPanel matches={matches.filter((m) => m.group)} standings={standings} locale={locale} />
        </section>
      ) : null}

      {initialView === "knockout" ? (
        <section id="knockout" className="schedule-section-anchor">
          <KnockoutPanel matches={knockoutMatches} locale={locale} />
        </section>
      ) : null}
    </section>
  );
}

function StandingTable({ group, rows, locale }: { group: string; rows: StandingRow[]; locale: Locale }) {
  return (
    <div className="standing-table" role="table" aria-label={locale === "en" ? `Group ${group} standings` : `Groepsstand groep ${group}`}>
      <div className="standing-row standing-row-head" role="row">
        <span>#</span>
        <span>{locale === "en" ? "Country" : "Land"}</span>
        <span>W</span>
        <span>P</span>
        <span>{locale === "en" ? "GD" : "DS"}</span>
      </div>
      {rows.map((row, index) => (
        <div key={row.code} className={index < 2 ? "standing-row standing-row-direct" : index === 2 ? "standing-row standing-row-third" : "standing-row"} role="row">
          <span>{index + 1}</span>
          <span className="standing-team">
            <TeamFlag code={row.code} name={row.name} size="sm" locale={locale} />
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

function StandingsPanel({ matches, standings, locale }: { matches: ScheduleMatch[]; standings: { group: string; rows: StandingRow[] }[]; locale: Locale }) {
  const [display, setDisplay] = useState<"groups" | "dates">("groups");
  const [groupFilter, setGroupFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [nlOnly, setNlOnly] = useState(false);
  const [openPicker, setOpenPicker] = useState<"group" | "date" | null>(null);

  const allGroups = useMemo(
    () => Array.from(new Set(matches.map((m) => m.group).filter(Boolean) as string[])).sort(),
    [matches],
  );
  const allDates = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of matches) {
      const key = dateKey(m.startsAt);
      if (key && !map.has(key)) map.set(key, m.startsAt as string);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, iso]) => ({ key, label: dateLabel(iso, locale) }));
  }, [matches, locale]);

  const isNl = (match: ScheduleMatch) =>
    !nlOnly || ORANJE_TEAM_CODES.has(match.homeCode ?? "") || ORANJE_TEAM_CODES.has(match.awayCode ?? "");

  const matchesByGroup = useMemo(() => {
    const map = new Map<string, ScheduleMatch[]>();
    for (const match of matches) {
      if (!match.group) continue;
      if (groupFilter !== "all" && match.group !== groupFilter) continue;
      if (!isNl(match)) continue;
      map.set(match.group, [...(map.get(match.group) ?? []), match]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, groupFilter, nlOnly]);

  const matchesByDate = useMemo(() => {
    const map = new Map<string, ScheduleMatch[]>();
    for (const match of matches) {
      const key = dateKey(match.startsAt) || "unknown";
      if (dateFilter !== "all" && key !== dateFilter) continue;
      if (!isNl(match)) continue;
      map.set(key, [...(map.get(key) ?? []), match]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, dateFilter, nlOnly]);

  const standingsByGroup = new Map(standings.map((item) => [item.group, item.rows]));
  const visibleMatchCount = display === "groups"
    ? matchesByGroup.reduce((total, [, groupMatches]) => total + groupMatches.length, 0)
    : matchesByDate.reduce((total, [, dateMatches]) => total + dateMatches.length, 0);

  const groupButtonLabel = groupFilter === "all" ? (locale === "en" ? "All groups" : "Alle groepen") : `${scheduleCopy[locale].group} ${groupFilter}`;
  const dateButtonLabel = dateFilter === "all" ? (locale === "en" ? "All dates" : "Alle datums") : allDates.find((d) => d.key === dateFilter)?.label ?? scheduleCopy[locale].date;

  function pickGroup(value: string) {
    setGroupFilter(value);
    setDateFilter("all");
    setDisplay("groups");
    setOpenPicker(null);
  }
  function pickDate(value: string) {
    setDateFilter(value);
    setGroupFilter("all");
    setDisplay(value === "all" ? "groups" : "dates");
    setOpenPicker(null);
  }

  return (
    <div className="grid gap-3">
      <div className="schedule-section-tools">
        <div className="schedule-section-titlebar">
          <p className="schedule-section-kicker">{scheduleCopy[locale].liveGroups}</p>
        </div>
        <div className="schedule-groups-controls">
          <div className="schedule-picker">
            <button type="button" className="schedule-picker-button" aria-expanded={openPicker === "group"} onClick={() => setOpenPicker(openPicker === "group" ? null : "group")}>
              <Table2 aria-hidden="true" className="size-4" />
              {groupButtonLabel}
              <ChevronDown aria-hidden="true" className="size-4 schedule-picker-caret" />
            </button>
            {openPicker === "group" ? (
              <>
                <button type="button" className="schedule-picker-backdrop" aria-label={scheduleCopy[locale].close} onClick={() => setOpenPicker(null)} />
                <div className="schedule-picker-pop" role="menu">
                  <button type="button" className={groupFilter === "all" ? "schedule-pick schedule-pick-wide schedule-pick-active" : "schedule-pick schedule-pick-wide"} onClick={() => pickGroup("all")}>{scheduleCopy[locale].allGroups}</button>
                  <div className="schedule-group-grid">
                    {allGroups.map((g) => (
                      <button key={g} type="button" className={groupFilter === g ? "schedule-pick schedule-pick-active" : "schedule-pick"} onClick={() => pickGroup(g)}>{g}</button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="schedule-picker">
            <button type="button" className="schedule-picker-button" aria-expanded={openPicker === "date"} onClick={() => setOpenPicker(openPicker === "date" ? null : "date")}>
              <CalendarDays aria-hidden="true" className="size-4" />
              {dateButtonLabel}
              <ChevronDown aria-hidden="true" className="size-4 schedule-picker-caret" />
            </button>
            {openPicker === "date" ? (
              <>
                <button type="button" className="schedule-picker-backdrop" aria-label={scheduleCopy[locale].close} onClick={() => setOpenPicker(null)} />
                <div className="schedule-picker-pop" role="menu">
                  <button type="button" className={dateFilter === "all" ? "schedule-pick schedule-pick-wide schedule-pick-active" : "schedule-pick schedule-pick-wide"} onClick={() => pickDate("all")}>{scheduleCopy[locale].allDates}</button>
                  <div className="schedule-date-list">
                    {allDates.map((d) => (
                      <button key={d.key} type="button" className={dateFilter === d.key ? "schedule-pick schedule-pick-row schedule-pick-active" : "schedule-pick schedule-pick-row"} onClick={() => pickDate(d.key)}>{d.label}</button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <button
            type="button"
            className={nlOnly ? "schedule-orange-chip schedule-nl-chip schedule-orange-chip-active" : "schedule-orange-chip schedule-nl-chip"}
            aria-label={scheduleCopy[locale].netherlandsFilter}
            title={scheduleCopy[locale].netherlandsFilter}
            onClick={() => setNlOnly((value) => !value)}
          >
            <span aria-hidden="true">🇳🇱</span>
            <span className="sr-only">{scheduleCopy[locale].netherlandsFilter}</span>
          </button>
        </div>
      </div>

      {display === "groups" ? (
        <div className="group-phase-grid">
          {matchesByGroup.length ? matchesByGroup.map(([group, groupMatches]) => (
            <article key={group} className="panel group-phase-card overflow-hidden">
              <header className="standing-card-header">
                <span>{scheduleCopy[locale].group} {group}</span>
                <span className="text-xs font-bold text-[var(--text-muted)]">{scheduleCopy[locale].matchesAndStanding}</span>
              </header>
              <div className="group-phase-body">
                <div className="divide-y divide-slate-200">
                  {groupMatches.map((match) => <MatchRow key={match.id} match={match} locale={locale} compactMeta />)}
                </div>
                <aside className="group-phase-standing">
                  <StandingTable group={group} rows={standingsByGroup.get(group) ?? []} locale={locale} />
                </aside>
              </div>
            </article>
          )) : (
            <p className="panel p-4 text-sm font-bold text-[var(--text-muted)]">{scheduleCopy[locale].noMatches}</p>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {matchesByDate.length ? matchesByDate.map(([key, dateMatches]) => (
            <article key={key} className="panel overflow-hidden">
              <header className="standing-card-header">
                <span>{key === "unknown" ? scheduleCopy[locale].dateTbd : dateLabel(dateMatches[0]?.startsAt ?? null, locale)}</span>
                <span className="text-xs font-bold text-[var(--text-muted)]">{dateMatches.length} {dateMatches.length === 1 ? scheduleCopy[locale].match : scheduleCopy[locale].matches}</span>
              </header>
              <div className="divide-y divide-slate-200">
                {dateMatches.map((match) => <MatchRow key={match.id} match={match} locale={locale} compactMeta />)}
              </div>
            </article>
          )) : (
            <p className="panel p-4 text-sm font-bold text-[var(--text-muted)]">{scheduleCopy[locale].noMatches}</p>
          )}
        </div>
      )}
      <p className="schedule-result-count">{visibleMatchCount} {scheduleCopy[locale].matchesVisible}</p>
    </div>
  );
}

function KnockoutPanel({ matches, locale }: { matches: ScheduleMatch[]; locale: Locale }) {
  const matchesByStage = useMemo(() => {
    const map = new Map<string, ScheduleMatch[]>();
    for (const match of matches) {
      const key = match.stage ?? "knockout";
      map.set(key, [...(map.get(key) ?? []), match]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => Object.keys(stageLabels[locale]).indexOf(a) - Object.keys(stageLabels[locale]).indexOf(b));
  }, [matches, locale]);

  return (
    <div className="grid gap-3">
      <div className="schedule-section-tools">
        <div className="schedule-section-titlebar">
          <div>
            <p className="schedule-section-kicker">{scheduleCopy[locale].routeToCup}</p>
            <h2 className="inline-flex items-center gap-2">
              <Crown aria-hidden="true" className="size-5 text-[#d98600]" />
              {scheduleCopy[locale].knockoutPhase}
            </h2>
          </div>
          <p className="schedule-count-pill">{scheduleCopy[locale].roundRange}</p>
        </div>
        <p className="schedule-filter-help">{scheduleCopy[locale].fixedInfo}</p>
      </div>

      {matchesByStage.length ? (
        <nav className="schedule-subtabs knockout-stage-tabs" aria-label={scheduleCopy[locale].knockoutRounds}>
          {matchesByStage.map(([stage]) => (
            <a key={stage} className="schedule-subtab" href={`#ko-${stage}`}>
              {knockoutStageTabs[stage] ?? stageLabels[locale][stage] ?? "KO"}
            </a>
          ))}
        </nav>
      ) : null}

      {matchesByStage.length ? (
        matchesByStage.map(([stage, stageMatches]) => (
          <article key={stage} id={`ko-${stage}`} className="panel scroll-mt-24 overflow-hidden">
            <header className="standing-card-header knockout-stage-header">
              <span>{knockoutStageTabs[stage] ? `${knockoutStageTabs[stage]} · ${stageLabels[locale][stage] ?? "Knockout"}` : stageLabels[locale][stage] ?? "Knockout"}</span>
              <span className="knockout-stage-meta">{scheduleCopy[locale].winner} · {stageMatches.length} {stageMatches.length === 1 ? scheduleCopy[locale].match : scheduleCopy[locale].matches}</span>
            </header>
            <div className="divide-y divide-slate-200 knockout-match-list">
              {stageMatches.map((match) => <MatchRow key={match.id} match={match} locale={locale} knockout />)}
            </div>
          </article>
        ))
      ) : (
        <div className="knockout-roadmap">
          {knockoutRoadmap[locale].map((item, index) => (
            <article key={item.label} className="panel knockout-roadmap-card p-4">
              <span className="knockout-step">{index + 1}</span>
              <div>
                <h3 className="text-base font-black text-[var(--ink)]">{item.label}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--text-muted)]">{item.meta}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchRow({ match, locale, compactMeta = false, knockout = false }: { match: ScheduleMatch; locale: Locale; compactMeta?: boolean; knockout?: boolean }) {
  const offset = venueHourOffset(match.startsAt, match.venue);
  return (
    <div className={compactMeta ? "schedule-match-row schedule-match-row-compact" : "schedule-match-row"}>
      <div className="flex items-center">
        <span className="match-group">{match.group ?? "KO"}</span>
      </div>
      <div className="match-row-main">
        <div className={compactMeta ? "schedule-match-meta match-meta match-meta-compact" : "schedule-match-meta match-meta"}>
          <CalendarDays aria-hidden="true" className="size-3.5" />
          <span className="match-time">{formatAmsterdam(match.startsAt, locale === "en" ? "en-GB" : "nl-NL")}</span>
          <span className={match.status === "live" ? "match-status match-status-live" : "match-status"}>
            {match.status === "finished" ? scheduleCopy[locale].finished : match.status === "live" ? scheduleCopy[locale].live : stageLabel(match.stage, match.group, locale)}
          </span>
          {offset !== null ? (
            <span className="match-time-offset" title={scheduleCopy[locale].timeDiff}>
              ({offset === 0 ? scheduleCopy[locale].sameTime : `${offset > 0 ? "+" : "−"}${Math.abs(offset)}${locale === "en" ? "h" : "u"}`})
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
        <div className={`schedule-team-grid ${knockout ? "schedule-team-grid-knockout" : ""}`} aria-label={`${teamText(match, "home", locale)} ${scheduleCopy[locale].versus} ${teamText(match, "away", locale)}`}>
          <div className={match.winnerCode === match.homeCode ? "schedule-team-cell schedule-team-winner schedule-team-cell-home" : "schedule-team-cell schedule-team-cell-home"} title={teamText(match, "home", locale)}>
            <TeamFlag code={match.homeCode} name={teamText(match, "home", locale)} locale={locale} />
            <span className="schedule-team-name">
              <span className="sm:hidden">{teamText(match, "home", locale, true)}</span>
              <span className="hidden sm:inline">{teamText(match, "home", locale)}</span>
            </span>
          </div>
          <span className="schedule-team-separator" aria-hidden="true">-</span>
          <span className="sr-only">{scheduleCopy[locale].versus}</span>
          <div className={match.winnerCode === match.awayCode ? "schedule-team-cell schedule-team-cell-away schedule-team-winner" : "schedule-team-cell schedule-team-cell-away"} title={teamText(match, "away", locale)}>
            <TeamFlag code={match.awayCode} name={teamText(match, "away", locale)} locale={locale} />
            <span className="schedule-team-name">
              <span className="sm:hidden">{teamText(match, "away", locale, true)}</span>
              <span className="hidden sm:inline">{teamText(match, "away", locale)}</span>
            </span>
          </div>
          <ResultBoxes match={match} locale={locale} />
        </div>
      </div>
    </div>
  );
}
