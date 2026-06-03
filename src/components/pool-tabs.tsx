"use client";

import { Children, useState } from "react";

/**
 * Toont subpoules als tabs (1 per poule) in plaats van onder elkaar. De
 * server-gerenderde poule-panelen komen mee als children, in dezelfde volgorde
 * als `tabs`.
 */
export function PoolTabs({
  tabs,
  children,
}: {
  tabs: { id: string; label: string; emoji: string }[];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const panels = Children.toArray(children);
  const multiple = tabs.length > 1;

  return (
    <div className="grid gap-4">
      {multiple ? (
        <div className="pool-tabs" role="tablist" aria-label="Kies WK-poule">
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
      ) : null}
      {panels.map((panel, index) => (
        <div key={tabs[index]?.id ?? index} hidden={multiple && tabs[index]?.id !== active}>
          {panel}
        </div>
      ))}
    </div>
  );
}
