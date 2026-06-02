"use client";

import { CalendarClock, ListChecks, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ENTRY_DEADLINE_ISO } from "@/lib/constants";

type Me = { loggedIn: boolean; nickname?: string | null; rank?: number; progress?: number };

const deadline = new Date(ENTRY_DEADLINE_ISO).getTime();

function countdown(now: number) {
  const diff = deadline - now;
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}u`;
  if (h > 0) return `${h}u ${m}m`;
  return `${m}m`;
}

export function StatusBar() {
  const [me, setMe] = useState<Me | null>(null);
  const [left, setLeft] = useState<string | null>(() => countdown(Date.now()));

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe({ loggedIn: false }));

    const id = setInterval(() => setLeft(countdown(Date.now())), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-bar-inner">
        <span className="status-chip status-chip-countdown">
          <CalendarClock aria-hidden="true" className="size-4" />
          {left ? <>Nog <strong>{left}</strong> om in te vullen</> : "Invullen gesloten"}
        </span>
        {me?.loggedIn ? (
          <Link href="/voorspellingen" className="status-me">
            <span className="status-chip">
              <Trophy aria-hidden="true" className="size-4" />
              {me.nickname ?? "Speler"} · #{me.rank}
            </span>
            <span className="status-chip status-chip-accent">
              <ListChecks aria-hidden="true" className="size-4" />
              {me.progress ?? 0}% ingevuld
            </span>
          </Link>
        ) : me && !me.loggedIn ? (
          <Link href="/#login" className="status-chip status-chip-accent">
            Gratis meedoen
          </Link>
        ) : null}
      </div>
    </div>
  );
}
