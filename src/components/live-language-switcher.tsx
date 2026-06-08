"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { setLocalePreference } from "@/components/language-switcher";
import { useActiveLocale } from "@/hooks/use-active-locale";
import type { Locale } from "@/lib/i18n";

const OPTIONS: { code: Locale; flag: string; label: string }[] = [
  { code: "nl", flag: "🇳🇱", label: "Nederlands" },
  { code: "en", flag: "🇬🇧", label: "English" },
];

/**
 * Taalwissel voor de live-subsite: vlag + dropdown. Cookie-gebaseerd (geen /en-pad,
 * want dat bestaat niet onder de live-rewrite → voorheen een 404). Na de keuze
 * verversen we de server-componenten zodat de juiste taal verschijnt.
 */
export function LiveLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = useActiveLocale(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.code === locale) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  function choose(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    setLocalePreference(next);
    router.refresh();
  }

  return (
    <div className="live-lang-dd" ref={ref}>
      <button type="button" className="live-lang-btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true" className="live-lang-flag">{current.flag}</span>
        <ChevronDown aria-hidden="true" className="size-3.5" />
        <span className="sr-only">{current.label}</span>
      </button>
      {open ? (
        <ul className="live-lang-menu" role="listbox">
          {OPTIONS.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                role="option"
                aria-selected={option.code === locale}
                className={option.code === locale ? "live-lang-opt is-active" : "live-lang-opt"}
                onClick={() => choose(option.code)}
              >
                <span aria-hidden="true" className="live-lang-flag">{option.flag}</span>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
