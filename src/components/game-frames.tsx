"use client";

import { ExternalLink, Gamepad2, Volleyball } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Laadt de Slime-arcadegames in de eigen UI (iframe) met tabs. De game-site moet
 * inbedden toestaan (CSP frame-ancestors); anders is er de "open in nieuw tabblad".
 */
const gameFrameCopy = {
  nl: {
    toolbarLabel: "Kies spel",
    openAria: (gameName: string) => `Open ${gameName} in nieuw tabblad`,
    open: "Open spel in nieuw tabblad",
    mobileNote: "Mobiel speelt dit het best schermvullend in een eigen tabblad of app-weergave.",
    embedNote: "Laadt het spel niet? Open het in een nieuw tabblad.",
  },
  en: {
    toolbarLabel: "Choose game",
    openAria: (gameName: string) => `Open ${gameName} in a new tab`,
    open: "Open game in a new tab",
    mobileNote: "On mobile this plays best full-screen in its own tab or app view.",
    embedNote: "Game not loading? Open it in a new tab.",
  },
} as const;

export function GameFrames({
  soccerUrl,
  volleyUrl,
  initial = "soccer",
  locale = "nl",
}: {
  soccerUrl: string;
  volleyUrl: string;
  initial?: string;
  locale?: Locale;
}) {
  const copy = gameFrameCopy[locale];
  const [game, setGame] = useState<"soccer" | "volley">(initial === "volley" ? "volley" : "soccer");
  const url = game === "soccer" ? soccerUrl : volleyUrl;
  const gameName = game === "soccer" ? "Slime Soccer" : "Slime Volley";

  return (
    <div className="game-stage grid gap-3">
      <div className="game-toolbar" role="toolbar" aria-label={copy.toolbarLabel}>
        <button type="button" aria-label="Slime Soccer" className={`game-tab-pill ${game === "soccer" ? "is-active" : ""}`} onClick={() => setGame("soccer")}>
          <Gamepad2 aria-hidden="true" className="size-4" />
          <span>Soccer</span>
        </button>
        <button type="button" aria-label="Slime Volley" className={`game-tab-pill ${game === "volley" ? "is-active" : ""}`} onClick={() => setGame("volley")}>
          <Volleyball aria-hidden="true" className="size-4" />
          <span>Volley</span>
        </button>
        <a className="game-open-link" href={url} target="_blank" rel="noopener noreferrer" aria-label={copy.openAria(gameName)}>
          <ExternalLink aria-hidden="true" className="size-4" />
          <span>{copy.open}</span>
        </a>
      </div>
      <p className="game-mobile-note">{copy.mobileNote}</p>
      <div className="game-frame">
        <iframe
          key={game}
          src={url}
          title={gameName}
          allow="fullscreen; autoplay; gamepad"
          loading="lazy"
        />
      </div>
      <p className="game-embed-note text-xs font-medium text-[#54657f]">{copy.embedNote}</p>
    </div>
  );
}
