"use client";

import Link from "next/link";
import { useState } from "react";

const QUOTES = [
  "Helemaal ingevuld! Slime is trots op je. 🟢",
  "Klaar is Kees. Nu nog gewoon gelijk krijgen. 😎",
  "Top! De rest van je poule mag zich zorgen maken. 🏆",
  "Alles erin. Achterover leunen en genieten. ⚽",
];

const PIECES = ["⚽", "🎉", "🟢", "🏆", "🧡", "✨"];

/**
 * Easter egg: verschijnt als je al je voorspellingen hebt ingevuld. Viert het
 * met confetti (opnieuw te triggeren) en stuurt je vrolijk door naar een potje
 * Slime Soccer.
 */
export function PredictionsComplete() {
  // Confetti vuurt meteen bij de eerste render (burst = 1) en opnieuw bij elke klik.
  const [burst, setBurst] = useState(1);
  const [quote, setQuote] = useState(0);

  function celebrate() {
    setBurst((value) => value + 1);
    setQuote((value) => (value + 1) % QUOTES.length);
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
      <button type="button" onClick={celebrate} className="celebration-slime" aria-label="Vier het feestje nog een keer">
        🐮🏆
      </button>
      <div className="celebration-copy">
        <h3>Alles ingevuld — lekker bezig!</h3>
        <p>{QUOTES[quote]}</p>
        <p className="celebration-relax">
          Tijd voor ontspanning: speel een potje Slime Soccer tegen de computer of je vrienden (online).
        </p>
        <div className="celebration-actions">
          <Link href="/games?game=soccer" className="button-primary">
            ⚽ Speel Slime Soccer
          </Link>
          <button type="button" onClick={celebrate} className="button-secondary">
            🎉 Nog wat confetti
          </button>
        </div>
      </div>
    </div>
  );
}
