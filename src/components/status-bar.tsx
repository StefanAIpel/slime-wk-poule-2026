"use client";

import { ArrowRight, CalendarClock, ListChecks, Trophy } from "lucide-react";
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
    let mounted = true;

    async function refreshMe() {
      try {
        const response = await fetch("/api/me", { cache: "no-store" });
        const data = (await response.json()) as Me;
        if (mounted) setMe(data);
      } catch {
        if (mounted) setMe({ loggedIn: false });
      }
    }

    function handleMeUpdate(event: Event) {
      const detail = (event as CustomEvent<Partial<Me>>).detail;
      if (!detail) return;
      setMe((current) => (current ? { ...current, ...detail } : current));
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") void refreshMe();
    }

    void refreshMe();
    window.addEventListener("slimescore:me-update", handleMeUpdate);
    window.addEventListener("focus", refreshMe);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const id = setInterval(() => setLeft(countdown(Date.now())), 30000);
    return () => {
      mounted = false;
      clearInterval(id);
      window.removeEventListener("slimescore:me-update", handleMeUpdate);
      window.removeEventListener("focus", refreshMe);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="status-bar">
      <div className="status-bar-inner">
        <Link href="/voorspellingen" className="status-chip status-chip-countdown">
          <CalendarClock aria-hidden="true" className="size-4" />
          {left ? <>Nog <strong>{left}</strong> om in te vullen</> : "Invullen gesloten"}
        </Link>
        {me?.loggedIn ? (
          <span className="status-me">
            <Link href="/account" className="status-chip" aria-label="Mijn account">
              <Trophy aria-hidden="true" className="size-4" />
              {me.nickname ?? "Speler"} · #{me.rank}
            </Link>
            <Link href="/voorspellingen" className="status-chip status-chip-accent status-chip-progress">
              <ListChecks aria-hidden="true" className="size-4" />
              {me.progress ?? 0}% ingevuld
            </Link>
          </span>
        ) : me && !me.loggedIn ? (
          <Link href="/aanmelden" className="status-cta">
            Gratis meedoen
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
