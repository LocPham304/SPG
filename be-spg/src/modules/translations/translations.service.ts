import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import sanitizeHtml from 'sanitize-html';
import { IsNull, Not, Repository } from 'typeorm';

import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { SafeHttpException } from '../../common/exceptions/safe-http.exception';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ArticlePolicyService } from '../articles/article-policy.service';
import { NewsArticleTranslationEntity } from '../articles/entities/news-article-translation.entity';
import { NewsArticleEntity } from '../articles/entities/news-article.entity';
import { TranslationStatus } from '../articles/enums/translation-status.enum';
import { LocaleCode } from '../categories/enums/locale-code.enum';
import { TranslateArticleDto } from './dto/translate-article.dto';
import {
  TranslateArticleResponseDto,
  TranslateArticleResultDto,
} from './dto/translate-article-response.dto';
import {
  ARTICLE_TRANSLATION_PROVIDER,
  type TranslationProvider,
  TranslationProviderError,
  type TranslationTargetLocale,
} from './providers/translation-provider.interface';

type RequestInfo = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

type TranslatedArticleFields = {
  title: string;
  summary: string;
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  thumbnailAltText: string | null;
};

const TARGET_LOCALES: TranslationTargetLocale[] = ['en', 'zh'];
const ARTICLE_NOT_FOUND = 'Không tìm thấy bài viết.';
const INCOMPLETE_VIETNAMESE_ARTICLE =
  'Bài viết tiếng Việt chưa đủ nội dung để dịch';
