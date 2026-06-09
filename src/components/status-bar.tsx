"use client";

import { ArrowRight, CalendarClock, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import { useActiveLocale } from "@/hooks/use-active-locale";
import { ENTRY_DEADLINE_ISO } from "@/lib/constants";
import { localizedHref, type Locale } from "@/lib/i18n";

type Me = { loggedIn: boolean; nickname?: string | null; avatarKey?: string | null; rank?: number | null; progress?: number };

const deadline = new Date(ENTRY_DEADLINE_ISO).getTime();

function countdown(now: number, locale: Locale) {
  const diff = deadline - now;
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return locale === "en" ? `${d}d ${h}h` : `${d}d ${h}u`;
  if (h > 0) return locale === "en" ? `${h}h ${m}m` : `${h}u ${m}m`;
  return `${m}m`;
}

export function StatusBar() {
  const pathname = usePathname();
  const locale = useActiveLocale(pathname || "/");
  const [me, setMe] = useState<Me | null>(null);
  const [left, setLeft] = useState<string | null>(() => countdown(Date.now(), locale));
  const predictHref = locale === "en" && !me?.loggedIn ? "/en#login" : localizedHref("/voorspellingen", locale);

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

    const updateCountdown = () => setLeft(countdown(Date.now(), locale));
    const initialCountdownId = window.setTimeout(updateCountdown, 0);
    const id = setInterval(updateCountdown, 30000);
    return () => {
      mounted = false;
      window.clearTimeout(initialCountdownId);
      clearInterval(id);
      window.removeEventListener("slimescore:me-update", handleMeUpdate);
      window.removeEventListener("focus", refreshMe);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [locale]);

  return (
    <div className="status-bar">
      <div className="status-bar-inner">
        <Link href={predictHref} className="status-chip status-chip-countdown">
          <CalendarClock aria-hidden="true" className="size-4" />
          {left ? (
            locale === "en" ? <><strong>{left}</strong> until WC</> : <>Nog <strong>{left}</strong> tot WK</>
          ) : locale === "en" ? "Entries closed" : "Invullen gesloten"}
        </Link>
        {me?.loggedIn ? (
          <span className="status-me">
            <Link href={localizedHref("/account", locale)} className="status-chip status-chip-account" aria-label={locale === "en" ? "My account" : "Mijn account"}>
              <Avatar name={me.nickname ?? (locale === "en" ? "Player" : "Speler")} avatarKey={me.avatarKey} size={18} />
              {me.nickname ?? (locale === "en" ? "Player" : "Speler")}{typeof me.rank === "number" ? <> · #{me.rank}</> : null}
            </Link>
            <Link href={localizedHref("/voorspellingen", locale)} className="status-chip status-chip-accent status-chip-progress">
              <ListChecks aria-hidden="true" className="size-4" />
              {me.progress ?? 0}% {locale === "en" ? "completed" : "ingevuld"}
            </Link>
          </span>
        ) : me && !me.loggedIn ? (
          <Link href={locale === "en" ? "/en#login" : localizedHref("/aanmelden", locale)} className="status-cta">
            {locale === "en" ? "Join for free" : "Gratis meedoen"}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
