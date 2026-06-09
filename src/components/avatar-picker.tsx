"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { avatarOptions, avatarSrcForKey, isAvatarKey, resolveAvatarSrc } from "@/lib/avatars";
import type { Locale } from "@/lib/i18n";

const avatarPickerCopy = {
  nl: {
    selected: "Jouw gekozen slime.",
    automatic: (name: string) => `Geen keuze: dan krijg je automatisch een vaste slime voor "${name}".`,
    autoTitle: "Automatisch (op naam)",
  },
  en: {
    selected: "Your selected slime.",
    automatic: (name: string) => `No choice: you automatically get a fixed slime for "${name}".`,
    autoTitle: "Automatic (based on name)",
  },
} satisfies Record<Locale, { selected: string; automatic: (name: string) => string; autoTitle: string }>;

const avatarLabelsEn: Record<string, string> = {
  netherlands: "Netherlands",
  "oranje-aanvoerder": "Captain",
  "oranje-spelmaker": "Playmaker",
  "oranje-aanvaller": "Forward",
  "oranje-coach": "Coach",
  "oranje-supporter": "Supporter",
  "oranje-president": "President",
  keeper: "Goalkeeper",
  "appel-slime": "Apple",
  brazil: "Brazil",
  argentina: "Argentina",
  france: "France",
  spain: "Spain",
  england: "England",
  usa: "USA",
  mexico: "Mexico",
  "japan-sumo": "Japan",
  "morocco-fan": "Morocco",
  "norway-viking": "Norway",
  "scotland-fan": "Scotland",
  "sweden-fan": "Sweden",
  "switzerland-alpine": "Switzerland",
  "turkey-fan": "Turkey",
  curacao: "Curaçao",
  duitsland: "Germany",
  "rode-duivel": "Belgium",
};

function avatarLabel(option: { key: string; label: string }, locale: Locale) {
  return locale === "en" ? avatarLabelsEn[option.key] ?? option.label : option.label;
}

/**
 * Kies je eigen slime-avatar. Schrijft de gekozen sleutel naar een verborgen
 * veld `avatar_key`, zodat het meelift met het account-formulier.
 */
export function AvatarPicker({ initialKey, name, locale = "nl" }: { initialKey?: string | null; name: string; locale?: Locale }) {
  const [selected, setSelected] = useState<string>(isAvatarKey(initialKey) ? (initialKey as string) : "");
  const copy = avatarPickerCopy[locale];
  const previewSize = selected ? 112 : 56;

  return (
    <div className="grid gap-3">
      <input type="hidden" name="avatar_key" value={selected} />
      <div className="flex items-center gap-3">
        <img
          className="avatar-img"
          src={selected ? avatarSrcForKey(selected) : resolveAvatarSrc(name)}
          alt=""
          aria-hidden="true"
          width={previewSize}
          height={previewSize}
          style={{ width: previewSize, height: previewSize }}
        />
        <p className="text-sm font-medium text-[#48617f]">
          {selected ? copy.selected : copy.automatic(name)}
        </p>
      </div>
      <div className="avatar-grid">
        <button
          type="button"
          className={`avatar-choice ${selected === "" ? "is-selected" : ""}`}
          onClick={() => setSelected("")}
          aria-pressed={selected === ""}
          title={copy.autoTitle}
        >
          <span className="avatar-choice-auto">Auto</span>
        </button>
        {avatarOptions.map((option) => {
          const label = avatarLabel(option, locale);
          return (
            <button
              key={option.key}
              type="button"
              className={`avatar-choice ${selected === option.key ? "is-selected" : ""}`}
              onClick={() => setSelected(option.key)}
              aria-pressed={selected === option.key}
              title={label}
            >
              <img src={avatarSrcForKey(option.key)} alt={label} width={48} height={48} loading="lazy" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
