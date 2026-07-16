import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AboutSubNavigation } from "@/components/about/AboutSubNavigation";
import { OrganizationChartSection } from "@/components/about/Organization/OrganizationChartSection";
import { PageHero } from "@/components/common/PageHero";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "organization", "/about/organization");
}

export default async function OrganizationPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const currentHref = "/about/organization";
  const title = t("about.organization.title");
  const aboutNavigation = [
    {
      href: "/about/company-profile",
      label: t("about.companyProfile.groupProfile"),
    },
    { href: currentHref, label: title },
    {
      href: "/about/corporate-culture",
      label: t("about.corporateCulture.title"),
    },
    { href: "/about/qualifications", label: t("about.qualifications.title") },
  ];

  return (
    <>
      <PageHero
        breadcrumbLabel={t("common.breadcrumb")}
        breadcrumbs={[
          { href: "/", label: t("common.home") },
          { label: t("about.companyProfile.title") },
          { label: title },
        ]}
        breadcrumbSeparator="-"
        title={t("about.companyProfile.title")}
        variant="about"
      >
        <AboutSubNavigation
          ariaLabel={t("about.subNavigationLabel")}
          currentHref={currentHref}
          items={aboutNavigation}
        />
      </PageHero>
      <OrganizationChartSection
        closeLabel={t("about.organization.closeChart")}
        title={title}
      />
    </>
  );
}
