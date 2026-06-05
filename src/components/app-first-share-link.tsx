"use client";

import type { MouseEvent, ReactNode } from "react";

type AppFirstShareLinkProps = {
  appHref: string;
  webHref: string;
  className: string;
  label: string;
  title?: string;
  children: ReactNode;
};

const MOBILE_APP_USER_AGENT = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i;

function isMobileAppContext() {
  if (typeof navigator === "undefined") return false;
  return MOBILE_APP_USER_AGENT.test(navigator.userAgent);
}

/**
 * Probeert op mobiel eerst de native app te openen. Op desktop/web openen we de
 * web-deelpagina expliciet in een nieuw tabblad, zodat SlimeScore zelf blijft staan.
 */
export function AppFirstShareLink({ appHref, webHref, className, label, title, children }: AppFirstShareLinkProps) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (isMobileAppContext()) {
      let cancelled = false;
      const cancelFallback = () => {
        cancelled = true;
        window.removeEventListener("pagehide", cancelFallback);
        window.removeEventListener("blur", cancelFallback);
        document.removeEventListener("visibilitychange", cancelFallback);
      };
      window.addEventListener("pagehide", cancelFallback, { once: true });
      window.addEventListener("blur", cancelFallback, { once: true });
      document.addEventListener("visibilitychange", cancelFallback, { once: true });
      window.location.href = appHref;
      window.setTimeout(() => {
        if (!cancelled && document.visibilityState === "visible") {
          window.open(webHref, "_blank", "noopener,noreferrer");
        }
        cancelFallback();
      }, 900);
      return;
    }

    window.open(webHref, "_blank", "noopener,noreferrer");
  }

  return (
    <a
      className={className}
      href={appHref}
      data-app-href={appHref}
      data-web-href={webHref}
      onClick={onClick}
      aria-label={label}
      title={title ?? label}
    >
      {children}
    </a>
  );
}
