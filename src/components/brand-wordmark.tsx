import Link from "next/link";

/**
 * Woordmerk "SlimeScore.com" als tekst (geen PNG nodig). `onDark` voor gebruik
 * over de stadion-achtergrond, anders donkere variant op lichte vlakken.
 */
export function BrandWordmark({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  return (
    <Link href="/" className={`brand-wordmark ${onDark ? "brand-wordmark-dark" : ""} ${className}`} aria-label="Slime Score home">
      <span className="brand-wordmark-slime">Slime</span>
      <span className="brand-wordmark-score">Score</span>
      <span className="brand-wordmark-tld">.com</span>
    </Link>
  );
}
