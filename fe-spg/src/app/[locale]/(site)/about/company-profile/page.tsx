import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AboutSubNavigation } from "@/components/about/AboutSubNavigation";
import { AboutBasesSection } from "@/components/about/CompanyProfile/AboutBasesSection";
import { CompanyHistorySection } from "@/components/about/CompanyProfile/CompanyHistorySection";
import { CompanyProfileSection } from "@/components/about/CompanyProfile/CompanyProfileSection";
import { PageHero } from "@/components/common/PageHero";
import { getCompanyProfileContent } from "@/content/about/company-profile";
import { getCompanyHistoryContent } from "@/content/about/company-profile/history";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "companyProfile", "/about/company-profile");
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const content = getCompanyProfileContent(activeLocale);
  const historyContent = getCompanyHistoryContent(activeLocale);
  const currentHref = "/about/company-profile";
  const aboutNavigation = [
    { href: currentHref, label: t("about.companyProfile.groupProfile") },
    { href: "/about/organization", label: t("about.organization.title") },
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
          { label: t("about.companyProfile.groupProfile") },
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
      <CompanyProfileSection content={content} />
      <AboutBasesSection locale={activeLocale} />
      <CompanyHistorySection content={historyContent} />
    </>
  );
}
