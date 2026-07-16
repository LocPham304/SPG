import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AboutSubNavigation } from "@/components/about/AboutSubNavigation";
import { PageHero } from "@/components/common/PageHero";
import { MajorProjectSection } from "@/components/technology/MajorProjectSection";
import { getMajorProjectContent } from "@/content/technology/major-project";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { createLocalizedMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

const pageHref = "/technology/major-project";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const content = getMajorProjectContent(activeLocale);

  return createLocalizedMetadata({
    locale: activeLocale,
    href: pageHref,
    title: content.pageTitle,
    description: content.description,
  });
}

export default async function MajorProjectPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const content = getMajorProjectContent(activeLocale);
  const technologyNavigation = [
    {
      href: "/technology/r-and-d-layout",
      label: t("navigation.rdLayout"),
    },
    {
      href: "/technology/technological-achievements",
      label: t("navigation.achievements"),
    },
    { href: pageHref, label: t("navigation.majorProject") },
  ];

  return (
    <>
      <PageHero
        breadcrumbLabel={t("common.breadcrumb")}
        breadcrumbs={[
          { href: "/", label: t("common.home") },
          { label: content.title },
          { label: content.pageTitle },
        ]}
        breadcrumbSeparator="-"
        title={content.title}
        variant="technology"
      >
        <AboutSubNavigation
          ariaLabel={content.title}
          currentHref={pageHref}
          items={technologyNavigation}
        />
      </PageHero>
      <MajorProjectSection
        pageTitle={content.pageTitle}
        projects={content.projects}
      />
    </>
  );
}
