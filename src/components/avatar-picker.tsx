"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { avatarOptions, avatarSrcForKey, isAvatarKey } from "@/lib/avatars";

/**
 * Kies je eigen slime-avatar. Schrijft de gekozen sleutel naar een verborgen
 * veld `avatar_key`, zodat het meelift met het account-formulier.
 */
export function AvatarPicker({ initialKey, name }: { initialKey?: string | null; name: string }) {
  const [selected, setSelected] = useState<string>(isAvatarKey(initialKey) ? (initialKey as string) : "");

  return (
    <div className="grid gap-3">
      <input type="hidden" name="avatar_key" value={selected} />
      <div className="flex items-center gap-3">
        <img
          className="avatar-img"
          src={selected ? avatarSrcForKey(selected) : avatarSrcForKey(avatarOptions[0].key)}
          alt=""
          aria-hidden="true"
          width={56}
          height={56}
          style={{ width: 56, height: 56 }}
        />
        <p className="text-sm font-medium text-[#48617f]">
          {selected ? "Jouw gekozen slime." : `Geen keuze: dan krijg je automatisch een vaste slime voor "${name}".`}
        </p>
      </div>
      <div className="avatar-grid">
        <button
          type="button"
          className={`avatar-choice ${selected === "" ? "is-selected" : ""}`}
          onClick={() => setSelected("")}
          aria-pressed={selected === ""}
          title="Automatisch (op naam)"
        >
          <span className="avatar-choice-auto">Auto</span>
        </button>
        {avatarOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`avatar-choice ${selected === option.key ? "is-selected" : ""}`}
            onClick={() => setSelected(option.key)}
            aria-pressed={selected === option.key}
            title={option.label}
          >
            <img src={avatarSrcForKey(option.key)} alt={option.label} width={48} height={48} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
