import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StaticPageShell } from "@/components/common/StaticPageShell";
import { getStaticPageMetadata } from "@/lib/seo";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "home", "/");
}

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <StaticPageShell
      breadcrumbLabel={t("common.breadcrumb")}
      foundationMessage={t("common.foundationReady")}
      homeLabel={t("common.home")}
      title={t("home.title")}
    />
  );
}
