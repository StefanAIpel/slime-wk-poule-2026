"use client";

import { useEffect } from "react";

/** Vangnet voor fouten in de root-layout. Moet eigen html/body renderen. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error?.message, error?.digest);
  }, [error]);

  return (
    <html lang="nl">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "10vh 20px", textAlign: "center", background: "#f5f7fb", color: "#0e2a47" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/slimes/ikea-maintenance-slime-404.webp"
          alt="Zweedse Slime met een stapelbed-bouwpakket"
          width="240"
          height="240"
          style={{ width: "min(240px, 82vw)", height: "auto", borderRadius: 24, boxShadow: "0 16px 40px rgba(8, 22, 52, 0.18)", marginBottom: 18 }}
        />
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Er ging iets mis</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: 460, margin: "8px auto 16px" }}>
          Vernieuw de pagina of probeer het later opnieuw.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{ background: "#df5a12", color: "#fff", border: 0, borderRadius: 12, padding: "11px 18px", fontWeight: 700, cursor: "pointer" }}
        >
          Opnieuw proberen
        </button>
      </body>
    </html>
  );
}
