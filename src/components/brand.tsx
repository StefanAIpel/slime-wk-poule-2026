import Image from "next/image";
import Link from "next/link";
import { SlimeAvatar } from "@/components/slime-avatar";

export function Brand({ avatarKey }: { avatarKey?: string | null } = {}) {
  return (
    <Link href="/" className="flex items-center gap-2 no-underline">
      {avatarKey ? (
        <SlimeAvatar
          avatarKey={avatarKey}
          className="rounded-full bg-white/80 p-1 shadow-lg shadow-black/20 ring-2 ring-[#ff7a00]"
          size={40}
        />
      ) : (
        <Image
          className="size-14 rounded-xl shadow-lg shadow-black/25"
          src="/icon.png"
          alt=""
          width={96}
          height={96}
          aria-hidden="true"
          priority
        />
      )}
      <div>
        <div className="text-2xl font-black leading-none tracking-normal text-[#0b1f4d]">Slime Score</div>
        <div className="text-sm font-black leading-none text-[#0f8a43]">WK Poule 2026</div>
      </div>
    </Link>
  );
}
