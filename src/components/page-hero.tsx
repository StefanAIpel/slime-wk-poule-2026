import { SlimeImage } from "@/components/slime-image";

/**
 * Stadion-kop met de slime op het veld (op de achtergrond). De slime valt terug
 * op de coach-slime als de opgegeven afbeelding nog niet bestaat.
 */
export function PageHero({
  title,
  subtitle,
  children,
  slime = "/assets/hd-ranglijst.webp",
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  slime?: string;
}) {
  return (
    <div className="hero-band hero-band-visual hero-band-page">
      <div className="hero-content">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-base font-medium leading-7 text-blue-50">{subtitle}</p>
        ) : null}
        {children ? <div className="mt-3">{children}</div> : null}
      </div>
      <SlimeImage candidates={[slime, "/assets/hd-coach.webp"]} className="hero-mascot" />
    </div>
  );
}
