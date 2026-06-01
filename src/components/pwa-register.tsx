"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => null);
    };
    const idleWindow = window as Window & { requestIdleCallback?: (callback: () => void) => number };

    if (idleWindow.requestIdleCallback) {
      idleWindow.requestIdleCallback(register);
    } else {
      window.setTimeout(register, 1200);
    }
  }, []);

  return null;
}
