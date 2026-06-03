import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Atomaire rate limit via de Postgres-functie `rate_limit_hit`. Geeft `true` als
 * de actie is toegestaan (onder de limiet), `false` als de limiet is bereikt.
 * Bij een fout in de limiter laten we de actie door (fail-open) zodat echte
 * gebruikers nooit onterecht geblokkeerd worden. Gebruik de admin/service-client.
 */
export async function rateLimit(
  admin: SupabaseClient,
  key: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  const { data, error } = await admin.rpc("rate_limit_hit", {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (error) return true;
  return data === true;
}
