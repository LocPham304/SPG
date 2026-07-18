import type { LocaleCode } from '../../categories/enums/locale-code.enum';

export type ArticleCategoryResponse = {
  id: number;
  code: string;
  slug: string;
  name: string | null;
};

export type ArticleThumbnailResponse = {
  id: number;
  publicUrl: string;
  storagePath: string;
  altText: string | null;
  width: number;
  height: number;
};

export class ArticlePublicResponseDto {
  id!: number;
  locale!: LocaleCode;
  title!: string;
  slug!: string;
  summary!: string;
  contentHtml?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  thumbnailAltText?: string | null;
  category!: ArticleCategoryResponse | null;
  thumbnail!: ArticleThumbnailResponse | null;
  publishedAt!: Date;
  isFeatured!: boolean;
  sourceUrl?: string | null;

  constructor(partial: ArticlePublicResponseDto) {
    Object.assign(this, partial);
  }
}
