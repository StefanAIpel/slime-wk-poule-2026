import { APP_VERSION, COMPANY_NAME, COMPANY_URL, CONTACT_EMAIL } from "@/lib/constants";

/** Subtiele voettekst met juridische links, versie en maker. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="site-footer-line">
        <a href="/privacy">Privacy</a>
        <span aria-hidden="true">·</span>
        <a href="/voorwaarden">Voorwaarden</a>
        <span aria-hidden="true">·</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        <span aria-hidden="true">·</span>
        <span className="site-footer-beta">bèta {APP_VERSION}</span>
        <span aria-hidden="true">·</span>
        <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer">
          (c) {COMPANY_NAME}
        </a>
      </span>
    </footer>
  );
}
