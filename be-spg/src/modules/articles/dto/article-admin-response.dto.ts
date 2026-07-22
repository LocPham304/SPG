import type { LocaleCode } from '../../categories/enums/locale-code.enum';
import type {
  ArticleCategoryResponse,
  ArticleThumbnailResponse,
} from './article-public-response.dto';
import type { ArticleStatus } from '../enums/article-status.enum';
import type { TranslationStatus } from '../enums/translation-status.enum';

export type ArticleSafeUserResponse = {
  id: number;
  fullName: string;
  email: string;
};

export type ArticleTranslationResponse = {
  id: number;
  locale: LocaleCode;
  sourceVersion: number;
  title: string | null;
  slug: string | null;
  summary: string | null;
  contentHtml: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  thumbnailAltText: string | null;
  translationStatus: TranslationStatus;
  translationError: string | null;
  translatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class ArticleAdminResponseDto {
  id!: number;
  categoryId!: number | null;
  thumbnailId!: number | null;
  status!: ArticleStatus;
  isFeatured!: boolean;
  sourceLocale!: LocaleCode;
  sourceVersion!: number;
  sourceUrl!: string | null;
  title!: string | null;
  summary!: string | null;
  locale!: LocaleCode;
  category!: ArticleCategoryResponse | null;
  thumbnail!: ArticleThumbnailResponse | null;
  createdBy!: ArticleSafeUserResponse;
  updatedBy!: ArticleSafeUserResponse | null;
  publishedBy!: ArticleSafeUserResponse | null;
  publishedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
  translations?: ArticleTranslationResponse[];

  constructor(partial: ArticleAdminResponseDto) {
    Object.assign(this, partial);
  }
}
