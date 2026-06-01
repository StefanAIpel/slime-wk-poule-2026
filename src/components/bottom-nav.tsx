import { CalendarDays, ClipboardList, Home, ListChecks, MoreHorizontal, Trophy, Users } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schema", label: "Schema", icon: CalendarDays },
  { href: "/voorspellingen", label: "Voorspel", icon: ClipboardList, private: true },
  { href: "/poules", label: "Poules", icon: Users, private: true },
  { href: "/ranglijst", label: "Ranglijst", icon: Trophy },
  { href: "/regels", label: "Regels", icon: ListChecks },
];

export function BottomNav({ current = "/", showPrivate = true }: { current?: string; showPrivate?: boolean }) {
  const visibleLinks = links.filter((link) => showPrivate || !link.private);

  return (
    <nav className="bottom-nav" data-count={visibleLinks.length} aria-label="Hoofdnavigatie">
      {visibleLinks.map((link) => {
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
