"use client";

import { Check, Copy, Link2, Mail, Send, Share2 } from "lucide-react";
import { useState } from "react";

type Variant = "primary" | "secondary";

type GlyphProps = { className?: string };

/** Merk-glyphs als inline SVG (lucide-react bevat geen merklogo's meer). */
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
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.5-1.5h1.6V4.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H7.6V14h2.7v8h3.2z" />
    </svg>
  );
}

function XGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function TelegramGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

/**
 * Deelknop met native Web Share API en een nette fallback
 * (kopiëren naar klembord). Alle links wijzen naar slimescore.nl.
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

/**
 * Rij met deel-opties: systeem-delen + WhatsApp, Facebook, X, Telegram, e-mail
 * en kopieer-link. Instagram kent geen web-deel-URL, dus daarvoor gebruik je de
 * kopieerknop (plak de link in je verhaal of bio).
 */
export function ShareRow({
  url,
  text,
  title = "Slime Score WK 2026",
}: {
  url: string;
  text: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedBoth = encodeURIComponent(`${text} ${url}`.trim());

  const targets = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedBoth}`,
      icon: WhatsappGlyph,
      className: "share-pill share-pill-whatsapp",
    },
    {
      key: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookGlyph,
      className: "share-pill share-pill-facebook",
    },
    {
      key: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: XGlyph,
      className: "share-pill share-pill-x",
    },
    {
      key: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: TelegramGlyph,
      className: "share-pill share-pill-telegram",
    },
    {
      key: "email",
      label: "E-mail",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedBoth}`,
      icon: Mail,
      className: "share-pill share-pill-email",
    },
  ];

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function onNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // afgebroken — geen actie nodig
      }
    } else {
      onCopy();
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={buttonClassFor("secondary")} onClick={onNativeShare}>
          <Share2 aria-hidden="true" className="size-5" />
          Delen
        </button>
        {targets.map((target) => {
          const Icon = target.icon;
          return (
            <a
              key={target.key}
              className={target.className}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Delen via ${target.label}`}
              title={`Delen via ${target.label}`}
            >
              <Icon aria-hidden="true" className="size-5" />
            </a>
          );
        })}
        <button
          type="button"
          className="share-pill share-pill-copy"
          onClick={onCopy}
          aria-label="Link kopiëren"
          title="Link kopiëren (ook voor Instagram)"
        >
          {copied ? <Check aria-hidden="true" className="size-5" /> : <Link2 aria-hidden="true" className="size-5" />}
        </button>
      </div>
      <p aria-live="polite" className="text-xs font-medium text-[#46566f]">
        {copied ? "Link gekopieerd — plak hem in je app, story of bio." : "Kies een app of kopieer de link."}
      </p>
    </div>
  );
}

function buttonClassFor(variant: Variant) {
  return variant === "primary" ? "button-primary" : "button-secondary";
}

/** Directe WhatsApp-deelknop met vooraf ingevulde tekst + slimescore.nl-link. */
export function WhatsappShare({
  text,
  url,
  label = "WhatsApp",
  variant = "primary",
}: {
  text: string;
  url: string;
  label?: string;
  variant?: Variant;
}) {
  void variant;
  const message = encodeURIComponent(`${text} ${url}`.trim());
  return (
    <a className="button-whatsapp" href={`https://wa.me/?text=${message}`} target="_blank" rel="noopener noreferrer">
      <Send aria-hidden="true" className="size-5" />
      {label}
    </a>
  );
}

/** Kopieer een korte waarde (zoals een poulecode) met visuele bevestiging. */
export function CopyButton({ value, label = "Kopieer", variant = "secondary" }: { value: string; label?: string; variant?: Variant }) {
  const [copied, setCopied] = useState(false);
  const buttonClass = variant === "primary" ? "button-primary" : "button-secondary";

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
