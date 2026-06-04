import Image from "next/image";
import { avatarOptions, DEFAULT_AVATAR_KEY, normalizeAvatarKey } from "@/lib/avatars";

export function AvatarPicker({
  currentAvatarKey,
  compact = false,
}: {
  currentAvatarKey?: string | null;
  compact?: boolean;
}) {
  const selected = normalizeAvatarKey(currentAvatarKey ?? DEFAULT_AVATAR_KEY);

  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-black text-[#081634]">Avatar</legend>
      <div className={compact ? "avatar-picker avatar-picker-compact" : "avatar-picker"}>
        {avatarOptions.map((avatar) => (
          <label key={avatar.key} className="avatar-option" title={avatar.label}>
            <input
              className="sr-only"
              type="radio"
              name="avatar_key"
              value={avatar.key}
              defaultChecked={avatar.key === selected}
            />
            <Image className="avatar-option-image" src={avatar.src} alt="" width={64} height={64} aria-hidden="true" />
            <span className="sr-only">{avatar.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
