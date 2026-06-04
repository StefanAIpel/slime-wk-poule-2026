"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { flagEmoji, flagUrl } from "@/lib/flags";

export function TeamFlag({
  code,
  name,
  size = "md",
}: {
  code: string | null | undefined;
  name?: string | null;
  size?: "sm" | "md";
}) {
  const [broken, setBroken] = useState(false);
  const url = flagUrl(code);
  const emoji = flagEmoji(code);
  const className =
    size === "sm"
      ? "h-4 w-6 rounded-[3px] border border-slate-200 object-cover shadow-sm"
      : "h-6 w-9 rounded-[4px] border border-slate-200 object-cover shadow-sm";

  const title = name ?? code ?? undefined;

  if (!url || broken) {
    return (
      <span
        className={`${size === "sm" ? "h-4 w-6 text-[12px]" : "h-6 w-9 text-[17px]"} inline-grid place-items-center overflow-hidden rounded-[4px] border border-slate-200 bg-white font-bold leading-none text-slate-700 shadow-sm`}
        aria-hidden="true"
        title={title}
      >
        {emoji ?? code?.slice(0, 2) ?? "?"}
      </span>
    );
  }

  return <img className={className} src={url} alt={name ? `Vlag van ${name}` : ""} title={title} loading="lazy" onError={() => setBroken(true)} />;
}
