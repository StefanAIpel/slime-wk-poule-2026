import Image from "next/image";
import Link from "next/link";
import { SlimeAvatar } from "@/components/slime-avatar";

type BrandProps = {
  avatarKey?: string | null;
  tone?: "light" | "dark";
  compact?: boolean;
};

export function Brand({ avatarKey, tone = "light", compact = false }: BrandProps = {}) {
  const slimeColor = tone === "dark" ? "text-white" : "text-[#0b1f4d]";
  const iconSize = compact ? 48 : 56;

  return (
    <Link href="/" className="flex items-center gap-2 no-underline" aria-label="SlimeScore WK 2026">
      {avatarKey ? (
        <SlimeAvatar
          avatarKey={avatarKey}
          className="rounded-full bg-white/80 p-1 shadow-lg shadow-black/20 ring-2 ring-[#ff7a00]"
          size={compact ? 38 : 40}
        />
      ) : (
        <Image
          className={`${compact ? "size-12" : "size-14"} rounded-xl shadow-lg shadow-black/25`}
          src="/icon.png"
          alt=""
          width={iconSize}
          height={iconSize}
          aria-hidden="true"
          priority
        />
      )}
      <div>
        <div className={`${compact ? "text-xl" : "text-2xl"} font-black leading-none tracking-normal`}>
          <span className={slimeColor}>Slime</span>
          <span className="text-[#0f8a43]">Score</span>
        </div>
        <div className={`${compact ? "mt-1 text-sm" : "mt-1.5 text-base"} font-black leading-tight text-[#0f8a43]`}>
          WK 2026
        </div>
      </div>
    </Link>
  );
}
