import { CalendarCheck, Gift, Lock, Users } from "lucide-react";

const badges = [
  { icon: Gift, label: "100% gratis" },
  { icon: CalendarCheck, label: "Eén keer invullen" },
  { icon: Lock, label: "Jouw data privé" },
  { icon: Users, label: "Voor jong en oud" },
];

export function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <ul className={`trust-badges ${className}`} aria-label="Waarom SlimeScore">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <li key={badge.label} className="trust-badge">
            <Icon aria-hidden="true" className="size-4" />
            {badge.label}
          </li>
        );
      })}
    </ul>
  );
}
