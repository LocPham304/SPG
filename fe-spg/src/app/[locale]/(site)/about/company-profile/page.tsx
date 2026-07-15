import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StaticPageShell } from "@/components/common/StaticPageShell";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "companyProfile", "/about/company-profile");
}

export default async function CompanyProfilePage() {
  const t = await getTranslations();
  return <StaticPageShell breadcrumbLabel={t("common.breadcrumb")} foundationMessage={t("common.foundationReady")} homeLabel={t("common.home")} title={t("about.companyProfile.title")} />;
}
