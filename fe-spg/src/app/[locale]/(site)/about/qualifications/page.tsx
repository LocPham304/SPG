import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AboutSubNavigation } from "@/components/about/AboutSubNavigation";
import { QualificationsSection } from "@/components/about/Qualifications/QualificationsSection";
import { PageHero } from "@/components/common/PageHero";
import { getQualificationsContent } from "@/content/about/qualifications";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "qualifications", "/about/qualifications");
}

export default async function QualificationsPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const content = getQualificationsContent(activeLocale);
  const currentHref = "/about/qualifications";
  const title = t("about.qualifications.title");
  const aboutNavigation = [
    {
      href: "/about/company-profile",
      label: t("about.companyProfile.groupProfile"),
    },
    { href: "/about/organization", label: t("about.organization.title") },
    {
      href: "/about/corporate-culture",
      label: t("about.corporateCulture.title"),
    },
    { href: currentHref, label: title },
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
      <QualificationsSection content={content} title={title} />
    </>
  );
}
