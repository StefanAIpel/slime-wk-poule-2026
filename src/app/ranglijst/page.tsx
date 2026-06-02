import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { RankingExplorer, type PlayerRow, type PoolRow } from "@/components/ranking-explorer";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 30;

type GlobalScoreRow = {
  user_id: string;
  points: number;
  exact_scores: number;
  correct_results: number;
  bonus_points: number;
  profiles: { nickname: string | null; team_name: string | null; avatar_key: string | null } | null;
};

export default async function RankingPage() {
  const admin = createAdminClient();
  const [{ data: globalScores }, { data: pools }, { data: members }, { data: allScores }] = await Promise.all([
    admin
      .from("scores")
      .select("user_id,points,exact_scores,correct_results,bonus_points,profiles(nickname,team_name,avatar_key)")
      .order("points", { ascending: false })
      .limit(100),
    admin.from("pools").select("id,name,code"),
    admin.from("pool_members").select("pool_id,user_id"),
    admin.from("scores").select("user_id,points"),
  ]);

  const rows = (globalScores ?? []) as unknown as GlobalScoreRow[];
  const players: PlayerRow[] = rows.map((row, index) => ({
    userId: row.user_id,
    rank: index + 1,
    nickname: row.profiles?.nickname ?? null,
    teamName: row.profiles?.team_name ?? null,
    avatarKey: row.profiles?.avatar_key ?? null,
    points: row.points,
    exact: row.exact_scores,
    correct: row.correct_results,
  }));
  const poolRankings: PoolRow[] = buildPoolRankings(pools ?? [], members ?? [], allScores ?? []).map((pool, index) => ({
    id: pool.id,
    rank: index + 1,
    name: pool.name,
    code: pool.code,
    points: pool.points,
  }));

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero
          title="Ranglijsten"
          subtitle="Zoek een speler op naam of team, of vind je subpoule. Meedoen kan na login."
        />
      </header>

      <RankingExplorer players={players} pools={poolRankings} />

      <BottomNav current="/ranglijst" showPrivate={false} />
    </main>
  );
}

function buildPoolRankings(
  pools: { id: string; name: string; code: string }[],
  members: { pool_id: string; user_id: string }[],
  scores: { user_id: string; points: number }[],
) {
  const scoreMap = new Map(scores.map((score) => [score.user_id, score.points]));
  return pools
    .map((pool) => {
      const memberScores = members
        .filter((member) => member.pool_id === pool.id)
        .map((member) => scoreMap.get(member.user_id) ?? 0)
        .sort((a, b) => b - a)
        .slice(0, 4);
      return {
        ...pool,
        points: memberScores.reduce((sum, score) => sum + score, 0),
      };
    })
    .sort((a, b) => b.points - a.points);
}
