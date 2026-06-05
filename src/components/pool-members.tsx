"use client";

import { ChevronDown, Crown, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/avatar";

export type MatchLine = {
  matchId: number;
  when: string;
  home: string;
  away: string;
  predHome: number | null;
  predAway: number | null;
  resultHome: number | null;
  resultAway: number | null;
  points: number | null;
};

export type PoolMember = {
  userId: string;
  rank: number;
  worldRank: number | null;
  isOwner: boolean;
  name: string;
  teamName: string | null;
  avatarKey: string | null;
  points: number;
  isYou: boolean;
  locked: boolean;
  past: MatchLine[];
  upcoming: MatchLine[];
};

/**
 * Klikbare stand binnen een subpoule: klik een speler open om diens behaalde
 * punten per afgelopen wedstrijd en voorspellingen voor komende wedstrijden te
 * zien. Andere spelers blijven verborgen tot de deadline (e-mail altijd privé).
 */
export function PoolMembers({ members }: { members: PoolMember[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="pool-members-section border-b border-slate-200 p-4">
      <div className="pool-members-title-row">
        <h3 className="pool-members-title text-lg font-bold text-[#101a2b]">Ranglijst &amp; deelnemers</h3>
        <span className="pool-members-count">{members.length}</span>
      </div>
      <p className="pool-members-hint mt-1 text-sm font-medium text-[#48617f]">Tik op een speler voor punten en voorspellingen.</p>
      <div className="pool-members-list mt-3 grid gap-2">
        {members.map((member) => {
          const open = openId === member.userId;
          return (
            <div key={member.userId} className="pool-member-card rounded-lg border border-slate-200 bg-white">
              <button
                type="button"
                className="pool-member-button flex w-full items-center gap-3 p-3 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : member.userId)}
              >
                <span className="pool-member-rank grid size-7 flex-none place-items-center rounded-full bg-[#20508c] text-xs font-bold text-white">
                  {member.rank}
                </span>
                <Avatar name={member.name} avatarKey={member.avatarKey} size={26} />
                <span className="pool-member-main min-w-0 flex-1 truncate">
                  <span className="pool-member-name font-bold text-[#081634]">{member.name}</span>
                  {member.isOwner ? (
                    <Crown aria-label="Beheerder" className="ml-1 inline size-4 -translate-y-px text-[#e0a516]" />
                  ) : null}
                  {member.isYou ? <span className="pool-member-you ml-1 text-xs font-bold text-[#16863a]">(jij)</span> : null}
                  {member.teamName ? <span className="pool-member-team font-medium text-[#475670]"> · {member.teamName}</span> : null}
                  {member.worldRank ? (
                    <span className="pool-member-world mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#7a8aa3]">
                      <Globe aria-hidden="true" className="size-3" />
                      Wereldrang #{member.worldRank}
                    </span>
                  ) : null}
                </span>
                <span className="pool-member-points font-bold tabular-nums text-[#081634]">{member.points} pt</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`pool-member-chevron size-4 flex-none text-[#475670] transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open ? (
                <div className="grid gap-4 border-t border-slate-200 p-3">
                  {member.locked ? (
                    <p className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm font-medium text-[#48617f]">
                      <Lock aria-hidden="true" className="size-4" />
                      De voorspellingen van anderen zijn zichtbaar zodra de invulronde sluit.
                    </p>
                  ) : (
                    <>
                      <LineTable title="Afgelopen wedstrijden" lines={member.past} showPoints emptyText="Nog geen afgelopen wedstrijden." />
                      <LineTable title="Komende wedstrijden" lines={member.upcoming} emptyText="Geen voorspellingen ingevuld." />
                    </>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LineTable({
  title,
  lines,
  showPoints = false,
  emptyText,
}: {
  title: string;
  lines: MatchLine[];
  showPoints?: boolean;
  emptyText: string;
}) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-bold text-[#081634]">{title}</h4>
      {lines.length ? (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          {lines.map((line) => (
            <div
              key={line.matchId}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0"
            >
              <span className="min-w-0 truncate font-medium text-[#081634]">
                {line.home} <span className="text-[#475670]">–</span> {line.away}
                <span className="ml-1 block text-xs font-medium text-[#7a8aa3]">{line.when}</span>
              </span>
              <span className="text-right font-semibold tabular-nums text-[#101a2b]">
                {line.predHome ?? "–"}–{line.predAway ?? "–"}
                {showPoints && line.resultHome !== null ? (
                  <span className="block text-xs font-medium text-[#475670]">
                    uitslag {line.resultHome}–{line.resultAway}
                  </span>
                ) : null}
              </span>
              {showPoints ? (
                <span className="w-12 text-right font-bold tabular-nums text-[#16863a]">
                  {line.points === null ? "–" : `${line.points}p`}
                </span>
              ) : (
                <span className="w-2" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm font-medium text-[#48617f]">{emptyText}</p>
      )}
    </div>
  );
}
