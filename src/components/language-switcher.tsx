"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeFromPathname, pathForLocale, type Locale } from "@/lib/i18n";

const maxAge = 60 * 60 * 24 * 365;

function setLocaleCookie(nextLocale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const locale = localeFromPathname(pathname);
  const nlHref = `${pathForLocale(pathname, "nl")}?lang=nl`;
  const englishHref = `${pathForLocale(pathname, "en")}?lang=en`;

  return (
    <div className={`language-switcher ${className}`} aria-label={locale === "en" ? "Language switch" : "Taalkeuze / language switch"}>
      <Link
        href={nlHref}
        className={`language-switcher-option ${locale === "nl" ? "is-active" : ""}`}
        aria-label={locale === "nl" ? "Nederlands actief" : "Switch to Dutch"}
        aria-current={locale === "nl" ? "true" : undefined}
        onClick={() => setLocaleCookie("nl")}
      >
        <span aria-hidden="true">🇳🇱</span>
        <span className="sr-only">Nederlands</span>
      </Link>
      <Link
        href={englishHref}
        className={`language-switcher-option ${locale === "en" ? "is-active" : ""}`}
        aria-label={locale === "en" ? "English active" : "Switch to English"}
        aria-current={locale === "en" ? "true" : undefined}
        onClick={() => setLocaleCookie("en")}
      >
        <span aria-hidden="true">🇬🇧</span>
        <span className="sr-only">English</span>
      </Link>
    </div>
  );
}
