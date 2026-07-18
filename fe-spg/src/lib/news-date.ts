import type { AppLocale } from "@/i18n/routing";

const newsLocaleLanguageTags: Record<AppLocale, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
};

export type NewsDateParts = {
  day: string;
  dayMonth: string;
  yearMonth: string;
  year: string;
  full: string;
};

export function formatNewsDate(value: string, locale: AppLocale): NewsDateParts {
  const date = new Date(value);
  const languageTag = newsLocaleLanguageTags[locale];

  return {
    day: new Intl.DateTimeFormat(languageTag, {
      day: "2-digit",
      timeZone: "UTC",
    }).format(date),
    dayMonth: new Intl.DateTimeFormat(languageTag, {
      day: "2-digit",
      month: "2-digit",
      timeZone: "UTC",
    })
      .format(date)
      .replaceAll("/", "-"),
    yearMonth: `${new Intl.DateTimeFormat("en", {
      year: "numeric",
      timeZone: "UTC",
    }).format(date)}-${new Intl.DateTimeFormat("en", {
      month: "2-digit",
      timeZone: "UTC",
    }).format(date)}`,
    year: new Intl.DateTimeFormat(languageTag, {
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
    full: new Intl.DateTimeFormat(languageTag, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
  };
}
