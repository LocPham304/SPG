import { localeLanguageTags, type AppLocale } from "@/i18n/routing";

export type NewsDateParts = {
  dayMonth: string;
  year: string;
  full: string;
};

export function formatNewsDate(value: string, locale: AppLocale): NewsDateParts {
  const date = new Date(value);
  const languageTag = localeLanguageTags[locale];

  return {
    dayMonth: new Intl.DateTimeFormat(languageTag, {
      day: "2-digit",
      month: "2-digit",
      timeZone: "UTC",
    })
      .format(date)
      .replaceAll("/", "-"),
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
