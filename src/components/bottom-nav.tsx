"use client";

import { CalendarDays, ClipboardList, Home, ListChecks, Trophy, Users } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schema", label: "Schema", icon: CalendarDays },
  { href: "/voorspellingen", label: "Voorspel", icon: ClipboardList },
  { href: "/poules", label: "WK-poules", icon: Users },
  { href: "/ranglijst", label: "Ranglijst", icon: Trophy },
  { href: "/regels", label: "Regels", icon: ListChecks },
];

// Altijd alle bestemmingen tonen — ook uitgelogd. Privé-pagina's vragen zelf om
// inloggen, zodat je vanaf b.v. het schema makkelijk bij de subpoules komt.
export function BottomNav({ current = "/", className = "" }: { current?: string; className?: string }) {
  return (
    <nav className={["bottom-nav", className].filter(Boolean).join(" ")} data-count={links.length} aria-label="Hoofdnavigatie">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a key={link.href} href={link.href} aria-current={current === link.href ? "page" : undefined}>
            <Icon aria-hidden="true" className="size-5" />
            <span>{link.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
