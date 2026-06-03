import Image from "next/image";
import Link from "next/link";

/**
 * Woordmerk "SlimeScore.com" met klein app-logo ervoor. `onDark` voor gebruik
 * over de stadion-achtergrond, anders donkere variant op lichte vlakken.
 */
export function BrandWordmark({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  return (
    <Link href="/" className={`brand-wordmark ${onDark ? "brand-wordmark-dark" : ""} ${className}`} aria-label="Slime Score home">
      <Image className="brand-wordmark-logo" src="/icon.png" alt="" width={64} height={64} aria-hidden="true" priority />
      <span className="brand-wordmark-text">
        <span className="brand-wordmark-slime">Slime</span>
        <span className="brand-wordmark-score">Score</span>
        <span className="brand-wordmark-tld">.com</span>
      </span>
    </Link>
  );
}
