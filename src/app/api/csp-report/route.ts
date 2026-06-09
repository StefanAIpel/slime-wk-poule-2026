import { logWarn } from "@/lib/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Verzamelpunt voor CSP-overtredingen (de CSP staat op Report-Only; zo belanden
 * meldingen niet alleen in de browserconsole maar ook in onze gestructureerde
 * logs). Geen DB, geen PII-opslag: alleen de richtlijn + geblokkeerde bron,
 * gecapt op lengte. Faalt nooit — een report mag de browser nooit hinderen.
 */
type CspFields = Record<string, unknown>;

function pick(report: CspFields, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = report[key];
    if (typeof value === "string" && value) return value.slice(0, 300);
  }
  return undefined;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as unknown;
    // report-uri-formaat: { "csp-report": {...} }; report-to: [{ body: {...} }].
    const raw =
      (body as { "csp-report"?: CspFields } | null)?.["csp-report"] ??
      (Array.isArray(body) ? (body[0] as { body?: CspFields } | undefined)?.body : null) ??
      (body as CspFields | null);

    if (raw && typeof raw === "object") {
      const report = raw as CspFields;
      logWarn("csp-violation", {
        directive: pick(report, "violated-directive", "effectiveDirective"),
        blocked: pick(report, "blocked-uri", "blockedURL"),
        document: pick(report, "document-uri", "documentURL"),
      });
    }
  } catch {
    // Nooit falen op een report.
  }
  return new Response(null, { status: 204 });
}
