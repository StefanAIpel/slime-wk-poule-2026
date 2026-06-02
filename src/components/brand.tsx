import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <Image
        className="size-14 rounded-xl shadow-lg shadow-black/25"
        src="/icon.png"
        alt=""
        width={96}
        height={96}
        aria-hidden="true"
        priority
      />
      <div>
        <div className="text-2xl font-black leading-none tracking-normal text-[#0b1f4d]">Slime Score</div>
        <div className="text-sm font-black leading-none text-[#0f8a43]">WK Poule 2026</div>
      </div>
    </Link>
  );
}
