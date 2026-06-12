"use client";

import { CalendarDays, ClipboardList, Gamepad2, Home, ListChecks, LogIn, LogOut, Trophy, UserCog, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LiveNowBadge } from "@/components/live-now-badge";
import { useActiveLocale } from "@/hooks/use-active-locale";
import { localizedHref, stripLocaleFromPath } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/browser";

const homeLink = { href: "/", label: "Home", labelEn: "Home", icon: Home };
const schemaLink = { href: "/schema", label: "Schema", labelEn: "Schedule", icon: CalendarDays };
const publicTail = [
  { href: "/ranglijst", label: "Ranglijst", labelEn: "Rankings", icon: Trophy },
  { href: "/games", label: "Spelletjes", labelEn: "Games", icon: Gamepad2 },
  { href: "/regels", label: "Regels", labelEn: "Rules", icon: ListChecks },
];
const privateLinks = [
  { href: "/voorspellingen", label: "Voorspel", labelEn: "Predict", icon: ClipboardList, emphasis: true },
  { href: "/poules", label: "WK-poules", labelEn: "Pools", icon: Users },
];

/**
 * Desktop-headerbalk met groter logo + geïntegreerd menu. Verbergt zich op mobiel
 * (daar is de onderbalk). Menu is auth-bewust: uitgelogd zonder privé-opties, maar
 * met directe Speelschema- en Inloggen-knop.
 */
export function SiteHeader() {
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();
  const locale = useActiveLocale(pathname || "/");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setLoggedIn(Boolean(data.session)));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(Boolean(session)));
    return () => subscription.unsubscribe();
  }, []);

  const links = loggedIn
    ? [homeLink, schemaLink, ...privateLinks, ...publicTail]
    : [homeLink, schemaLink, ...publicTail];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={localizedHref("/", locale)} className="site-header-logo" aria-label="SlimeScore home">
          <Image
            className="site-header-avatar header-slime-avatar"
            src="/assets/transparant-avatar/wk_slime_700_transparant.webp"
            width={700}
            height={700}
            sizes="60px"
            alt=""
            aria-hidden="true"
            priority
          />
          <span className="brand-wordmark">
            <span className="brand-wordmark-text">
              <span className="brand-wordmark-slime">Slime</span>
              <span className="brand-wordmark-score">Score</span>
              <span className="brand-wordmark-tld">.com</span>
            </span>
          </span>
        </Link>
        <nav className="site-header-nav" aria-label={locale === "en" ? "Main menu" : "Hoofdmenu"}>
          <div className="site-header-link-row">
            {links.map((link) => {
              const Icon = link.icon;
              const active = stripLocaleFromPath(pathname || "/") === link.href;
              const emphasized = "emphasis" in link && link.emphasis;
              return (
                <Link
                  key={link.href}
                  href={localizedHref(link.href, locale)}
                  className={`site-header-link ${emphasized ? "site-header-link-emphasis" : ""} ${active ? "is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {locale === "en" ? link.labelEn : link.label}
                </Link>
              );
            })}
          </div>
          <div className="site-header-utility-row">
            <LiveNowBadge locale={locale} />
            <LanguageSwitcher />
            {loggedIn ? (
              <>
                <Link href={localizedHref("/account", locale)} className="site-header-mini-action">
                  <UserCog aria-hidden="true" className="size-3.5" />
                  {locale === "en" ? "Account" : "Account"}
                </Link>
                <form action="/logout" method="post">
                  <button className="site-header-mini-action" type="submit">
                    <LogOut aria-hidden="true" className="size-3.5" />
                    {locale === "en" ? "Log out" : "Uitloggen"}
                  </button>
                </form>
              </>
            ) : (
              <Link href={localizedHref("/aanmelden", locale)} className="site-header-cta site-header-cta-primary">
                <LogIn aria-hidden="true" className="size-4" />
                {locale === "en" ? "Sign up" : "Aanmelden"}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
