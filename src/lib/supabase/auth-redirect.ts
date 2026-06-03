export const AUTH_CONFIRM_PATH = "/auth/confirm";
export const AUTH_CALLBACK_PATH = "/auth/callback";

export function safeRedirectTarget(value: string | null) {
  if (!value) return "/?login=gelukt";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return "/?login=gelukt";
}

export function buildEmailRedirectTo(origin: string, next?: string | null) {
  const confirmUrl = new URL(AUTH_CONFIRM_PATH, origin);
  const safeNext = safeRedirectTarget(next ?? null);
  if (safeNext !== "/?login=gelukt") confirmUrl.searchParams.set("next", safeNext);
  return confirmUrl.toString();
}

export function serverAuthCallbackPath(url: URL) {
  const hasServerPayload = Boolean(
    url.searchParams.get("code") ||
      url.searchParams.get("token_hash") ||
      url.searchParams.get("error") ||
      url.searchParams.get("error_description"),
  );

  if (!hasServerPayload) return null;

  const callbackUrl = new URL(AUTH_CALLBACK_PATH, url.origin);
  for (const key of ["code", "token_hash", "type", "next", "error", "error_description"]) {
    const value = url.searchParams.get(key);
    if (value) callbackUrl.searchParams.set(key, value);
  }

  return `${callbackUrl.pathname}${callbackUrl.search}`;
}
