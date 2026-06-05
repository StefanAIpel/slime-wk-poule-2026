import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { RankingExplorer, type PlayerRow, type PoolRow } from "@/components/ranking-explorer";
import { formatAmsterdam } from "@/lib/format";
import { compareScoresAlphabetical, hasPublicProfile } from "@/lib/ranking";
import { createOptionalAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "WK 2026-poule ranglijst — wie staat er bovenaan?",
  description:
    "De algemene ranglijst van de gratis WK 2026-poule. Volg live wie de meeste punten scoort met voorspellingen en bekijk de stand per WK-poule.",
  alternates: { canonical: "/ranglijst" },
};

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
  const admin = createOptionalAdminClient();
  const [{ data: globalScores }, { data: pools }, { data: members }, { data: allScores }, { data: lastScore }] = admin
    ? await Promise.all([
        admin
          .from("scores")
          .select("user_id,points,exact_scores,correct_results,bonus_points,profiles(nickname,team_name,avatar_key)")
          .order("points", { ascending: false })
          .order("exact_scores", { ascending: false })
          .order("correct_results", { ascending: false })
          .order("bonus_points", { ascending: false })
          .limit(300),
        admin.from("pools").select("id,name,code"),
        admin.from("pool_members").select("pool_id,user_id"),
        admin.from("scores").select("user_id,points"),
        admin.from("scores").select("updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: null }];

  const lastUpdate = (lastScore as { updated_at: string | null } | null)?.updated_at ?? null;

  const rows = ((globalScores ?? []) as unknown as GlobalScoreRow[]).filter((row) => hasPublicProfile(row.profiles));
  const players: PlayerRow[] = rows
    .map((row) => ({
      userId: row.user_id,
      nickname: row.profiles?.nickname ?? null,
      teamName: row.profiles?.team_name ?? null,
      avatarKey: row.profiles?.avatar_key ?? null,
      points: row.points,
      exact: row.exact_scores,
      correct: row.correct_results,
    }))
    .sort(compareScoresAlphabetical)
    .slice(0, 300)
    .map((row, index) => ({
      ...row,
      rank: index + 1,
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
          subtitle="Zoek een speler op naam of team, of vind je WK-poule. Meedoen kan na login."
          slime="/assets/transparant-avatar/wk_slime_700_transparant.webp"
        />
        {lastUpdate ? (
          <p className="text-xs font-semibold text-[var(--muted)]">
            Laatste resultaten-update:{" "}
            <span className="text-[var(--ink)]">{formatAmsterdam(lastUpdate)}</span>
          </p>
        ) : null}
      </header>

      <RankingExplorer players={players} pools={poolRankings} />

      <BottomNav current="/ranglijst" className="bottom-nav-hide-mobile" />
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
