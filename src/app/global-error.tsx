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
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Er ging iets mis</h1>
        <p style={{ color: "#48617f", maxWidth: 460, margin: "8px auto 16px" }}>
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
