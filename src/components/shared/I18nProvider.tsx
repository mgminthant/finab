"use client";
import * as React from "react";
import type { Dict } from "@/lib/i18n";

const I18nContext = React.createContext<Dict | null>(null);

export function I18nProvider({
  dict,
  children,
}: {
  dict: Dict;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={dict}>{children}</I18nContext.Provider>;
}

export function useT(): (key: string) => string {
  const dict = React.useContext(I18nContext);
  return React.useCallback(
    (key: string) => {
      if (dict && key in dict) return (dict as Record<string, string>)[key];
      return key;
    },
    [dict]
  );
}
