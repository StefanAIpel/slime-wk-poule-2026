"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { LiveLanguageSwitcher } from "@/components/live-language-switcher";
import { useActiveLocale } from "@/hooks/use-active-locale";

const navCopy = {
  nl: [
    { appHref: "/live", liveHref: "/", label: "Live" },
    { appHref: "/live/schema", liveHref: "/schema", label: "Schema" },
    { appHref: "/live/schema/knockout", liveHref: "/schema/knockout", label: "Finales" },
  ],
  en: [
    { appHref: "/live", liveHref: "/", label: "Live" },
    { appHref: "/live/schema", liveHref: "/schema", label: "Schedule" },
    { appHref: "/live/schema/knockout", liveHref: "/schema/knockout", label: "Finals" },
  ],
} as const;

function isActive(pathname: string, href: string) {
  if (href === "/" || href === "/live") return pathname === "/" || pathname === "/live" || pathname === "/live/";
  if (href === "/schema" || href === "/live/schema") return pathname === "/schema" || pathname === "/schema/" || pathname === "/live/schema" || pathname === "/live/schema/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Sticky live-header: merk + LIVE-sticker + menu op alle live-tabs + compacte vlag-taalwissel. */
// Hostname verandert nooit binnen een sessie: lege subscribe, module-niveau
// zodat React niet elke render opnieuw abonneert.
const emptySubscribe = () => () => {};

export function LiveSubsiteNav() {
  const pathname = usePathname() || "/live";
  const locale = useActiveLocale(pathname);
  // Hostname is client-only; server rendert app-links (snapshot false).
  const isLiveHost = useSyncExternalStore(
    emptySubscribe,
    () => window.location.hostname.startsWith("live."),
    () => false,
  );

  const items = navCopy[locale].map((item) => ({ href: isLiveHost ? item.liveHref : item.appHref, label: item.label }));

  return (
    <header className="live-subsite-header">
      <div className="live-subsite-header-inner">
        <div className="live-subsite-brandwrap">
          <BrandWordmark onDark />
          <span className="live-badge">
            <span className="live-badge-dot" aria-hidden="true" />
            LIVE
          </span>
        </div>
        <nav className="live-subsite-menu" aria-label={locale === "en" ? "Live navigation" : "Live navigatie"}>
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <a key={item.href} href={item.href} className={active ? "live-subsite-menu-link is-active" : "live-subsite-menu-link"} aria-current={active ? "page" : undefined}>
                {item.label}
              </a>
            );
          })}
        </nav>
        <LiveLanguageSwitcher />
      </div>
    </header>
  );
}
