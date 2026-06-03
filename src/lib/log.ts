/**
 * Eenvoudige, gestructureerde logging. Schrijft JSON naar stdout/stderr zodat
 * de logs van Vercel/host doorzoekbaar zijn. Klaar om later door te sturen naar
 * een monitoringtool (bijv. Sentry) zonder de aanroepen te hoeven wijzigen.
 */
type Fields = Record<string, unknown>;

function emit(level: "info" | "warn" | "error", message: string, fields?: Fields) {
  const line = JSON.stringify({ level, message, ts: new Date().toISOString(), ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function logInfo(message: string, fields?: Fields) {
  emit("info", message, fields);
}

export function logWarn(message: string, fields?: Fields) {
  emit("warn", message, fields);
}

export function logError(context: string, error: unknown, fields?: Fields) {
  const message = error instanceof Error ? error.message : String(error);
  emit("error", context, { error: message, ...fields });
}
