import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { NewsDateListSection } from "@/components/news/NewsDateListSection";
import { NewsPageHero } from "@/components/news/NewsPageHero";
import { getCurrentAffairsArticles } from "@/content/news/current-affairs";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "news", "/news/current-affairs");
}

export default async function CurrentAffairsPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const currentHref = "/news/current-affairs";
  const title = t("news.currentAffairs.title");

  return (
    <>
      <NewsPageHero
        breadcrumbLabel={t("common.breadcrumb")}
        currentHref={currentHref}
        homeLabel={t("common.home")}
        navigationLabel={t("news.subNavigationLabel")}
        navigationLabels={{
          currentAffairs: t("news.currentAffairs.title"),
          groupNews: t("news.groupNews.title"),
          productDelivery: t("news.productDelivery.title"),
          notices: t("news.notices.title"),
        }}
        newsTitle={t("news.title")}
        pageTitle={title}
      />
      <NewsDateListSection
        articles={getCurrentAffairsArticles(activeLocale)}
        readMoreLabel={t("news.currentAffairs.readMore")}
        title={title}
      />
    </>
  );
}
