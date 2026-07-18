import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { NewsArticleDetail } from "@/components/news/NewsArticleDetail";
import { NewsPageHero } from "@/components/news/NewsPageHero";
import { PublicNewsStateSection } from "@/components/news/PublicNewsStateSection";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import {
  getPublicNewsDetail,
  PublicNewsApiError,
} from "@/services/public-news.service";
import {
  isPublicNewsCategorySlug,
  type PublicNewsCategorySlug,
  type PublicNewsDetail,
} from "@/types/public-news";

type PageProps = {
  params: Promise<{
    category: string;
    locale: string;
    slug: string;
  }>;
};

const categoryTranslationKeys = {
  "current-affairs": "currentAffairs",
  "group-news": "groupNews",
  "product-delivery": "productDelivery",
  notices: "notices",
} as const satisfies Record<PublicNewsCategorySlug, string>;

const detailLabels = {
  en: {
    error: "Unable to load this article. Please try again.",
    source: "View original source",
  },
  vi: {
    error: "Không thể tải bài viết. Vui lòng thử lại.",
    source: "Xem nguồn bài viết",
  },
  zh: {
    error: "无法加载文章，请重试。",
    source: "查看原文",
  },
} as const;

function isArticleInCategory(
  article: PublicNewsDetail,
  category: PublicNewsCategorySlug,
) {
  return !article.category || article.category.slug === category;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, locale, slug } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;

  if (!isPublicNewsCategorySlug(category)) return {};

  try {
    const article = await getPublicNewsDetail(slug, activeLocale);
    if (!isArticleInCategory(article, category)) return {};

    const title = article.seoTitle || article.title;
    const description = article.seoDescription || article.summary;
    const images = article.thumbnail?.publicUrl
      ? [
          {
            alt:
              article.thumbnailAltText ??
              article.thumbnail.altText ??
              article.title,
            url: article.thumbnail.publicUrl,
          },
        ]
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images,
        type: "article",
      },
    };
  } catch {
    return {};
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { category, locale, slug } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;

  if (!isPublicNewsCategorySlug(category)) notFound();

  const t = await getTranslations({ locale: activeLocale });
  const categoryKey = categoryTranslationKeys[category];
  const categoryTitle = t(`news.${categoryKey}.title`);
  const currentHref = `/news/${category}`;
  const hero = (
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
  );

  let article: PublicNewsDetail;

  try {
    article = await getPublicNewsDetail(slug, activeLocale);
  } catch (error) {
    if (error instanceof PublicNewsApiError && error.status === 404) {
      notFound();
    }

    console.error("Unable to load public news detail", error);

    return (
      <>
        {hero}
        <PublicNewsStateSection
          message={detailLabels[activeLocale].error}
          title={categoryTitle}
        />
      </>
    );
  }

  if (!isArticleInCategory(article, category)) notFound();

  return (
    <>
      {hero}
      <NewsArticleDetail
        article={article}
        categoryName={categoryTitle}
        locale={activeLocale}
        sourceLabel={detailLabels[activeLocale].source}
      />
    </>
  );
}
