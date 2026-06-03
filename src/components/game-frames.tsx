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

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={`tab-pill ${game === "soccer" ? "is-active" : ""}`} onClick={() => setGame("soccer")}>
          <Gamepad2 aria-hidden="true" className="size-4" />
          Slime Soccer
        </button>
        <button type="button" className={`tab-pill ${game === "volley" ? "is-active" : ""}`} onClick={() => setGame("volley")}>
          <Volleyball aria-hidden="true" className="size-4" />
          Slime Volley
        </button>
        <a className="button-secondary ml-auto min-h-10 px-3 text-sm" href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden="true" className="size-4" />
          Nieuw tabblad
        </a>
      </div>
      <div className="game-frame">
        <iframe
          key={game}
          src={url}
          title={game === "soccer" ? "Slime Soccer" : "Slime Volley"}
          allow="fullscreen; autoplay; gamepad"
          loading="lazy"
        />
      </div>
      <p className="text-xs font-medium text-[#54657f]">
        Laadt het spel niet? Open het in een nieuw tabblad — de game-site moet inbedden toestaan.
      </p>
    </div>
  );
}
