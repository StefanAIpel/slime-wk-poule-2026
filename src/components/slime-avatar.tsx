import Image from "next/image";
import { getAvatar } from "@/lib/avatars";

export function SlimeAvatar({
  avatarKey,
  label,
  size,
  className,
}: {
  avatarKey?: string | null;
  label?: string;
  size?: number;
  className?: string;
}) {
  const avatar = getAvatar(avatarKey);

  return (
    <Image
      className={["slime-avatar", className].filter(Boolean).join(" ")}
      src={avatar.src}
      alt={label ? `${label} avatar` : ""}
      width={64}
      height={64}
      style={size ? { width: size, height: size } : undefined}
    />
  );
}
