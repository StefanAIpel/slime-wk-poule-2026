"use client";

import { Children, useState } from "react";
import type { Locale } from "@/lib/i18n";

const poolTabsCopy = {
  nl: {
    selectorLabel: "Kies WK-poule",
    tablistLabel: "Kies WK-poule",
  },
  en: {
    selectorLabel: "Choose World Cup pool",
    tablistLabel: "Choose World Cup pool",
  },
} as const;

/**
 * Toont subpoules als tabs (1 per poule) in plaats van onder elkaar. De
 * server-gerenderde poule-panelen komen mee als children, in dezelfde volgorde
 * als `tabs`.
 */
export function PoolTabs({
  tabs,
  initialId,
  locale = "nl",
  children,
}: {
  tabs: { id: string; label: string; emoji: string }[];
  initialId?: string;
  locale?: Locale;
  children: React.ReactNode;
}) {
  const copy = poolTabsCopy[locale];
  const [active, setActive] = useState(
    initialId && tabs.some((tab) => tab.id === initialId) ? initialId : tabs[0]?.id ?? "",
  );
  const panels = Children.toArray(children);
  const multiple = tabs.length > 1;

  return (
    <div className="grid gap-4">
      {multiple ? (
        <>
          <label className="pool-selector-mobile">
            <span className="pool-selector-label">{copy.selectorLabel}</span>
            <span className="pool-selector-field">
              <select
                className="pool-selector-select"
                value={active}
                onChange={(event) => setActive(event.target.value)}
                aria-label={copy.selectorLabel}
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.emoji} {tab.label}
                  </option>
                ))}
              </select>
            </span>
          </label>
          <div className="pool-tabs" role="tablist" aria-label={copy.tablistLabel}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active === tab.id}
                className={`tab-pill ${active === tab.id ? "is-active" : ""}`}
                onClick={() => setActive(tab.id)}
              >
                <span aria-hidden="true">{tab.emoji}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}
      {panels.map((panel, index) => (
        <div key={tabs[index]?.id ?? index} hidden={multiple && tabs[index]?.id !== active}>
          {panel}
        </div>
      ))}
    </div>
  );
}
