"use client";

import { CalendarDays, ClipboardList, Gamepad2, Home, ListChecks, LogIn, Trophy, UserCog, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const homeLink = { href: "/", label: "Home", icon: Home };
const schemaLink = { href: "/schema", label: "Schema", icon: CalendarDays };
const publicTail = [
  { href: "/ranglijst", label: "Ranglijst", icon: Trophy },
  { href: "/games", label: "Spelletjes", icon: Gamepad2 },
  { href: "/regels", label: "Regels", icon: ListChecks },
];
const privateLinks = [
  { href: "/voorspellingen", label: "Voorspel", icon: ClipboardList },
  { href: "/poules", label: "Subpoules", icon: Users },
];

/**
 * Desktop-headerbalk met groter logo + geïntegreerd menu. Verbergt zich op mobiel
 * (daar is de onderbalk). Menu is auth-bewust: uitgelogd zonder privé-opties, maar
 * met directe Speelschema- en Inloggen-knop.
 */
export function SiteHeader() {
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

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
        <Link href="/" className="site-header-logo" aria-label="Slime Score home">
          <Image src="/icon.png" width={96} height={96} alt="" aria-hidden="true" priority />
          <span className="brand-wordmark">
            <span className="brand-wordmark-text">
              <span className="brand-wordmark-slime">Slime</span>
              <span className="brand-wordmark-score">Score</span>
              <span className="brand-wordmark-tld">.com</span>
            </span>
          </span>
        </Link>
        <nav className="site-header-nav" aria-label="Hoofdmenu">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`site-header-link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
                <Icon aria-hidden="true" className="size-4" />
                {link.label}
              </Link>
            );
          })}
          {loggedIn ? (
            <Link href="/account" className="site-header-cta">
              <UserCog aria-hidden="true" className="size-4" />
              Account
            </Link>
          ) : (
            <Link href="/#login" className="site-header-cta site-header-cta-primary">
              <LogIn aria-hidden="true" className="size-4" />
              Inloggen
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
