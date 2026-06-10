import Image from "next/image";
import { SlimeAvatar } from "@/components/slime-avatar";

/**
 * Kleurrijke koptekst-band bovenaan een pagina. Vervangt de witte titel op
 * de lichte achtergrond zodat er minder witte vlakken zijn en de WK-sfeer
 * meteen zichtbaar is.
 */
export function PageHero({
  title,
  subtitle,
  children,
  avatarKey,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  avatarKey?: string | null;
}) {
  return (
    <div className="hero-band">
      <div>
        <h1 className="text-3xl font-black leading-none md:text-4xl">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-blue-50">{subtitle}</p>
        ) : null}
        {children ? <div className="mt-3">{children}</div> : null}
      </div>
      {avatarKey ? (
        <SlimeAvatar
          avatarKey={avatarKey}
          className="hero-band-art justify-self-start md:justify-self-end"
        />
      ) : (
        <Image
          className="hero-band-art justify-self-start md:justify-self-end"
          src="/icon.png"
          alt=""
          aria-hidden="true"
          width={208}
          height={208}
        />
      )}
    </div>
  );
}
