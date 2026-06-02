import { Medal, Trophy, Users } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 30;

type GlobalScoreRow = {
  user_id: string;
  points: number;
  exact_scores: number;
  correct_results: number;
  bonus_points: number;
  profiles: { nickname: string | null; team_name: string | null } | null;
};

export default async function RankingPage() {
  const admin = createAdminClient();
  const [{ data: globalScores }, { data: pools }, { data: members }, { data: allScores }] = await Promise.all([
    admin
      .from("scores")
      .select("user_id,points,exact_scores,correct_results,bonus_points,profiles(nickname,team_name)")
      .order("points", { ascending: false })
      .limit(100),
    admin.from("pools").select("id,name,code"),
    admin.from("pool_members").select("pool_id,user_id"),
    admin.from("scores").select("user_id,points"),
  ]);

  const poolRankings = buildPoolRankings(pools ?? [], members ?? [], allScores ?? []);
  const rows = (globalScores ?? []) as unknown as GlobalScoreRow[];

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero
          title="Ranglijsten"
          subtitle="Algemene stand en subpoules. Meedoen of voorspellingen aanpassen kan na login."
        />
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <article className="panel overflow-hidden">
          <div className="wc-header flex items-center gap-3 p-4 text-white">
            <Trophy aria-hidden="true" className="size-7" />
            <h2 className="text-2xl font-black">Wereldranglijst</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {rows.map((row, index) => (
              <div key={row.user_id} className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 p-4 text-[#081634]">
                <RankBadge rank={index + 1} />
                <Avatar name={row.profiles?.team_name || row.profiles?.nickname || "Anoniem"} />
                <div className="min-w-0">
                  <div className="truncate font-black">{row.profiles?.team_name || "Team zonder naam"}</div>
                  <div className="truncate text-sm font-bold text-[#48617f]">
                    {row.profiles?.nickname || "Naam volgt"} · {row.exact_scores} exact · {row.correct_results} juiste richting
                  </div>
                </div>
                <div className="text-right text-xl font-black">{row.points} pt</div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel overflow-hidden">
          <div className="flex items-center gap-3 bg-[#128f47] p-4 text-white">
            <Users aria-hidden="true" className="size-7" />
            <h2 className="text-2xl font-black">Subpoules</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {poolRankings.map((pool, index) => (
              <div key={pool.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 text-[#081634]">
                <RankBadge rank={index + 1} />
                <div>
                  <div className="font-black">{pool.name}</div>
                  <div className="text-sm font-bold text-[#48617f]">Beste 4 samen, code {pool.code}</div>
                </div>
                <div className="text-right text-xl font-black">{pool.points} pt</div>
              </div>
            ))}
            {!poolRankings.length ? (
              <div className="p-4 font-semibold text-[#48617f]">Nog geen subpoules met score.</div>
            ) : null}
          </div>
        </article>
      </section>

      <BottomNav current="/ranglijst" showPrivate={false} />
    </main>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const color = rank === 1 ? "bg-[#ffb000]" : rank === 2 ? "bg-slate-400" : rank === 3 ? "bg-[#ff7a00]" : "bg-[#0866e8]";
  return (
    <div className={`grid size-10 place-items-center rounded-full ${color} text-sm font-black text-white`}>
      {rank <= 3 ? <Medal aria-hidden="true" className="size-5" /> : rank}
    </div>
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
