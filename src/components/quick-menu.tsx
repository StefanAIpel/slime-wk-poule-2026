"use client";

import { CalendarDays, ClipboardList, Home, KeyRound, ListChecks, LogOut, Menu, Radio, Trophy, UserCog, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useActiveLocale } from "@/hooks/use-active-locale";
import { localizedHref } from "@/lib/i18n";
import { LIVE_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/browser";

const publicLinks = [
  { href: "/", label: "Home", labelEn: "Home", icon: Home },
  { href: "/ranglijst", label: "Ranglijst", labelEn: "Rankings", icon: Trophy },
  { href: "/regels", label: "Regels", labelEn: "Rules", icon: ListChecks },
];

const menuPairLinks = [
  { href: "/schema", label: "Schema", labelEn: "Schedule", icon: CalendarDays, external: false },
  { href: LIVE_URL, label: "Live", labelEn: "Live", icon: Radio, external: true },
];

const privateLinks = [
  { href: "/voorspellingen", label: "Voorspellen", labelEn: "Predict", icon: ClipboardList },
  { href: "/poules", label: "WK-poules", labelEn: "Pools", icon: Users },
];

const accountLink = { href: "/account", label: "Mijn account", labelEn: "My account", icon: UserCog };
const joinPoolLink = { href: "/?meedoen=1", label: "Meedoen", labelEn: "Join pool", icon: KeyRound };

export function QuickMenu() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();
  const locale = useActiveLocale(pathname || "/");

  useEffect(() => {
    const handleOpenMenu = () => setOpen(true);
    window.addEventListener("slimescore:open-menu", handleOpenMenu);

    return () => window.removeEventListener("slimescore:open-menu", handleOpenMenu);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehaviorY;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehaviorY = "contain";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehaviorY = previousOverscroll;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const links = loggedIn ? [publicLinks[0], privateLinks[0], ...publicLinks.slice(1)] : publicLinks;
  const [primaryLink, ...tailLinks] = links;
  const AccountIcon = accountLink.icon;

  return (
    <>
      <button className="quick-menu-button" type="button" aria-expanded={open} aria-controls="quick-menu-panel" onClick={() => setOpen(true)}>
        <Menu aria-hidden="true" className="size-6" />
        <span className="sr-only">{locale === "en" ? "Open menu" : "Menu openen"}</span>
      </button>
      {open ? (
        <div className="quick-menu-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <nav
            id="quick-menu-panel"
            className="quick-menu-panel"
            aria-label={locale === "en" ? "Quick navigation" : "Snelle navigatie"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Image
                  src="/icons/slimescore-app-icon-v4-192.png"
                  alt=""
                  width={46}
                  height={46}
                  className="quick-menu-app-icon"
                />
                <div className="quick-menu-brand" aria-label={locale === "en" ? "SlimeScore World Cup 2026" : "SlimeScore WK 2026"}>
                  <div className="quick-menu-brand-name" aria-hidden="true">
                    <span className="quick-menu-brand-slime">Slime</span><span className="quick-menu-brand-score">Score</span>
                  </div>
                  <div className="quick-menu-brand-sub">{locale === "en" ? "WC 2026" : "WK 2026"}</div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button className="button-secondary min-h-10 px-3" type="button" onClick={() => setOpen(false)}>
                  <X aria-hidden="true" className="size-5" />
                  <span className="sr-only">{locale === "en" ? "Close menu" : "Menu sluiten"}</span>
                </button>
              </div>
            </div>
            <div className="mt-5 grid gap-2">
              {primaryLink ? (() => {
                const Icon = primaryLink.icon;
                return (
                  <div className="quick-menu-home-row">
                    <Link key={primaryLink.href} href={localizedHref(primaryLink.href, locale)} className="quick-menu-link quick-menu-home-link" onClick={() => setOpen(false)}>
                      <Icon aria-hidden="true" className="size-5" />
                      <span>{locale === "en" ? primaryLink.labelEn : primaryLink.label}</span>
                    </Link>
                    <LanguageSwitcher className="quick-menu-language-switcher" />
                  </div>
                );
              })() : null}
              <div className="quick-menu-split-row" aria-label={locale === "en" ? "Live and schedule" : "Live en schema"}>
                {menuPairLinks.map((link) => {
                  const Icon = link.icon;
                  const label = locale === "en" ? link.labelEn : link.label;
                  const href = link.external ? link.href : localizedHref(link.href, locale);
                  return (
                    <a
                      key={link.href}
                      href={href}
                      className={link.external ? "quick-menu-link quick-menu-link-half quick-menu-live-link" : "quick-menu-link quick-menu-link-half"}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <Icon aria-hidden="true" className="size-5" />
                      <span>{label}</span>
                    </a>
                  );
                })}
              </div>
              {loggedIn ? (
                <div className="quick-menu-split-row" aria-label={locale === "en" ? "Pools and joining" : "WK-poules en meedoen"}>
                  {[privateLinks[1], joinPoolLink].map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={localizedHref(link.href, locale)} className="quick-menu-link quick-menu-link-half" onClick={() => setOpen(false)}>
                        <Icon aria-hidden="true" className="size-5" />
                        <span>{locale === "en" ? link.labelEn : link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
              {tailLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={localizedHref(link.href, locale)} className="quick-menu-link" onClick={() => setOpen(false)}>
                    <Icon aria-hidden="true" className="size-5" />
                    <span>{locale === "en" ? link.labelEn : link.label}</span>
                  </Link>
                );
              })}
              {!loggedIn ? (
                <Link className="quick-menu-link" href={localizedHref("/aanmelden", locale)} onClick={() => setOpen(false)}>
                  <Users aria-hidden="true" className="size-5" />
                  <span>{locale === "en" ? "Sign in" : "Log in"}</span>
                </Link>
              ) : null}
              <Link className="quick-menu-link slime-link" href={localizedHref("/games?game=soccer", locale)} onClick={() => setOpen(false)}>
                <Image src="/slime-soccer-icon.webp" alt="" width={28} height={28} className="quick-menu-link-image" />
                <span>Slime Soccer</span>
              </Link>
              {loggedIn ? (
                <div className="quick-menu-account-actions" aria-label={locale === "en" ? "Account actions" : "Account acties"}>
                  <Link href={localizedHref(accountLink.href, locale)} className="quick-menu-link quick-menu-link-compact" onClick={() => setOpen(false)}>
                    <AccountIcon aria-hidden="true" className="size-4" />
                    <span>{locale === "en" ? accountLink.labelEn : accountLink.label}</span>
                  </Link>
                  <form className="quick-menu-form" action="/logout" method="post">
                    <button className="quick-menu-link quick-menu-link-compact quick-menu-logout" type="submit">
                      <LogOut aria-hidden="true" className="size-4" />
                      <span>{locale === "en" ? "Log out" : "Uitloggen"}</span>
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
