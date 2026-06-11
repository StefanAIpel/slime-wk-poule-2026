import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/i18n";

export type SiteMessagePlacement = "home" | "voorspellingen";

export type SiteMessageRow = {
  placement: SiteMessagePlacement;
  body_nl: string;
  body_en: string;
  show_from: string | null;
  show_until: string | null;
};

/**
 * Welke tekst (indien aanwezig) nu getoond moet worden. Leeg lichaam of een
 * tijdvenster waar `now` buiten valt → null. EN valt terug op NL zodat een
 * alleen-NL mededeling ook op /en zichtbaar blijft.
 */
export function activeSiteMessage(row: SiteMessageRow | null | undefined, locale: Locale, now: Date = new Date()): string | null {
  if (!row) return null;
  if (row.show_from && now < new Date(row.show_from)) return null;
  if (row.show_until && now >= new Date(row.show_until)) return null;
  const body = (locale === "en" ? row.body_en || row.body_nl : row.body_nl).trim();
  return body || null;
}

/** Haalt de mededeling voor één plek op (RLS: publiek leesbaar). */
export async function fetchSiteMessage(
  supabase: SupabaseClient,
  placement: SiteMessagePlacement,
): Promise<SiteMessageRow | null> {
  const { data } = await supabase
    .from("site_messages")
    .select("placement,body_nl,body_en,show_from,show_until")
    .eq("placement", placement)
    .maybeSingle();
  return (data as SiteMessageRow | null) ?? null;
}
