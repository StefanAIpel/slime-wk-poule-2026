"use client";

import { Check, Mail, Send } from "lucide-react";
import { useState } from "react";

import { AppFirstShareLink } from "@/components/app-first-share-link";

type GlyphProps = { className?: string; "aria-hidden"?: boolean | "true" | "false" };

function InstagramGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Inline deelknoppen naast de poulenaam: zichtbaar, compact en zonder zwevende popover. */
export function PoolQuickShare({
  joinUrl,
  poolName,
  poolCode,
  inviteText,
}: {
  joinUrl: string;
  poolName: string;
  poolCode: string;
  inviteText: string;
}) {
  const [nativeCopied, setNativeCopied] = useState(false);
  const message = `${inviteText}\n\n${joinUrl}`.trim();
  const poolInviteHeadline = `Doe mee met onze 100% gratis WK-poule "${poolName}" ⚽`;
  const poolInviteCode = `Poulecode: ${poolCode}`;
  const poolInviteValue = "1x ±10 min invullen. Speelschema + uitslagen volgen.";
  const groupMessageText = `${poolInviteHeadline}\n${poolInviteCode}\nMaak evt. eerst gratis een account. ${poolInviteValue}`;
  const groupMessage = `${groupMessageText}\n\n${joinUrl}`;
  const socialMessage = `${poolInviteHeadline}\n${poolInviteCode}\n${poolInviteValue}`;
  const instagramMessage = `100% gratis WK-poule "${poolName}". ${poolInviteCode}. ${poolInviteValue}`;
  const encodedMessage = encodeURIComponent(groupMessage);
  const encodedInvite = encodeURIComponent(socialMessage);
  const encodedSignalMessage = encodeURIComponent(groupMessage);
  const encodedUrl = encodeURIComponent(joinUrl);
  const encodedTitle = encodeURIComponent(`Doe mee met ${poolName}`);
  const encodedBody = encodeURIComponent(message);
  const facebookWebHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedInvite}`;

  async function nativeShare(shareText = groupMessageText) {
    try {
      if (navigator.share) {
        await navigator.share({ title: `Doe mee met ${poolName}`, text: shareText, url: joinUrl });
        return;
      }
      await navigator.clipboard.writeText(`${shareText}\n${joinUrl}`.trim());
      setNativeCopied(true);
      setTimeout(() => setNativeCopied(false), 1800);
    } catch {
      // Gebruiker annuleerde of apparaat ondersteunt dit niet.
    }
  }

  return (
    <div className="pool-quick-share" aria-label="Poule delen">
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
        <AppFirstShareLink
          className="pool-quick-share-button pool-quick-share-facebook"
          appHref={`fb://facewebmodal/f?href=${encodeURIComponent(facebookWebHref)}`}
          webHref={facebookWebHref}
          label="Deel via Facebook"
          title="Deel via Facebook"
        >
          <span aria-hidden="true" className="pool-share-brand-letter">f</span>
        </AppFirstShareLink>
        <AppFirstShareLink
          className="pool-quick-share-button pool-quick-share-telegram"
          appHref={`tg://msg_url?url=${encodedUrl}&text=${encodedInvite}`}
          webHref={`https://t.me/share/url?url=${encodedUrl}&text=${encodedInvite}`}
          label="Deel via Telegram"
          title="Deel via Telegram"
        >
          <span aria-hidden="true" className="pool-share-brand-letter">TG</span>
        </AppFirstShareLink>
        <a
          className="pool-quick-share-button pool-quick-share-signal"
          href={`sgnl://send?text=${encodedSignalMessage}`}
          aria-label="Deel via Signal"
          title="Deel via Signal"
        >
          <span aria-hidden="true" className="pool-share-brand-letter">S</span>
        </a>
        <a
          className="pool-quick-share-button pool-quick-share-mail"
          href={`mailto:?subject=${encodedTitle}&body=${encodedBody}`}
          aria-label="Deel via mail"
          title="Deel via mail"
        >
          <Mail aria-hidden="true" className="size-4" />
        </a>
        <button
          className="pool-quick-share-button pool-quick-share-instagram"
          type="button"
          onClick={() => nativeShare(instagramMessage)}
          aria-label={nativeCopied ? "Link gekopieerd voor Instagram/native share" : "Deel via Instagram/native share"}
          title={nativeCopied ? "Link gekopieerd voor Instagram/native share" : "Deel via Instagram/native share"}
        >
          {nativeCopied ? <Check aria-hidden="true" className="size-4" /> : <InstagramGlyph aria-hidden="true" className="size-4" />}
        </button>
      </div>
    </div>
  );
}
