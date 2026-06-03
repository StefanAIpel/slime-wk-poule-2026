"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { finishSupabaseAuth } from "@/lib/supabase/finish-auth";
import { serverAuthCallbackPath } from "@/lib/supabase/auth-redirect";

export function AuthConfirmClient() {
  const [message, setMessage] = useState("Je inloglink wordt gecontroleerd.");

  useEffect(() => {
    let cancelled = false;

    async function finishLogin() {
      const serverCallback = serverAuthCallbackPath(new URL(window.location.href));
      if (serverCallback) {
        if (!cancelled) setMessage("Sessie wordt veilig klaargezet.");
        window.location.replace(serverCallback);
        return;
      }

      if (!cancelled) setMessage("Sessie wordt klaargezet.");
      const result = await finishSupabaseAuth();
      if (!result.ok) throw new Error(result.error);

      if (!cancelled) {
        setMessage("Gelukt. Je scorekaart wordt geopend.");
        window.location.replace(result.redirectTo);
      }
    }

    finishLogin().catch(() => {
      if (!cancelled) {
        setMessage("Deze link is verlopen of al gebruikt. Vraag een nieuwe inloglink aan.");
        window.location.replace("/?auth=fout");
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#eef6ff] px-4 py-3 text-sm font-bold text-[#102c77]">
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-[#064ed6]" />
      <span aria-live="polite">{message}</span>
    </div>
  );
}
