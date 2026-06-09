"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const storageKey = "slime-score-install-card-dismissed-v2";
const subscribe = () => () => {};

const copy = {
  nl: {
    aria: "App toevoegen",
    title: "Voeg toe als app",
    body: "Snel openen vanaf je telefoon.",
    install: "Installeren",
    help: "Zo installeer je",
    iphone: "tik onderin op de deelknop (vierkant met pijl) → “Zet op beginscherm”",
    android: "menu ⋮ → “App installeren” / “Toevoegen aan startscherm”",
    desktop: "klik op het installatie-icoon in de adresbalk",
    close: "Melding sluiten",
  },
  en: {
    aria: "Add app",
    title: "Add as app",
    body: "Open quickly from your phone.",
    install: "Install",
    help: "How to install",
    iphone: "tap the share button at the bottom (square with arrow) → “Add to Home Screen”",
    android: "menu ⋮ → “Install app” / “Add to Home screen”",
    desktop: "click the install icon in the address bar",
    close: "Close message",
  },
} satisfies Record<Locale, Record<string, string>>;

export function InstallAppCard({ locale = "nl" }: { locale?: Locale }) {
  const text = copy[locale];
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
    <aside className="install-card" aria-label={text.aria}>
      <div className="flex items-start gap-3">
        <div className="install-card-icon" aria-hidden="true">
          <Download className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 className="install-card-title">{text.title}</h2>
          <p className="install-card-copy">
            {text.body}
          </p>
          <div className="mt-3">
            <button className="button-secondary min-h-10 px-3" type="button" onClick={install}>
              <Download aria-hidden="true" className="size-4" />
              {installPrompt ? text.install : text.help}
            </button>
          </div>
          {showHelp && !installPrompt ? (
            <ul className="mt-2 grid gap-1 text-xs font-medium leading-5 text-[var(--text-muted)]">
              <li><strong>iPhone (Safari):</strong> {text.iphone}.</li>
              <li><strong>Android (Chrome):</strong> {text.android}.</li>
              <li><strong>Desktop:</strong> {text.desktop}.</li>
            </ul>
          ) : null}
        </div>
        <button className="install-card-close" type="button" onClick={close}>
          <X aria-hidden="true" className="size-5" />
          <span className="sr-only">{text.close}</span>
        </button>
      </div>
    </aside>
  );
}
