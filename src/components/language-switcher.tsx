"use client";

import { usePathname } from "next/navigation";
import { useActiveLocale } from "@/hooks/use-active-locale";
import { LOCALE_COOKIE, LOCALE_STORAGE_KEY, localizedHref, type Locale } from "@/lib/i18n";

const maxAge = 60 * 60 * 24 * 365;

export function setLocalePreference(nextLocale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=${maxAge}; samesite=lax`;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  window.dispatchEvent(new CustomEvent("slimescore:locale-change", { detail: { locale: nextLocale } }));
}

async function persistLocalePreference(nextLocale: Locale) {
  try {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: nextLocale }),
      keepalive: true,
    });
  } catch {
    // Cookie + localStorage are already set; account persistence can retry on the next account save/click.
  }
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const locale = useActiveLocale(pathname);
  const nlHref = `${localizedHref(pathname, "nl")}?lang=nl`;
  const englishHref = `${localizedHref(pathname, "en")}?lang=en`;

  function chooseLocale(nextLocale: Locale) {
    setLocalePreference(nextLocale);
    void persistLocalePreference(nextLocale);
  }

  return (
    <div className={`language-switcher ${className}`} aria-label={locale === "en" ? "Language switch" : "Taalkeuze / language switch"}>
      <a
        href={nlHref}
        className={`language-switcher-option ${locale === "nl" ? "is-active" : ""}`}
        aria-label={locale === "nl" ? "Nederlands actief" : "Switch to Dutch"}
        aria-current={locale === "nl" ? "true" : undefined}
        onClick={() => chooseLocale("nl")}
      >
        <span aria-hidden="true">🇳🇱</span>
        <span className="sr-only">Nederlands</span>
      </a>
      <a
        href={englishHref}
        className={`language-switcher-option ${locale === "en" ? "is-active" : ""}`}
        aria-label={locale === "en" ? "English active" : "Switch to English"}
        aria-current={locale === "en" ? "true" : undefined}
        onClick={() => chooseLocale("en")}
      >
        <span aria-hidden="true">🇬🇧</span>
        <span className="sr-only">English</span>
      </a>
    </div>
  );
}
