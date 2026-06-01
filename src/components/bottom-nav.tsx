import { CalendarDays, ClipboardList, Home, ListChecks, MoreHorizontal, Trophy, Users } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schema", label: "Schema", icon: CalendarDays },
  { href: "/voorspellingen", label: "Voorspel", icon: ClipboardList },
  { href: "/poules", label: "Poules", icon: Users },
  { href: "/ranglijst", label: "Ranglijst", icon: Trophy },
  { href: "/regels", label: "Regels", icon: ListChecks },
];

export function BottomNav({ current = "/" }: { current?: string }) {
  return (
    <nav className="bottom-nav" aria-label="Hoofdnavigatie">
      {links.map((link) => {
        const Icon = link.icon === ListChecks && current !== "/regels" ? MoreHorizontal : link.icon;
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
