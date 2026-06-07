"use client";

import { ChevronLeft, ChevronRight, Medal, Search, Trophy, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/avatar";
import type { Locale } from "@/lib/i18n";

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

const PAGE_SIZE = 100;

const rankingExplorerCopy = {
  nl: {
    tabListLabel: "Kies ranglijst",
    worldTitle: "Wereldranglijst",
    poolsTitle: "WK-poules",
    playerTab: "Per speler",
    poolTab: "Per poule",
    playerSearchPlaceholder: "Zoek een speler of team…",
    poolSearchPlaceholder: "Zoek een WK-poule of code…",
    playerFallback: "Speler",
    noPlayers: "Geen spelers gevonden.",
    noPools: "Geen WK-poules gevonden.",
    playerRankLabel: "Spelerrang",
    poolRankLabel: "Poule-rang",
    poolTotalHint: "Top 4 totaal",
    exactSuffix: "exact",
    pointsSuffix: "pt",
    previousPage: "Vorige 100 spelers",
    nextPage: "Volgende 100 spelers",
    pageOf: "van",
  },
  en: {
    tabListLabel: "Choose ranking",
    worldTitle: "World rankings",
    poolsTitle: "World Cup pools",
    playerTab: "Per player",
    poolTab: "Per pool",
    playerSearchPlaceholder: "Search for a player or team…",
    poolSearchPlaceholder: "Search for a World Cup pool or code…",
    playerFallback: "Player",
    noPlayers: "No players found.",
    noPools: "No World Cup pools found.",
    playerRankLabel: "Player rank",
    poolRankLabel: "Pool rank",
    poolTotalHint: "Top 4 total",
    exactSuffix: "exact",
    pointsSuffix: "pts",
    previousPage: "Previous 100 players",
    nextPage: "Next 100 players",
    pageOf: "of",
  },
} as const;

type RankingExplorerCopy = (typeof rankingExplorerCopy)[Locale];

function matches(query: string, ...fields: (string | null | undefined)[]) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => (field ?? "").toLowerCase().includes(q));
}

