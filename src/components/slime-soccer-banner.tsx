/* eslint-disable @next/next/no-img-element */

/**
 * Twee klikbare game-banners (soccer + volley) zonder tekst-overlay — de banner
 * zelf is de knop. Linkt naar /games waar het spel in de eigen UI laadt.
 */
const tiles = [
  { href: "/games?game=soccer", img: "/slimes/slime-soccer-banner-3to1.png", alt: "Speel Slime Soccer" },
  { href: "/games?game=volley", img: "/slimes/slime-volley-banner-3to1.png", alt: "Speel Slime Volley" },
];

export function SlimeSoccerBanner() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {tiles.map((tile) => (
        <a key={tile.href} href={tile.href} className="game-banner-tile" aria-label={tile.alt}>
          <img src={tile.img} alt={tile.alt} loading="lazy" />
        </a>
      ))}
    </div>
  );
}
