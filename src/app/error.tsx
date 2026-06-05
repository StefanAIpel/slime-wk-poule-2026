"use client";

import Image from "next/image";
import { useEffect } from "react";
import { CONTACT_EMAIL } from "@/lib/constants";

/** Route-fout: nette melding i.p.v. een witte pagina, met opnieuw-knop. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Zichtbaar in de serverlogs/monitoring.
    console.error("Route error:", error?.message, error?.digest);
  }, [error]);

  return (
    <main className="page-shell grid min-h-[60vh] place-items-center">
      <div className="panel grid max-w-md gap-3 p-6 text-center">
        <Image
          className="mx-auto h-auto w-full max-w-[240px] rounded-3xl shadow-lg"
          src="/slimes/ikea-maintenance-slime-404.webp"
          alt="Zweedse Slime met een stapelbed-bouwpakket"
          width={720}
          height={720}
          priority
        />
        <h1 className="text-2xl font-bold text-[#081634]">Er ging even iets mis</h1>
        <p className="text-sm font-medium leading-6 text-[#48617f]">
          Probeer het opnieuw. Blijft het misgaan? Laat het ons weten via{" "}
          <a className="font-bold text-[#0e7a44]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="button-primary" onClick={reset}>
            Opnieuw proberen
          </button>
          {/* Harde navigatie is hier gewenst: het reset de eventueel kapotte client-state. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="button-plain" href="/">
            Naar home
          </a>
        </div>
      </div>
    </main>
  );
}
