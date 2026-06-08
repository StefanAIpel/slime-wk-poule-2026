"use client";

import { usePathname } from "next/navigation";
import { BrandWordmark } from "@/components/brand-wordmark";
import { LiveLanguageSwitcher } from "@/components/live-language-switcher";
import { useActiveLocale } from "@/hooks/use-active-locale";

const navCopy = {
  nl: [
    { href: "/live", label: "Live" },
    { href: "/live/schema", label: "Schema" },
    { href: "/live/schema/knockout", label: "Finales" },
  ],
  en: [
    { href: "/live", label: "Live" },
    { href: "/live/schema", label: "Schedule" },
    { href: "/live/schema/knockout", label: "Finals" },
  ],
} as const;

function isActive(pathname: string, href: string) {
  if (href === "/live") return pathname === "/live" || pathname === "/live/" || pathname === "/";
  if (href === "/live/schema") return pathname === href || pathname === `${href}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Sticky live-header: merk + LIVE-sticker + menu op alle live-tabs + compacte vlag-taalwissel. */
export function LiveSubsiteNav() {
  const pathname = usePathname() || "/live";
  const locale = useActiveLocale(pathname);
  const items = navCopy[locale];

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
