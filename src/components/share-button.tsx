"use client";

import { Check, Copy, Link2, Mail, Send, Share2 } from "lucide-react";
import { useState } from "react";

type Variant = "primary" | "secondary";

type GlyphProps = { className?: string };

/** Merk-glyph als inline SVG (lucide-react bevat geen merklogo's meer). */
function WhatsappGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 21.5a9.5 9.5 0 01-4.84-1.33l-.35-.2-3.6.94.96-3.5-.23-.36a9.46 9.46 0 01-1.45-5.04c0-5.24 4.27-9.5 9.52-9.5 2.54 0 4.93.99 6.73 2.79a9.45 9.45 0 012.79 6.72c0 5.24-4.27 9.5-9.52 9.5z" />
    </svg>
  );
}

function SignalGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 4.2c4.2 0 7.6 2.9 7.6 6.5S16.2 17.2 12 17.2c-.7 0-1.4-.08-2.05-.24L5.1 19.8l1.35-4.12c-1.28-1.18-2.05-2.73-2.05-4.98C4.4 7.1 7.8 4.2 12 4.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M8.8 10.8h6.4M8.8 13.2h4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
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
}: {
  url: string;
  text: string;
  title?: string;
  compact?: boolean;
  onDark?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const encodedBoth = encodeURIComponent(`${text} ${url}`.trim());

  const targets = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedBoth}`,
      icon: WhatsappGlyph,
      className: "share-link share-link-whatsapp",
    },
    {
      key: "email",
      label: "Mail",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedBoth}`,
      icon: Mail,
      className: "share-link share-link-email",
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

  async function onSignalShare() {
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
    <div className={`share-row${compact ? " share-row-compact" : ""}${onDark ? " share-row-on-dark" : ""}`}>
      <div className="share-actions">
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
              <span className={compact ? "sr-only" : undefined}>{target.label}</span>
            </a>
          );
        })}
        <button type="button" className="share-link share-link-signal" onClick={onSignalShare}>
          <SignalGlyph className="size-5" />
          <span className={compact ? "sr-only" : undefined}>Signal</span>
        </button>
        <button
          type="button"
          className="share-link share-link-copy"
          onClick={onCopy}
          aria-label="Link kopiëren"
          title="Link kopiëren"
        >
          {copied ? <Check aria-hidden="true" className="size-5" /> : <Link2 aria-hidden="true" className="size-5" />}
          <span className={compact ? "sr-only" : undefined}>{copied ? "Gekopieerd" : "Link"}</span>
        </button>
      </div>
      {compact ? null : (
        <p aria-live="polite" className="text-xs font-medium text-[#46566f]">
          {copied ? "Link gekopieerd." : "Deel via WhatsApp, Signal, mail of kopieer de link."}
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
