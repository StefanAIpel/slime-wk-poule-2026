import { Trophy } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <div className="grid size-12 place-items-center rounded-lg bg-[#f28c18] text-[#07112b] shadow-lg shadow-black/25">
        <Trophy aria-hidden="true" className="size-6" />
      </div>
      <div>
        <div className="text-2xl font-black leading-none tracking-normal text-white">WK Poule</div>
        <div className="text-sm font-black leading-none text-[#42cf65]">Slime 2026</div>
      </div>
    </Link>
  );
}
