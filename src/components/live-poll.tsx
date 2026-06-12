"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { pollPercentages, type PollChoice } from "@/lib/live-poll";

type PollData = {
  poll: { id: string; question: string; optionA: string; optionB: string; optionC: string | null } | null;
  counts?: { a: number; b: number; c: number };
  yourChoice?: PollChoice | null;
};

/**
 * Admin-ingestelde poll naast "Nu bezig". Haalt status op via /api/live-poll
 * (per apparaat, no-store) en stemt via POST. Toont niets als er geen actieve
 * poll is. Eén stem per apparaat; nogmaals tikken past je keuze aan.
 */
export function LivePoll({ locale }: { locale: Locale }) {
  const [data, setData] = useState<PollData | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/live-poll", { cache: "no-store" });
        const json = (await res.json()) as PollData;
        if (mounted) setData(json);
      } catch {
        // Tijdelijke netwerkfout: huidige status laten staan.
      }
    }
    void load();
    const id = window.setInterval(load, 30000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  if (!data?.poll) return null;

  const counts = data.counts ?? { a: 0, b: 0, c: 0 };
  const pct = pollPercentages(counts);
  const voted = Boolean(data.yourChoice);
  const options: { key: PollChoice; label: string }[] = [
    { key: "a", label: data.poll.optionA },
    { key: "b", label: data.poll.optionB },
    ...(data.poll.optionC ? [{ key: "c" as PollChoice, label: data.poll.optionC }] : []),
  ];

  async function vote(choice: PollChoice) {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/live-poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });
      if (res.ok) setData((await res.json()) as PollData);
    } catch {
      // negeren; gebruiker kan opnieuw tikken
    } finally {
      setPending(false);
    }
  }

  const totalLabel = locale === "en" ? `${pct.total} vote${pct.total === 1 ? "" : "s"}` : `${pct.total} stem${pct.total === 1 ? "" : "men"}`;
  const hint = voted
    ? `${totalLabel} · ${locale === "en" ? "your pick highlighted" : "jouw keuze gemarkeerd"}`
    : locale === "en" ? "Tap to vote" : "Tik om te stemmen";

  return (
    <section className="panel live-poll overflow-hidden">
      <header className="live-poll-header">{locale === "en" ? "Poll" : "Stelling"}</header>
      <div className="live-poll-body">
        <p className="live-poll-question">{data.poll.question}</p>
        <div className="live-poll-options">
          {options.map((option) => {
            const value = pct[option.key];
            const isYours = data.yourChoice === option.key;
            return (
              <button
                key={option.key}
                type="button"
                className={`live-poll-option${isYours ? " is-yours" : ""}`}
                onClick={() => vote(option.key)}
                disabled={pending}
                aria-pressed={isYours}
              >
                {voted ? <span className="live-poll-bar" style={{ width: `${value}%` }} aria-hidden="true" /> : null}
                <span className="live-poll-option-label">{option.label}</span>
                {voted ? <span className="live-poll-option-pct">{value}%</span> : null}
              </button>
            );
          })}
        </div>
        <p className="live-poll-foot">{hint}</p>
      </div>
    </section>
  );
}
