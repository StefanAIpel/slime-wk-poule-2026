"use client";

import { Check, Link as LinkIcon, Mail, QrCode, Send, Share2 } from "lucide-react";
import { useState } from "react";

import { AppFirstShareLink } from "@/components/app-first-share-link";

/** Inline deelknoppen naast de poulenaam: zichtbaar, compact en zonder zwevende popover. */
export function PoolQuickShare({
  joinUrl,
  qrDataUrl,
  poolName,
  inviteText,
  isManager = false,
}: {
  joinUrl: string;
  qrDataUrl: string;
  poolName: string;
  inviteText: string;
  isManager?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [qrBusy, setQrBusy] = useState(false);
  const [nativeCopied, setNativeCopied] = useState(false);
  const message = `${inviteText} ${joinUrl}`.trim();
  const encodedMessage = encodeURIComponent(message);
  const encodedInvite = encodeURIComponent(inviteText);
  const encodedUrl = encodeURIComponent(joinUrl);
  const encodedTitle = encodeURIComponent(`Doe mee met ${poolName}`);
  const encodedBody = encodeURIComponent(`${inviteText}\n\n${joinUrl}`.trim());
  const facebookWebHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;
  const fileName = `qr-${poolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "wk-poule"}.png`;

  async function copyText(text = joinUrl) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `Doe mee met ${poolName}`, text: inviteText, url: joinUrl });
        return;
      }
      await navigator.clipboard.writeText(message);
      setNativeCopied(true);
      setTimeout(() => setNativeCopied(false), 1800);
    } catch {
      // Gebruiker annuleerde of apparaat ondersteunt dit niet.
    }
  }

  async function shareQr() {
    setQrBusy(true);
    try {
      if (!qrDataUrl) {
        await nativeShare();
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
        window.open(qrDataUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      // Gebruiker annuleerde of apparaat ondersteunt dit niet.
    } finally {
      setQrBusy(false);
    }
  }

  return (
    <div className="pool-quick-share" aria-label="Poule delen">
      <span className="pool-share-inline-label" title="Poule delen">
        <Share2 aria-hidden="true" className="size-3.5" />
        <span className="sr-only">Poule delen</span>
      </span>
      <div className="pool-share-actions" aria-label="Deel deze poule">
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
          onClick={() => copyText(joinUrl)}
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

        {isManager ? (
          <>
            <AppFirstShareLink
              className="pool-quick-share-button pool-quick-share-facebook pool-quick-share-admin-button"
              appHref={`fb://facewebmodal/f?href=${encodeURIComponent(facebookWebHref)}`}
              webHref={facebookWebHref}
              label="Deel via Facebook"
              title="Deel via Facebook"
            >
              <span aria-hidden="true" className="pool-share-brand-letter">f</span>
            </AppFirstShareLink>
            <button
              className="pool-quick-share-button pool-quick-share-instagram pool-quick-share-admin-button"
              type="button"
              onClick={nativeShare}
              aria-label={nativeCopied ? "Link gekopieerd voor Instagram" : "Deel via Instagram of native deelmenu"}
              title={nativeCopied ? "Link gekopieerd voor Instagram" : "Deel via Instagram/native deelmenu"}
            >
              <span aria-hidden="true" className="pool-share-brand-letter">IG</span>
            </button>
            <AppFirstShareLink
              className="pool-quick-share-button pool-quick-share-telegram pool-quick-share-admin-button"
              appHref={`tg://msg_url?url=${encodedUrl}&text=${encodedInvite}`}
              webHref={`https://t.me/share/url?url=${encodedUrl}&text=${encodedInvite}`}
              label="Deel via Telegram"
              title="Deel via Telegram"
            >
              <span aria-hidden="true" className="pool-share-brand-letter">TG</span>
            </AppFirstShareLink>
          </>
        ) : null}
      </div>
    </div>
  );
}
