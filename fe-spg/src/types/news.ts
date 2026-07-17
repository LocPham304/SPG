import type { AppLocale } from "@/i18n/routing";

export type NewsCategoryKey =
  | "currentAffairs"
  | "groupNews"
  | "productDelivery"
  | "notices";
export type NewsPublicationStatus = "draft" | "published" | "archived";

export type NewsCategory = {
  id: string;
  key: NewsCategoryKey;
  slug: string;
};

export type NewsMedia = {
  src: string;
  alt: string;
};

export type PublicNewsArticle = {
  id: string;
  locale: AppLocale;
  categoryKey: NewsCategoryKey;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  status: NewsPublicationStatus;
  isFeatured: boolean;
  media: NewsMedia;
};

export type NewsQuery = {
  locale: AppLocale;
  category?: NewsCategoryKey;
  featuredOnly?: boolean;
  limit?: number;
};

export type NewsResult = {
  items: PublicNewsArticle[];
  total: number;
};

export type NewsDateListItem = {
  id: string;
  publishedAt: string;
  title: string;
  summary: string;
  href: string;
};

export type NewsArticleDetail = {
  author: string;
  categoryName: string;
  content: readonly string[];
  coverImage?: string;
  sourceUrl: string;
};

export type DetailedNewsDateListItem = NewsDateListItem & NewsArticleDetail;

export type LocalNewsArticle = NewsArticleDetail & {
  id: string;
  publishedAt: string;
  title: string;
  summary: string;
};
