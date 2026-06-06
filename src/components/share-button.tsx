"use client";

import { Check, Copy, Mail, Send, Share2 } from "lucide-react";
import { useState, type ComponentType } from "react";

import { AppFirstShareLink } from "@/components/app-first-share-link";

type Variant = "primary" | "secondary";

type GlyphProps = { className?: string; "aria-hidden"?: boolean | "true" | "false" };
type ShareChannel = "whatsapp" | "facebook" | "telegram" | "signal" | "mail" | "instagram" | "native";
type ShareMessages = Partial<Record<ShareChannel, string>>;
type ShareTarget = {
  key: string;
  label: string;
  icon: ComponentType<GlyphProps>;
  className: string;
} & (
  | { appHref: string; webHref: string; href?: never }
  | { href: string; appHref?: never; webHref?: never }
);

/** Merk-glyph als inline SVG (lucide-react bevat geen merklogo's meer). */
function WhatsappGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 21.5a9.5 9.5 0 01-4.84-1.33l-.35-.2-3.6.94.96-3.5-.23-.36a9.46 9.46 0 01-1.45-5.04c0-5.24 4.27-9.5 9.52-9.5 2.54 0 4.93.99 6.73 2.79a9.45 9.45 0 012.79 6.72c0 5.24-4.27 9.5-9.52 9.5z" />
    </svg>
  );
}

function FacebookGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

function InstagramGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M21.9 4.16c.26-1.2-.9-1.86-1.94-1.45L2.66 9.44c-1.18.46-1.16 1.1-.2 1.4l4.43 1.38 1.7 5.17c.22.62.11.87.75.87.49 0 .7-.22.98-.49l2.35-2.29 4.9 3.62c.9.5 1.55.24 1.78-.83L21.9 4.16ZM7.58 11.9l10.28-6.48c.5-.3.95-.14.58.2L9.64 13.56l-.34 3.63-1.72-5.3Z" />
    </svg>
  );
}

function SignalGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="7.1" fill="currentColor" opacity="0.14" />
      <path
        d="M5.6 17.6A8.7 8.7 0 0 1 4 12a8 8 0 1 1 3.3 6.48L4.2 19.4l.92-2.82"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 14.35c.63.57 1.53.9 2.57.9 1.47 0 2.47-.65 2.47-1.72 0-1-.72-1.37-2.4-1.76-1.4-.33-2.33-.9-2.33-2.03 0-1.15 1.04-1.95 2.55-1.95.93 0 1.68.23 2.3.7" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function withUrl(message: string, url: string) {
  return `${message.trim()}\n${url}`.trim();
}

/**
 * Deelknop met native Web Share API en een nette fallback
 * (kopiëren naar klembord).
 */
export function ShareButton({
  url,
  text,
  title = "Slime Score WK 2026",
  label = "Delen",
  variant = "primary",
}: {
  url: string;
  text: string;
  title?: string;
  label?: string;
  variant?: Variant;
}) {
  const [copied, setCopied] = useState(false);
  const buttonClass = variant === "primary" ? "button-primary" : "button-secondary";

  async function onShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Gebruiker brak het delen af of het lukte niet: val terug op kopiëren.
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className={buttonClass} onClick={onShare}>
      {copied ? <Check aria-hidden="true" className="size-5" /> : <Share2 aria-hidden="true" className="size-5" />}
      {copied ? "Link gekopieerd" : label}
    </button>
  );
}

