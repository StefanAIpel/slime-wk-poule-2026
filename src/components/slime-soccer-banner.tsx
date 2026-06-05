/* eslint-disable @next/next/no-img-element */

import { SITE_URL, SLIME_GAME_URL, SLIME_VOLLEY_URL } from "@/lib/constants";

/**
 * Klikbare SlimeScore-banners. Homepage gebruikt alleen de externe games;
 * op Regels mag de WK-poule banner onderaan terug.
 */
const gameTiles = [
  { href: SLIME_GAME_URL, img: "/slimes/slime-soccer-wc26-play-online-banner.jpg", alt: "Try Slime Soccer WC '26" },
  { href: SLIME_VOLLEY_URL, img: "/slimes/slime-volley-champions-play-now-banner.jpg", alt: "Slime Volley Champions" },
];

const wkTile = { href: SITE_URL, img: "/slimes/slimescore-wk2026-friend-poule-banner.jpg", alt: "SlimeScore WK 2026 vriendenpoule" };

export function SlimeSoccerBanner({ includeWk = false, includeVolley = true, fullWidth = false }: { includeWk?: boolean; includeVolley?: boolean; fullWidth?: boolean }) {
  const games = includeVolley ? gameTiles : gameTiles.slice(0, 1);
  const tiles = includeWk ? [wkTile, ...games] : games;

  return (
    <div className={fullWidth ? "slime-link-banners slime-link-banners-wide" : "slime-link-banners"}>
      {tiles.map((tile) => (
        <a key={tile.href} href={tile.href} className="game-banner-tile" aria-label={tile.alt}>
          <img src={tile.img} alt={tile.alt} loading="lazy" />
        </a>
      ))}
    </div>
  );
}
