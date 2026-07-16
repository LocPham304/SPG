import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundPage } from "@/components/common/NotFoundPage";

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
