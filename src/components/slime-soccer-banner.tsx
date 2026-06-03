/* eslint-disable @next/next/no-img-element */

import { SLIME_GAME_URL, SLIME_VOLLEY_URL } from "@/lib/constants";

/**
 * Drie klikbare SlimeScore-banners zonder tekst-overlay — de banner zelf is de knop.
 * Exacte assets van Stefan: Soccer, WK Poule, Volley.
 */
const tiles = [
  { href: SLIME_GAME_URL, img: "/slimes/slime-soccer-wc26-play-online-banner.jpg", alt: "Try Slime Soccer WC '26" },
  { href: "https://slimescore.com", img: "/slimes/slimescore-wk2026-friend-poule-banner.jpg", alt: "Slime Score WK Poule 2026" },
  { href: SLIME_VOLLEY_URL, img: "/slimes/slime-volley-champions-play-now-banner.jpg", alt: "Slime Volley Champions" },
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
