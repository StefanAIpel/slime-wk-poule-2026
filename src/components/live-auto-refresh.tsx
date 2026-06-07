"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Vernieuwt de server-data (ISR) periodiek zodat live-standen meelopen zonder reload. */
export function LiveAutoRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = window.setInterval(() => router.refresh(), seconds * 1000);
    return () => window.clearInterval(id);
  }, [router, seconds]);
  return null;
}
