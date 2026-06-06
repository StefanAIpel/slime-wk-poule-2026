import { APP_VERSION, COMPANY_NAME, COMPANY_URL, CONTACT_EMAIL } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

/** Subtiele voettekst met juridische links, versie en maker. */
export function SiteFooter({ locale = "nl" }: { locale?: Locale }) {
  return (
    <footer className="site-footer">
      <span className="site-footer-line">
        <a href="/privacy">{locale === "en" ? "Privacy" : "Privacy"}</a>
        <span aria-hidden="true">·</span>
        <a href="/voorwaarden">{locale === "en" ? "Terms" : "Voorwaarden"}</a>
        <span aria-hidden="true">·</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        <span aria-hidden="true">·</span>
        <span className="site-footer-beta">{locale === "en" ? "beta" : "bèta"} {APP_VERSION}</span>
        <span aria-hidden="true">·</span>
        <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer">
          © {COMPANY_NAME}
        </a>
      </span>
    </footer>
  );
}
