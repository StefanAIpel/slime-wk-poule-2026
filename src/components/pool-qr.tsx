"use client";

import { Download, QrCode, Share2 } from "lucide-react";
import { useState } from "react";

/**
 * Toont de uitnodigings-QR met knoppen om 'm te downloaden of (op mobiel) direct
 * te delen als afbeelding via het systeem-deelvenster. Zo kan een beheerder de
 * QR snel in een appgroep of print zetten.
 */
export function PoolQr({
  qrDataUrl,
  poolName,
  joinUrl,
}: {
  qrDataUrl: string;
  poolName: string;
  joinUrl: string;
}) {
  const [busy, setBusy] = useState(false);
  if (!qrDataUrl) return null;

  const fileName = `qr-${poolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "wk-poule"}.png`;

  async function shareQr() {
    setBusy(true);
    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({
          files: [file],
          title: `Doe mee met ${poolName}`,
          text: `Scan de QR of ga naar ${joinUrl}`,
        });
      } else if (navigator.share) {
        await navigator.share({ title: `Doe mee met ${poolName}`, text: `Doe mee met ${poolName}`, url: joinUrl });
      } else {
        window.open(qrDataUrl, "_blank");
      }
    } catch {
      // gebruiker annuleerde het delen — geen actie nodig
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pool-invite-qr" src={qrDataUrl} alt={`QR-code om mee te doen met ${poolName}`} width={92} height={92} />
      <div className="flex gap-1.5">
        <a className="button-plain min-h-8 px-2 text-xs" href={qrDataUrl} download={fileName} title="QR-afbeelding downloaden">
          <Download aria-hidden="true" className="size-3.5" />
          Download
        </a>
        <button className="button-plain min-h-8 px-2 text-xs" type="button" onClick={shareQr} disabled={busy} title="QR delen">
          {busy ? <QrCode aria-hidden="true" className="size-3.5" /> : <Share2 aria-hidden="true" className="size-3.5" />}
          Deel QR
        </button>
      </div>
    </div>
  );
}