export function RankingExplorer({ players, pools, locale = "nl" }: { players: PlayerRow[]; pools: PoolRow[]; locale?: Locale }) {
  const copy = rankingExplorerCopy[locale];
  const [qWorld, setQWorld] = useState("");
  const [qPools, setQPools] = useState("");
  const [view, setView] = useState<"wereld" | "subpoules">("wereld");
  const [page, setPage] = useState(0);

  const filteredPlayers = useMemo(
    () => players.filter((p) => matches(qWorld, p.nickname, p.teamName)),
    [players, qWorld],
  );
  const filteredPools = useMemo(() => pools.filter((p) => matches(qPools, p.name, p.code)), [pools, qPools]);

  // Bij een nieuwe zoekopdracht weer op de eerste 100 beginnen.
  function onSearchWorld(value: string) {
    setQWorld(value);
    setPage(0);
  }

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pagedPlayers = filteredPlayers.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="grid gap-4">
      {/* Tabs alleen op mobiel; op desktop staan beide tabellen naast elkaar. */}
      <div className="flex gap-2 lg:hidden" role="tablist" aria-label={copy.tabListLabel}>
        <button
          type="button"
          role="tab"
          aria-selected={view === "wereld"}
          className={`tab-pill ${view === "wereld" ? "is-active" : ""}`}
          onClick={() => setView("wereld")}
        >
          <Trophy aria-hidden="true" className="size-4" />
          {copy.playerTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "subpoules"}
          className={`tab-pill ${view === "subpoules" ? "is-active" : ""}`}
          onClick={() => setView("subpoules")}
        >
          <Users aria-hidden="true" className="size-4" />
          {copy.poolTab}
        </button>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <article className={`panel overflow-hidden ${view === "wereld" ? "" : "hidden"} lg:block`}>
          <div className="wc-header flex items-center gap-2.5 p-2.5 text-white">
            <Trophy aria-hidden="true" className="size-5" />
            <h2 className="text-lg font-bold">{copy.worldTitle}</h2>
          </div>
          <TableSearch value={qWorld} onChange={onSearchWorld} placeholder={copy.playerSearchPlaceholder} />
          <div className="divide-y divide-slate-100">
            {pagedPlayers.length ? (
              pagedPlayers.map((row) => (
                <div key={row.userId} className="ranking-row-player flex items-center gap-2 px-2.5 py-1.5 text-[#101a2b]">
                  <RankBadge rank={row.rank} label={copy.playerRankLabel} />
                  <Avatar name={row.nickname || row.teamName || copy.playerFallback} avatarKey={row.avatarKey} size={24} />
                  <div className="min-w-0 flex-1 truncate text-sm leading-tight">
                    <span className="font-semibold">{row.nickname || copy.playerFallback}</span>
                    {row.teamName ? <span className="font-medium text-[#5a6b82]"> · {row.teamName}</span> : null}
                  </div>
                  <span className="hidden text-[11px] font-semibold text-[#5a6b82] sm:inline">{row.exact} {copy.exactSuffix}</span>
                  <span className="text-sm font-bold tabular-nums">{row.points} {copy.pointsSuffix}</span>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm font-medium text-[#475670]">{copy.noPlayers}</p>
            )}
          </div>
          {filteredPlayers.length > PAGE_SIZE ? (
            <Pager
              page={safePage}
              totalPages={totalPages}
              total={filteredPlayers.length}
              copy={copy}
              onPrev={() => setPage((p) => Math.max(0, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            />
          ) : null}
        </article>

        <article className={`panel overflow-hidden ${view === "subpoules" ? "" : "hidden"} lg:block`}>
          <div className="flex items-center gap-2.5 bg-[#1c855a] p-2.5 text-white">
            <Users aria-hidden="true" className="size-5" />
            <h2 className="text-lg font-bold">{copy.poolsTitle}</h2>
          </div>
          <TableSearch value={qPools} onChange={setQPools} placeholder={copy.poolSearchPlaceholder} />
          <div className="divide-y divide-slate-100">
            {filteredPools.length ? (
              filteredPools.map((pool) => (
                <div key={pool.id} className="ranking-row-pool flex items-center gap-2 px-2.5 py-1.5 text-[#101a2b]">
                  <RankBadge rank={pool.rank} label={copy.poolRankLabel} />
                  <div className="min-w-0 flex-1 truncate text-sm leading-tight">
                    <span className="font-semibold">{pool.name}</span>
                    <span className="font-medium text-[#5a6b82]"> · {pool.code}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums" title={copy.poolTotalHint}>{pool.points} {copy.pointsSuffix}</span>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm font-medium text-[#475670]">{copy.noPools}</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

function Pager({
  page,
  totalPages,
  total,
  copy,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  copy: RankingExplorerCopy;
  onPrev: () => void;
  onNext: () => void;
}) {
  const from = page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, total);
  return (
    <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 px-2.5 py-2">
      <button
        type="button"
        className="ranking-pager-btn"
        onClick={onPrev}
        disabled={page === 0}
        aria-label={copy.previousPage}
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      <span className="text-xs font-semibold text-[#475670] tabular-nums">
        {from}–{to} {copy.pageOf} {total}
      </span>
      <button
        type="button"
        className="ranking-pager-btn"
        onClick={onNext}
        disabled={page >= totalPages - 1}
        aria-label={copy.nextPage}
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
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

function RankBadge({ rank, label }: { rank: number; label: string }) {
  const color = rank === 1 ? "bg-[#efa820]" : rank === 2 ? "bg-slate-400" : rank === 3 ? "bg-[#f4661e]" : "bg-[#20508c]";
  return (
    <div className={`grid size-6 flex-none place-items-center rounded-full ${color} text-[11px] font-bold tabular-nums text-white`} aria-label={`${label} #${rank}`}>
      {rank <= 3 ? <Medal aria-hidden="true" className="size-3.5" /> : rank}
    </div>
  );
}
