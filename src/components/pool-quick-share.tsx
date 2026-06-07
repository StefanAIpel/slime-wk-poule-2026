"use client";

import { Check, Mail, Send } from "lucide-react";
import { useState } from "react";

import { AppFirstShareLink } from "@/components/app-first-share-link";
import type { Locale } from "@/lib/i18n";

type GlyphProps = { className?: string; "aria-hidden"?: boolean | "true" | "false" };

const poolQuickShareCopy = {
  nl: {
    containerLabel: "Poule delen",
    actionsLabel: "Deel deze poule",
    headline: (poolName: string) => `Doe mee met onze 100% gratis WK-poule "${poolName}" ⚽`,
    code: (poolCode: string) => `Poulecode: ${poolCode}`,
    value: "1x ±10 min invullen. Speelschema + uitslagen volgen.",
    accountHint: "Maak evt. eerst gratis een account.",
    instagram: (poolName: string, poolInviteCode: string, poolInviteValue: string) =>
      `100% gratis WK-poule "${poolName}". ${poolInviteCode}. ${poolInviteValue}`,
    nativeTitle: (poolName: string) => `Doe mee met ${poolName}`,
    shareVia: (channel: string) => `Deel via ${channel}`,
    copied: (channel: string) => `Link gekopieerd voor ${channel}`,
  },
  en: {
    containerLabel: "Share pool",
    actionsLabel: "Share this pool",
    headline: (poolName: string) => `Join our 100% free World Cup pool "${poolName}" ⚽`,
    code: (poolCode: string) => `Pool code: ${poolCode}`,
    value: "Fill in once in about 10 minutes. Follow the schedule and results.",
    accountHint: "Create a free account first if needed.",
    instagram: (poolName: string, poolInviteCode: string, poolInviteValue: string) =>
      `100% free World Cup pool "${poolName}". ${poolInviteCode}. ${poolInviteValue}`,
    nativeTitle: (poolName: string) => `Join ${poolName}`,
    shareVia: (channel: string) => `Share via ${channel}`,
    copied: (channel: string) => `Link copied for ${channel}`,
  },
} as const;

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
  locale = "nl",
}: {
  joinUrl: string;
  poolName: string;
  poolCode: string;
  inviteText: string;
  locale?: Locale;
}) {
  const [nativeCopied, setNativeCopied] = useState<string | null>(null);
  const copy = poolQuickShareCopy[locale];
  const message = `${inviteText}\n\n${joinUrl}`.trim();
  const poolInviteHeadline = copy.headline(poolName);
  const poolInviteCode = copy.code(poolCode);
  const poolInviteValue = copy.value;
  const groupMessageText = `${poolInviteHeadline}\n${poolInviteCode}\n${copy.accountHint} ${poolInviteValue}`;
  const groupMessage = `${groupMessageText}\n\n${joinUrl}`;
  const socialMessage = `${poolInviteHeadline}\n${poolInviteCode}\n${poolInviteValue}`;
  const instagramMessage = copy.instagram(poolName, poolInviteCode, poolInviteValue);
  const encodedMessage = encodeURIComponent(groupMessage);
  const encodedInvite = encodeURIComponent(socialMessage);
  const encodedUrl = encodeURIComponent(joinUrl);
  const encodedTitle = encodeURIComponent(copy.nativeTitle(poolName));
  const encodedBody = encodeURIComponent(message);
  const facebookWebHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedInvite}`;

  async function nativeShare(shareText = groupMessageText, channelLabel = "native share") {
    try {
      if (navigator.share) {
        await navigator.share({ title: copy.nativeTitle(poolName), text: shareText, url: joinUrl });
        return;
      }
      await navigator.clipboard.writeText(`${shareText}\n${joinUrl}`.trim());
      setNativeCopied(channelLabel);
      setTimeout(() => setNativeCopied(null), 1800);
    } catch {
      // Gebruiker annuleerde of apparaat ondersteunt dit niet.
    }
  }

  return (
    <div className="pool-quick-share" aria-label={copy.containerLabel}>
      <div className="pool-share-actions" aria-label={copy.actionsLabel}>
        <AppFirstShareLink
          className="pool-quick-share-button pool-quick-share-whatsapp"
          appHref={`whatsapp://send?text=${encodedMessage}`}
          webHref={`https://wa.me/?text=${encodedMessage}`}
          label={copy.shareVia("WhatsApp")}
          title={copy.shareVia("WhatsApp")}
        >
          <Send aria-hidden="true" className="size-4" />
        </AppFirstShareLink>
        <AppFirstShareLink
          className="pool-quick-share-button pool-quick-share-facebook"
          appHref={`fb://facewebmodal/f?href=${encodeURIComponent(facebookWebHref)}`}
          webHref={facebookWebHref}
          label={copy.shareVia("Facebook")}
          title={copy.shareVia("Facebook")}
        >
          <span aria-hidden="true" className="pool-share-brand-letter">f</span>
        </AppFirstShareLink>
        <AppFirstShareLink
          className="pool-quick-share-button pool-quick-share-telegram"
          appHref={`tg://msg_url?url=${encodedUrl}&text=${encodedInvite}`}
          webHref={`https://t.me/share/url?url=${encodedUrl}&text=${encodedInvite}`}
          label={copy.shareVia("Telegram")}
          title={copy.shareVia("Telegram")}
        >
          <span aria-hidden="true" className="pool-share-brand-letter">TG</span>
        </AppFirstShareLink>
        <button
          className="pool-quick-share-button pool-quick-share-signal"
          type="button"
          onClick={() => nativeShare(groupMessageText, "Signal")}
          aria-label={nativeCopied === "Signal" ? copy.copied("Signal") : copy.shareVia("Signal")}
          title={nativeCopied === "Signal" ? copy.copied("Signal") : copy.shareVia("Signal")}
        >
          {nativeCopied === "Signal" ? <Check aria-hidden="true" className="size-4" /> : <span aria-hidden="true" className="pool-share-brand-letter">S</span>}
        </button>
        <a
          className="pool-quick-share-button pool-quick-share-mail"
          href={`mailto:?subject=${encodedTitle}&body=${encodedBody}`}
          aria-label={copy.shareVia("mail")}
          title={copy.shareVia("mail")}
        >
          <Mail aria-hidden="true" className="size-4" />
        </a>
        <button
          className="pool-quick-share-button pool-quick-share-instagram"
          type="button"
          onClick={() => nativeShare(instagramMessage, "Instagram/native share")}
          aria-label={nativeCopied === "Instagram/native share" ? copy.copied("Instagram/native share") : copy.shareVia("Instagram/native share")}
          title={nativeCopied === "Instagram/native share" ? copy.copied("Instagram/native share") : copy.shareVia("Instagram/native share")}
        >
          {nativeCopied === "Instagram/native share" ? <Check aria-hidden="true" className="size-4" /> : <InstagramGlyph aria-hidden="true" className="size-4" />}
        </button>
      </div>
    </div>
  );
}
