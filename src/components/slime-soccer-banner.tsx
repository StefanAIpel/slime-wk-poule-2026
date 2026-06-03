/* eslint-disable @next/next/no-img-element */

import { SLIME_GAME_URL, SLIME_VOLLEY_URL } from "@/lib/constants";

/**
 * Twee klikbare game-banners zonder tekst-overlay — de banner zelf is de knop.
 * Slime Soccer staat bovenaan, Slime Volley daaronder.
 */
const tiles = [
  { href: SLIME_GAME_URL, img: "/slimes/slime-soccer-banner-web.png", alt: "Slime Soccer" },
  { href: SLIME_VOLLEY_URL, img: "/slimes/slime-volley-banner-3to1.png", alt: "Slime Volley Champions" },
];

export function SlimeSoccerBanner() {
  return (
    <div className="slime-link-banners">
      {tiles.map((tile) => (
        <a key={tile.href} href={tile.href} className="game-banner-tile" aria-label={tile.alt}>
          <img src={tile.img} alt={tile.alt} loading="lazy" />
        </a>
      ))}
    </div>
  );
}
