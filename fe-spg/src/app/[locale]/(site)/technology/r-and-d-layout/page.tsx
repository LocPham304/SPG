import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AboutSubNavigation } from "@/components/about/AboutSubNavigation";
import { PageHero } from "@/components/common/PageHero";
import { ResearchLayoutSection } from "@/components/technology/ResearchLayoutSection";
import { getResearchLayoutContent } from "@/content/technology/r-and-d-layout";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { createLocalizedMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

const pageHref = "/technology/r-and-d-layout";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const content = getResearchLayoutContent(activeLocale);

  return createLocalizedMetadata({
    locale: activeLocale,
    href: pageHref,
    title: content.pageTitle,
    description: content.description,
  });
}

export default async function ResearchAndDevelopmentLayoutPage({
  params,
}: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const content = getResearchLayoutContent(activeLocale);
  const technologyNavigation = [
    { href: pageHref, label: t("navigation.rdLayout") },
    {
      href: "/technology/technological-achievements",
      label: t("navigation.achievements"),
    },
    {
      href: "/technology/major-project",
      label: t("navigation.majorProject"),
    },
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
      <ResearchLayoutSection
        pageTitle={content.pageTitle}
        sections={content.sections}
      />
    </>
  );
}
