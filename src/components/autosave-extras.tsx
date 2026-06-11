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
  // Volgnummer zodat een verouderde (door een nieuwere wijziging ingehaalde) opslag
  // de status niet meer overschrijft.
  const seq = useRef(0);

  async function save(form: HTMLFormElement) {
    const id = ++seq.current;
    setStatus("saving");
    // Twee pogingen met een korte pauze: vangt een transiënte hapering op (bv. een
    // net-vervangen bundel/serviceworker vlak na een deploy) zodat de melding niet
    // ten onrechte "niet opgeslagen" toont terwijl de data wél landt.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const result = await autosaveExtras(new FormData(form));
        if (id !== seq.current) return;
        if (result.ok) {
          setStatus("saved");
          return;
        }
      } catch {
        // val door naar een nieuwe poging
      }
      if (id !== seq.current) return;
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (id === seq.current) setStatus("error");
  }

  function handleChange(event: React.ChangeEvent<HTMLElement>) {
    const form = (event.target as HTMLInputElement | HTMLSelectElement).form;
    if (!form) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void save(form);
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
