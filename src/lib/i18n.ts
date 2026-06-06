export const LOCALE_COOKIE = "slimescore-locale";
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
  if (locale === "en") return "/en";
  return stripLocaleFromPath(pathname);
}
