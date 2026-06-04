"use client";

import { ExternalLink, Gamepad2, Volleyball } from "lucide-react";
import { useState } from "react";

/**
 * Laadt de Slime-arcadegames in de eigen UI (iframe) met tabs. De game-site moet
 * inbedden toestaan (CSP frame-ancestors); anders is er de "open in nieuw tabblad".
 */
export function GameFrames({ soccerUrl, volleyUrl, initial = "soccer" }: { soccerUrl: string; volleyUrl: string; initial?: string }) {
  const [game, setGame] = useState<"soccer" | "volley">(initial === "volley" ? "volley" : "soccer");
  const url = game === "soccer" ? soccerUrl : volleyUrl;
  const gameName = game === "soccer" ? "Slime Soccer" : "Slime Volley";

  return (
    <div className="grid gap-3">
      <div className="game-toolbar" role="toolbar" aria-label="Kies spel">
        <button type="button" aria-label="Slime Soccer" className={`game-tab-pill ${game === "soccer" ? "is-active" : ""}`} onClick={() => setGame("soccer")}>
          <Gamepad2 aria-hidden="true" className="size-4" />
          <span>Soccer</span>
        </button>
        <button type="button" aria-label="Slime Volley" className={`game-tab-pill ${game === "volley" ? "is-active" : ""}`} onClick={() => setGame("volley")}>
          <Volleyball aria-hidden="true" className="size-4" />
          <span>Volley</span>
        </button>
        <a className="game-open-link" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${gameName} in nieuw tabblad`}>
          <ExternalLink aria-hidden="true" className="size-4" />
          <span>Open spel in nieuw tabblad</span>
        </a>
      </div>
      <p className="game-mobile-note">
        Mobiel speelt dit het best schermvullend in een eigen tabblad of app-weergave.
      </p>
      <div className="game-frame">
        <iframe
          key={game}
          src={url}
          title={gameName}
          allow="fullscreen; autoplay; gamepad"
          loading="lazy"
        />
      </div>
      <p className="game-embed-note text-xs font-medium text-[#54657f]">
        Laadt het spel niet? Open het in een nieuw tabblad — de game-site moet inbedden toestaan.
      </p>
    </div>
  );
}
