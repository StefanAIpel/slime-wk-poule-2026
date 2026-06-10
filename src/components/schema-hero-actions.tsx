"use client";

import { Radio, Share2 } from "lucide-react";
import { useState } from "react";

import { ShareRow } from "@/components/share-button";
import type { Locale } from "@/lib/i18n";

export function SchemaHeroActions({
  liveUrl,
  shareUrl,
  shareText,
  shareTitle,
  liveLabel,
  shareLabel,
  locale,
}: {
  liveUrl: string;
  shareUrl: string;
  shareText: string;
  shareTitle: string;
  liveLabel: string;
  shareLabel: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="schema-hero-actions">
      <a href={liveUrl} className="schema-live-follow-button" aria-label={liveLabel}>
        <Radio aria-hidden="true" className="size-4" />
        <span className="schema-action-label">{liveLabel}</span>
      </a>
      <div className={open ? "schema-share-menu is-open" : "schema-share-menu"}>
        <button type="button" className="schema-share-trigger" aria-label={shareLabel} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <Share2 aria-hidden="true" className="size-4" />
          <span className="schema-action-label">{shareLabel}</span>
        </button>
        {open ? (
          <div className="schema-share-popover">
            <ShareRow url={shareUrl} text={shareText} title={shareTitle} compact onDark locale={locale} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
