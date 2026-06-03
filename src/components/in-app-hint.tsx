"use client";

import { ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Veel mensen openen de link vanuit WhatsApp. De in-app browser kan dan niet
 * installeren als app en de inloglink opent in een andere browser. We duwen
 * daarom licht (en wegklikbaar) naar Safari/Chrome.
 */
const IN_APP = /(FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Line\/|Snapchat|Twitter|LinkedInApp|Pinterest|TikTok)/i;

export function InAppHint() {
  // Client-only detectie (userAgent bestaat niet bij SSR), daarom in een effect.
  const [state, setState] = useState<{ show: boolean; ios: boolean }>({ show: false, ios: false });

  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (!IN_APP.test(ua)) return;
    if (localStorage.getItem("slime-inapp-dismissed") === "1") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- eenmalige client-detectie bij mount
    setState({ show: true, ios: /iPhone|iPad|iPod/i.test(ua) });
  }, []);

  if (!state.show) return null;
  const isIOS = state.ios;

  function dismiss() {
    localStorage.setItem("slime-inapp-dismissed", "1");
    setState({ show: false, ios: false });
  }

  return (
    <div className="inapp-hint" role="note">
      <ExternalLink aria-hidden="true" className="size-5 flex-none" />
      <p className="inapp-hint-text">
        Je opent dit in een app-browser. Voor de beste ervaring (en om Slime Score als app te
        installeren): tik op {isIOS ? "het deel-icoon en kies “Open in Safari”." : "het menu (⋮) en kies “Openen in Chrome”."}
      </p>
      <button type="button" className="inapp-hint-close" onClick={dismiss} aria-label="Sluiten">
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
