"use client";

import { useCallback, useSyncExternalStore } from "react";
import { localeFromBrowserPreference, localeFromPathname, type Locale } from "@/lib/i18n";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("slimescore:locale-change", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("slimescore:locale-change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useActiveLocale(pathname = "/"): Locale {
  const getSnapshot = useCallback(() => localeFromBrowserPreference(pathname), [pathname]);
  const getServerSnapshot = useCallback(() => localeFromPathname(pathname), [pathname]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
