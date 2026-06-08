"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

const languageOptions: { code: Locale; flag: string; label: string }[] = [
  { code: "nl", flag: "🇳🇱", label: "Nederlands" },
  { code: "en", flag: "🇬🇧", label: "English" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const locale = useActiveLocale(pathname);
  const nlHref = `${localizedHref(pathname, "nl")}?lang=nl`;
  const englishHref = `${localizedHref(pathname, "en")}?lang=en`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languageOptions.find((option) => option.code === locale) ?? languageOptions[0];

  useEffect(() => {
    if (!open) return;
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  function chooseLocale(nextLocale: Locale) {
    setOpen(false);
    setLocalePreference(nextLocale);
    void persistLocalePreference(nextLocale);
  }

  return (
    <div ref={ref} className={`language-switcher ${className}`} aria-label={locale === "en" ? "Language switch" : "Taalkeuze / language switch"}>
      <button type="button" className="language-switcher-btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span aria-hidden="true" className="language-switcher-flag">{current.flag}</span>
        <ChevronDown aria-hidden="true" className="size-3.5" />
        <span className="sr-only">{current.label}</span>
      </button>
      {open ? (
        <ul className="language-switcher-menu" role="listbox">
          {languageOptions.map((option) => {
            const active = option.code === locale;
            const href = option.code === "nl" ? nlHref : englishHref;
            const label = option.code === "nl"
              ? locale === "nl" ? "Nederlands actief" : "Switch to Dutch"
              : locale === "en" ? "English active" : "Switch to English";
            return (
              <li key={option.code}>
                <a
                  href={href}
                  role="option"
                  aria-label={label}
                  aria-selected={active}
                  aria-current={active ? "true" : undefined}
                  className={`language-switcher-option ${active ? "is-active" : ""}`}
                  onClick={() => chooseLocale(option.code)}
                >
                  <span aria-hidden="true" className="language-switcher-flag">{option.flag}</span>
                  {option.label}
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
