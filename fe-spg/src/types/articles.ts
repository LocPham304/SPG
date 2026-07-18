import type { LocaleCode } from "./categories";

export type ArticleStatus = "draft" | "published" | "hidden";

export type TranslationStatus =
  | "original"
  | "queued"
  | "translating"
  | "auto_translated"
  | "reviewed"
  | "outdated"
  | "failed";

export type ArticleCategory = {
  code: string;
  id: number;
  name: string | null;
  slug: string;
};

export type ArticleThumbnail = {
  altText: string | null;
  height: number;
  id: number;
  publicUrl: string;
  storagePath: string;
  width: number;
};

export type ArticleUser = {
  email: string;
  fullName: string;
  id: number;
};

export type ArticleListItem = {
  category: ArticleCategory | null;
  categoryId: number | null;
  createdAt: string;
  createdBy: ArticleUser;
  deletedAt: string | null;
  id: number;
  isFeatured: boolean;
  locale: LocaleCode;
  publishedAt: string | null;
  publishedBy: ArticleUser | null;
  slug?: string | null;
  sourceUrl: string | null;
  sourceVersion: number;
  status: ArticleStatus;
  summary: string | null;
  thumbnail: ArticleThumbnail | null;
  thumbnailId: number | null;
  title: string | null;
  updatedAt: string;
  updatedBy: ArticleUser | null;
};

export type ArticleTranslation = {
  contentHtml: string | null;
  createdAt: string;
  id: number;
  locale: LocaleCode;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string | null;
  sourceVersion: number;
  summary: string | null;
  thumbnailAltText: string | null;
  title: string | null;
  translatedAt: string | null;
  translationError: string | null;
  translationStatus: TranslationStatus;
  updatedAt: string;
};

export type ArticleDetail = ArticleListItem & {
  translations: ArticleTranslation[];
};

export type ArticleTranslationInput = {
  contentHtml: string;
  locale: LocaleCode;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  summary: string;
  thumbnailAltText: string;
  title: string;
};

export type ArticlesListResponse = {
  data: ArticleListItem[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
};

export type GetAdminArticlesParams = {
  categoryId?: number;
  createdBy?: number;
  isFeatured?: boolean;
  limit?: number;
  locale?: LocaleCode;
  page?: number;
  search?: string;
  status?: ArticleStatus;
};

export type CreateArticleData = {
  categoryId: number;
  isFeatured?: boolean;
  sourceUrl?: string;
  status: "draft" | "published";
  thumbnailId?: number;
  translations: ArticleTranslationInput[];
};

export type UpdateArticleData = {
  categoryId?: number;
  sourceUrl?: string | null;
  thumbnailId?: number | null;
  translations?: ArticleTranslationInput[];
};

export type TranslateArticleData = {
  overwrite?: boolean;
  targets?: Array<Extract<LocaleCode, "en" | "zh">>;
};

export type TranslateArticleResult = {
  contentHtml: string | null;
  locale: Extract<LocaleCode, "en" | "zh">;
  reason?: string;
  seoDescription: string | null;
  seoTitle: string | null;
  skipped: boolean;
  slug: string | null;
  status: TranslationStatus;
  summary: string | null;
  thumbnailAltText: string | null;
  title: string | null;
  translationError: string | null;
};

export type TranslateArticleResponse = {
  articleId: number;
  provider: "gemini";
  results: TranslateArticleResult[];
  sourceLocale: "vi";
};
