import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { NewsDateListSection } from "@/components/news/NewsDateListSection";
import { NewsPageHero } from "@/components/news/NewsPageHero";
import { getNotices } from "@/content/news/notices";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "news", "/news/notices");
}

export default async function NoticesPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const currentHref = "/news/notices";
  const title = t("news.notices.title");

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
          notices: title,
        }}
        newsTitle={t("news.title")}
        pageTitle={title}
      />
      <NewsDateListSection
        articles={getNotices(activeLocale)}
        categorySlug="notices"
        readMoreLabel={t("news.notices.readMore")}
        title={title}
      />
    </>
  );
}
