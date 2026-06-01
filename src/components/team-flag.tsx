/* eslint-disable @next/next/no-img-element */
import { flagUrl } from "@/lib/flags";

export function TeamFlag({
  code,
  name,
  size = "md",
}: {
  code: string | null | undefined;
  name?: string | null;
  size?: "sm" | "md";
}) {
  const url = flagUrl(code);
  const className =
    size === "sm"
      ? "h-4 w-6 rounded-[3px] border border-slate-200 object-cover shadow-sm"
      : "h-6 w-9 rounded-[4px] border border-slate-200 object-cover shadow-sm";

  if (!url) {
    return (
      <span
        className={`${size === "sm" ? "h-4 w-6 text-[9px]" : "h-6 w-9 text-[10px]"} inline-grid place-items-center rounded-[4px] bg-slate-200 font-black text-slate-600`}
        aria-hidden="true"
      >
        {code?.slice(0, 2) ?? "?"}
      </span>
    );
  }

  return <img className={className} src={url} alt={name ? `Vlag van ${name}` : ""} loading="lazy" />;
}
