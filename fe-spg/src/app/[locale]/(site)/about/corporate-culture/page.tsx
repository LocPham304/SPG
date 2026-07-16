import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AboutSubNavigation } from "@/components/about/AboutSubNavigation";
import { CorporateCultureSection } from "@/components/about/CorporateCulture/CorporateCultureSection";
import { PageHero } from "@/components/common/PageHero";
import { getCorporateCultureGroups } from "@/content/about/corporate-culture";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "corporateCulture", "/about/corporate-culture");
}

export default async function CorporateCulturePage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const corporateCultureGroups = getCorporateCultureGroups(activeLocale);
  const currentHref = "/about/corporate-culture";
  const title = t("about.corporateCulture.title");
  const aboutNavigation = [
    {
      href: "/about/company-profile",
      label: t("about.companyProfile.groupProfile"),
    },
    { href: "/about/organization", label: t("about.organization.title") },
    { href: currentHref, label: title },
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
      <CorporateCultureSection groups={corporateCultureGroups} title={title} />
    </>
  );
}
