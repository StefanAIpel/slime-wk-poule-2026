"use client";

import { Medal, Search, Trophy, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/avatar";

export type PlayerRow = {
  userId: string;
  rank: number;
  nickname: string | null;
  teamName: string | null;
  points: number;
  exact: number;
  correct: number;
};

export type PoolRow = { id: string; rank: number; name: string; code: string; points: number };

function matches(query: string, ...fields: (string | null | undefined)[]) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => (field ?? "").toLowerCase().includes(q));
}

export function RankingExplorer({ players, pools }: { players: PlayerRow[]; pools: PoolRow[] }) {
  const [query, setQuery] = useState("");

  const filteredPlayers = useMemo(
    () => players.filter((p) => matches(query, p.nickname, p.teamName)),
    [players, query],
  );
  const filteredPools = useMemo(() => pools.filter((p) => matches(query, p.name, p.code)), [pools, query]);

  return (
    <div className="grid gap-4">
      <div className="panel flex items-center gap-2 p-2">
        <Search aria-hidden="true" className="ml-2 size-5 text-[#475670]" />
        <input
          className="w-full bg-transparent p-2 font-medium text-[#101a2b] outline-none"
          type="search"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek een speler, team of poule…"
          aria-label="Zoek speler of poule"
        />
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <article className="panel overflow-hidden">
          <div className="wc-header flex items-center gap-3 p-4 text-white">
            <Trophy aria-hidden="true" className="size-7" />
            <h2 className="text-2xl font-bold">Wereldranglijst</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {filteredPlayers.length ? (
              filteredPlayers.map((row) => (
                <div key={row.userId} className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 p-4 text-[#101a2b]">
                  <RankBadge rank={row.rank} />
                  <Avatar name={row.nickname || row.teamName || "Speler"} />
                  <div className="min-w-0">
                    <div className="truncate font-bold">{row.nickname || "Speler"}</div>
                    <div className="truncate text-sm font-semibold text-[#475670]">
                      {row.teamName || "—"} · {row.exact} exact · {row.correct} juist
                    </div>
                  </div>
                  <div className="text-right text-xl font-bold">{row.points} pt</div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm font-medium text-[#475670]">Geen spelers gevonden.</p>
            )}
          </div>
        </article>

        <article className="panel overflow-hidden">
          <div className="flex items-center gap-3 bg-[#1c855a] p-4 text-white">
            <Users aria-hidden="true" className="size-7" />
            <h2 className="text-2xl font-bold">Subpoules</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {filteredPools.length ? (
              filteredPools.map((pool) => (
                <div key={pool.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 text-[#101a2b]">
                  <RankBadge rank={pool.rank} />
                  <div className="min-w-0">
                    <div className="truncate font-bold">{pool.name}</div>
                    <div className="text-sm font-semibold text-[#475670]">Beste 4 samen · code {pool.code}</div>
                  </div>
                  <div className="text-right text-xl font-bold">{pool.points} pt</div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm font-medium text-[#475670]">Geen poules gevonden.</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const color = rank === 1 ? "bg-[#efa820]" : rank === 2 ? "bg-slate-400" : rank === 3 ? "bg-[#f4661e]" : "bg-[#20508c]";
  return (
    <div className={`grid size-10 place-items-center rounded-full ${color} text-sm font-bold text-white`}>
      {rank <= 3 ? <Medal aria-hidden="true" className="size-5" /> : rank}
    </div>
  );
}
