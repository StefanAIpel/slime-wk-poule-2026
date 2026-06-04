import Image from "next/image";
import { getAvatar } from "@/lib/avatars";

export function SlimeAvatar({
  avatarKey,
  label,
  size = 42,
}: {
  avatarKey?: string | null;
  label?: string;
  size?: number;
}) {
  const avatar = getAvatar(avatarKey);

  return (
    <Image
      className="slime-avatar"
      src={avatar.src}
      alt={label ? `${label} avatar` : ""}
      width={64}
      height={64}
      style={{ width: size, height: size }}
    />
  );
}
