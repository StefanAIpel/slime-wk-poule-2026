"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const storageKey = "slime-score-install-card-dismissed-v2";
const subscribe = () => () => {};

export function InstallAppCard() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [closed, setClosed] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);

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
    if (installPrompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
      return;
    }
    setShowHelp((value) => !value);
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
          <h2 className="text-base font-bold text-[#081634]">Zet Slime Score op je beginscherm</h2>
          <p className="mt-1 text-sm font-medium leading-5 text-[#48617f]">
            Werkt als app op je telefoon en gewoon in de browser.
          </p>
          <div className="mt-3">
            <button className="button-secondary min-h-10 px-3" type="button" onClick={install}>
              <Download aria-hidden="true" className="size-4" />
              {installPrompt ? "Installeren" : "Zo installeer je"}
            </button>
          </div>
          {showHelp && !installPrompt ? (
            <ul className="mt-2 grid gap-1 text-xs font-medium leading-5 text-[#48617f]">
              <li><strong>iPhone (Safari):</strong> tik onderin op de deelknop (vierkant met pijl) → &ldquo;Zet op beginscherm&rdquo;.</li>
              <li><strong>Android (Chrome):</strong> menu ⋮ → &ldquo;App installeren&rdquo; / &ldquo;Toevoegen aan startscherm&rdquo;.</li>
              <li><strong>Desktop:</strong> klik op het installatie-icoon in de adresbalk.</li>
            </ul>
          ) : null}
        </div>
        <button className="install-card-close" type="button" onClick={close}>
          <X aria-hidden="true" className="size-5" />
          <span className="sr-only">Melding sluiten</span>
        </button>
      </div>
    </aside>
  );
}
