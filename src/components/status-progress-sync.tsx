"use client";

import { useEffect } from "react";

/**
 * Keeps the persistent layout status bar in sync after a server-action save.
 * Next.js preserves the client layout between page renders, so StatusBar's
 * initial /api/me fetch can otherwise stay stale until a manual reload.
 */
export function StatusProgressSync({ progress }: { progress: number }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("slimescore:me-update", { detail: { progress } }));
  }, [progress]);

  return null;
}
