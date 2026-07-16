import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { GroupNewsSection } from "@/components/news/GroupNewsSection";
import { NewsPageHero } from "@/components/news/NewsPageHero";
import { getGroupNewsArticles } from "@/content/news/group-news";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "news", "/news/group-news");
}

export default async function GroupNewsPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const currentHref = "/news/group-news";
  const title = t("news.groupNews.title");

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
      <GroupNewsSection
        articles={getGroupNewsArticles(activeLocale)}
        readMoreLabel={t("news.groupNews.readMore")}
        title={title}
      />
    </>
  );
}
