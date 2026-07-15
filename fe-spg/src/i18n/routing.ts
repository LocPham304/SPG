import { defineRouting } from "next-intl/routing";

export const locales = ["vi", "en", "zh"] as const;
export const defaultLocale = "vi";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localeDetection: false,
  localePrefix: "always",
});

export type AppLocale = (typeof locales)[number];

export const localeLanguageTags: Record<AppLocale, string> = {
  vi: "vi",
  en: "en",
  zh: "zh-CN",
};

export const localeNames: Record<AppLocale, string> = {
  vi: "Tiếng Việt",
  en: "English",
  zh: "简体中文",
};

export const localeShortNames: Record<AppLocale, string> = {
  vi: "VI",
  en: "EN",
  zh: "中文",
};

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && locales.includes(value as AppLocale);
}
