"use client";

import { CalendarDays, ClipboardList, Home, ListChecks, LogOut, Menu, Trophy, UserCog, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schema", label: "Schema", icon: CalendarDays },
  { href: "/ranglijst", label: "Ranglijst", icon: Trophy },
  { href: "/regels", label: "Regels", icon: ListChecks },
];

const privateLinks = [
  { href: "/voorspellingen", label: "Voorspellen", icon: ClipboardList },
  { href: "/poules", label: "WK-poules", icon: Users },
];

const accountLink = { href: "/account", label: "Mijn account", icon: UserCog };

export function QuickMenu() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

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

  const links = loggedIn ? [publicLinks[0], privateLinks[0], ...publicLinks.slice(1), ...privateLinks.slice(1)] : publicLinks;
  const AccountIcon = accountLink.icon;

  return (
    <>
      <button className="quick-menu-button" type="button" aria-expanded={open} aria-controls="quick-menu-panel" onClick={() => setOpen(true)}>
        <Menu aria-hidden="true" className="size-6" />
        <span className="sr-only">Menu openen</span>
      </button>
      {open ? (
        <div className="quick-menu-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <nav
            id="quick-menu-panel"
            className="quick-menu-panel"
            aria-label="Snelle navigatie"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/slimescore-app-icon-v2-192.png"
                  alt=""
                  width={44}
                  height={44}
                  className="quick-menu-app-icon"
                />
                <div>
                  <div className="text-xl font-bold text-[#081634]">Menu</div>
                  <div className="text-sm font-bold text-[#128f47]">Slime Score WK 2026</div>
                </div>
              </div>
              <button className="button-secondary min-h-10 px-3" type="button" onClick={() => setOpen(false)}>
                <X aria-hidden="true" className="size-5" />
                <span className="sr-only">Menu sluiten</span>
              </button>
            </div>
            <div className="mt-5 grid gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} className="quick-menu-link" onClick={() => setOpen(false)}>
                    <Icon aria-hidden="true" className="size-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              {!loggedIn ? (
                <Link className="quick-menu-link" href="/aanmelden" onClick={() => setOpen(false)}>
                  <Users aria-hidden="true" className="size-5" />
                  <span>Log in</span>
                </Link>
              ) : null}
              <Link className="quick-menu-link slime-link" href="/games?game=soccer" onClick={() => setOpen(false)}>
                <Image src="/slime-soccer-icon.png" alt="" width={28} height={28} className="quick-menu-link-image" />
                <span>Slime Soccer</span>
              </Link>
              {loggedIn ? (
                <div className="quick-menu-account-actions" aria-label="Account acties">
                  <Link href={accountLink.href} className="quick-menu-link quick-menu-link-compact" onClick={() => setOpen(false)}>
                    <AccountIcon aria-hidden="true" className="size-4" />
                    <span>{accountLink.label}</span>
                  </Link>
                  <form className="quick-menu-form" action="/logout" method="post">
                    <button className="quick-menu-link quick-menu-link-compact quick-menu-logout" type="submit">
                      <LogOut aria-hidden="true" className="size-4" />
                      <span>Uitloggen</span>
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
