"use client";

import { useRef, useState } from "react";
import { autosaveExtras } from "@/app/actions";
import type { Locale } from "@/lib/i18n";

type Status = "idle" | "saving" | "saved" | "error";

const copy = {
  nl: { saving: "Opslaan…", saved: "Knock-outs & bonus opgeslagen ✓", error: "Niet opgeslagen — probeer opnieuw" },
  en: { saving: "Saving…", saved: "Knockouts & bonus saved ✓", error: "Not saved — try again" },
} as const;

/**
 * Wikkelt de knock-out- en bonusvelden. Vangt wijzigingen op (bubbelende change-events
 * van de checkboxes/selects/inputs erin), debounced, en schrijft ze direct weg via de
 * autosaveExtras-action — zo gaan ook deze keuzes nooit verloren als je de grote
 * opslaan-knop niet gebruikt.
 */
export function AutosaveExtras({ locale = "nl", children }: { locale?: Locale; children: React.ReactNode }) {
  const text = copy[locale];
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLElement>) {
    const form = (event.target as HTMLInputElement | HTMLSelectElement).form;
    if (!form) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setStatus("saving");
      try {
        const result = await autosaveExtras(new FormData(form));
        setStatus(result.ok ? "saved" : "error");
      } catch {
        setStatus("error");
      }
    }, 800);
  }

  return (
    <div className="autosave-extras" onChange={handleChange}>
      {children}
      {status !== "idle" ? (
        <div className="autosave-extras-status">
          <span className={`prediction-save-status prediction-save-status--${status === "saving" ? "saving" : status === "saved" ? "saved" : "error"}`} aria-live="polite">
            {status === "saving" ? text.saving : status === "saved" ? text.saved : text.error}
          </span>
        </div>
      ) : null}
    </div>
  );
}
