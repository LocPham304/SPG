import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { cache } from "react";

import { JsonLd } from "@/components/common/JsonLd";
import { NewsLocaleLinksSync } from "@/components/layout/NewsLocaleLinksContext";
import { NewsArticleDetail } from "@/components/news/NewsArticleDetail";
import { NewsPageHero } from "@/components/news/NewsPageHero";
import { PublicNewsStateSection } from "@/components/news/PublicNewsStateSection";
import { RelatedNewsSection } from "@/components/news/RelatedNewsSection";
import {
  defaultLocale,
  isAppLocale,
  locales,
  type AppLocale,
} from "@/i18n/routing";
import {
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  createLocalizedMetadata,
} from "@/lib/seo";
import {
  getPublicNews,
  getPublicNewsDetail,
  PublicNewsApiError,
} from "@/services/public-news.service";
import {
  isPublicNewsCategorySlug,
  type PublicNewsCategorySlug,
  type PublicNewsDetail,
  type PublicNewsItem,
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
    related: "Related articles",
    source: "View original source",
  },
  vi: {
    error: "Không thể tải bài viết. Vui lòng thử lại.",
    related: "Bài viết liên quan",
    source: "Xem nguồn bài viết",
  },
  zh: {
    error: "无法加载文章，请重试。",
    related: "相关文章",
    source: "查看原文",
  },
} as const;

const getCachedPublicNewsDetail = cache(getPublicNewsDetail);

function isArticleInCategory(
  article: PublicNewsDetail,
  category: PublicNewsCategorySlug,
) {
  return !article.category || article.category.slug === category;
}

async function getArticleLanguagePaths(article: PublicNewsDetail) {
  const results = await Promise.allSettled(
    locales.map(async (locale) => {
      let page = 1;
      let totalPages = 1;

      do {
        const response = await getPublicNews({
          locale,
          page,
          limit: 100,
        });
        totalPages = response.meta.totalPages;
        const localizedArticle = response.data.find(
          (item) => item.id === article.id,
        );
        const localizedCategory = localizedArticle?.category?.slug;

        if (
          localizedArticle &&
          localizedCategory &&
          isPublicNewsCategorySlug(localizedCategory)
        ) {
          return [
            locale,
            `/news/${localizedCategory}/${localizedArticle.slug}`,
          ] as const;
        }

        page += 1;
      } while (page <= totalPages);

      return null;
    }),
  );

  return Object.fromEntries(
    results.flatMap((result) =>
      result.status === "fulfilled" && result.value
        ? [result.value]
        : [],
    ),
  ) as Partial<Record<AppLocale, string>>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, locale, slug } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;

  if (!isPublicNewsCategorySlug(category)) notFound();

  let article: PublicNewsDetail;

  try {
    article = await getCachedPublicNewsDetail(slug, activeLocale);
  } catch (error) {
    if (error instanceof PublicNewsApiError && error.status === 404) {
      notFound();
    }

    return {
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  if (!isArticleInCategory(article, category)) notFound();

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.summary;
  const href = `/news/${category}/${article.slug}`;
  const languagePaths = await getArticleLanguagePaths(article);

  return createLocalizedMetadata({
    locale: activeLocale,
    href,
    title,
    description,
    image: article.thumbnail?.publicUrl
      ? {
          alt:
            article.thumbnailAltText ??
            article.thumbnail.altText ??
            article.title,
          url: article.thumbnail.publicUrl,
        }
      : undefined,
    languagePaths,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { category, locale, slug } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;

  if (!isPublicNewsCategorySlug(category)) notFound();

  const t = await getTranslations({ locale: activeLocale });
  const categoryKey = categoryTranslationKeys[category];
  const categoryTitle = t(`news.${categoryKey}.title`);
  const currentHref = `/news/${category}`;
  const renderHero = (articleTitle?: string) => (
    <NewsPageHero
      articleTitle={articleTitle}
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
    article = await getCachedPublicNewsDetail(slug, activeLocale);
  } catch (error) {
    if (error instanceof PublicNewsApiError && error.status === 404) {
      notFound();
    }

    console.error("Unable to load public news detail", error);

    return (
      <>
        {renderHero()}
        <PublicNewsStateSection
          message={detailLabels[activeLocale].error}
          title={categoryTitle}
        />
      </>
    );
  }

  if (!isArticleInCategory(article, category)) notFound();

  let relatedArticles: PublicNewsItem[] = [];

  try {
    const relatedResponse = await getPublicNews({
      category,
      locale: activeLocale,
      page: 1,
      limit: 4,
    });
    relatedArticles = relatedResponse.data
      .filter((item) => item.id !== article.id)
      .slice(0, 3);
  } catch (error) {
    console.error("Unable to load related public news", error);
  }

  const articleHref = `/news/${category}/${article.slug}`;
  const languagePaths = await getArticleLanguagePaths(article);
  const description = article.seoDescription || article.summary;
  const breadcrumbJsonLd = createBreadcrumbJsonLd(activeLocale, [
    { href: "/", name: t("common.home") },
    { href: "/news", name: t("news.title") },
    { href: currentHref, name: categoryTitle },
    { href: articleHref, name: article.title },
  ]);
  const articleJsonLd = createArticleJsonLd({
    locale: activeLocale,
    href: articleHref,
    headline: article.title,
    description,
    image: article.thumbnail?.publicUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
  });

  return (
    <>
      <NewsLocaleLinksSync
        links={{
          ...languagePaths,
          [activeLocale]: articleHref,
        }}
      />
      <JsonLd data={breadcrumbJsonLd} id="article-breadcrumb-jsonld" />
      <JsonLd data={articleJsonLd} id="article-jsonld" />
      {renderHero(article.title)}
      <NewsArticleDetail
        article={article}
        categoryName={categoryTitle}
        locale={activeLocale}
        sourceLabel={detailLabels[activeLocale].source}
      />
      <RelatedNewsSection
        articles={relatedArticles}
        category={category}
        locale={activeLocale}
        title={detailLabels[activeLocale].related}
      />
    </>
  );
}
