import "server-only";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Eén server-side bron voor de admin-check: ingelogde user + of die in
 * ADMIN_EMAILS staat. Pagina's die een nette "geen toegang"-melding willen
 * tonen gebruiken deze variant; alles wat data of mutaties raakt gebruikt
 * requireAdmin. `server-only` garandeert dat dit nooit in een client-bundle
 * belandt.
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user, isAdmin: Boolean(user && isAdminEmail(user.email)) };
}

/** Harde poort voor admin-data en -mutaties: niet-admin (of uitgelogd) → home. */
export async function requireAdmin() {
  const { user, isAdmin } = await getAdminUser();
  if (!user || !isAdmin) redirect("/");
  return { user };
}
