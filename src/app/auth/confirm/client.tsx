"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { finishSupabaseAuth } from "@/lib/supabase/finish-auth";

export function AuthConfirmClient() {
  const router = useRouter();
  const [message, setMessage] = useState("Je inloglink wordt gecontroleerd.");

  useEffect(() => {
    let cancelled = false;

    async function finishLogin() {
      if (!cancelled) setMessage("Sessie wordt klaargezet.");
      const result = await finishSupabaseAuth();
      if (!result.ok) throw new Error(result.error);

      if (!cancelled) {
        setMessage("Gelukt. Je scorekaart wordt geopend.");
        window.history.replaceState(null, "", result.redirectTo);
        router.replace(result.redirectTo);
        router.refresh();
      }
    }

    finishLogin().catch(() => {
      if (!cancelled) {
        setMessage("Deze link is verlopen of al gebruikt. Vraag een nieuwe inloglink aan.");
        router.replace("/?auth=fout");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#eef6ff] px-4 py-3 text-sm font-black text-[#102c77]">
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-[#064ed6]" />
      <span aria-live="polite">{message}</span>
    </div>
  );
}
