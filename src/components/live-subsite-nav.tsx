import { BrandWordmark } from "@/components/brand-wordmark";
import { LanguageSwitcher } from "@/components/language-switcher";

/** Kale top-header van de live-subsite: merk + LIVE-sticker + taalwissel. */
export function LiveSubsiteNav() {
  return (
    <header className="live-subsite-header">
      <div className="live-subsite-brandwrap">
        <BrandWordmark onDark />
        <span className="live-badge">
          <span className="live-badge-dot" aria-hidden="true" />
          LIVE
        </span>
      </div>
      <LanguageSwitcher className="live-lang" />
    </header>
  );
}
