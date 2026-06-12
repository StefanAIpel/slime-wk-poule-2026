"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const JOIN_PARAM = "meedoen";

/**
 * Scroll alleen naar het poule-meedoenformulier na een expliciete menu/linkactie.
 * We gebruiken bewust geen `#meedoen` in de URL, want mobiele browsers/PWA's
 * bewaren zo'n hash en openen de ingelogde home daarna steeds halverwege.
 */
export function JoinPoolScrollTarget() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get(JOIN_PARAM) !== "1") return;

    window.requestAnimationFrame(() => {
      document.getElementById("join-pool-form")?.scrollIntoView({ block: "start", behavior: "smooth" });

      const cleanParams = new URLSearchParams(window.location.search);
      cleanParams.delete(JOIN_PARAM);
      const query = cleanParams.toString();
      const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
      window.history.replaceState(null, "", cleanUrl);
    });
  }, [pathname, searchParams]);

  return null;
}
