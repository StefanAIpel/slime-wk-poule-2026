/* eslint-disable @next/next/no-img-element */

/**
 * Twee klikbare Slime-banners zonder tekst-overlay — de banner zelf is de knop.
 * WK/SlimeScore staat bovenaan, Volley daaronder.
 */
const tiles = [
  { href: "https://slimescore.com", img: "/slimes/slimescore-wk2026-link-banner.png", alt: "Slime Score WK Poule 2026" },
  { href: "https://volley.slimescore.com", img: "/slimes/slime-volley-link-banner.jpg", alt: "Slime Volley Champions" },
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
