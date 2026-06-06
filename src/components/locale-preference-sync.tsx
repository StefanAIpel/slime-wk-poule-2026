"use client";

import { useEffect } from "react";
import {
  LOCALE_STORAGE_KEY,
  isSupportedLocale,
  localeFromCookieString,
  localizedHref,
  type Locale,
} from "@/lib/i18n";
import { setLocalePreference } from "@/components/language-switcher";

type MeLocaleResponse = {
  loggedIn: boolean;
  preferredLocale?: Locale | null;
};

function browserStoredLocale() {
  const cookieLocale = localeFromCookieString(document.cookie);
  if (cookieLocale) return cookieLocale;

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isSupportedLocale(stored)) return stored;
  } catch {
    // localStorage can be unavailable in private contexts; cookie has already been checked.
  }

  return null;
}

function renderedLocale() {
  return isSupportedLocale(document.documentElement.lang) ? document.documentElement.lang : null;
}

function reloadIfRenderedLocaleDiffers(locale: Locale) {
  if (renderedLocale() === locale) return;

  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const target = localizedHref(current, locale);
  if (target === current) {
    window.location.reload();
  } else {
    window.location.replace(target);
  }
}

export function LocalePreferenceSync() {
  useEffect(() => {
    async function syncAccountLocale() {
      try {
        const response = await fetch("/api/me", { cache: "no-store" });
        const me = (await response.json()) as MeLocaleResponse;

        if (me.loggedIn && isSupportedLocale(me.preferredLocale)) {
          setLocalePreference(me.preferredLocale);
          reloadIfRenderedLocaleDiffers(me.preferredLocale);
          return;
        }

        const browserLocale = browserStoredLocale();
        if (browserLocale) {
          setLocalePreference(browserLocale);
          await fetch("/api/locale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale: browserLocale }),
            keepalive: true,
          });
        }
      } catch {
        // Non-critical: locale switcher/account form still set cookie + localStorage/account explicitly.
      }
    }

    void syncAccountLocale();
  }, []);

  return null;
}
