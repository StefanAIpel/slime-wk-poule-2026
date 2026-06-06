import { NextResponse } from "next/server";
import { LOCALE_COOKIE, isSupportedLocale, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

const localeCookieOptions = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let locale: Locale | null = null;

  try {
    const body = (await request.json()) as { locale?: unknown };
    locale = isSupportedLocale(String(body.locale ?? "")) ? (body.locale as Locale) : null;
  } catch {
    locale = null;
  }

  if (!locale) {
    return NextResponse.json({ ok: false, error: "unsupported-locale" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase.from("profiles").update({ preferred_locale: locale }).eq("id", user.id);
    if (error) {
      const response = NextResponse.json({ ok: false, error: "profile-update-failed" }, { status: 500 });
      response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions);
      return response;
    }
  }

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions);
  return response;
}
