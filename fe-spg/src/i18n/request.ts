import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isAppLocale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  if (requestedLocale !== undefined && !isAppLocale(requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale ?? defaultLocale;
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: "Asia/Ho_Chi_Minh",
    getMessageFallback: ({ key, namespace }) =>
      [namespace, key].filter(Boolean).join("."),
  };
});
