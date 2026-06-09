import "server-only";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Eén server-side admin-poort: ingelogd ÉN e-mail in ADMIN_EMAILS, anders
 * redirect naar home. Frontend-checks zijn nooit genoeg — elke admin-action
 * en -pagina hoort hier doorheen. `server-only` garandeert dat dit bestand
 * nooit in een client-bundle belandt.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) redirect("/");
  return { supabase, user };
}
