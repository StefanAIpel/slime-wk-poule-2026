"use client";

import { CalendarDays, ClipboardList, Gamepad2, Home, ListChecks, Menu, Trophy, Users, X } from "lucide-react";
import { useState } from "react";
import { SLIME_GAME_URL } from "@/lib/constants";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schema", label: "Schema", icon: CalendarDays },
  { href: "/voorspellingen", label: "Voorspellen", icon: ClipboardList },
  { href: "/poules", label: "Poules", icon: Users },
  { href: "/ranglijst", label: "Ranglijst", icon: Trophy },
  { href: "/regels", label: "Regels", icon: ListChecks },
];

export function QuickMenu() {
  const [open, setOpen] = useState(false);

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
              <div>
                <div className="text-xl font-black text-[#081634]">Menu</div>
                <div className="text-sm font-black text-[#128f47]">Slime Score WK 2026</div>
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
                  <a key={link.href} href={link.href} className="quick-menu-link" onClick={() => setOpen(false)}>
                    <Icon aria-hidden="true" className="size-5" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
              <a className="quick-menu-link slime-link" href={SLIME_GAME_URL} target="_blank" rel="noopener noreferrer">
                <Gamepad2 aria-hidden="true" className="size-5" />
                <span>Slime game</span>
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
