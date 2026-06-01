"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { finishSupabaseAuth, hasAuthCallbackPayload } from "@/lib/supabase/finish-auth";

export function AuthLinkBridge() {
  const router = useRouter();
  const [active] = useState(() => typeof window !== "undefined" && hasAuthCallbackPayload());

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    finishSupabaseAuth().then((result) => {
      if (cancelled) return;
      window.history.replaceState(null, "", result.redirectTo);
      router.replace(result.redirectTo);
      router.refresh();
    });

    return () => {
      cancelled = true;
    };
  }, [active, router]);

  if (!active) return null;

  return (
    <div className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-lg border border-white/70 bg-white px-4 py-3 text-sm font-black text-[#081634] shadow-2xl">
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-[#064ed6]" />
      <span>Inloglink wordt afgerond...</span>
    </div>
  );
}
