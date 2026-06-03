"use client";

import { CalendarDays, ClipboardList, Home, ListChecks, Menu, Trophy, Users } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schema", label: "Schema", icon: CalendarDays },
  { href: "/voorspellingen", label: "Voorspel", icon: ClipboardList },
  { href: "/poules", label: "Subpoules", icon: Users },
  { href: "/ranglijst", label: "Ranglijst", icon: Trophy },
  { href: "/regels", label: "Regels", icon: ListChecks },
];

// Altijd alle bestemmingen tonen — ook uitgelogd. Privé-pagina's vragen zelf om
// inloggen, zodat je vanaf b.v. het schema makkelijk bij de subpoules komt.
export function BottomNav({ current = "/" }: { current?: string }) {
  const openMenu = () => {
    window.dispatchEvent(new Event("slimescore:open-menu"));
  };

  return (
    <nav className="bottom-nav" data-count={links.length + 1} aria-label="Hoofdnavigatie">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a key={link.href} href={link.href} aria-current={current === link.href ? "page" : undefined}>
            <Icon aria-hidden="true" className="size-5" />
            <span>{link.label}</span>
          </a>
        );
      })}
      <button type="button" onClick={openMenu}>
        <Menu aria-hidden="true" className="size-5" />
        <span>Menu</span>
      </button>
    </nav>
  );
}
