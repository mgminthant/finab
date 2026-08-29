"use client";

import * as React from "react";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useT } from "./I18nProvider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed";

if (typeof window !== "undefined") {
  // Clear the legacy persistent dismissal so the prompt can appear again
  // (e.g. after the user uninstalls the app).
  try {
    localStorage.removeItem(DISMISS_KEY);
  } catch {}
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new Event("pwa-install-available"));
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    window.dispatchEvent(new Event("pwa-install-available"));
  });
}

export default function InstallPrompt() {
  const t = useT();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      let dismissed = false;
      try {
        dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
      } catch {}
      setVisible(!!deferredPrompt && !dismissed);
    };
    update();
    window.addEventListener("pwa-install-available", update);
    return () => window.removeEventListener("pwa-install-available", update);
  }, []);

  if (!visible) return null;

  const handleInstall = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice
      .then((choice) => {
        if (choice.outcome === "accepted") {
          try {
            sessionStorage.setItem(DISMISS_KEY, "1");
          } catch {}
        }
        deferredPrompt = null;
        setVisible(false);
      })
      .catch(() => {
        deferredPrompt = null;
        setVisible(false);
      });
  };

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <div className="mx-auto mb-4 flex max-w-2xl flex-col items-center gap-3 rounded-md border border-border bg-card p-3 text-card-foreground shadow-sm sm:flex-row sm:justify-between">
      <div className="flex items-center gap-3">
        <DownloadIcon className="h-6 w-6 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium">{t("install.title")}</p>
          <p className="text-xs text-muted-foreground">{t("install.message")}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded px-3 py-1 text-sm text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground"
        >
          {t("common.dismiss")}
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex h-[35px] items-center justify-center rounded bg-primary px-[15px] text-sm font-medium leading-none text-primary-foreground outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t("install.action")}
        </button>
      </div>
    </div>
  );
}
