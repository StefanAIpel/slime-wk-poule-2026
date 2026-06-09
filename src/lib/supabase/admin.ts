import "server-only";

import { createClient } from "@supabase/supabase-js";

function adminEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function hasAdminEnv() {
  const { url, key } = adminEnv();
  return Boolean(url && key);
}

export function createAdminClient() {
  const { url, key } = adminEnv();

  if (!url || !key) {
    throw new Error("Supabase admin env vars ontbreken.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createOptionalAdminClient() {
  return hasAdminEnv() ? createAdminClient() : null;
}
