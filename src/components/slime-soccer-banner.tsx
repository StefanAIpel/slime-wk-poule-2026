import { Play } from "lucide-react";
import type { CSSProperties } from "react";
import { SLIME_GAME_URL, SLIME_VOLLEY_URL } from "@/lib/constants";

type GameTile = {
  href: string;
  image: string;
  chip: string;
  title: string;
  text: string;
};

const tiles: GameTile[] = [
  {
    href: SLIME_GAME_URL,
    image: "/slimes/slime-soccer-banner-web.png",
    chip: "Bonus · gratis",
    title: "Slime Soccer — WC ’26",
    text: "Trap een balletje in de WK-game als opwarmer.",
  },
  {
    href: SLIME_VOLLEY_URL,
    image: "/slimes/slime-volley-banner-3to1.png",
    chip: "Bonus · gratis",
    title: "Slime Volley",
    text: "Of sla een balletje over het net in Slime Volley.",
  },
];

/**
 * Duo-sfeerbanner naar de Slime-arcadegames (soccer + volley). Twee tegels,
 * op mobiel onder elkaar. Tot de definitieve beelden er zijn, toont de gradient
 * zich onder de optionele achtergrondafbeelding.
 */
export function SlimeSoccerBanner() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {tiles.map((tile) => (
        <a
          key={tile.href}
          className="slime-banner grid gap-2 p-4"
          href={tile.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ "--slime-banner-image": `url('${tile.image}')` } as CSSProperties}
        >
          <span className="chip w-fit">{tile.chip}</span>
          <h2 className="text-xl font-bold leading-tight md:text-2xl">{tile.title}</h2>
          <p className="text-sm font-medium leading-6 text-blue-50">{tile.text}</p>
          <span className="button-primary mt-1 w-fit">
            <Play aria-hidden="true" className="size-5" />
            Speel nu
          </span>
        </a>
      ))}
    </div>
  );
}