const TRANSLATION_NOT_CONFIGURED = 'Dịch tự động chưa được cấu hình';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(NewsArticleEntity)
    private readonly articlesRepository: Repository<NewsArticleEntity>,
    @InjectRepository(NewsArticleTranslationEntity)
    private readonly translationsRepository: Repository<NewsArticleTranslationEntity>,
    private readonly articlePolicy: ArticlePolicyService,
    private readonly activityLogsService: ActivityLogsService,
    @Inject(ARTICLE_TRANSLATION_PROVIDER)
    private readonly translationProvider: TranslationProvider,
  ) {}

  async translateArticle(
    articleId: number,
    dto: TranslateArticleDto,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<TranslateArticleResponseDto> {
    const article = await this.articlesRepository.findOne({
      where: { id: articleId, deletedAt: IsNull() },
      relations: { translations: true },
    });
    if (!article) throw new NotFoundException(ARTICLE_NOT_FOUND);

    this.articlePolicy.assertCanManage(currentUser, article, 'translate');
    const vietnamese = this.getCompleteVietnameseTranslation(article);

    if (!this.translationProvider.isConfigured()) {
      throw new SafeHttpException(
        TRANSLATION_NOT_CONFIGURED,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const targets = dto.targets ?? TARGET_LOCALES;
    const results: TranslateArticleResultDto[] = [];
    const translatedTargets: TranslationTargetLocale[] = [];

    for (const targetLocale of targets) {
      const target = await this.getOrCreateTargetTranslation(
        article,
        targetLocale,
      );

      if (!dto.overwrite && this.shouldSkipTranslation(target)) {
        results.push(this.toPreviewResult(target, true));
        continue;
      }

      try {
        const translated = await this.translateFields(vietnamese, targetLocale);
        const slug = await this.createUniqueSlug(
          article.id,
          targetLocale,
          translated.title,
          target.id,
        );

        Object.assign(target, translated, {
          slug,
          sourceVersion: article.sourceVersion,
          translationStatus: TranslationStatus.AutoTranslated,
          translationError: null,
          translatedAt: new Date(),
        });
        const savedTarget = await this.translationsRepository.save(target);
        results.push(this.toPreviewResult(savedTarget, false));
        translatedTargets.push(targetLocale);
      } catch (error: unknown) {
        const safeError = this.getSafeTranslationError(error);
        target.sourceVersion = article.sourceVersion;
        target.translationStatus = TranslationStatus.Failed;
        target.translationError = safeError;
        await this.translationsRepository.save(target);
        throw new SafeHttpException(safeError, HttpStatus.BAD_GATEWAY);
      }
    }

    if (translatedTargets.length > 0) {
      await this.activityLogsService.record({
        actorUserId: currentUser.id,
        action: 'article.auto_translated',
        entityType: 'news_article',
        entityId: article.id,
        title: 'Dịch tự động bài viết',
        description: `Dịch bài viết sang ${translatedTargets
          .map((locale) => (locale === 'en' ? 'English' : '中文'))
          .join('/')}`,
        changes: {
          sourceLocale: LocaleCode.Vietnamese,
          targets: translatedTargets,
          overwrite: dto.overwrite,
          sourceVersion: article.sourceVersion,
        },
        ipAddress: requestInfo.ipAddress ?? null,
        userAgent: requestInfo.userAgent ?? null,
      });
    }

    return {
      articleId: article.id,
      sourceLocale: LocaleCode.Vietnamese,
      results,
    };
  }

  private getCompleteVietnameseTranslation(
    article: NewsArticleEntity,
  ): NewsArticleTranslationEntity {
    const translation = article.translations.find(
      (item) => item.locale === LocaleCode.Vietnamese,
    );

    if (
      !translation?.title?.trim() ||
      !translation.summary?.trim() ||
      !translation.contentHtml?.trim()
    ) {
      throw new BadRequestException(INCOMPLETE_VIETNAMESE_ARTICLE);
    }

    return translation;
  }

  private async getOrCreateTargetTranslation(
    article: NewsArticleEntity,
    locale: TranslationTargetLocale,
  ): Promise<NewsArticleTranslationEntity> {
    const localeCode =
      locale === 'en' ? LocaleCode.English : LocaleCode.Chinese;
    const existing = article.translations.find(
      (translation) => translation.locale === localeCode,
    );
    if (existing) return existing;

    const created = this.translationsRepository.create({
      articleId: article.id,
      locale: localeCode,
      sourceVersion: article.sourceVersion,
      title: null,
      slug: null,
      summary: null,
      contentHtml: null,
      seoTitle: null,
      seoDescription: null,
      thumbnailAltText: null,
      translationStatus: TranslationStatus.Queued,
      translationError: null,
      translatedAt: null,
    });
    const saved = await this.translationsRepository.save(created);
    article.translations.push(saved);
    return saved;
  }

  private shouldSkipTranslation(
    translation: NewsArticleTranslationEntity,
  ): boolean {
    if (translation.translationStatus === TranslationStatus.Reviewed) {
      return true;
    }

    const hasContent = [
      translation.title,
      translation.slug,
      translation.summary,
      translation.contentHtml,
      translation.seoTitle,
      translation.seoDescription,
      translation.thumbnailAltText,
    ].some((value) => Boolean(value?.trim()));

    return hasContent && translation.translatedAt === null;
  }

  private async translateFields(
    source: NewsArticleTranslationEntity,
    targetLocale: TranslationTargetLocale,
  ): Promise<TranslatedArticleFields> {
    const plainFields = [
      ['title', source.title as string],
      ['summary', source.summary as string],
      ['seoTitle', source.seoTitle],
      ['seoDescription', source.seoDescription],
      ['thumbnailAltText', source.thumbnailAltText],
    ] as const;
    const populatedPlainFields = plainFields.filter(
      (entry): entry is readonly [(typeof entry)[0], string] =>
        typeof entry[1] === 'string' && entry[1].trim().length > 0,
    );
    const translatedPlainValues = await this.translationProvider.translateTexts(
      populatedPlainFields.map(([, value]) => value),
      targetLocale,
      'plain',
    );
    const translatedPlainFields = Object.fromEntries(
      populatedPlainFields.map(([field], index) => [
        field,
        translatedPlainValues[index],
      ]),
    ) as Partial<Omit<TranslatedArticleFields, 'contentHtml'>>;
    const [translatedHtml] = await this.translationProvider.translateTexts(
      [source.contentHtml as string],
      targetLocale,
      'html',
    );

    if (
      !translatedPlainFields.title?.trim() ||
      !translatedPlainFields.summary?.trim() ||
      !translatedHtml?.trim()
    ) {
      throw new TranslationProviderError(
        'Dịch tự động trả về nội dung không đầy đủ.',
      );
    }

    return {
      title: translatedPlainFields.title.trim(),
      summary: translatedPlainFields.summary.trim(),
      contentHtml: this.sanitizeTranslatedHtml(translatedHtml),
      seoTitle: translatedPlainFields.seoTitle?.trim() || null,
      seoDescription: translatedPlainFields.seoDescription?.trim() || null,
      thumbnailAltText: translatedPlainFields.thumbnailAltText?.trim() || null,
    };
  }

  private sanitizeTranslatedHtml(content: string): string {
    const sanitized = sanitizeHtml(content, {
      allowedTags: [
        'p',
        'h2',
        'h3',
        'ul',
        'ol',
        'li',
        'strong',
        'em',
        'u',
        'blockquote',
        'a',
        'img',
        'br',
        'hr',
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'title'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedSchemesByTag: {
        img: ['http', 'https'],
      },
      transformTags: {
        a: (_tagName, attributes) => {
          const transformedAttributes = { ...attributes };
          if (transformedAttributes.target === '_blank') {
            transformedAttributes.rel = 'noopener noreferrer';
          }
          return { tagName: 'a', attribs: transformedAttributes };
        },
      },
    }).trim();
    const textContent = sanitizeHtml(sanitized, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    if (!textContent && !/<img(?:\s|>)/i.test(sanitized)) {
      throw new TranslationProviderError(
        'Nội dung dịch rỗng sau khi loại bỏ HTML không an toàn.',
      );
    }

    return sanitized;
  }

  private async createUniqueSlug(
    articleId: number,
    locale: TranslationTargetLocale,
    translatedTitle: string,
    ignoredTranslationId?: number,
  ): Promise<string> {
    const localeCode =
      locale === 'en' ? LocaleCode.English : LocaleCode.Chinese;
    const baseSlug =
      this.slugifyTranslatedTitle(translatedTitle) ||
      `translated-${locale}-${articleId}`;
    let candidate = baseSlug;
    let suffix = 2;

    while (
      await this.translationsRepository.findOneBy({
        locale: localeCode,
        slug: candidate,
        ...(ignoredTranslationId ? { id: Not(ignoredTranslationId) } : {}),
      })
    ) {
      const suffixText = `-${suffix}`;
      candidate = `${baseSlug.slice(0, 500 - suffixText.length)}${suffixText}`;
      suffix += 1;
    }

    return candidate;
  }

  private slugifyTranslatedTitle(title: string): string {
    const tokens: string[] = [];
    const normalizedTitle = title.normalize('NFKD').toLowerCase();

    for (const character of normalizedTitle) {
      if (/[a-z0-9]/.test(character)) {
        tokens.push(character);
      } else if (character === 'đ') {
        tokens.push('d');
      } else if (/[\u0300-\u036f]/.test(character)) {
        continue;
      } else if (/[\p{Letter}\p{Number}]/u.test(character)) {
        tokens.push(`-u${character.codePointAt(0)?.toString(16)}-`);
      } else {
        tokens.push('-');
      }
    }

    return tokens
      .join('')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 480)
      .replace(/-+$/g, '');
  }

  private getSafeTranslationError(error: unknown): string {
    if (error instanceof TranslationProviderError) {
      return error.message.slice(0, 1000);
    }

    return 'Không thể dịch tự động. Vui lòng thử lại.';
  }

  private toPreviewResult(
    translation: NewsArticleTranslationEntity,
    skipped: boolean,
  ): TranslateArticleResultDto {
    return {
      locale: translation.locale === LocaleCode.English ? 'en' : 'zh',
      status: translation.translationStatus,
      skipped,
      title: translation.title,
      slug: translation.slug,
      summary: translation.summary,
      contentHtml: translation.contentHtml,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
      thumbnailAltText: translation.thumbnailAltText,
      translationError: translation.translationError,
    };
  }
}
