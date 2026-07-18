import { TranslationStatus } from '../../articles/enums/translation-status.enum';
import type { TranslationTargetLocale } from '../providers/translation-provider.interface';

export class TranslateArticleResultDto {
  locale!: TranslationTargetLocale;
  status!: TranslationStatus;
  skipped!: boolean;
  reason?: string;
  title!: string | null;
  slug!: string | null;
  summary!: string | null;
  contentHtml!: string | null;
  seoTitle!: string | null;
  seoDescription!: string | null;
  thumbnailAltText!: string | null;
  translationError!: string | null;
}

export class TranslateArticleResponseDto {
  articleId!: number;
  sourceLocale!: 'vi';
  provider!: string;
  results!: TranslateArticleResultDto[];
}
