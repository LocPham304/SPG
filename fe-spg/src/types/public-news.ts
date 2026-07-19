import type { AppLocale } from "@/i18n/routing";

export const PUBLIC_NEWS_CATEGORY_SLUGS = [
  "current-affairs",
  "group-news",
  "product-delivery",
  "notices",
] as const;

export type PublicNewsCategorySlug =
  (typeof PUBLIC_NEWS_CATEGORY_SLUGS)[number];

export type PublicNewsCategory = {
  id: number;
  code: string;
  slug: string;
  name: string | null;
  description: string | null;
  sortOrder: number;
  showOnHome: boolean;
};

export type PublicNewsItemCategory = Pick<
  PublicNewsCategory,
  "id" | "code" | "slug" | "name"
>;

export type Thumbnail = {
  id: number;
  publicUrl: string;
  storagePath: string;
  altText: string | null;
  width: number;
  height: number;
};

export type PublicNewsItem = {
  id: number;
  locale: AppLocale;
  title: string;
  slug: string;
  summary: string;
  category: PublicNewsItemCategory | null;
  thumbnail: Thumbnail | null;
  publishedAt: string;
  updatedAt?: string;
  isFeatured: boolean;
};

export type PublicNewsDetail = PublicNewsItem & {
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  thumbnailAltText: string | null;
  sourceUrl: string | null;
};

export type PublicNewsListResponse = {
  data: PublicNewsItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function isPublicNewsCategorySlug(
  value: string,
): value is PublicNewsCategorySlug {
  return PUBLIC_NEWS_CATEGORY_SLUGS.includes(
    value as PublicNewsCategorySlug,
  );
}

export function getPublicNewsDetailPath(
  category: PublicNewsCategorySlug,
  slug: string,
) {
  return `/news/${category}/${slug}`;
}
