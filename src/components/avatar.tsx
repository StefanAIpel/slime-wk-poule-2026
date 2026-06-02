/* eslint-disable @next/next/no-img-element */

import { resolveAvatarSrc } from "@/lib/avatars";

/**
 * Ronde slime-avatar. Gebruikt de eigen keuze (`avatarKey`) als die er is,
 * anders een vaste slime op basis van de naam.
 */
export function Avatar({ name, avatarKey, size = 40 }: { name: string; avatarKey?: string | null; size?: number }) {
  const label = name?.trim() || "Speler";
  return (
    <img
      className="avatar-img"
      src={resolveAvatarSrc(label, avatarKey)}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
    />
  );
}
