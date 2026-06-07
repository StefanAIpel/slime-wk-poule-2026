"use client";

import { Download, QrCode, Share2 } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

const poolQrCopy = {
  nl: {
    fileFallback: "wk-poule",
    shareTitle: (poolName: string) => `Doe mee met ${poolName}`,
    shareText: (poolName: string, joinUrl: string) => `Scan de QR of ga naar ${joinUrl}`,
    fallbackText: (poolName: string) => `Doe mee met ${poolName}`,
    alt: (poolName: string) => `QR-code om mee te doen met ${poolName}`,
    downloadTitle: "QR-afbeelding downloaden",
    downloadLabel: "Download",
    shareTitleAttr: "QR delen",
    shareLabel: "Deel QR",
  },
  en: {
    fileFallback: "world-cup-pool",
    shareTitle: (poolName: string) => `Join ${poolName}`,
    shareText: (_poolName: string, joinUrl: string) => `Scan the QR code or go to ${joinUrl}`,
    fallbackText: (poolName: string) => `Join ${poolName}`,
    alt: (poolName: string) => `QR code to join ${poolName}`,
    downloadTitle: "Download QR image",
    downloadLabel: "Download",
    shareTitleAttr: "Share QR",
    shareLabel: "Share QR",
  },
} as const;

/**
 * Toont de uitnodigings-QR met knoppen om 'm te downloaden of (op mobiel) direct
 * te delen als afbeelding via het systeem-deelvenster. Zo kan een beheerder de
 * QR snel in een appgroep of print zetten.
 */
export function PoolQr({
  qrDataUrl,
  poolName,
  joinUrl,
  locale = "nl",
}: {
  qrDataUrl: string;
  poolName: string;
  joinUrl: string;
  locale?: Locale;
}) {
  const copy = poolQrCopy[locale];
  const [busy, setBusy] = useState(false);
  if (!qrDataUrl) return null;

  const fileName = `qr-${poolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || copy.fileFallback}.png`;

  async function shareQr() {
    setBusy(true);
    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({
          files: [file],
          title: copy.shareTitle(poolName),
          text: copy.shareText(poolName, joinUrl),
        });
      } else if (navigator.share) {
        await navigator.share({ title: copy.shareTitle(poolName), text: copy.fallbackText(poolName), url: joinUrl });
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
      <img className="pool-invite-qr" src={qrDataUrl} alt={copy.alt(poolName)} width={92} height={92} />
      <div className="flex gap-1.5">
        <a className="button-plain min-h-8 px-2 text-xs" href={qrDataUrl} download={fileName} title={copy.downloadTitle}>
          <Download aria-hidden="true" className="size-3.5" />
          {copy.downloadLabel}
        </a>
        <button className="button-plain min-h-8 px-2 text-xs" type="button" onClick={shareQr} disabled={busy} title={copy.shareTitleAttr}>
          {busy ? <QrCode aria-hidden="true" className="size-3.5" /> : <Share2 aria-hidden="true" className="size-3.5" />}
          {copy.shareLabel}
        </button>
      </div>
    </div>
  );
}
