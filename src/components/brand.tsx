import { Trophy } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <div className="brand-mark grid size-12 place-items-center rounded-lg text-[#07112b] shadow-lg shadow-black/25">
        <Trophy aria-hidden="true" className="size-6" />
      </div>
      <div>
        <div className="text-2xl font-black leading-none tracking-normal text-white">Slime Score</div>
        <div className="text-sm font-black leading-none text-[#78e38c]">WK Poule 2026</div>
      </div>
    </Link>
  );
}
