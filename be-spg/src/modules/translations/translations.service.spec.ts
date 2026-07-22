import type { Repository } from 'typeorm';

import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import type { ActivityLogsService } from '../activity-logs/activity-logs.service';
import type { ArticlePolicyService } from '../articles/article-policy.service';
import { NewsArticleTranslationEntity } from '../articles/entities/news-article-translation.entity';
import { NewsArticleEntity } from '../articles/entities/news-article.entity';
import { TranslationStatus } from '../articles/enums/translation-status.enum';
import { LocaleCode } from '../categories/enums/locale-code.enum';
import type { TranslationProvider } from './providers/translation-provider.interface';
import { TranslationsService } from './translations.service';

function createTranslation(
  locale: LocaleCode,
  content?: {
    title: string;
    slug: string;
    summary: string;
    contentHtml: string;
  },
): NewsArticleTranslationEntity {
  return Object.assign(new NewsArticleTranslationEntity(), {
    id:
      locale === LocaleCode.English
        ? 1
        : locale === LocaleCode.Vietnamese
          ? 2
          : 3,
    articleId: 10,
    locale,
    sourceVersion: 1,
    title: content?.title ?? null,
    slug: content?.slug ?? null,
    summary: content?.summary ?? null,
    contentHtml: content?.contentHtml ?? null,
    seoTitle: null,
    seoDescription: null,
    thumbnailAltText: null,
    translationStatus:
      locale === LocaleCode.English
        ? TranslationStatus.Original
        : TranslationStatus.Queued,
    translationError: null,
    translatedAt: null,
  });
}

describe('TranslationsService', () => {
  it('translates an English source into Vietnamese and Chinese', async () => {
    const english = createTranslation(LocaleCode.English, {
      title: 'Source title',
      slug: 'source-title',
      summary: 'Source summary',
      contentHtml: '<p>Source content</p>',
    });
    const vietnamese = createTranslation(LocaleCode.Vietnamese);
    const chinese = createTranslation(LocaleCode.Chinese);
    const article = Object.assign(new NewsArticleEntity(), {
      id: 10,
      sourceLocale: LocaleCode.English,
      sourceVersion: 1,
      deletedAt: null,
      translations: [english, vietnamese, chinese],
    });
    const articlesRepository = {
      findOne: jest.fn().mockResolvedValue(article),
    };
    const translationsRepository = {
      findOneBy: jest.fn().mockResolvedValue(null),
      save: jest
        .fn()
        .mockImplementation((translation: NewsArticleTranslationEntity) =>
          Promise.resolve(translation),
        ),
    };
    const articlePolicy = { assertCanManage: jest.fn() };
    const activityLogsService = {
      record: jest.fn().mockResolvedValue(undefined),
    };
    const translateArticle = jest.fn().mockResolvedValue({
      vi: {
        title: 'Tiêu đề',
        summary: 'Tóm tắt',
        contentHtml: '<p>Nội dung</p>',
        seoTitle: null,
        seoDescription: null,
        thumbnailAltText: null,
      },
      zh: {
        title: '标题',
        summary: '摘要',
        contentHtml: '<p>内容</p>',
        seoTitle: null,
        seoDescription: null,
        thumbnailAltText: null,
      },
    });
    const translationProvider: TranslationProvider = {
      name: 'gemini',
      isConfigured: () => true,
      translateArticle,
    };
    const service = new TranslationsService(
      articlesRepository as unknown as Repository<NewsArticleEntity>,
      translationsRepository as unknown as Repository<NewsArticleTranslationEntity>,
      articlePolicy as unknown as ArticlePolicyService,
      activityLogsService as unknown as ActivityLogsService,
      translationProvider,
    );
    const currentUser: AuthenticatedUser = {
      id: 1,
      email: 'admin@example.com',
      fullName: 'Admin',
      role: 'admin',
      mustChangePassword: false,
      sessionId: 'session-id',
    };

    const response = await service.translateArticle(
      10,
      { overwrite: false },
      currentUser,
    );

    expect(translateArticle).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Source title' }),
      'en',
      ['vi', 'zh'],
    );
    expect(response.sourceLocale).toBe(LocaleCode.English);
    expect(response.results.map((result) => result.locale)).toEqual([
      'vi',
      'zh',
    ]);
    expect(vietnamese.translationStatus).toBe(TranslationStatus.AutoTranslated);
    expect(chinese.translationStatus).toBe(TranslationStatus.AutoTranslated);
  });
});
