import { cookies } from "next/headers";
import { LOCALE_COOKIE, isSupportedLocale, type Locale } from "@/lib/i18n";

export async function getServerLocale(defaultLocale: Locale = "nl"): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  return isSupportedLocale(cookieLocale) ? cookieLocale : defaultLocale;
}
