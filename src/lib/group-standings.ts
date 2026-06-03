export type StandingMatch = {
  id: number;
  group_letter: string | null;
  home_code: string | null;
  away_code: string | null;
};

export type ScoreLookup = Map<number, { home: number; away: number }>;

export type StandingRow = {
  code: string;
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

function row(code: string, group: string): StandingRow {
  return {
    code,
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

/** Lege standingrow voor een team (bijv. om alle landen met nullen te tonen). */
export function emptyStandingRow(code: string, group: string): StandingRow {
  return row(code, group);
}

export function compareStandingRows(a: StandingRow, b: StandingRow) {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    a.goalsAgainst - b.goalsAgainst ||
    a.code.localeCompare(b.code)
  );
}

export function calculateGroupStandings(matches: StandingMatch[], scores: ScoreLookup) {
  const groups = new Map<string, Map<string, StandingRow>>();

  for (const match of matches) {
    if (!match.home_code || !match.away_code || !match.group_letter) continue;
    const score = scores.get(match.id);
    if (!score) continue;

    const groupRows = groups.get(match.group_letter) ?? new Map<string, StandingRow>();
    const home = groupRows.get(match.home_code) ?? row(match.home_code, match.group_letter);
    const away = groupRows.get(match.away_code) ?? row(match.away_code, match.group_letter);

    home.played += 1;
    away.played += 1;
    home.goalsFor += score.home;
    home.goalsAgainst += score.away;
    away.goalsFor += score.away;
    away.goalsAgainst += score.home;
    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;

    if (score.home > score.away) {
      home.wins += 1;
      away.losses += 1;
      home.points += 3;
    } else if (score.home < score.away) {
      away.wins += 1;
      home.losses += 1;
      away.points += 3;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }

    groupRows.set(match.home_code, home);
    groupRows.set(match.away_code, away);
    groups.set(match.group_letter, groupRows);
  }

  return new Map(
    Array.from(groups.entries()).map(([group, rows]) => [
      group,
      Array.from(rows.values()).sort(compareStandingRows),
    ]),
  );
}

export function calculateRound32(matches: StandingMatch[], scores: ScoreLookup) {
  const standings = calculateGroupStandings(matches, scores);
  const direct = Array.from(standings.values()).flatMap((rows) => rows.slice(0, 2));
  const thirds = Array.from(standings.values())
    .map((rows) => rows[2])
    .filter(Boolean)
    .sort(compareStandingRows)
    .slice(0, 8);

  return [...direct, ...thirds].map((standing) => standing.code);
}
