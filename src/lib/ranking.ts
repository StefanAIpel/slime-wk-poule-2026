import { DEMO_PLAYERS, hasSafePublicProfile } from "@/lib/demo-leaderboard";
import { displayName } from "@/lib/format";

export type RankingProfile = {
  nickname: string | null;
  team_name: string | null;
};

export type RankedScore = {
  user_id?: string | null;
  userId?: string | null;
  points: number;
  profiles?: RankingProfile | RankingProfile[] | null;
  nickname?: string | null;
  team_name?: string | null;
  teamName?: string | null;
};

function normalizeRankText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("nl-NL");
}

function firstProfile(profile?: RankingProfile | RankingProfile[] | null): RankingProfile | null {
  if (Array.isArray(profile)) return profile[0] ?? null;
  return profile ?? null;
}

export function scoreUserId(score: RankedScore) {
  return score.user_id ?? score.userId ?? "";
}

export function rankingName(scoreOrProfile?: RankedScore | RankingProfile | RankingProfile[] | null, fallback = "Speler") {
  if (!scoreOrProfile) return fallback;
  const maybeScore = scoreOrProfile as RankedScore;
  const profile = firstProfile(maybeScore.profiles) ?? {
    nickname: maybeScore.nickname ?? null,
    team_name: maybeScore.team_name ?? maybeScore.teamName ?? null,
  };
  const name = displayName(profile).trim();
  return name || fallback;
}

/**
 * Voorlopige rangschikking: punten dalend, bij gelijke punten alfabetisch.
 * Zo krijgen spelers met 0 punten alvast een echte plek i.p.v. allemaal #1.
 */
export function compareScoresAlphabetical<T extends RankedScore>(a: T, b: T) {
  const pointDiff = b.points - a.points;
  if (pointDiff !== 0) return pointDiff;

  const aId = scoreUserId(a);
  const bId = scoreUserId(b);
  const aName = normalizeRankText(rankingName(a, aId || "Speler"));
  const bName = normalizeRankText(rankingName(b, bId || "Speler"));
  const nameDiff = aName.localeCompare(bName, "nl-NL", { numeric: true, sensitivity: "base" });
  if (nameDiff !== 0) return nameDiff;

  return aId.localeCompare(bId);
}

export function worldRankMap<T extends RankedScore>(scores: T[]) {
  const map = new Map<string, number>();
  scores
    .filter((score) => scoreUserId(score))
    .slice()
    .sort(compareScoresAlphabetical)
    .forEach((score, index) => map.set(scoreUserId(score), index + 1));
  return map;
}

export function demoRankScores(): RankedScore[] {
  return DEMO_PLAYERS.map((player) => ({
    userId: player.userId,
    nickname: player.nickname,
    teamName: player.teamName,
    points: 0,
  }));
}

export function withDemoRankScores<T extends RankedScore>(scores: T[]) {
  const safePublicScores = scores.filter((score) => hasSafePublicProfile(firstProfile(score.profiles) ?? {
    nickname: score.nickname ?? null,
    team_name: score.team_name ?? score.teamName ?? null,
  }));
  return [...safePublicScores, ...demoRankScores()];
}

export function worldRankForUser<T extends RankedScore>(scores: T[], userId: string) {
  return worldRankMap(scores).get(userId) ?? null;
}
