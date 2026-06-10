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
      <div className="brand-lockup">
        <div className="brand-lockup-name" aria-label="SlimeScore">
          <span className="brand-lockup-slime">Slime</span><span className="brand-lockup-score">Score</span>
        </div>
        <div className="brand-lockup-sub">{locale === "en" ? "WC pool 2026" : "WK-poule 2026"}</div>
      </div>
    </Link>
  );
}
