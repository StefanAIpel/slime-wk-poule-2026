import Image from "next/image";

/**
 * Kleurrijke koptekst-band bovenaan een pagina. Vervangt de witte titel op
 * de lichte achtergrond zodat er minder witte vlakken zijn en de WK-sfeer
 * meteen zichtbaar is.
 */
export function PageHero({
  title,
  subtitle,
  children,
  image = "/icon.png",
  imageRounded = true,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  image?: string;
  imageRounded?: boolean;
}) {
  return (
    <div className="hero-band">
      <div>
        <h1 className="text-3xl font-bold leading-none md:text-4xl">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-base font-medium leading-7 text-blue-50">{subtitle}</p>
        ) : null}
        {children ? <div className="mt-3">{children}</div> : null}
      </div>
      <Image
        className={`hero-band-art justify-self-start md:justify-self-end ${imageRounded ? "" : "hero-band-art-plain"}`}
        src={image}
        alt=""
        aria-hidden="true"
        width={208}
        height={208}
      />
    </div>
  );
}
