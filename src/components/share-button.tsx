"use client";

import { Check, Copy, Send, Share2 } from "lucide-react";
import { useState } from "react";

type Variant = "primary" | "secondary";

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
  const buttonClass = variant === "primary" ? "button-primary" : "button-secondary";
  const message = encodeURIComponent(`${text} ${url}`.trim());
  return (
    <a className={buttonClass} href={`https://wa.me/?text=${message}`} target="_blank" rel="noopener noreferrer">
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
