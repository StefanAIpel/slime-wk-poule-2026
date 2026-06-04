"use client";

import { Check, Link as LinkIcon, Mail, QrCode, Send } from "lucide-react";
import { useState } from "react";

import { AppFirstShareLink } from "@/components/app-first-share-link";

/**
 * Compacte icon-only deelrij voor de poule-header. Houdt mobiel alleen de code
 * zichtbaar; de lange link/QR-download zitten in een ingeklapt details-blok.
 */
export function PoolQuickShare({
  joinUrl,
  qrDataUrl,
  poolName,
  inviteText,
}: {
  joinUrl: string;
  qrDataUrl: string;
  poolName: string;
  inviteText: string;
}) {
  const [copied, setCopied] = useState(false);
  const [qrBusy, setQrBusy] = useState(false);
  const message = `${inviteText} ${joinUrl}`.trim();
  const encodedMessage = encodeURIComponent(message);
  const encodedTitle = encodeURIComponent(`Doe mee met ${poolName}`);
  const encodedBody = encodeURIComponent(`${inviteText}\n\n${joinUrl}`.trim());
  const fileName = `qr-${poolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "wk-poule"}.png`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function shareQr() {
    setQrBusy(true);
    try {
      if (!qrDataUrl) {
        if (navigator.share) await navigator.share({ title: `Doe mee met ${poolName}`, text: inviteText, url: joinUrl });
        return;
      }
      const blob = await (await fetch(qrDataUrl)).blob();
      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: `Doe mee met ${poolName}`, text: `Scan de QR of ga naar ${joinUrl}` });
      } else if (navigator.share) {
        await navigator.share({ title: `Doe mee met ${poolName}`, text: inviteText, url: joinUrl });
      } else {
        window.open(qrDataUrl, "_blank");
      }
    } catch {
      // Gebruiker annuleerde of apparaat ondersteunt dit niet.
    } finally {
      setQrBusy(false);
    }
  }

  return (
    <div className="pool-quick-share" aria-label="Poule delen">
      <AppFirstShareLink
        className="pool-quick-share-button pool-quick-share-whatsapp"
        appHref={`whatsapp://send?text=${encodedMessage}`}
        webHref={`https://wa.me/?text=${encodedMessage}`}
        label="Deel via WhatsApp"
        title="Deel via WhatsApp"
      >
        <Send aria-hidden="true" className="size-4" />
      </AppFirstShareLink>
      <button
        className="pool-quick-share-button pool-quick-share-copy"
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Link gekopieerd" : "Kopieer link"}
        title={copied ? "Link gekopieerd" : "Kopieer link"}
      >
        {copied ? <Check aria-hidden="true" className="size-4" /> : <LinkIcon aria-hidden="true" className="size-4" />}
      </button>
      <a
        className="pool-quick-share-button pool-quick-share-mail"
        href={`mailto:?subject=${encodedTitle}&body=${encodedBody}`}
        aria-label="Deel via mail"
        title="Deel via mail"
      >
        <Mail aria-hidden="true" className="size-4" />
      </a>
      <button
        className="pool-quick-share-button pool-quick-share-qr"
        type="button"
        onClick={shareQr}
        disabled={qrBusy}
        aria-label="Deel QR-code"
        title="Deel QR-code"
      >
        <QrCode aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
