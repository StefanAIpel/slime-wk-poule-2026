import { NextResponse, type NextRequest } from "next/server";

import { SITE_URL, SITE_URL_APP } from "@/lib/constants";
import { DEFAULT_LOGIN_REDIRECT, safeRedirectTarget } from "@/lib/supabase/auth-redirect";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PasswordLoginBody = {
  email?: unknown;
  password?: unknown;
  next?: unknown;
  reason?: unknown;
};

function loginErrorMessage(errorMessage: string) {
  const lower = errorMessage.toLowerCase();
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "Mail of wachtwoord klopt niet. Nog nooit een wachtwoord gekozen? Gebruik ‘Wachtwoord vergeten?’.";
  }
  if (lower.includes("email not confirmed")) {
    return "Open eerst de bevestigingsmail. Daarna kun je inloggen met je e-mail en wachtwoord.";
  }
  return "Inloggen lukte niet. Controleer je gegevens en probeer het opnieuw.";
}

function decorateRedirectTarget(request: NextRequest, value: string, reason: string) {
  const redirectUrl = new URL(value, request.url);
  redirectUrl.searchParams.set("login", reason);
  redirectUrl.searchParams.set("_auth", Date.now().toString(36));
  const target = `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
  return safeRedirectTarget(target) === target ? target : DEFAULT_LOGIN_REDIRECT;
}

function redirectTarget(request: NextRequest, next: string, reason: string) {
  try {
    const redirectUrl = new URL(next, request.url);
    if (!allowedRequestOrigins(request).has(redirectUrl.origin)) {
      return decorateRedirectTarget(request, DEFAULT_LOGIN_REDIRECT, reason);
    }
    return decorateRedirectTarget(request, `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`, reason);
  } catch {
    return decorateRedirectTarget(request, DEFAULT_LOGIN_REDIRECT, reason);
  }
}

function allowedRequestOrigins(request: NextRequest) {
  const origins = new Set<string>([new URL(request.url).origin, SITE_URL, SITE_URL_APP]);
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSiteUrl) {
    try {
      origins.add(new URL(configuredSiteUrl).origin);
    } catch {
      // Ignore invalid local config; the fixed constants above still protect production.
    }
  }

  const headerHosts = [request.headers.get("host"), request.headers.get("x-forwarded-host")]
    .flatMap((host) => host?.split(",") ?? [])
    .map((host) => host.trim())
    .filter(Boolean);
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  for (const host of headerHosts) {
    if (forwardedProto) origins.add(`${forwardedProto}://${host}`);
    origins.add(`https://${host}`);
    origins.add(`http://${host}`);
  }

  return origins;
}

function requestFromSameOrigin(request: NextRequest) {
  const allowedOrigins = allowedRequestOrigins(request);
  const origin = request.headers.get("origin");
  if (origin) return allowedOrigins.has(origin);

  const referer = request.headers.get("referer");
  if (!referer) return true;

  try {
    return allowedOrigins.has(new URL(referer).origin);
  } catch {
    return false;
  }
}

function isJsonRequest(request: NextRequest) {
  return request.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false;
}

export async function POST(request: NextRequest) {
  if (!requestFromSameOrigin(request)) {
    return NextResponse.json({ ok: false, message: "Inloggen lukte niet. Vernieuw de pagina en probeer opnieuw." }, { status: 403 });
  }
  if (!isJsonRequest(request)) {
    return NextResponse.json({ ok: false, message: "Ongeldig inlogverzoek." }, { status: 415 });
  }

  const body = (await request.json().catch(() => null)) as PasswordLoginBody | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const next = safeRedirectTarget(typeof body?.next === "string" ? body.next : null);
  const reason = body?.reason === "code" ? "code" : "wachtwoord";

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Vul je e-mailadres en wachtwoord in." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json(
      { ok: false, message: loginErrorMessage(error.message) },
      { status: error.message.toLowerCase().includes("email not confirmed") ? 403 : 401 },
    );
  }

  const target = redirectTarget(request, next, reason);
  return NextResponse.json({ ok: true, redirectTo: target });
}
