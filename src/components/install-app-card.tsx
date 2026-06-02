"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const storageKey = "slime-score-install-card-dismissed";
const subscribe = () => () => {};

export function InstallAppCard() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [closed, setClosed] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  if (!hydrated || closed || window.localStorage.getItem(storageKey) === "1") return null;

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  }

  function close() {
    window.localStorage.setItem(storageKey, "1");
    setClosed(true);
  }

  return (
    <aside className="install-card" aria-label="App toevoegen">
      <div className="flex items-start gap-3">
        <div className="install-card-icon" aria-hidden="true">
          <Download className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-black text-[#081634]">Zet Slime Score op je beginscherm</h2>
          <p className="mt-1 text-sm font-semibold leading-5 text-[#48617f]">
            Werkt als app op je telefoon en gewoon in de browser.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {installPrompt ? (
              <button className="button-secondary min-h-10 px-3" type="button" onClick={install}>
                Installeren
              </button>
            ) : (
              <span className="text-xs font-bold leading-5 text-[#48617f]">
                iPhone: tik onderin op de deelknop (vierkant met pijl) en kies &ldquo;Zet op beginscherm&rdquo;.
              </span>
            )}
          </div>
        </div>
        <button className="install-card-close" type="button" onClick={close}>
          <X aria-hidden="true" className="size-5" />
          <span className="sr-only">Melding sluiten</span>
        </button>
      </div>
    </aside>
  );
}
