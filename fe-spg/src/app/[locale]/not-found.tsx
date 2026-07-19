import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundPage } from "@/components/common/NotFoundPage";

export const metadata: Metadata = {
  title: "404",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LocaleNotFound() {
  const locale = await getLocale();
  const t = await getTranslations("errors.notFound");

  return (
    <NotFoundPage
      actionLabel={t("action")}
      description={t("description")}
      homeHref={`/${locale}`}
      title={t("title")}
    />
  );
}
