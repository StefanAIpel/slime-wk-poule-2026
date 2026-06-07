"use client";

import Link from "next/link";
import { useState } from "react";
import { localizedHref, type Locale } from "@/lib/i18n";

const completeCopy = {
  nl: {
    quotes: [
      "Helemaal ingevuld! Slime is trots op je. 🟢",
      "Klaar is Kees. Nu nog gewoon gelijk krijgen. 😎",
      "Top! De rest van je poule mag zich zorgen maken. 🏆",
      "Alles erin. Achterover leunen en genieten. ⚽",
    ],
    celebrateAria: "Vier het feestje nog een keer",
    title: "Alles ingevuld — lekker bezig!",
    relax: "Tijd voor ontspanning: speel een potje Slime Soccer tegen de computer of je vrienden (online).",
    play: "⚽ Speel Slime Soccer",
    confetti: "🎉 Nog wat confetti",
  },
  en: {
    quotes: [
      "All filled in! Slime is proud of you. 🟢",
      "Done and dusted. Now you just have to be right. 😎",
      "Nice! The rest of your pool should start worrying. 🏆",
      "Everything is in. Sit back and enjoy. ⚽",
    ],
    celebrateAria: "Celebrate one more time",
    title: "Everything filled in — nice work!",
    relax: "Time to relax: play Slime Soccer against the computer or your friends online.",
    play: "⚽ Play Slime Soccer",
    confetti: "🎉 More confetti",
  },
} as const;

const PIECES = ["⚽", "🎉", "🟢", "🏆", "🧡", "✨"];

/**
 * Easter egg: verschijnt als je al je voorspellingen hebt ingevuld. Viert het
 * met confetti (opnieuw te triggeren) en stuurt je vrolijk door naar een potje
 * Slime Soccer.
 */
export function PredictionsComplete({ locale = "nl" }: { locale?: Locale }) {
  const copy = completeCopy[locale];
  // Confetti vuurt meteen bij de eerste render (burst = 1) en opnieuw bij elke klik.
  const [burst, setBurst] = useState(1);
  const [quote, setQuote] = useState(0);

  function celebrate() {
    setBurst((value) => value + 1);
    setQuote((value) => (value + 1) % copy.quotes.length);
  }

  return (
    <div className="celebration-card">
      {burst > 0 ? (
        <div className="celebration-confetti" key={burst} aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              style={{ left: `${(index * 5.5 + 3) % 100}%`, animationDelay: `${(index % 9) * 0.07}s` }}
            >
              {PIECES[index % PIECES.length]}
            </span>
          ))}
        </div>
      ) : null}
      <button type="button" onClick={celebrate} className="celebration-slime" aria-label={copy.celebrateAria}>
        🐮🏆
      </button>
      <div className="celebration-copy">
        <h3>{copy.title}</h3>
        <p>{copy.quotes[quote]}</p>
        <p className="celebration-relax">{copy.relax}</p>
        <div className="celebration-actions">
          <Link href={localizedHref("/games?game=soccer", locale)} className="button-primary">
            {copy.play}
          </Link>
          <button type="button" onClick={celebrate} className="button-secondary">
            {copy.confetti}
          </button>
        </div>
      </div>
    </div>
  );
}
