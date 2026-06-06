import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/**
 * Logo + naam. Met `hideIcon` toon je alleen de woordmerk-tekst — handig op de
 * aanmeldpagina, waar de grote hero-banner al bovenaan staat.
 */
export function Brand({ hideIcon = false, locale = "nl" }: { hideIcon?: boolean; locale?: Locale }) {
  return (
    <Link href={locale === "en" ? "/en" : "/"} className="app-brand flex items-center gap-3 no-underline">
      {hideIcon ? null : (
        <Image
          className="size-14 rounded-xl shadow-lg shadow-black/25"
          src="/icon.png"
          alt=""
          width={96}
          height={96}
          aria-hidden="true"
          priority
        />
      )}
      <div>
        <div className="text-2xl font-bold leading-none tracking-normal text-[#0b1f4d]">Slime Score</div>
        <div className="text-sm font-bold leading-none text-[#0f8a43]">{locale === "en" ? "WC pool 2026" : "WK-poule 2026"}</div>
      </div>
    </Link>
  );
}
