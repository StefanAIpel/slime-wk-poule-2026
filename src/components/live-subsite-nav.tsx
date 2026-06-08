"use client";

import { CalendarDays, Radio } from "lucide-react";
import { usePathname } from "next/navigation";
import { BrandWordmark } from "@/components/brand-wordmark";

// Hrefs met /live-prefix werken zowel op de subdomeinen (live.slimescore.com/live…
// en live.slimescore.app/live…) als in preview.
// als op een preview-deploy (…/live…). usePathname ziet de browser-URL, dus we
// matchen op beide vormen (subdomein-rewrite laat soms "/" zien).
const tabs = [
  { href: "/live", label: "Live", icon: Radio, active: (p: string) => p === "/live" || p === "/" },
  { href: "/live/schema", label: "Schema", icon: CalendarDays, active: (p: string) => p.includes("/schema") },
];

export function LiveSubsiteNav() {
  const pathname = usePathname();
  return (
    <header className="live-subsite-header">
      <a href="/live" className="live-subsite-brand" aria-label="SlimeScore Live">
        <BrandWordmark onDark />
      </a>
      <nav className="live-subsite-tabs" aria-label="Live-subsite navigatie">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <a key={tab.href} href={tab.href} className={tab.active(pathname) ? "live-subsite-tab is-active" : "live-subsite-tab"}>
              <Icon aria-hidden="true" className="size-4" />
              {tab.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
