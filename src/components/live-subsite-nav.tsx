"use client";

import { CalendarDays, Home, ListChecks, Menu, Trophy, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { LiveLanguageSwitcher } from "@/components/live-language-switcher";
import { useActiveLocale } from "@/hooks/use-active-locale";
import { SITE_URL } from "@/lib/constants";

const navCopy = {
  nl: [
    { appHref: "/live", liveHref: "/", label: "Live" },
    { appHref: "/live/schema", liveHref: "/schema", label: "Schema" },
    { appHref: SITE_URL, liveHref: SITE_URL, label: "WK voorspellen", emphasis: true },
  ],
  en: [
    { appHref: "/live", liveHref: "/", label: "Live" },
    { appHref: "/live/schema", liveHref: "/schema", label: "Schedule" },
    { appHref: SITE_URL, liveHref: SITE_URL, label: "Predict WC", emphasis: true },
  ],
} as const;

const drawerLinks = {
  nl: [
    { href: "/", label: "Live", icon: Home },
    { href: "/schema", label: "Schema", icon: CalendarDays },
    { href: "/schema/knockout", label: "Finales", icon: Trophy },
    { href: SITE_URL, label: "WK voorspellen", icon: ListChecks, emphasis: true },
  ],
  en: [
    { href: "/", label: "Live", icon: Home },
    { href: "/schema", label: "Schedule", icon: CalendarDays },
    { href: "/schema/knockout", label: "Finals", icon: Trophy },
    { href: SITE_URL, label: "Predict WC", icon: ListChecks, emphasis: true },
  ],
} as const;

function isActive(pathname: string, href: string) {
  if (href.startsWith("https://")) return false;
  if (href === "/" || href === "/live") return pathname === "/" || pathname === "/live" || pathname === "/live/";
  if (href === "/schema" || href === "/live/schema") return pathname === "/schema" || pathname === "/schema/" || pathname === "/live/schema" || pathname === "/live/schema/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Sticky live-header: merk + LIVE-sticker + menu op alle live-tabs + compacte vlag-taalwissel. */
export function LiveSubsiteNav() {
  const pathname = usePathname() || "/live";
  const locale = useActiveLocale(pathname);
  const [isLiveHost, setIsLiveHost] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLiveHost(window.location.hostname.startsWith("live."));
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const items = navCopy[locale].map((item) => ({ href: isLiveHost ? item.liveHref : item.appHref, label: item.label, emphasis: "emphasis" in item && item.emphasis }));
  const panelItems = drawerLinks[locale].map((item) => ({ ...item, href: isLiveHost || item.href.startsWith("https://") ? item.href : `/live${item.href === "/" ? "" : item.href}` }));

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
            const external = item.href.startsWith("https://");
            const className = ["live-subsite-menu-link", active ? "is-active" : "", item.emphasis ? "live-subsite-menu-link-predict" : ""].filter(Boolean).join(" ");
            return (
              <a key={item.href} href={item.href} className={className} aria-current={active ? "page" : undefined} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                {item.label}
              </a>
            );
          })}
        </nav>
        <LiveLanguageSwitcher />
        <button className="live-menu-button" type="button" aria-expanded={menuOpen} aria-controls="live-quick-menu-panel" onClick={() => setMenuOpen(true)}>
          <Menu aria-hidden="true" className="size-5" />
          <span className="sr-only">{locale === "en" ? "Open menu" : "Menu openen"}</span>
        </button>
      </div>
      {menuOpen ? (
        <div className="live-menu-backdrop" role="presentation" onClick={() => setMenuOpen(false)}>
          <nav id="live-quick-menu-panel" className="live-menu-panel" aria-label={locale === "en" ? "Live quick navigation" : "Live snelle navigatie"} onClick={(event) => event.stopPropagation()}>
            <div className="live-menu-panel-head">
              <div className="live-menu-panel-brand">
                <Image src="/icons/slimescore-app-icon-v4-192.png" alt="" width={44} height={44} className="quick-menu-app-icon" />
                <div>
                  <div className="live-menu-title">Menu</div>
                  <div className="live-menu-subtitle">{locale === "en" ? "World Cup 2026 live" : "WK 2026 live"}</div>
                </div>
              </div>
              <button className="live-menu-close" type="button" onClick={() => setMenuOpen(false)}>
                <X aria-hidden="true" className="size-5" />
                <span className="sr-only">{locale === "en" ? "Close menu" : "Menu sluiten"}</span>
              </button>
            </div>
            <div className="live-menu-links">
              {panelItems.map((link) => {
                const Icon = link.icon;
                const active = isActive(pathname, link.href);
                const external = link.href.startsWith("https://");
                const emphasized = "emphasis" in link && link.emphasis;
                const className = ["live-menu-link", emphasized ? "live-menu-link-predict" : "", active ? "is-active" : ""].filter(Boolean).join(" ");
                return (
                  <a key={link.href} href={link.href} className={className} aria-current={active ? "page" : undefined} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={() => setMenuOpen(false)}>
                    <Icon aria-hidden="true" className="size-5" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
