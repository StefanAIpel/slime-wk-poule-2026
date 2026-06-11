"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Vernieuwt de server-data (ISR) periodiek zodat live-standen meelopen zonder reload.
 * In een transition: de her-render is onderbreekbaar, zodat een klik (bijv. op
 * "WK voorspellen") niet hoeft te wachten op de refresh (INP). Verborgen
 * tabbladen slaan de refresh over.
 */
export function LiveAutoRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      startTransition(() => router.refresh());
    }, seconds * 1000);
    return () => window.clearInterval(id);
  }, [router, seconds]);
  return null;
}
