"use client";

import { Medal, Search, Trophy, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/avatar";

export type PlayerRow = {
  userId: string;
  rank: number;
  nickname: string | null;
  teamName: string | null;
  avatarKey?: string | null;
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
  const [qWorld, setQWorld] = useState("");
  const [qPools, setQPools] = useState("");
  const [view, setView] = useState<"wereld" | "subpoules">("wereld");

  const filteredPlayers = useMemo(
    () => players.filter((p) => matches(qWorld, p.nickname, p.teamName)),
    [players, qWorld],
  );
  const filteredPools = useMemo(() => pools.filter((p) => matches(qPools, p.name, p.code)), [pools, qPools]);

  return (
    <div className="grid gap-4">
      {/* Tabs alleen op mobiel; op desktop staan beide tabellen naast elkaar. */}
      <div className="flex gap-2 lg:hidden" role="tablist" aria-label="Kies ranglijst">
        <button
          type="button"
          role="tab"
          aria-selected={view === "wereld"}
          className={`tab-pill ${view === "wereld" ? "is-active" : ""}`}
          onClick={() => setView("wereld")}
        >
          <Trophy aria-hidden="true" className="size-4" />
          Wereldranglijst
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "subpoules"}
          className={`tab-pill ${view === "subpoules" ? "is-active" : ""}`}
          onClick={() => setView("subpoules")}
        >
          <Users aria-hidden="true" className="size-4" />
          Subpoules
        </button>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <article className={`panel overflow-hidden ${view === "wereld" ? "" : "hidden"} lg:block`}>
          <div className="wc-header flex items-center gap-3 p-3 text-white">
            <Trophy aria-hidden="true" className="size-6" />
            <h2 className="text-xl font-bold">Wereldranglijst</h2>
          </div>
          <TableSearch value={qWorld} onChange={setQWorld} placeholder="Zoek een speler of team…" />
          <div className="divide-y divide-slate-100">
            {filteredPlayers.length ? (
              filteredPlayers.map((row) => (
                <div key={row.userId} className="flex items-center gap-3 px-3 py-2 text-[#101a2b]">
                  <RankBadge rank={row.rank} />
                  <Avatar name={row.nickname || row.teamName || "Speler"} avatarKey={row.avatarKey} size={30} />
                  <div className="min-w-0 flex-1 truncate">
                    <span className="font-bold">{row.nickname || "Speler"}</span>
                    {row.teamName ? <span className="font-medium text-[#475670]"> · {row.teamName}</span> : null}
                  </div>
                  <span className="hidden text-xs font-semibold text-[#475670] sm:inline">{row.exact} exact</span>
                  <span className="font-bold tabular-nums">{row.points} pt</span>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm font-medium text-[#475670]">Geen spelers gevonden.</p>
            )}
          </div>
        </article>

        <article className={`panel overflow-hidden ${view === "subpoules" ? "" : "hidden"} lg:block`}>
          <div className="flex items-center gap-3 bg-[#1c855a] p-3 text-white">
            <Users aria-hidden="true" className="size-6" />
            <h2 className="text-xl font-bold">Subpoules</h2>
          </div>
          <TableSearch value={qPools} onChange={setQPools} placeholder="Zoek een subpoule of code…" />
          <div className="divide-y divide-slate-100">
            {filteredPools.length ? (
              filteredPools.map((pool) => (
                <div key={pool.id} className="flex items-center gap-3 px-3 py-2 text-[#101a2b]">
                  <RankBadge rank={pool.rank} />
                  <div className="min-w-0 flex-1 truncate">
                    <span className="font-bold">{pool.name}</span>
                    <span className="font-medium text-[#475670]"> · {pool.code}</span>
                  </div>
                  <span className="font-bold tabular-nums">{pool.points} pt</span>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm font-medium text-[#475670]">Geen subpoules gevonden.</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

function TableSearch({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
      <Search aria-hidden="true" className="size-4 text-[#475670]" />
      <input
        className="w-full bg-transparent text-sm font-medium text-[#101a2b] outline-none"
        type="search"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const color = rank === 1 ? "bg-[#efa820]" : rank === 2 ? "bg-slate-400" : rank === 3 ? "bg-[#f4661e]" : "bg-[#20508c]";
  return (
    <div className={`grid size-7 flex-none place-items-center rounded-full ${color} text-xs font-bold text-white`}>
      {rank <= 3 ? <Medal aria-hidden="true" className="size-4" /> : rank}
    </div>
  );
}
