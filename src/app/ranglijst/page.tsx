import { Medal, Trophy, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { displayName } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type GlobalScoreRow = {
  user_id: string;
  points: number;
  exact_scores: number;
  correct_results: number;
  bonus_points: number;
  profiles: { nickname: string | null; team_name: string | null } | null;
};

export default async function RankingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const admin = createAdminClient();
  const [{ data: globalScores }, { data: pools }, { data: members }, { data: allScores }] = await Promise.all([
    supabase
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
      <header className="mb-6 grid gap-4 md:max-w-2xl">
        <Brand />
        <div>
          <h1 className="text-4xl font-black leading-none text-white">Ranglijsten</h1>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-blue-100">
            Punten komen automatisch binnen zodra uitslagen zijn verwerkt. Subpoules tellen mee op basis van de beste
            vier spelers.
          </p>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <article className="panel overflow-hidden">
          <div className="wc-header flex items-center gap-3 p-4 text-white">
            <Trophy aria-hidden="true" className="size-7" />
            <h2 className="text-2xl font-black">Wereldranglijst</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {rows.map((row, index) => (
              <div key={row.user_id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 text-[#081634]">
                <RankBadge rank={index + 1} />
                <div>
                  <div className="font-black">{displayName(row.profiles)}</div>
                  <div className="text-sm font-bold text-[#48617f]">
                    {row.exact_scores} exact, {row.correct_results} juiste richting
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

      <BottomNav current="/ranglijst" />
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
