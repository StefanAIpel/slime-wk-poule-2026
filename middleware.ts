import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { LOCALE_COOKIE, isSupportedLocale, preferredLocaleFromRequest, stripLocaleFromPath, type Locale } from "@/lib/i18n";

const localeCookieOptions = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

export async function middleware(request: NextRequest) {
  // --- Live-subsite (live.slimescore.com) -----------------------------------
  // Aparte UI met alleen Schema + Live. We markeren de request met een header
  // zodat de root-layout de hoofd-navigatie/footer verbergt. Op het echte
  // subdomein rewriten we /<path> → /live/<path>; op preview kun je /live direct
  // bezoeken. Raakt de hoofdsite niet (alleen dit host/pad).
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const path = request.nextUrl.pathname;
  const isLiveHost = host === "live.slimescore.com" || host.startsWith("live.localhost");
  const isLivePath = path === "/live" || path.startsWith("/live/");
  if (isLiveHost || isLivePath) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-slimescore-surface", "live");
    if (isLiveHost && !isLivePath) {
      const url = request.nextUrl.clone();
      url.pathname = path === "/" ? "/live" : `/live${path}`;
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const langParam = request.nextUrl.searchParams.get("lang");
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const countryCode =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country");
  const acceptLanguage = request.headers.get("accept-language");
  const pathLocale: Locale = request.nextUrl.pathname === "/en" || request.nextUrl.pathname.startsWith("/en/") ? "en" : "nl";
  const requestedLocale = isSupportedLocale(langParam) ? langParam : null;
  const locale = requestedLocale ?? (pathLocale === "en" ? "en" : isSupportedLocale(cookieLocale) ? cookieLocale : preferredLocaleFromRequest({ cookieLocale, country: countryCode, acceptLanguage }));

  if (requestedLocale) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    if (requestedLocale === "en" && url.pathname === "/") {
      url.pathname = "/en";
    }
    if (requestedLocale === "nl") {
      url.pathname = stripLocaleFromPath(url.pathname);
    }
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions);
    return response;
  }

  if (!requestedLocale && request.nextUrl.pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = stripLocaleFromPath(url.pathname);
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, "en", localeCookieOptions);
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
