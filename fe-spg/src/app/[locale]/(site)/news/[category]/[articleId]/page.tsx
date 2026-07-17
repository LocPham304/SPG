import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { NewsArticleDetail } from "@/components/news/NewsArticleDetail";
import { NewsPageHero } from "@/components/news/NewsPageHero";
import {
  getNewsArticle,
  isNewsCategorySlug,
} from "@/content/news/detail";
import type { NewsCategorySlug } from "@/content/news/routes";
import { defaultLocale, isAppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{
    articleId: string;
    category: string;
    locale: string;
  }>;
};

const categoryTranslationKeys: Record<
  NewsCategorySlug,
  "currentAffairs" | "groupNews" | "productDelivery" | "notices"
> = {
  "current-affairs": "currentAffairs",
  "group-news": "groupNews",
  "product-delivery": "productDelivery",
  notices: "notices",
};

const sourceLabels = {
  en: "View original source",
  vi: "Xem nguồn bài viết",
  zh: "查看原文",
} as const;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { articleId, category, locale } = await params;
  if (!isAppLocale(locale) || !isNewsCategorySlug(category)) return {};

  const article = getNewsArticle(locale, category, articleId);
  if (!article) return {};

  return {
    title: article.title,
    description: article.summary || article.content[0],
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { articleId, category, locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;

  if (!isNewsCategorySlug(category)) notFound();

  const article = getNewsArticle(activeLocale, category, articleId);
  if (!article) notFound();

  const t = await getTranslations({ locale: activeLocale });
  const categoryKey = categoryTranslationKeys[category];
  const categoryTitle = t(`news.${categoryKey}.title`);
  const currentHref = `/news/${category}`;

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
        pageTitle={categoryTitle}
      />
      <NewsArticleDetail
        article={article}
        sourceLabel={sourceLabels[activeLocale]}
      />
    </>
  );
}
