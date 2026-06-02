import { Play } from "lucide-react";
import type { CSSProperties } from "react";
import { SLIME_GAME_URL } from "@/lib/constants";

/**
 * Brede sfeerbanner naar de Slime Soccer-game. Gebruikt een optionele graphic
 * op /slimes/slime-soccer-banner.png; tot die er is, toont de gradient zich.
 */
export function SlimeSoccerBanner() {
  const style = {
    "--slime-banner-image": "url('/slimes/slime-soccer-banner-web.png')",
  } as CSSProperties;

  return (
    <a
      className="slime-banner grid gap-3 md:grid-cols-[1fr_auto] md:items-center"
      href={SLIME_GAME_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
    >
      <div className="max-w-md">
        <span className="chip">Bonus · gratis</span>
        <h2 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">Speel Slime Soccer — WC &rsquo;26</h2>
        <p className="mt-1 text-sm font-medium leading-6 text-blue-50">
          Even geen zin in voorspellen? Trap een balletje in de WK-game als opwarmer.
        </p>
      </div>
      <span className="button-primary md:w-auto">
        <Play aria-hidden="true" className="size-5" />
        Speel nu
      </span>
    </a>
  );
}