/** Subtiele deelrij met de belangrijkste gezins-/groepskanalen. */
export function ShareRow({
  url,
  text,
  title = "Slime Score WK 2026",
  compact = false,
  onDark = false,
  messages,
}: {
  url: string;
  text: string;
  title?: string;
  compact?: boolean;
  onDark?: boolean;
  messages?: ShareMessages;
}) {
  const [copied, setCopied] = useState(false);
  const messageFor = (channel: ShareChannel) => messages?.[channel] ?? text;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedWhatsApp = encodeURIComponent(withUrl(messageFor("whatsapp"), url));
  const encodedFacebookQuote = encodeURIComponent(messageFor("facebook"));
  const encodedTelegramText = encodeURIComponent(messageFor("telegram"));
  const encodedSignal = encodeURIComponent(withUrl(messageFor("signal"), url));
  const encodedMailBody = encodeURIComponent(withUrl(messageFor("mail"), url));
  const whatsappWebHref = `https://wa.me/?text=${encodedWhatsApp}`;
  const facebookWebHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedFacebookQuote}`;
  const telegramWebHref = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTelegramText}`;

  const targets: ShareTarget[] = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      appHref: `whatsapp://send?text=${encodedWhatsApp}`,
      webHref: whatsappWebHref,
      icon: WhatsappGlyph,
      className: "share-link share-link-whatsapp",
    },
    {
      key: "facebook",
      label: "Facebook",
      appHref: `fb://facewebmodal/f?href=${encodeURIComponent(facebookWebHref)}`,
      webHref: facebookWebHref,
      icon: FacebookGlyph,
      className: "share-link share-link-facebook",
    },
    {
      key: "telegram",
      label: "Telegram",
      appHref: `tg://msg_url?url=${encodedUrl}&text=${encodedTelegramText}`,
      webHref: telegramWebHref,
      icon: TelegramGlyph,
      className: "share-link share-link-telegram",
    },
    {
      key: "signal",
      label: "Signal",
      href: `sgnl://send?text=${encodedSignal}`,
      icon: SignalGlyph,
      className: "share-link share-link-signal",
    },
    {
      key: "mail",
      label: "Mail",
      href: `mailto:?subject=${encodedTitle}&body=${encodedMailBody}`,
      icon: Mail,
      className: "share-link share-link-mail",
    },
  ];

  async function copyShareText(channel: ShareChannel = "native") {
    try {
      await navigator.clipboard.writeText(withUrl(messageFor(channel), url));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function onNativeShare(channel: ShareChannel = "native") {
    const shareText = messageFor(channel);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
        return;
      } catch {
        // afgebroken — geen actie nodig
      }
    }
    copyShareText(channel);
  }

  return (
    <div className={`share-row${compact ? " share-row-compact" : ""}${onDark ? " share-row-on-dark" : ""}`}>
      <div className="share-actions">
        {targets.map((target) => {
          const Icon = target.icon;
          const label = `Delen via ${target.label}`;
          if (target.appHref && target.webHref) {
            return (
              <AppFirstShareLink
                key={target.key}
                className={target.className}
                appHref={target.appHref}
                webHref={target.webHref}
                label={label}
                title={label}
              >
                <Icon aria-hidden="true" className="size-5" />
                <span className={compact ? "sr-only" : undefined}>{target.label}</span>
              </AppFirstShareLink>
            );
          }
          return (
            <a
              key={target.key}
              className={target.className}
              href={target.href}
              aria-label={label}
              title={label}
            >
              <Icon aria-hidden="true" className="size-5" />
              <span className={compact ? "sr-only" : undefined}>{target.label}</span>
            </a>
          );
        })}
        <button
          type="button"
          className="share-link share-link-instagram"
          onClick={() => onNativeShare("instagram")}
          aria-label="Delen via Instagram"
          title="Delen via Instagram"
        >
          <InstagramGlyph aria-hidden="true" className="size-5" />
          <span className={compact ? "sr-only" : undefined}>Instagram</span>
        </button>
        <button
          type="button"
          className="share-link share-link-more"
          onClick={() => onNativeShare("native")}
          aria-label="Meer delen"
          title="Meer delen"
        >
          {copied ? <Check aria-hidden="true" className="size-5" /> : <Share2 aria-hidden="true" className="size-5" />}
          <span className={compact ? "sr-only" : undefined}>{copied ? "Gekopieerd" : "Meer"}</span>
        </button>
      </div>
      {compact ? null : (
        <p aria-live="polite" className="text-xs font-medium text-[#46566f]">
          {copied ? "Link gekopieerd." : "Deel via WhatsApp, Facebook, Telegram, Signal, mail, Instagram of je telefoon."}
        </p>
      )}
    </div>
  );
}

/** Directe WhatsApp-deelknop met vooraf ingevulde tekst + link. */
export function WhatsappShare({
  text,
  url,
  label = "WhatsApp",
  variant = "primary",
  compact = false,
}: {
  text: string;
  url: string;
  label?: string;
  variant?: Variant;
  compact?: boolean;
}) {
  void variant;
  const message = encodeURIComponent(`${text} ${url}`.trim());
  return (
    <AppFirstShareLink
      className={`button-whatsapp${compact ? " button-compact" : ""}`}
      appHref={`whatsapp://send?text=${message}`}
      webHref={`https://wa.me/?text=${message}`}
      label={label}
      title={label}
    >
      <Send aria-hidden="true" className="size-5" />
      {label}
    </AppFirstShareLink>
  );
}

/** Kopieer een korte waarde (zoals een poulecode) met visuele bevestiging. */
export function CopyButton({
  value,
  label = "Kopieer",
  variant = "secondary",
  compact = false,
}: {
  value: string;
  label?: string;
  variant?: Variant;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const buttonClass = `${variant === "primary" ? "button-primary" : "button-secondary"}${compact ? " button-compact" : ""}`;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className={buttonClass} onClick={onCopy}>
      {copied ? <Check aria-hidden="true" className="size-5" /> : <Copy aria-hidden="true" className="size-5" />}
      {copied ? "Gekopieerd" : label}
    </button>
  );
}
