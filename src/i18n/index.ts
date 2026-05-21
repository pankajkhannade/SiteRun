import { useCallback, useMemo } from "react";
import { useApp } from "../context";
import { translations, type TranslationKey } from "./translations";
import type { Locale } from "./types";

export type { Locale, TranslationKey };

export function useTranslation() {
  const { locale } = useApp();

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let text: string = translations[locale][key];
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [locale]
  );

  return useMemo(() => ({ t, locale }), [t, locale]);
}

export function getTranslation(locale: Locale, key: TranslationKey): string {
  return translations[locale][key];
}
