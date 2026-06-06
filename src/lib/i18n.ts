export const LOCALE_COOKIE = "slimescore-locale";
export const LOCALE_STORAGE_KEY = "slimescore-locale";
export const SUPPORTED_LOCALES = ["nl", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return value === "nl" || value === "en";
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "nl";
}

export function countryPrefersDutch(country: string | null | undefined) {
  const countryCode = country?.trim().toUpperCase();
  return countryCode === "NL" || countryCode === "BE";
}

export function preferredLocaleFromRequest({
  cookieLocale,
  country,
  acceptLanguage = "",
}: {
  cookieLocale?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (isSupportedLocale(cookieLocale)) return cookieLocale;

  const countryCode = country?.trim().toUpperCase();
  if (countryCode) return countryPrefersDutch(countryCode) ? "nl" : "en";

  const acceptedLanguages = acceptLanguage ?? "";
  if (acceptedLanguages.toLowerCase().includes("nl")) return "nl";
  return "en";
}

export function stripLocaleFromPath(pathname: string) {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  return pathname;
}

export function pathForLocale(pathname: string, locale: Locale) {
  const strippedPathname = stripLocaleFromPath(pathname || "/");
  if (locale === "en") return strippedPathname === "/" ? "/en" : strippedPathname;
  return strippedPathname;
}

export function localizedHref(href: string, locale: Locale) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;

  const [beforeHash, hash] = href.split("#", 2);
  const [pathname, query] = beforeHash.split("?", 2);
  const localizedPath = pathForLocale(pathname || "/", locale);
  return `${localizedPath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function localeFromCookieString(cookieString: string | null | undefined): Locale | null {
  if (!cookieString) return null;
  const cookies = cookieString.split(";").map((part) => part.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=", 2);
    if (name === LOCALE_COOKIE && isSupportedLocale(decodeURIComponent(value ?? ""))) return decodeURIComponent(value) as Locale;
  }
  return null;
}

export function localeFromBrowserPreference(pathname = "/"): Locale {
  const pathLocale = localeFromPathname(pathname);
  if (pathLocale === "en") return "en";

  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isSupportedLocale(stored)) return stored;
    } catch {
      // localStorage can be unavailable in private contexts; fall back to cookies/html lang.
    }
  }

  if (typeof document !== "undefined") {
    const cookieLocale = localeFromCookieString(document.cookie);
    if (cookieLocale) return cookieLocale;
    if (isSupportedLocale(document.documentElement.lang)) return document.documentElement.lang;
  }

  return pathLocale;
}
