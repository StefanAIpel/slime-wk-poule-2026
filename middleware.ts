import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { LOCALE_COOKIE, isSupportedLocale, preferredLocaleFromRequest, type Locale } from "@/lib/i18n";

const localeCookieOptions = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

export async function middleware(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get("lang");
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const countryCode =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country");
  const acceptLanguage = request.headers.get("accept-language");
  const pathLocale: Locale = request.nextUrl.pathname === "/en" || request.nextUrl.pathname.startsWith("/en/") ? "en" : "nl";
  const requestedLocale = isSupportedLocale(langParam) ? langParam : null;
  const locale = requestedLocale ?? (isSupportedLocale(cookieLocale) ? cookieLocale : pathLocale === "en" ? "en" : preferredLocaleFromRequest({ cookieLocale, country: countryCode, acceptLanguage }));

  if (requestedLocale) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    if (requestedLocale === "en") {
      const response = NextResponse.redirect(new URL("/en", request.url));
      response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions);
      return response;
    }
    if (request.nextUrl.pathname === "/en") {
      url.pathname = "/";
    }
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions);
    return response;
  }

  if (request.nextUrl.pathname === "/" && locale === "en") {
    const response = NextResponse.redirect(new URL("/en", request.url));
    response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions);
    return response;
  }

  request.cookies.set(LOCALE_COOKIE, locale);
  const response = await updateSession(request);
  response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
