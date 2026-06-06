export const AUTH_CONFIRM_PATH = "/auth/confirm";
export const AUTH_CALLBACK_PATH = "/auth/callback";
export const DEFAULT_LOGIN_REDIRECT = "/?login=gelukt";

function hasEncodedPathTraversal(pathname: string) {
  const lower = pathname.toLowerCase();
  return lower.includes("%2e") || lower.includes("%2f") || lower.includes("%5c");
}

export function safeRedirectTarget(value: string | null) {
  if (!value) return DEFAULT_LOGIN_REDIRECT;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return DEFAULT_LOGIN_REDIRECT;

  try {
    const parsed = new URL(value, "https://slimescore.local");
    const target = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    if (parsed.origin !== "https://slimescore.local") return DEFAULT_LOGIN_REDIRECT;
    if (!target.startsWith("/") || target.startsWith("//") || target.includes("\\")) return DEFAULT_LOGIN_REDIRECT;
    if (hasEncodedPathTraversal(parsed.pathname)) return DEFAULT_LOGIN_REDIRECT;
    return target;
  } catch {
    return DEFAULT_LOGIN_REDIRECT;
  }
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
